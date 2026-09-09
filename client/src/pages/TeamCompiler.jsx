import { useEffect, useRef, useState } from "react";
import Editor from "@monaco-editor/react";
import { io } from "socket.io-client";
import { useParams } from "react-router-dom";

import api from "../services/api";
import { useAuth } from "../context/AuthContext";

const SOCKET_URL =
  "https://devcollab-developer-collabaration-hub.onrender.com/";

const DEFAULT_CODE = `public class Main {
    public static void main(String[] args) {
        System.out.println("Hello DevCollab!");
    }
}`;

const TeamCompiler = () => {
  const { id: projectId } = useParams();
  const { token } = useAuth();

  const socketRef = useRef(null);
  const remoteChangeRef = useRef(false);
  const codeTimerRef = useRef(null);

  const [languages, setLanguages] = useState([]);
  const [languageId, setLanguageId] = useState("");
  const [sourceCode, setSourceCode] = useState(DEFAULT_CODE);
  const [stdin, setStdin] = useState("");
  const [output, setOutput] = useState("");
  const [status, setStatus] = useState("");
  const [running, setRunning] = useState(false);
  const [connected, setConnected] = useState(false);
  const [collaborators, setCollaborators] = useState(1);

  // ==========================================
  // MONACO LANGUAGE MAPPING
  // ==========================================

  const getMonacoLanguage = (name = "") => {
    const language = name.toLowerCase();

    if (language.includes("java")) return "java";
    if (language.includes("python")) return "python";
    if (
      language.includes("javascript") ||
      language.includes("node.js")
    ) {
      return "javascript";
    }
    if (language.includes("typescript")) return "typescript";
    if (language.includes("c++") || language.includes("gnu++")) {
      return "cpp";
    }
    if (language.includes("c#") || language.includes("csharp")) {
      return "csharp";
    }
    if (language.includes("php")) return "php";
    if (language.includes("go")) return "go";
    if (language.includes("rust")) return "rust";
    if (language.includes("kotlin")) return "kotlin";
    if (language.includes("swift")) return "swift";
    if (language.includes("ruby")) return "ruby";
    if (language.includes("sql")) return "sql";

    return "plaintext";
  };

  const selectedLanguage = languages.find(
    (language) =>
      String(language.id) === String(languageId)
  );

  // ==========================================
  // LOAD LANGUAGES
  // ==========================================

  useEffect(() => {
    const loadLanguages = async () => {
      try {
        setStatus("Loading languages...");

        const response = await api.get("/compiler/languages");

        console.log(
          "Languages API response:",
          response.data
        );

        /*
          Supports both:

          {
            languages: [...]
          }

          and

          [...]
        */
        const allLanguages =
          response.data?.languages ||
          response.data ||
          [];

        if (!Array.isArray(allLanguages)) {
          throw new Error(
            "Invalid languages response from server"
          );
        }

        /*
          Do not require is_archived === false.
          Some Judge0 responses may omit is_archived.
        */
        const usableLanguages = allLanguages.filter(
          (language) =>
            language &&
            language.id !== undefined &&
            language.name &&
            language.is_archived !== true
        );

        console.log(
          "Usable languages:",
          usableLanguages
        );

        setLanguages(usableLanguages);

        // Try Java first
        const java = usableLanguages.find((language) =>
          language.name
            .toLowerCase()
            .includes("java")
        );

        if (java) {
          setLanguageId(String(java.id));
        } else if (usableLanguages.length > 0) {
          setLanguageId(
            String(usableLanguages[0].id)
          );
        }

        setStatus("");
      } catch (error) {
        console.error(
          "Language loading error:",
          error.response?.data || error.message
        );

        setStatus(
          error.response?.data?.message ||
            "Unable to load languages"
        );
      }
    };

    loadLanguages();
  }, []);

  // ==========================================
  // SOCKET CONNECTION
  // ==========================================

  useEffect(() => {
    if (!token || !projectId) {
      return;
    }

    const socket = io(SOCKET_URL, {
      auth: {
        token,
      },
    });

    socketRef.current = socket;

    socket.on("connect", () => {
      setConnected(true);

      socket.emit("join_compiler", {
        projectId,
      });
    });

    socket.on("disconnect", () => {
      setConnected(false);
    });

    socket.on("compiler_error", (data) => {
      setStatus(
        data?.message || "Compiler connection error"
      );
    });

    socket.on("compiler_joined", () => {
      setStatus("Connected to team compiler");
    });

    // ======================================
    // RECEIVE CODE CHANGE
    // ======================================

    socket.on(
      "compiler_code_change",
      ({ code }) => {
        remoteChangeRef.current = true;

        setSourceCode(code || "");

        setTimeout(() => {
          remoteChangeRef.current = false;
        }, 0);
      }
    );

    // ======================================
    // RECEIVE LANGUAGE CHANGE
    // ======================================

    socket.on(
      "compiler_language_change",
      ({ languageId }) => {
        remoteChangeRef.current = true;

        setLanguageId(String(languageId));

        setTimeout(() => {
          remoteChangeRef.current = false;
        }, 0);
      }
    );

    // ======================================
    // COLLABORATOR JOIN
    // ======================================

    socket.on(
      "compiler_user_joined",
      () => {
        setCollaborators((previous) => previous + 1);
      }
    );

    // ======================================
    // COLLABORATOR LEFT
    // ======================================

    socket.on(
      "compiler_user_left",
      () => {
        setCollaborators((previous) =>
          Math.max(1, previous - 1)
        );
      }
    );

    return () => {
      socket.disconnect();
      socketRef.current = null;

      if (codeTimerRef.current) {
        clearTimeout(codeTimerRef.current);
      }
    };
  }, [token, projectId]);

  // ==========================================
  // EDIT CODE
  // ==========================================

  const handleCodeChange = (value) => {
    const newCode = value || "";

    setSourceCode(newCode);

    if (
      remoteChangeRef.current ||
      !socketRef.current
    ) {
      return;
    }

    clearTimeout(codeTimerRef.current);

    codeTimerRef.current = setTimeout(() => {
      socketRef.current.emit(
        "compiler_code_change",
        {
          projectId,
          code: newCode,
        }
      );
    }, 100);
  };

  // ==========================================
  // CHANGE LANGUAGE
  // ==========================================

  const handleLanguageChange = (e) => {
    const newLanguageId = e.target.value;

    setLanguageId(newLanguageId);

    if (
      remoteChangeRef.current ||
      !socketRef.current
    ) {
      return;
    }

    socketRef.current.emit(
      "compiler_language_change",
      {
        projectId,
        languageId: newLanguageId,
      }
    );
  };

  // ==========================================
  // FORMAT RESULT
  // ==========================================

  const formatResult = (result) => {
    if (result.stdout) {
      return result.stdout;
    }

    if (result.compile_output) {
      return result.compile_output;
    }

    if (result.stderr) {
      return result.stderr;
    }

    if (result.message) {
      return result.message;
    }

    return (
      result.status?.description ||
      "No output"
    );
  };

  // ==========================================
  // WAIT FOR JUDGE0
  // ==========================================

  const waitForResult = async (tokenValue) => {
    for (
      let attempt = 0;
      attempt < 20;
      attempt++
    ) {
      const response = await api.get(
        `/compiler/team/${projectId}/result/${tokenValue}`
      );

      const result = response.data;

      if (
        result.status?.id !== 1 &&
        result.status?.id !== 2
      ) {
        return result;
      }

      await new Promise((resolve) =>
        setTimeout(resolve, 700)
      );
    }

    throw new Error("Execution timed out");
  };

  // ==========================================
  // RUN CODE
  // ==========================================

  const runCode = async () => {
    if (!sourceCode.trim()) {
      setOutput("Write some code first.");
      return;
    }

    if (!languageId) {
      setOutput("Select a programming language.");
      return;
    }

    try {
      setRunning(true);
      setStatus("Submitting code...");
      setOutput("");

      const submission = await api.post(
        `/compiler/team/${projectId}/run`,
        {
          sourceCode,
          languageId: Number(languageId),
          stdin,
        }
      );

      setStatus("Running code...");

      const result = await waitForResult(
        submission.data.token
      );

      setOutput(formatResult(result));

      setStatus(
        result.status?.description ||
          "Finished"
      );
    } catch (error) {
      console.error(
        "Execution error:",
        error.response?.data || error
      );

      setStatus("Execution failed");

      setOutput(
        error.response?.data?.message ||
          error.message ||
          "Unable to execute code"
      );
    } finally {
      setRunning(false);
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-8rem)] flex-col gap-4">

      {/* HEADER */}
      <div className="flex flex-col gap-4 rounded-xl border border-slate-200 bg-white p-5 md:flex-row md:items-center md:justify-between">

        <div>
          <div className="flex items-center gap-3">

            <h1 className="text-xl font-bold text-slate-900">
              💻 Private Team Compiler
            </h1>

            <span className="rounded-full bg-green-50 px-3 py-1 text-xs font-medium text-green-600">
              Shared
            </span>

          </div>

          <div className="mt-2 flex flex-wrap items-center gap-4 text-xs text-slate-500">

            <span>
              <span
                className={
                  connected
                    ? "text-green-500"
                    : "text-red-500"
                }
              >
                ●
              </span>{" "}
              {connected
                ? "Connected"
                : "Disconnected"}
            </span>

            <span>
              👥 {collaborators} collaborator
              {collaborators !== 1
                ? "s"
                : ""}
            </span>

          </div>
        </div>

        <div className="flex items-center gap-3">

          {/* LANGUAGE SELECTOR */}
          <select
            value={languageId}
            onChange={handleLanguageChange}
            disabled={languages.length === 0}
            className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none disabled:cursor-not-allowed disabled:bg-slate-100"
          >
            <option value="">
              {languages.length === 0
                ? "Loading languages..."
                : "Select Language"}
            </option>

            {languages.map((language) => (
              <option
                key={language.id}
                value={String(language.id)}
              >
                {language.name}
              </option>
            ))}
          </select>

          <button
            onClick={runCode}
            disabled={running || !languageId}
            className="rounded-lg bg-slate-900 px-5 py-2 text-sm font-medium text-white hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {running
              ? "Running..."
              : "▶ Run Code"}
          </button>

        </div>
      </div>

      {/* STATUS */}
      {status && (
        <div className="rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm text-slate-600">
          {status}
        </div>
      )}

      {/* EDITOR */}
      <div className="overflow-hidden rounded-xl border border-slate-200">

        <Editor
          height="55vh"
          theme="vs-dark"
          language={
            selectedLanguage
              ? getMonacoLanguage(
                  selectedLanguage.name
                )
              : "plaintext"
          }
          value={sourceCode}
          onChange={handleCodeChange}
          options={{
            minimap: {
              enabled: false,
            },

            fontSize: 14,

            padding: {
              top: 15,
            },

            automaticLayout: true,
          }}
        />

      </div>

      {/* INPUT / OUTPUT */}
      <div className="grid gap-4 lg:grid-cols-2">

        {/* INPUT */}
        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">

          <div className="border-b border-slate-200 px-4 py-3">
            <h2 className="text-sm font-semibold">
              Standard Input
            </h2>
          </div>

          <textarea
            value={stdin}
            onChange={(e) =>
              setStdin(e.target.value)
            }
            placeholder="Enter input..."
            className="min-h-32 w-full resize-none p-4 font-mono text-sm outline-none"
          />

        </div>

        {/* OUTPUT */}
        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">

          <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3">

            <h2 className="text-sm font-semibold">
              Output
            </h2>

            <span className="text-xs text-slate-500">
              {status}
            </span>

          </div>

          <pre className="min-h-32 overflow-auto whitespace-pre-wrap bg-slate-950 p-4 font-mono text-sm text-slate-200">
            {output ||
              "Program output will appear here..."}
          </pre>

        </div>

      </div>

    </div>
  );
};

export default TeamCompiler;
