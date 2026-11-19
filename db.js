/*
Name: Abdullah Khan
Date: November 18, 2026
Course: CSC 372
Description: Connects the application to the Neon database.
*/

require('dotenv').config();

let { Pool } = require('pg');

let pool = new Pool({
  connectionString: process.env.DATABASE_URL
});

module.exports = pool;