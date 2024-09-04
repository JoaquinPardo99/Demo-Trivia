let questions = [];
let currentQuestionIndex = 0;
let score = 0;
let timer;
let timeLeft = 10;
let userAnswers = [];

const questionElement = document.getElementById("question");
const optionButtons = document.querySelectorAll(".option");
const timerElement = document.getElementById("timer");
const scoreContainer = document.getElementById("score-container");
const scoreElement = document.getElementById("score");
const finalMessageElement = document.getElementById("final-message");
const restartButton = document.getElementById("restart-button");
const progressBar = document.getElementById("progress-bar");
const notificationElement = document.getElementById("notification");
const summaryContainer = document.getElementById("summary-container");
const welcomeContainer = document.getElementById("welcome-container");
const triviaContainer = document.getElementById("trivia-container");
const startButton = document.getElementById("start-button");

function startTrivia() {
  currentQuestionIndex = 0;
  score = 0;
  userAnswers = [];
  progressBar.style.width = "0%";
  progressBar.setAttribute("aria-valuenow", 0);
  scoreContainer.style.display = "none";
  summaryContainer.innerHTML = "";
  triviaContainer.style.display = "block";
  welcomeContainer.style.display = "none";
  showQuestion();
  startTimer();
}

function showQuestion() {
  const currentQuestion = questions[currentQuestionIndex];

  optionButtons.forEach((button) => {
    button.className = "option btn btn-primary btn-block";
    button.disabled = false;
  });

  questionElement.classList.remove("animate__animated", "animate__fadeIn");
  void questionElement.offsetWidth;
  questionElement.classList.add("animate__animated", "animate__fadeIn");

  questionElement.textContent = currentQuestion.question;
  optionButtons.forEach((button, index) => {
    button.classList.remove("animate__animated", "animate__fadeInUp");
    void button.offsetWidth;
    button.classList.add("animate__animated", "animate__fadeInUp");

    button.textContent = currentQuestion.options[index];
    button.onclick = () => selectAnswer(button, button.textContent);
  });
}

function selectAnswer(button, selectedOption) {
  const currentQuestion = questions[currentQuestionIndex];
  if (button) button.disabled = true;

  const correct = selectedOption === currentQuestion.answer;
  if (correct) {
    if (button)
      button.classList.add(
        "animate__animated",
        "animate__bounceIn",
        "bg-success"
      );
    score++;
  } else {
    if (button)
      button.classList.add("animate__animated", "animate__shakeX", "bg-danger");
  }

  userAnswers.push({
    question: currentQuestion.question,
    selected: selectedOption,
    correct: currentQuestion.answer,
    isCorrect: correct,
  });

  clearInterval(timer);
  setTimeout(() => {
    if (currentQuestionIndex < questions.length - 1) {
      currentQuestionIndex++;
      updateProgressBar();
      showQuestion();
      startTimer();
    } else {
      endTrivia();
    }
  }, 1000);
}

function startTimer() {
  timeLeft = 10;
  timerElement.textContent = timeLeft;
  timer = setInterval(() => {
    timeLeft--;
    timerElement.textContent = timeLeft;
    if (timeLeft <= 0) {
      clearInterval(timer);
      showNotification();
      selectAnswer(null, "");
    }
  }, 1000);
}

function endTrivia() {
  scoreElement.textContent = score;
  displayFinalMessage();
  displaySummary();
  scoreContainer.style.display = "block";
  launchConfetti();
}

function updateProgressBar() {
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;
  progressBar.style.width = `${progress}%`;
  progressBar.setAttribute("aria-valuenow", progress);
}

function showNotification() {
  notificationElement.style.display = "block";
  setTimeout(() => {
    notificationElement.style.display = "none";
  }, 1000);
}

function displayFinalMessage() {
  let message = "";
  if (score === 10) {
    message = "¡Excelente! Acertaste todas las preguntas. ¡Eres un genio!";
  } else if (score >= 7) {
    message = "¡Buen trabajo! Acertaste la mayoría de las preguntas.";
  } else if (score >= 4) {
    message = "Puedes mejorar. Practica un poco más y lo lograrás.";
  } else {
    message = "Mejor suerte la próxima vez. ¡No te rindas!";
  }
  finalMessageElement.textContent = message;
}

function displaySummary() {
  userAnswers.forEach((answer) => {
    const questionDiv = document.createElement("div");
    questionDiv.classList.add("mb-3");

    const questionText = document.createElement("p");
    questionText.classList.add("font-weight-bold");
    questionText.textContent = answer.question;
    questionDiv.appendChild(questionText);

    const selectedAnswerText = document.createElement("p");
    selectedAnswerText.textContent = `Tu respuesta: ${answer.selected}`;
    questionDiv.appendChild(selectedAnswerText);

    const correctAnswerText = document.createElement("p");
    correctAnswerText.textContent = `Respuesta correcta: ${answer.correct}`;
    questionDiv.appendChild(correctAnswerText);

    summaryContainer.appendChild(questionDiv);
  });
}

function launchConfetti() {
  let colors = ["#bb0000", "#ffffff"];
  if (score >= 7) {
    colors = ["#00FF00", "#FFD700"];
  } else if (score >= 4) {
    colors = ["#FF4500", "#FF8C00"];
  }

  const duration = 5 * 1000;
  const animationEnd = Date.now() + duration;
  const defaults = {
    startVelocity: 30,
    spread: 360,
    ticks: 60,
    zIndex: 0,
    colors: colors,
  };

  function randomInRange(min, max) {
    return Math.random() * (max - min) + min;
  }

  const interval = setInterval(() => {
    const timeLeft = animationEnd - Date.now();

    if (timeLeft <= 0) {
      return clearInterval(interval);
    }

    const particleCount = 50 * (timeLeft / duration);

    confetti(
      Object.assign({}, defaults, {
        particleCount,
        origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
      })
    );
    confetti(
      Object.assign({}, defaults, {
        particleCount,
        origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
      })
    );
  }, 250);
}

restartButton.onclick = startTrivia;

startButton.onclick = startTrivia;

function loadQuestions() {
  fetch("questions.json")
    .then((response) => response.json())
    .then((data) => {
      questions = data;
    })
    .catch((error) => console.error("Error al cargar las preguntas:", error));
}

loadQuestions();
