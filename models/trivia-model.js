
/*
Name: Abdullah Khan
Date: November 19, 2026
Course: CSC 372
Description: Handles database queries for trivia questions and topics.
*/

let pool = require('../db');

/**
 * Gets all topics from the database.
 * @returns {Promise<Array>} List of topics.
 */
async function getTopics() {
  let result = await pool.query(
    'SELECT id, name FROM topics ORDER BY name'
  );

  return result.rows;
}

/**
 * Gets questions for a specific topic.
 * @param {string} topic - Name of the topic.
 * @param {string} difficulty - Optional difficulty filter.
 * @param {number} limit - Optional maximum number of questions.
 * @returns {Promise<Array>} List of questions.
 */
async function getQuestionsByTopic(topic, difficulty, limit) {
  let query = `
    SELECT q.id, t.name AS topic, q.question,
           q.answer, q.difficulty
    FROM questions q
    JOIN topics t ON q.topic_id = t.id
    WHERE t.name = $1
  `;

  let values = [topic];

  // Filter questions by difficulty if provided.
  if (difficulty) {
    values.push(difficulty);
    query += ` AND q.difficulty = $${values.length}`;
  }

  query += ' ORDER BY q.id';

  // Limit the number of questions if provided.
  if (limit !== undefined) {
    values.push(limit);
    query += ` LIMIT $${values.length}`;
  }

  let result = await pool.query(query, values);
  return result.rows;
}

/**
 * Gets one random question without showing its answer.
 * @returns {Promise<Object|null>} A random question.
 */
async function getRandomQuestion() {
  let result = await pool.query(`
    SELECT q.id, t.name AS topic, q.question, q.difficulty
    FROM questions q
    JOIN topics t ON q.topic_id = t.id
    ORDER BY RANDOM()
    LIMIT 1
  `);

  return result.rows[0] || null;
}

/**
 * Gets a question by its ID.
 * @param {number} id - The question ID.
 * @returns {Promise<Object|null>} The question or null.
 */
async function getQuestionById(id) {
  let result = await pool.query(
    'SELECT id, answer FROM questions WHERE id = $1',
    [id]
  );

  return result.rows[0] || null;
}

/**
 * Adds a new trivia question to the database.
 * Creates the topic if it does not already exist.
 * @param {string} topic - Topic name.
 * @param {string} question - Trivia question.
 * @param {string} answer - Correct answer.
 * @param {string} difficulty - Question difficulty.
 * @returns {Promise<Array>} Updated questions for the topic.
 */
async function addQuestion(topic, question, answer, difficulty) {
  let client = await pool.connect();

  try {
    await client.query('BEGIN');

    // Create the topic if it does not already exist.
    let topicResult = await client.query(
      `INSERT INTO topics (name)
       VALUES ($1)
       ON CONFLICT (name)
       DO UPDATE SET name = EXCLUDED.name
       RETURNING id`,
      [topic]
    );

    let topicId = topicResult.rows[0].id;

    // Save the new question.
    await client.query(
      `INSERT INTO questions (topic_id, question, answer, difficulty)
       VALUES ($1, $2, $3, $4)`,
      [topicId, question, answer, difficulty]
    );

    // Get the updated list of questions.
    let result = await client.query(
      `SELECT q.id, t.name AS topic, q.question,
              q.answer, q.difficulty
       FROM questions q
       JOIN topics t ON q.topic_id = t.id
       WHERE t.id = $1
       ORDER BY q.id`,
      [topicId]
    );

    await client.query('COMMIT');

    return result.rows;
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
}

module.exports = {
  getTopics,
  getQuestionsByTopic,
  getRandomQuestion,
  getQuestionById,
  addQuestion
};
