import { easy, medium, hard } from "./questions.js";

let isQuizStarted = false;
let difficultyMode = "easy";
let score = 0;

const easyBtn = document.querySelector(".easy");
const mediumBtn = document.querySelector(".medium");
const hardBtn = document.querySelector(".hard");
const preRequisites = document.querySelector(".pre-requisites");
const startBtn = document.querySelector(".start-quiz button");
const difficultySection = document.querySelector(".difficulty-level");
const startSection = document.querySelector(".start-quiz");

//--------------difficulty level style handling------------------------

function resetDifficultyButtonStyles() {
    document.querySelectorAll(".difficulty-level button").forEach((btn) => {
        btn.style.background = "darkcyan";
        btn.style.color = "#fff";
    });
}


function difficultyBtnClickStyle(btn) {
    btn.style.backgroundColor = "#1d2026";
    btn.style.color = "#fff";
}


easyBtn.addEventListener("click", () => {
    difficultyMode = "easy";
    resetDifficultyButtonStyles();
    difficultyBtnClickStyle(easyBtn);
});

mediumBtn.addEventListener("click", () => {
    difficultyMode = "medium";
    resetDifficultyButtonStyles();
    difficultyBtnClickStyle(mediumBtn);
});

hardBtn.addEventListener("click", () => {
    difficultyMode = "hard";
    resetDifficultyButtonStyles();
    difficultyBtnClickStyle(hardBtn);
});

// Start Quiz logic

startBtn.addEventListener("click", () => {
    isQuizStarted = true;
    score = 0;

    difficultySection.style.display = "none";
    startSection.style.display = "none";

    let questions = [];
    if (difficultyMode === "easy") questions = easy;
    if (difficultyMode === "medium") questions = medium;
    if (difficultyMode === "hard") questions = hard;

    questions.sort(()=>Math.random()-0.5)

    renderQuestion(questions, 0);
});

// Render Question logic

function renderQuestion(questions, index) {
    const btnText = index === questions.length - 1 ? "Submit" : "Next";

    if (index >= questions.length) {
        preRequisites.innerHTML = `
            <div class="quiz-result">
                <h2>Quiz Completed!</h2>
                <p>Your Score: ${score} / ${questions.length}</p>
                <button id="restart-quiz">Restart Quiz</button>
            </div>
        `;
        document.querySelector("#restart-quiz").addEventListener("click", restartQuiz);
        return;
    }

    let timeLeft = 15;

    preRequisites.innerHTML = `
        <div id="quiz">
            <div class="timer-container" style="display:flex;align-items:center;justify-content:center;margin-bottom:10px;position:relative;">
                <svg class="progress-ring" width="80" height="80">
                    <circle class="progress-ring__circle" stroke="#3B82F6" stroke-width="6" fill="transparent" r="34" cx="40" cy="40"/>
                </svg>
                <span id="time-text" style="position:absolute;font-size:18px;font-weight:bold;">${timeLeft}</span>
            </div>
            <h3>${index + 1}. ${questions[index].question}</h3>
            <div class="options">
                ${questions[index].options.map((opt, i) => `
                    <div>
                        <input type="radio" name="answer" value="${opt}" id="opt${i}">
                        <label for="opt${i}" class="opt">${opt}</label>
                    </div>
                `).join("")}
            </div>
            <button id="next-btn" disabled>${btnText}</button>
        </div>
    `;

    const nextBtn = document.getElementById("next-btn");
    const correctAnswer = questions[index].answer;

    // Timer Circle and timeover handling
     
    const circle = document.querySelector('.progress-ring__circle');
    const timeText = document.getElementById('time-text');
    const radius = circle.r.baseVal.value;
    const circumference = 2 * Math.PI * radius;

    circle.style.strokeDasharray = circumference;
    circle.style.strokeDashoffset = 0;

    function setProgress(percent) {
        const offset = circumference - (percent / 100) * circumference;
        circle.style.strokeDashoffset = offset;
    }
    setProgress(100);

    const timerId = setInterval(() => {
        timeLeft--;
        timeText.textContent = timeLeft;
        setProgress((timeLeft / 15) * 100);

        if (timeLeft <= 0) {
            clearInterval(timerId);
            handleTimeout(correctAnswer);
            nextBtn.disabled = false;
        }
    }, 1000);

    // User selection handling

    document.querySelectorAll('input[name="answer"]').forEach(input => {
        input.addEventListener('change', (e) => {
            clearInterval(timerId);
            nextBtn.disabled = false;
            handleAnswer(e.target.value, correctAnswer);
        });
    });

    
    nextBtn.addEventListener("click", () => {
        renderQuestion(questions, index + 1)
    });

    if(nextBtn.disabled===true){
    nextBtn.style.background="lightgray"
    nextBtn.style.color="#333"
}
   

}

// answer handling logic



function handleAnswer(selectedValue, correctAnswer) {
    const labels = document.querySelectorAll('.opt');

    let nextBtn=document.getElementById("next-btn");

    nextBtn.style.background= "#3882F6";
    nextBtn.style.color="#fff"

    labels.forEach(label => {
        if (label.textContent === correctAnswer) {
            label.style.backgroundColor = "green";
            label.style.color = "#fff";
        }
        if (selectedValue && label.textContent === selectedValue && selectedValue !== correctAnswer) {
            label.style.backgroundColor = "lightpink";
            label.style.color = "#333";
        }
    });

    if (selectedValue === correctAnswer) {
        score++;
    }
 

    // Disable further changes
    document.querySelectorAll('input[name="answer"]').forEach(input => input.disabled = true);
}

// timeover handling

function handleTimeout(correctAnswer) {
    const labels = document.querySelectorAll('.opt');
    labels.forEach(label => {
        if (label.textContent === correctAnswer) {
            label.style.backgroundColor = "green";
            label.style.color = "#fff";
        }
        else{
            label.style.backgroundColor="lightpink";
            label.style.color="#333";
        }
        setTimeout(()=>{document.getElementById("next-btn").click()},500)
    });

    // Disable further changes
    document.querySelectorAll('input[name="answer"]').forEach(input => input.disabled = true);
}

// Restart Quiz logic

function restartQuiz() {
    isQuizStarted = false;
    score = 0;
    location.reload();
}
