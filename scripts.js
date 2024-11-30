document.getElementById('start-btn').addEventListener('click', startQuiz);

let words = [];
let correctCount = 0;
let totalCount = 0;
let questionIndex = 0;
let mode = "hide-word";

function startQuiz() {
  const input = document.getElementById('word-input').value.trim();
  if (!input) return alert('단어와 뜻을 입력하세요.');

  words = input.split('\n').map(line => {
    const [word, meaning] = line.split(' ');
    return { word, meaning };
  });

  const choicesCount = parseInt(document.getElementById('choices-count').value);
  const questionCount = parseInt(document.getElementById('question-count').value);

  correctCount = 0;
  totalCount = questionCount;
  questionIndex = 0;

  document.getElementById('input-section').style.display = 'none';
  document.getElementById('question-area').style.display = 'block';

  loadNextQuestion(choicesCount);
}

function updateStats() {
  document.getElementById('correct-count').innerText = correctCount;
  document.getElementById('total-count').innerText = totalCount;
  const progress = (correctCount / totalCount) * 100;
  document.getElementById('progress').style.width = progress + '%';
}

function loadNextQuestion(choicesCount) {
  if (questionIndex >= totalCount) {
    alert(`학습 완료! 정답률: ${(correctCount / totalCount * 100).toFixed(1)}%`);
    location.reload();
    return;
  }

  const currentQuestion = words[Math.floor(Math.random() * words.length)];
  const mode = Math.random() > 0.5 ? "hide-word" : "hide-meaning";
  const question = mode === "hide-word" ? currentQuestion.meaning : currentQuestion.word;

  const choices = generateChoices(currentQuestion, mode, choicesCount);
  renderQuestion(question, choices, currentQuestion, mode);

  questionIndex++;
}

function generateChoices(correctItem, mode, choicesCount) {
  const choices = [correctItem];
  while (choices.length < choicesCount) {
    const randomItem = words[Math.floor(Math.random() * words.length)];
    if (!choices.includes(randomItem)) choices.push(randomItem);
  }
  return shuffleArray(choices).map(item => (mode === "hide-word" ? item.word : item.meaning));
}

function renderQuestion(question, choices, currentQuestion, mode) {
  const questionArea = document.getElementById('question-area');
  questionArea.querySelector('#question').innerText = question;

  const choicesContainer = questionArea.querySelector('#choices');
  choicesContainer.innerHTML = '';

  choices.forEach(choiceText => {
    const button = document.createElement('button');
    button.className = 'choice';
    button.innerText = choiceText;

    button.addEventListener('click', () => handleAnswer(button, choiceText, currentQuestion, mode));
    choicesContainer.appendChild(button);
  });
}

function handleAnswer(button, selectedAnswer, currentQuestion, mode) {
  const correctAnswer = mode === "hide-word" ? currentQuestion.word : currentQuestion.meaning;

  if (selectedAnswer === correctAnswer) {
    correctCount++;
    button.classList.add('correct');
  } else {
    button.classList.add('incorrect');
    alert(`오답! 정답은: ${correctAnswer}`);
  }

  updateStats();
  setTimeout(() => loadNextQuestion(parseInt(document.getElementById('choices-count').value)), 1000);
}

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}