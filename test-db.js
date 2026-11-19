/*
Name: Abdullah Khan
Date: November 19, 2026
Course: CSC 372
Description: Tests the connection to the Neon database.
*/

let pool = require('./db');

// Test the database connection.
async function testConnection() {
  try {
    let result = await pool.query('SELECT NOW()');

    console.log('Successfully connected to Neon!');
    console.log('Database time:', result.rows[0].now);
  } catch (error) {
    console.log('Database connection failed:', error.message);
  } finally {
    await pool.end();
  }
}

testConnection();