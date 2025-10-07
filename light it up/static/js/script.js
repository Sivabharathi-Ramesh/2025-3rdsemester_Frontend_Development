// ===== DATA: Questions and Learning Content =====
// This structure holds the learning materials and questions for each grade.
const content = {
    '1': {
        learning: "<p><b>Addition is finding the total.</b> For example, 2 + 3 means you have 2 apples and you get 3 more. Now you have 5 apples!</p><p>2 + 3 = 5</p>",
        levels: [
            { question: "2 + 2", answer: "4" },
            { question: "3 + 1", answer: "4" },
            { question: "4 + 3", answer: "7" }
        ]
    },
    '2': {
        learning: "<p><b>Subtraction is taking away.</b> For example, 5 - 2 means you have 5 cookies and you eat 2. Now you have 3 left!</p><p>5 - 2 = 3</p>",
        levels: [
            { question: "8 - 3", answer: "5" },
            { question: "10 - 4", answer: "6" },
            { question: "15 - 7", answer: "8" }
        ]
    },
    '3': {
        learning: "<p><b>Multiplication is repeated addition.</b> For example, 4 x 3 is the same as adding 4 three times: 4 + 4 + 4 = 12.</p><p>4 x 3 = 12</p>",
        levels: [
            { question: "3 x 3", answer: "9" },
            { question: "5 x 4", answer: "20" },
            { question: "7 x 5", answer: "35" }
        ]
    }
};

// ===== GAME STATE VARIABLES =====
let playerName = "";
let playerGrade = "";
let currentLevel = 0;
let score = 0;

// ===== DOM ELEMENTS =====
const screens = document.querySelectorAll('.screen');
const welcomeScreen = document.getElementById('welcome-screen');
const instructionsScreen = document.getElementById('instructions-screen');
const learningScreen = document.getElementById('learning-screen');
const gameScreen = document.getElementById('game-screen');
const controls = document.getElementById('controls');

// ===== HELPER FUNCTION to switch screens =====
function showScreen(screenId) {
    screens.forEach(screen => {
        screen.classList.remove('active');
    });
    document.getElementById(screenId).classList.add('active');
}

// ===== GAME LOGIC FUNCTIONS =====

function startGame() {
    playerName = document.getElementById('player-name-input').value;
    playerGrade = document.getElementById('player-grade-select').value;

    if (playerName.trim() === "" || playerGrade === "") {
        alert("Please enter your name and select your grade!");
        return;
    }

    // Personalize welcome message
    document.getElementById('welcome-message').innerText = `Hello, ${playerName}!`;
    showScreen('instructions-screen');
}

function startLearning() {
    // Load learning content based on grade
    const learningContent = content[playerGrade].learning;
    document.getElementById('learning-title').innerText = `Learning for Grade ${playerGrade}`;
    document.getElementById('learning-content').innerHTML = learningContent;
    showScreen('learning-screen');
}

function loadGame() {
    currentLevel = 0;
    score = 0;
    updateScoreboard();
    loadLevel();
    showScreen('game-screen');
    controls.classList.remove('hidden');
}

function loadLevel() {
    const levelData = content[playerGrade].levels;

    if (currentLevel < levelData.length) {
        document.getElementById('question-container').innerText = levelData[currentLevel].question;
        document.getElementById('level-tracker').innerText = `Level: ${currentLevel + 1}`;
        document.getElementById('answer-input').value = "";
        document.getElementById('feedback-text').innerText = "";
        document.getElementById('answer-input').focus();
    } else {
        // Game Over
        document.getElementById('question-container').innerText = "You completed all levels!";
        document.getElementById('feedback-text').innerText = `Great job, ${playerName}! Your final score is ${score}.`;
        document.getElementById('submit-answer-btn').disabled = true;
        document.getElementById('answer-input').disabled = true;
    }
}

function submitAnswer() {
    const userAnswer = document.getElementById('answer-input').value.trim();
    const correctAnswer = content[playerGrade].levels[currentLevel].answer;

    if (userAnswer === correctAnswer) {
        score += 10;
        document.getElementById('feedback-text').innerText = "Correct! +10 points";
        document.getElementById('feedback-text').style.color = 'green';
        currentLevel++;
    } else {
        document.getElementById('feedback-text').innerText = `Not quite. The correct answer was ${correctAnswer}.`;
        document.getElementById('feedback-text').style.color = 'red';
    }
    updateScoreboard();

    // Load next level after a short delay
    setTimeout(loadLevel, 1500);
}

function updateScoreboard() {
    document.getElementById('scoreboard').innerText = `Score: ${score}`;
}

function resetGame() {
    playerName = "";
    playerGrade = "";
    currentLevel = 0;
    score = 0;

    // Reset UI elements
    document.getElementById('player-name-input').value = "";
    document.getElementById('player-grade-select').value = "";
    document.getElementById('submit-answer-btn').disabled = false;
    document.getElementById('answer-input').disabled = false;
    controls.classList.add('hidden');
    
    showScreen('welcome-screen');
}


// ===== EVENT LISTENERS =====
document.getElementById('start-btn').addEventListener('click', startGame);
document.getElementById('learn-btn').addEventListener('click', startLearning);
document.getElementById('skip-learn-btn').addEventListener('click', loadGame);
document.getElementById('start-game-btn').addEventListener('click', loadGame);
document.getElementById('submit-answer-btn').addEventListener('click', submitAnswer);
document.getElementById('reset-btn').addEventListener('click', resetGame);

// Allow pressing Enter to submit answer
document.getElementById('answer-input').addEventListener('keyup', function(event) {
    if (event.key === 'Enter') {
        submitAnswer();
    }
});