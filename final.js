// --- Data and State Variables ---
const questions = [
    { question: "Who is our teacher in SPEC 1?", options: ["Cryslet", "Alyssa", "Joey"], answer: "Alyssa" },
    { question: "What's the National Anthem of the Philippines?", options: ["Bayang Magiliw", "Lupang Hinirang", "Perlas ng Silanganan"], answer: "Lupang Hinirang" },
    { question: "10, 20, 30, 40, ? What comes after 40?", options: ["41", "50", "I miss you"], answer: "50" },
    { question: "What is the tallest mountain in the world?", options: ["Chocolate Hills", "Mount Everest", "Sierra Madre"], answer: "Mount Everest" },
    { question: "Which planet is known as the 'Red Planet'?", options: ["Earth", "Japan", "Mars"], answer: "Mars" },
    { question: "What is the Capital City of the Philippines?", options: ["Manila", "Mabolo", "New Era St."], answer: "Manila" },
    { question: "What do bees make that tastes sweet?", options: ["Babee", "Honey", "Cutiepie"], answer: "Honey" },
    { question: "What animal loves to eat bamboo?", options: ["Akai", "Panda", "Sarah Geronimo"], answer: "Panda" },
    { question: "What do cows give us that we drink?", options: ["Cobra", "Milk", "Choco"], answer: "Milk" },
    { question: "What do you call a place where you sleep at night?", options: ["Bed", "Sa puso mo", "Sa iyaha"], answer: "Bed" },
];

let userName = "";
let currentQuestionIndex = 0;
let userAnswers = new Array(questions.length).fill(null);

// --- DOM Elements (Grouped) ---
const DOM = {
    screens: document.querySelectorAll('.screen'),
    welcomeScreen: document.getElementById('welcome-screen'),
    nameInput: document.getElementById('user-name-input'),
    readinessPrompt: document.getElementById('readiness-prompt'),
    questionText: document.getElementById('question-text'),
    answerButtonsContainer: document.getElementById('answer-buttons'),
    scoreDisplay: document.getElementById('score-display'),
    questionCounter: document.getElementById('question-counter'),
    resultsScreen: document.getElementById('results-screen'),
    resultsMessage: document.getElementById('results-message'),
    farewellMessage: document.getElementById('farewell-message'),

    // Buttons
    startBtn: document.getElementById('start-btn'),
    nextBtnName: document.getElementById('next-btn-name'),
    yesReadyBtn: document.getElementById('yes-ready-btn'),
    noReadyBtn: document.getElementById('no-ready-btn'),
    prevQBtn: document.getElementById('prev-q-btn'),
    nextQBtn: document.getElementById('next-q-btn'),
    finishBtn: document.getElementById('finish-btn'),
};

// --- Helper Functions ---

function showScreen(screenId) {
    DOM.screens.forEach(s => s.classList.remove('active'));
    document.getElementById(screenId).classList.add('active');
}

function handleEvasiveButton(button) {
    const container = button.parentElement;
    let debounceTimer;

    function moveButton() {
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(() => {
            const cRect = container.getBoundingClientRect();
            const bRect = button.getBoundingClientRect();
            const maxX = cRect.width - bRect.width;
            const maxY = cRect.height - bRect.height;

            // Ensure button stays within container bounds
            let newX = Math.random() * maxX;
            let newY = Math.random() * maxY;

            button.style.left = `${newX}px`;
            button.style.top = `${newY}px`;
        }, 100); // Debounce to 100ms
    }

    // Support mouse and touch
    button.addEventListener('mouseenter', moveButton);
    button.addEventListener('touchstart', moveButton, { passive: true });
}

// --- Quiz Logic Functions ---

