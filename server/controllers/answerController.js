const Answer = require("../models/Answer");
const Question = require("../models/Question");

// Add Answer
const addAnswer = async (req, res) => {
  try {
    const { answer, code, language } = req.body;

    const question = await Question.findById(req.params.id);

    if (!question) {
      return res.status(404).json({
        message: "Question not found",
      });
    }

    const newAnswer = await Answer.create({
      question: question._id,
      author: req.user.userId,
      answer,
      code,
      language,
    });

    question.answersCount++;

    await question.save();

    const populated = await Answer.findById(newAnswer._id)
      .populate("author", "name email");

    res.status(201).json(populated);

  } catch (error) {

    console.error(error);

    res.status(500).json({
      message: "Server Error",
    });

  }
};

// Get Answers
const getAnswers = async (req, res) => {

  try {

    const answers = await Answer.find({
      question: req.params.id,
    })
      .populate("author", "name email")
      .sort({
        votes: -1,
        createdAt: -1,
      });

    res.json(answers);

  } catch (error) {

    res.status(500).json({
      message: "Server Error",
    });

  }
};

module.exports = {
  addAnswer,
  getAnswers,
};