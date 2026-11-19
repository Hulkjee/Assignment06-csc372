
/*
Name: Abdullah Khan
Date: November 19, 2026
Course: CSC 372
Description: Defines routes for the Triviabook API.
*/

let express = require('express');
let router = express.Router();
let triviaController = require('../controllers/trivia-controller');

// Route to get all topics.
router.get('/topics', triviaController.getTopics);

// Route to get questions by topic.
router.get('/topic/:topic', triviaController.getQuestionsByTopic);

// Route to get one random question.
router.get('/random', triviaController.getRandomQuestion);

// Route to check a user's answer.
router.post('/answer', triviaController.checkAnswer);

// Route to add a new trivia question.
router.post('/question/add', triviaController.addQuestion);

module.exports = router;
