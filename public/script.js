
/*
Name: Abdullah Khan
Date: November 19, 2026
Course: CSC 372
Description: Connects the Triviabook webpage to the API.
*/

// Wait until the webpage is ready.
document.addEventListener('DOMContentLoaded', () => {
  let topicSelect = document.getElementById('topic-select');
  let difficultySelect = document.getElementById('difficulty-select');
  let questionsList = document.getElementById('questions-list');

  let randomButton = document.getElementById('random-btn');
  let randomQuestion = document.getElementById('random-question');
  let answerForm = document.getElementById('answer-form');
  let answerInput = document.getElementById('answer-input');
  let answerResult = document.getElementById('answer-result');

  let addForm = document.getElementById('add-question-form');
  let addResult = document.getElementById('add-result');

  // Stores the ID of the current random question.
  let currentQuestionId = null;

  /**
   * Creates a message using a paragraph element.
   * @param {HTMLElement} container - Where to show the message.
   * @param {string} message - Message to display.
   * @param {string} className - Optional CSS class.
   */
  function showMessage(container, message, className = '') {
    container.replaceChildren();

    let paragraph = document.createElement('p');
    paragraph.textContent = message;

    if (className) {
      paragraph.classList.add(className);
    }

    container.appendChild(paragraph);
  }

  /**
   * Loads all available trivia topics.
   * @returns {Promise<void>}
   */
  async function loadTopics() {
    try {
      let response = await fetch('/triviabook/topics');

      if (!response.ok) {
        throw new Error('Unable to load topics');
      }

      let topics = await response.json();

      // Clear the dropdown before adding topics.
      topicSelect.replaceChildren();

      let defaultOption = document.createElement('option');
      defaultOption.value = '';
      defaultOption.textContent = 'Select a topic';
      topicSelect.appendChild(defaultOption);

      for (let topic of topics) {
        let option = document.createElement('option');
        option.value = topic.name;
        option.textContent = topic.name;
        topicSelect.appendChild(option);
      }
    } catch (error) {
      showMessage(questionsList, error.message, 'error');
    }
  }

  /**
   * Creates a question card on the webpage.
   * @param {Object} question - Question data from the API.
   * @param {HTMLElement} container - Where to add the card.
   * @param {boolean} showAnswer - Whether to display the answer.
   */
  function displayQuestion(question, container, showAnswer = true) {
    let card = document.createElement('article');
    card.classList.add('question-card');

    let title = document.createElement('h3');
    title.textContent = question.question;
    card.appendChild(title);

    let topic = document.createElement('p');
    topic.textContent = `Topic: ${question.topic}`;
    card.appendChild(topic);

    let difficulty = document.createElement('p');
    difficulty.textContent = `Difficulty: ${question.difficulty}`;
    card.appendChild(difficulty);

    if (showAnswer) {
      let answer = document.createElement('p');
      answer.textContent = `Answer: ${question.answer}`;
      card.appendChild(answer);
    }

    container.appendChild(card);
  }

  /**
   * Loads questions for the selected topic.
   * @returns {Promise<void>}
   */
  async function loadQuestions() {
    let topic = topicSelect.value;
    let difficulty = difficultySelect.value;

    if (!topic) {
      showMessage(questionsList, 'Please select a topic.', 'error');
      return;
    }

    let url = `/triviabook/topic/${encodeURIComponent(topic)}`;

    if (difficulty) {
      url += `?difficulty=${encodeURIComponent(difficulty)}`;
    }

    try {
      let response = await fetch(url);
      let questions = await response.json();

      if (!response.ok) {
        throw new Error(questions.error || 'Unable to load questions');
      }

      questionsList.replaceChildren();

      if (questions.length === 0) {
        showMessage(questionsList, 'No questions found.');
        return;
      }

      for (let question of questions) {
        displayQuestion(question, questionsList);
      }
    } catch (error) {
      showMessage(questionsList, error.message, 'error');
    }
  }

  /**
   * Loads a random trivia question without its answer.
   * @returns {Promise<void>}
   */
  async function loadRandomQuestion() {
    currentQuestionId = null;
    answerForm.hidden = true;
    answerInput.value = '';
    answerResult.textContent = '';

    try {
      let response = await fetch('/triviabook/random');
      let question = await response.json();

      if (!response.ok) {
        throw new Error(question.error || 'Unable to load question');
      }

      randomQuestion.replaceChildren();

      // Do not show the answer to a random question.
      displayQuestion(question, randomQuestion, false);

      currentQuestionId = question.id;
      answerForm.hidden = false;
    } catch (error) {
      showMessage(randomQuestion, error.message, 'error');
    }
  }

  /**
   * Sends the user's guess to the API.
   * @param {Event} event - Form submit event.
   * @returns {Promise<void>}
   */
  async function checkAnswer(event) {
    event.preventDefault();

    if (currentQuestionId === null) {
      return;
    }

    let guess = answerInput.value.trim();

    if (!guess) {
      answerResult.textContent = 'Please enter an answer.';
      answerResult.className = 'error';
      return;
    }

    try {
      let response = await fetch('/triviabook/answer', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          id: currentQuestionId,
          guess: guess
        })
      });

      let result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Unable to check answer');
      }

      if (result.correct) {
        answerResult.textContent = `Correct! Answer: ${result.answer}`;
        answerResult.className = 'success';
      } else {
        answerResult.textContent = `Incorrect. Correct answer: ${result.answer}`;
        answerResult.className = 'error';
      }
    } catch (error) {
      answerResult.textContent = error.message;
      answerResult.className = 'error';
    }
  }

  /**
   * Sends a new trivia question to the database.
   * @param {Event} event - Form submit event.
   * @returns {Promise<void>}
   */
  async function addQuestion(event) {
    event.preventDefault();

    let topic = document.getElementById('new-topic').value.trim();
    let question = document.getElementById('new-question').value.trim();
    let answer = document.getElementById('new-answer').value.trim();
    let difficulty = document.getElementById('new-difficulty').value;

    try {
      let response = await fetch('/triviabook/question/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          topic: topic,
          question: question,
          answer: answer,
          difficulty: difficulty
        })
      });

      let result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Unable to add question');
      }

      addResult.textContent = 'Question added successfully!';
      addResult.className = 'success';

      // Clear the form after saving the question.
      addForm.reset();

      // Refresh the topic dropdown for new topics.
      await loadTopics();

      // Show the updated questions if the new topic is selected.
      topicSelect.value = topic.toLowerCase();
      difficultySelect.value = '';
      await loadQuestions();
    } catch (error) {
      addResult.textContent = error.message;
      addResult.className = 'error';
    }
  }

  // Connect buttons and forms to their functions.
  document.getElementById('load-questions-btn')
    .addEventListener('click', loadQuestions);

  randomButton.addEventListener('click', loadRandomQuestion);

  answerForm.addEventListener('submit', checkAnswer);

  addForm.addEventListener('submit', addQuestion);

  // Load the topics when the webpage first opens.
  loadTopics();
});
