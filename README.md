# Assignment 6 - Triviabook

## About the Project

For this assignment, I created a trivia application using Node.js, Express, and PostgreSQL. The application allows users to view different trivia topics, get questions based on a topic, answer random questions, and add their own questions.

I used Neon PostgreSQL to store the questions and topics. I also created a simple webpage using HTML, CSS, and JavaScript so users can interact with the application.

## Technologies Used

- Node.js and Express
- PostgreSQL (Neon)
- HTML, CSS, and JavaScript
- GitHub
- Render for deployment

## Database

I created two tables in PostgreSQL to store the trivia data.

**1. Topics Table**

| Column | Data Type |
|---|---|
| id | SERIAL PRIMARY KEY |
| name | VARCHAR(100) UNIQUE NOT NULL |

This table stores the different trivia topics, such as science and geography.

**2. Questions Table**

| Column | Data Type |
|---|---|
| id | SERIAL PRIMARY KEY |
| topic_id | INTEGER NOT NULL |
| question | TEXT NOT NULL |
| answer | TEXT NOT NULL |
| difficulty | VARCHAR(10) NOT NULL |

The `topic_id` connects each question to a topic using a foreign key. The difficulty can only be `easy`, `medium`, or `hard`.

## How to Run the Project

1. Clone the repository from GitHub and open the folder in VS Code.
2. Open the terminal and install the required packages:

   ```bash
   npm install
   ```

3. Create a PostgreSQL database using Neon.
4. Create a `.env` file in the main project folder and add the database connection string:

   ```env
   DATABASE_URL=your_neon_database_url
   ```

5. Run the seed file to add the starting trivia questions:

   ```bash
   node seed.js
   ```

6. Start the server:

   ```bash
   npm start
   ```

7. Open the application in a browser:

   `http://localhost:3000`

## API Endpoints

I created five API endpoints for this assignment.

| Method | Endpoint | What It Does |
|---|---|---|
| GET | `/triviabook/topics` | Shows all available topics |
| GET | `/triviabook/topic/:topic` | Shows questions from a selected topic |
| GET | `/triviabook/random` | Gets one random question without showing the answer |
| POST | `/triviabook/answer` | Checks whether the user's answer is correct |
| POST | `/triviabook/question/add` | Adds a new trivia question to the database |

The topic endpoint also supports `limit` and `difficulty` filters.

For example:

```text
/triviabook/topic/science?difficulty=easy
```

## Testing

I tested all five endpoints using Echo API in VS Code. I checked that the GET requests returned the correct data and that the POST requests worked properly.

I also tested the application in Chrome to make sure questions could be displayed and new questions were saved in the database.

## Deployment

I will deploy the application using Render and connect it to my Neon PostgreSQL database.

**Live Application:** I will add the Render link here after deployment.

## Author

Abdullah Khan  
CSC 372 - Assignment 6  