function renderQuestion() {
    const currentQ = questions[currentQuestionIndex];
    
    DOM.questionText.textContent = currentQ.question;
    DOM.questionCounter.textContent = `Question ${currentQuestionIndex + 1}/${questions.length}`;
    DOM.answerButtonsContainer.innerHTML = "";

    currentQ.options.forEach((option, index) => {
        const btn = document.createElement('button');
        btn.textContent = option;
        btn.classList.add("option-btn");
        btn.setAttribute('aria-label', `Select answer: ${option}`);

        btn.addEventListener("click", () => handleAnswerSelection(option, index));
        DOM.answerButtonsContainer.appendChild(btn);
    });

    if (userAnswers[currentQuestionIndex] !== null) {
        highlightAnswer(userAnswers[currentQuestionIndex], currentQ.answer);
    }

    updateNavigationButtons();
}

function handleAnswerSelection(selectedAnswer, selectedIndex) {
    const currentQ = questions[currentQuestionIndex];
    userAnswers[currentQuestionIndex] = selectedIndex;

    highlightAnswer(selectedIndex, currentQ.answer);
    updateNavigationButtons();
}

function highlightAnswer(selectedIndex, correctAnswer) {
    const buttons = DOM.answerButtonsContainer.querySelectorAll('.option-btn');

    buttons.forEach((btn, index) => {
        btn.disabled = true;
        btn.classList.remove("correct", "incorrect");

        if (btn.textContent === correctAnswer) {
            btn.classList.add("correct");
        } else if (index === selectedIndex) {
            btn.classList.add("incorrect");
        }
    });
}

function updateNavigationButtons() {
    DOM.prevQBtn.style.display = currentQuestionIndex === 0 ? "none" : "inline-block";

    const lastIndex = questions.length - 1;

    if (currentQuestionIndex === lastIndex) {
        DOM.nextQBtn.style.display = "none";
        DOM.finishBtn.style.display = "inline-block";
    } else {
        DOM.nextQBtn.style.display = "inline-block";
        DOM.finishBtn.style.display = "none";
    }
}

function calculateAndShowResults() {
    let score = 0;

    questions.forEach((q, i) => {
        const index = userAnswers[i];
        if (index !== null && q.options[index] === q.answer) {
            score++;
        }
    });

    showResultsScreen(score);
}

function showResultsScreen(score) {
    showScreen("results-screen");

    const passingScore = 6;
    DOM.resultsScreen.className = "screen active";

    if (score >= passingScore) {
        DOM.resultsMessage.textContent = `Congratulations ${userName}! You PASSED with the score of ${score}/${questions.length}.`;
        DOM.resultsScreen.classList.add("pass");
        document.body.style.backgroundColor = "var(--pass-bg)";
    } else {
        DOM.resultsMessage.textContent = `Sorry ${userName}, you FAILED with the score of ${score}/${questions.length}.`;
        DOM.resultsScreen.classList.add("fail");
        document.body.style.backgroundColor = "var(--fail-bg)";
    }

    // Directly show the farewell message
    DOM.farewellMessage.style.display = "block";
}

// --- Event Listeners & Initialization ---

DOM.startBtn.addEventListener("click", () => showScreen("name-input-screen"));

DOM.nextBtnName.addEventListener("click", () => {
    userName = DOM.nameInput.value.trim() || "Guest";
    DOM.readinessPrompt.textContent = `Are you ready to take the quiz, ${userName}?`;
    showScreen("readiness-screen");
});

DOM.yesReadyBtn.addEventListener("click", () => {
    currentQuestionIndex = 0;
    userAnswers.fill(null);
    document.body.style.backgroundColor = "var(--secondary-color)";
    renderQuestion();
    showScreen("quiz-screen");
});

// Apply evasive behavior
handleEvasiveButton(DOM.noReadyBtn);

DOM.prevQBtn.addEventListener("click", () => {
    if (currentQuestionIndex > 0) {
        currentQuestionIndex--;
        renderQuestion();
    }
});

DOM.nextQBtn.addEventListener("click", () => {
    if (currentQuestionIndex < questions.length - 1) {
        currentQuestionIndex++;
        renderQuestion();
    }
});

DOM.finishBtn.addEventListener("click", calculateAndShowResults);