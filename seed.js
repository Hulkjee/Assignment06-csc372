/*
Name: Abdullah Khan
Date: November 18, 2026
Course: CSC 372
Description: Adds the starting trivia questions to the database.
*/

let pool = require('./db');

// Starting questions for the Triviabook application.
let questions = [
  {
    topic: 'science',
    question: 'What planet is known as the Red Planet?',
    answer: 'Mars',
    difficulty: 'easy'
  },
  {
    topic: 'science',
    question: 'What is the chemical symbol for gold?',
    answer: 'Au',
    difficulty: 'medium'
  },
  {
    topic: 'science',
    question: 'What is the powerhouse of the cell?',
    answer: 'Mitochondria',
    difficulty: 'easy'
  },
  {
    topic: 'geography',
    question: 'What is the capital of Australia?',
    answer: 'Canberra',
    difficulty: 'medium'
  },
  {
    topic: 'geography',
    question: 'Which river flows through Cairo?',
    answer: 'The Nile',
    difficulty: 'easy'
  }
];

// Insert the starting questions into PostgreSQL.
async function seedDatabase() {
  try {
    for (let item of questions) {
      let topicResult = await pool.query(
        `INSERT INTO topics (name)
         VALUES ($1)
         ON CONFLICT (name)
         DO UPDATE SET name = EXCLUDED.name
         RETURNING id`,
        [item.topic]
      );

      let topicId = topicResult.rows[0].id;

      // Avoid adding the same question more than once.
      let existing = await pool.query(
        `SELECT id FROM questions
         WHERE topic_id = $1 AND question = $2`,
        [topicId, item.question]
      );

      if (existing.rows.length === 0) {
        await pool.query(
          `INSERT INTO questions
           (topic_id, question, answer, difficulty)
           VALUES ($1, $2, $3, $4)`,
          [topicId, item.question, item.answer, item.difficulty]
        );
      }
    }

    console.log('Database seeded successfully!');
  } catch (error) {
    console.log('Error seeding database:', error.message);
  } finally {
    await pool.end();
  }
}

seedDatabase();
