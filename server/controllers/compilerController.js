const Project = require("../models/Project");

const JUDGE0_URL =
  process.env.JUDGE0_URL || "https://ce.judge0.com";

/*
  Check whether the logged-in user belongs
  to the requested project.
*/
const checkProjectMembership = async (
  projectId,
  userId
) => {
  const project = await Project.findById(projectId);

  if (!project) {
    return {
      error: "Project not found",
      project: null,
    };
  }

  const member = project.members.find(
    (item) =>
      item.user.toString() === userId.toString()
  );

  if (!member) {
    return {
      error: "You are not a member of this project",
      project,
    };
  }

  return {
    error: null,
    project,
  };
};

/*
  Run code inside the private team compiler.
*/
const runTeamCode = async (req, res) => {
  try {
    const { projectId } = req.params;

    const {
      sourceCode,
      languageId,
      stdin = "",
    } = req.body;

    if (!sourceCode?.trim()) {
      return res.status(400).json({
        message: "Source code is required",
      });
    }

    if (!languageId) {
      return res.status(400).json({
        message: "Language is required",
      });
    }

    // Check project membership
    const membership = await checkProjectMembership(
      projectId,
      req.user.userId
    );

    if (membership.error) {
      const statusCode =
        membership.error === "Project not found"
          ? 404
          : 403;

      return res.status(statusCode).json({
        message: membership.error,
      });
    }

    /*
      Submit code to Judge0.
    */
    const submissionResponse = await fetch(
      `${JUDGE0_URL}/submissions/?base64_encoded=false&wait=false`,
      {
        method: "POST",

        headers: {
          "Content-Type": "application/json",

          ...(process.env.JUDGE0_AUTH_TOKEN
            ? {
                "X-Auth-Token":
                  process.env.JUDGE0_AUTH_TOKEN,
              }
            : {}),
        },

        body: JSON.stringify({
          source_code: sourceCode,
          language_id: Number(languageId),
          stdin,

          // Conservative limits for the project compiler
          cpu_time_limit: 2,
          wall_time_limit: 5,
          memory_limit: 128000,
          max_processes_and_or_threads: 20,
          max_file_size: 2048,
          enable_network: false,
        }),
      }
    );

    if (!submissionResponse.ok) {
      const errorText =
        await submissionResponse.text();

      console.error(
        "Judge0 submission error:",
        errorText
      );

      return res.status(502).json({
        message: "Code execution service failed",
      });
    }

    const submission =
      await submissionResponse.json();

    res.status(202).json({
      message: "Code submitted successfully",
      token: submission.token,
    });

  } catch (error) {
    console.error(
      "Team compiler error:",
      error
    );

    res.status(500).json({
      message: "Unable to run code",
    });
  }
};

/*
  Get execution result.
*/
const getTeamCodeResult = async (req, res) => {
  try {
    const { projectId, token } = req.params;

    // Check project membership
    const membership = await checkProjectMembership(
      projectId,
      req.user.userId
    );

    if (membership.error) {
      const statusCode =
        membership.error === "Project not found"
          ? 404
          : 403;

      return res.status(statusCode).json({
        message: membership.error,
      });
    }

    const resultResponse = await fetch(
      `${JUDGE0_URL}/submissions/${token}?base64_encoded=false`,
      {
        headers: {
          ...(process.env.JUDGE0_AUTH_TOKEN
            ? {
                "X-Auth-Token":
                  process.env.JUDGE0_AUTH_TOKEN,
              }
            : {}),
        },
      }
    );

    if (!resultResponse.ok) {
      return res.status(502).json({
        message:
          "Unable to retrieve execution result",
      });
    }

    const result =
      await resultResponse.json();

    res.status(200).json(result);

  } catch (error) {
    console.error(
      "Compiler result error:",
      error
    );

    res.status(500).json({
      message:
        "Unable to retrieve compiler result",
    });
  }
};

/*
  Return available Judge0 languages.
*/
const getLanguages = async (req, res) => {
  try {
    const response = await fetch(
      `${JUDGE0_URL}/languages/`,
      {
        headers: {
          ...(process.env.JUDGE0_AUTH_TOKEN
            ? {
                "X-Auth-Token":
                  process.env.JUDGE0_AUTH_TOKEN,
              }
            : {}),
        },
      }
    );

    if (!response.ok) {
      return res.status(502).json({
        message: "Unable to load languages",
      });
    }

    const languages = await response.json();

    res.status(200).json({
      languages,
    });
  } catch (error) {
    console.error(
      "Language loading error:",
      error
    );

    res.status(500).json({
      message: "Unable to load languages",
    });
  }
};

module.exports = {
  runTeamCode,
  getTeamCodeResult,
  getLanguages,
};
// Run code in the public DevConnect compiler.
const runGlobalCode = async (req, res) => {
  try {
    const { sourceCode, languageId, stdin = "" } = req.body;
    if (!sourceCode?.trim()) return res.status(400).json({ message: "Source code is required" });
    if (!languageId) return res.status(400).json({ message: "Language is required" });

    const submissionResponse = await fetch(
      `${JUDGE0_URL}/submissions/?base64_encoded=false&wait=false`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(process.env.JUDGE0_AUTH_TOKEN ? { "X-Auth-Token": process.env.JUDGE0_AUTH_TOKEN } : {}),
        },
        body: JSON.stringify({
          source_code: sourceCode,
          language_id: Number(languageId),
          stdin,
          cpu_time_limit: 2,
          wall_time_limit: 5,
          memory_limit: 128000,
          max_processes_and_or_threads: 20,
          max_file_size: 2048,
          enable_network: false,
        }),
      }
    );

    if (!submissionResponse.ok) {
      console.error("Global Judge0 error:", await submissionResponse.text());
      return res.status(502).json({ message: "Code execution service failed" });
    }

    const submission = await submissionResponse.json();
    res.status(202).json({ message: "Code submitted successfully", token: submission.token });
  } catch (error) {
    console.error("Global compiler error:", error);
    res.status(500).json({ message: "Unable to run code" });
  }
};

const getGlobalCodeResult = async (req, res) => {
  try {
    const resultResponse = await fetch(
      `${JUDGE0_URL}/submissions/${req.params.token}?base64_encoded=false`,
      {
        headers: {
          ...(process.env.JUDGE0_AUTH_TOKEN ? { "X-Auth-Token": process.env.JUDGE0_AUTH_TOKEN } : {}),
        },
      }
    );
    if (!resultResponse.ok) return res.status(502).json({ message: "Unable to retrieve execution result" });
    res.json(await resultResponse.json());
  } catch (error) {
    console.error("Global compiler result error:", error);
    res.status(500).json({ message: "Unable to retrieve compiler result" });
  }
};

module.exports.runGlobalCode = runGlobalCode;
module.exports.getGlobalCodeResult = getGlobalCodeResult;
