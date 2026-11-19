
/*
Name: Abdullah Khan
Date: November 19, 2026
Course: CSC 372
Description: Handles incoming trivia API requests.
*/

let triviaModel = require('../models/trivia-model');

/**
 * Sends all trivia topics to the client.
 * @param {Object} req - Express request.
 * @param {Object} res - Express response.
 * @returns {Promise<void>}
 */
async function getTopics(req, res) {
  try {
    let topics = await triviaModel.getTopics();
    res.json(topics);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: 'Unable to retrieve topics'
    });
  }
}

/**
 * Gets questions for a specific topic.
 * @param {Object} req - Express request.
 * @param {Object} res - Express response.
 * @returns {Promise<void>}
 */
async function getQuestionsByTopic(req, res) {
  try {
    let topic = req.params.topic.toLowerCase();
    let difficulty = req.query.difficulty;
    let limit = req.query.limit;

    // Check if the difficulty is valid.
    if (difficulty && !['easy', 'medium', 'hard'].includes(difficulty)) {
      return res.status(400).json({
        error: 'Invalid difficulty'
      });
    }

    // Check if the limit is a positive integer.
    if (limit !== undefined &&
        (!/^[1-9]\d*$/.test(limit) || !Number.isSafeInteger(Number(limit)))) {
      return res.status(400).json({
        error: 'Limit must be a positive integer'
      });
    }

    // Check if the topic exists.
    let topics = await triviaModel.getTopics();

    if (!topics.some(item => item.name === topic)) {
      return res.status(404).json({
        error: 'Topic not found'
      });
    }

    let questions = await triviaModel.getQuestionsByTopic(
      topic,
      difficulty,
      limit === undefined ? undefined : Number(limit)
    );

    res.json(questions);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: 'Unable to retrieve questions'
    });
  }
}

/**
 * Sends one random question without its answer.
 * @param {Object} req - Express request.
 * @param {Object} res - Express response.
 * @returns {Promise<void>}
 */
async function getRandomQuestion(req, res) {
  try {
    let question = await triviaModel.getRandomQuestion();

    if (!question) {
      return res.status(404).json({
        error: 'No trivia questions found'
      });
    }

    res.json(question);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: 'Unable to retrieve a random question'
    });
  }
}

/**
 * Checks whether the user's answer is correct.
 * @param {Object} req - Express request.
 * @param {Object} res - Express response.
 * @returns {Promise<void>}
 */
async function checkAnswer(req, res) {
  try {
    let { id, guess } = req.body || {};

    // Check that the ID and guess are valid.
    if (!Number.isSafeInteger(id) || id <= 0 ||
        typeof guess !== 'string' || !guess.trim()) {
      return res.status(400).json({
        error: 'A valid question ID and guess are required'
      });
    }

    let question = await triviaModel.getQuestionById(id);

    if (!question) {
      return res.status(404).json({
        error: 'Question not found'
      });
    }

    // Ignore uppercase letters and extra spaces.
    let correct = guess.trim().toLowerCase() ===
                  question.answer.trim().toLowerCase();

    res.json({
      correct: correct,
      answer: question.answer
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: 'Unable to check answer'
    });
  }
}

/**
 * Adds a new trivia question to the database.
 * @param {Object} req - Express request.
 * @param {Object} res - Express response.
 * @returns {Promise<void>}
 */
async function addQuestion(req, res) {
  try {
    let { topic, question, answer, difficulty } = req.body || {};

    // Make sure all required fields are provided.
    if (typeof topic !== 'string' || !topic.trim() ||
        typeof question !== 'string' || !question.trim() ||
        typeof answer !== 'string' || !answer.trim() ||
        typeof difficulty !== 'string') {
      return res.status(400).json({
        error: 'Topic, question, answer, and difficulty are required'
      });
    }

    // Use lowercase names for topics and difficulties.
    topic = topic.trim().toLowerCase();
    question = question.trim();
    answer = answer.trim();
    difficulty = difficulty.trim().toLowerCase();

    // Check if the difficulty is valid.
    if (!['easy', 'medium', 'hard'].includes(difficulty)) {
      return res.status(400).json({
        error: 'Difficulty must be easy, medium, or hard'
      });
    }

    // Save the question and get the updated list.
    let questions = await triviaModel.addQuestion(
      topic,
      question,
      answer,
      difficulty
    );

    res.status(201).json(questions);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: 'Unable to add question'
    });
  }
}

module.exports = {
  getTopics,
  getQuestionsByTopic,
  getRandomQuestion,
  checkAnswer,
  addQuestion
};
