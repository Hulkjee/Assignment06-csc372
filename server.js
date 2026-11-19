/*
Name: Abdullah Khan
Date: November 18, 2026
Course: CSC 372
Description: Starts the Triviabook Express server.
*/

let express = require('express');
let app = express();

let port = process.env.PORT || 3000;

// Allows the server to receive JSON data.
app.use(express.json());

// Test route.
app.get('/', (req, res) => {
  res.send('Welcome to Triviabook!');
});

// Starts the server.
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});