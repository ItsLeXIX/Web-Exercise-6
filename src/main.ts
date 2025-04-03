interface Question {
  category: string;
  question: string;
  options: (string | number)[];
  answer: string | number;
  difficulty: 'easy' | 'medium' | 'hard';
}
  
interface LeaderboardEntry {
  name: string;
  score: number;
}
  
const nameInput = document.getElementById('player-name') as HTMLInputElement;
const startBtn = document.getElementById('start-btn') as HTMLButtonElement;
const quizContainer = document.getElementById('quiz-container') as HTMLDivElement;
const playerInput = document.getElementById('player-input') as HTMLDivElement;
const questionText = document.getElementById('question-text') as HTMLDivElement;
const optionsContainer = document.getElementById('options-container') as HTMLDivElement;
const nextBtn = document.getElementById('next-btn') as HTMLButtonElement;
const feedback = document.getElementById('feedback') as HTMLDivElement;
const leaderboardList = document.getElementById('leaderboard-list') as HTMLUListElement;
  
let questions: Question[] = [];
let currentQuestionIndex = 0;
let selectedOption = '';
let score = 0;
let playerName = '';
const leaderboard: LeaderboardEntry[] = [];
  
nameInput.addEventListener('input', () => {
  startBtn.disabled = nameInput.value.trim() === '';
});
  
startBtn.addEventListener('click', async () => {
  playerName = nameInput.value.trim();
  playerInput.style.display = 'none';
  quizContainer.style.display = 'block';
  await loadQuestions();
  if (questions.length === 0) {
    questionText.innerText = 'No questions available.';
    return;
  }
  showQuestion();
});
  
nextBtn.addEventListener('click', () => {
  const current = questions[currentQuestionIndex];
  if (selectedOption === current.answer) {
    score += getPoints(current.difficulty);
    feedback.innerText = 'Correct!';
    feedback.className = 'text-success';
  } else {
    feedback.innerText = 'Wrong!';
    feedback.className = 'text-danger';
  }
  
  setTimeout(() => {
    feedback.innerText = '';
    feedback.className = '';
    currentQuestionIndex++;
    if (currentQuestionIndex < questions.length) {
      showQuestion();
    } else {
      endQuiz();
    }
  }, 1000);
});
  
async function loadQuestions() {
  try {
    const res = await fetch('questions.json');
    const data: Question[] = await res.json();
    questions = data.sort(() => 0.5 - Math.random()).slice(0, 5); // temporary random pick
  } catch (error) {
    console.error('Failed to load questions:', error);
  }
}
  
function showQuestion() {
  const q = questions[currentQuestionIndex];
  questionText.innerText = q.question;
  optionsContainer.innerHTML = '';
  nextBtn.disabled = true;
  selectedOption = '';
  
  q.options.forEach(opt => {
    const btn = document.createElement('button');
    btn.className = 'btn btn-outline-primary btn-block';
    btn.innerText = String(opt);
    btn.onclick = () => {
      selectedOption = JSON.parse(btn.innerText);
      nextBtn.disabled = false;
      document.querySelectorAll('#options-container button').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
    };
    optionsContainer.appendChild(btn);
  });
}
  
function endQuiz() {
  quizContainer.innerHTML = `
    <h3 class="text-center">Quiz Completed</h3>
    <p class="text-center">${playerName}, you scored ${score} points.</p>
  `;
  
  leaderboard.push({ name: playerName, score });
  leaderboard.sort((a, b) => b.score - a.score);
  leaderboardList.innerHTML = '';
  
  leaderboard.forEach(player => {
    const li = document.createElement('li');
    li.className = 'list-group-item';
    li.innerText = `${player.name}: ${player.score} pts`;
    leaderboardList.appendChild(li);
  });
}
  
function getPoints(difficulty: string): number {
  switch (difficulty.toLowerCase()) {
    case 'easy': return 1;
    case 'medium': return 2;
    case 'hard': return 3;
    default: return 0;
  }
}