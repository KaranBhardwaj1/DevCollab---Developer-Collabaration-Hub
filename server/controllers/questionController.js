const Question = require("../models/Question");

const askQuestion = async (req, res) => {
  try {
    const {
      title,
      description,
      code,
      language,
      tags,
    } = req.body;

    const question = await Question.create({
      title,
      description,
      code,
      language,
      tags,
      author: req.user.userId,
    });

    res.status(201).json(question);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Server Error",
    });
  }
};

const getQuestions = async (req, res) => {
  try {
    const questions = await Question.find()
      .populate("author", "name email")
      .sort({
        createdAt: -1,
      });

    res.json(questions);
  } catch (error) {
    res.status(500).json({
      message: "Server Error",
    });
  }
};

const getQuestion = async (req, res) => {
  try {
    const question = await Question.findById(
      req.params.id
    ).populate("author", "name email");

    if (!question)
      return res.status(404).json({
        message: "Question not found",
      });

    question.views++;

    await question.save();

    res.json(question);
  } catch (error) {
    res.status(500).json({
      message: "Server Error",
    });
  }
};

module.exports = {
  askQuestion,
  getQuestions,
  getQuestion,
};