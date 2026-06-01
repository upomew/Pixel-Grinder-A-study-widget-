// ==========================================
// 1. DOM ELEMENT SELECTION
// ==========================================
const card = document.getElementById("card");
const actionContainer = document.getElementById("action-container");
const playBtn = document.getElementById("playBtn");
const timerDisplay = document.getElementById("timer");

const streakCountDisplay = document.getElementById("streak-count");
const totalHoursDisplay = document.querySelector(".portal-total");

// ==========================================
// 2. STATE & SAVED COLD STORAGE RETRIEVAL
// ==========================================
let isPaused = true;
let totalSeconds = 0; 
let countdownInterval = null;

function getTodayString() {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

function getYesterdayString() {
    const d = new Date();
    d.setDate(d.getDate() - 1);
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

let currentStreak = parseInt(localStorage.getItem("currentStreak")) || 0;
let lastStudyDate = localStorage.getItem("lastStudyDate") || ""; 
let dailyRecordSeconds = parseInt(localStorage.getItem("dailyRecordSeconds")) || 0;

const todayStr = getTodayString();
const yesterdayStr = getYesterdayString();

// Check if a calendar day was missed entirely
if (lastStudyDate !== "" && lastStudyDate !== todayStr && lastStudyDate !== yesterdayStr) {
    currentStreak = 0;
    dailyRecordSeconds = 0;
    localStorage.setItem("currentStreak", "0");
    localStorage.setItem("dailyRecordSeconds", "0");
} else if (lastStudyDate !== todayStr) {
    dailyRecordSeconds = 0;
    localStorage.setItem("dailyRecordSeconds", "0");
}

// ==========================================
// 3. CORE PROCESSING ENGINE FUNCTIONS
// ==========================================
function updateTimerDisplay() {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    
    const displayMin = minutes < 10 ? "0" + minutes : minutes;
    const displaySec = seconds < 10 ? "0" + seconds : seconds;
    
    timerDisplay.textContent = `${displayMin}:${displaySec}`;
}

function formatLongestTimeDisplay(secondsIn) {
    const hours = Math.floor(secondsIn / 3600);
    const minutes = Math.floor((secondsIn % 3600) / 60);
    const remainingSeconds = secondsIn % 60;
    
    const displayMins = minutes < 10 ? "0" + minutes : minutes;
    const displaySecs = remainingSeconds < 10 ? "0" + remainingSeconds : remainingSeconds;
    
    return `TOTAL: ${hours}h ${displayMins}m ${displaySecs}s`;
}

function startTimer() {
    countdownInterval = setInterval(() => {
        totalSeconds++;
        updateTimerDisplay();
    }, 1000);
}

function pauseTimer() {
    clearInterval(countdownInterval);
    countdownInterval = null;
}

// ==========================================
// 4. UNIFIED ROBUST CLICK INTERACTION LAYER
// ==========================================
actionContainer.addEventListener("click", (event) => {
    event.preventDefault();
    event.stopPropagation(); 

    if (isPaused) {
        // --- TRANSITION TO ACTIVE STUDY FOCUS STATE ---
        isPaused = false;
        
        playBtn.style.display = "none";
        timerDisplay.style.display = "block";
        
        card.style.backgroundImage = "url('./assets/studying.png')";
        
        startTimer();
    } else {
        // --- TRANSITION TO IDLE BREAK STATE ---
        isPaused = true;
        
        playBtn.style.display = "block";
        timerDisplay.style.display = "none";
        
        card.style.backgroundImage = "url('./assets/done.png')";
        
        pauseTimer();
        
        if (totalSeconds > 0) {
            const currentTodayStr = getTodayString();
            
            if (lastStudyDate !== currentTodayStr) {
                currentStreak++;
                lastStudyDate = currentTodayStr;
                
                localStorage.setItem("currentStreak", currentStreak.toString());
                localStorage.setItem("lastStudyDate", currentTodayStr);
                
                streakCountDisplay.textContent = currentStreak;
            }
            
            if (totalSeconds > dailyRecordSeconds) {
                dailyRecordSeconds = totalSeconds;
                localStorage.setItem("dailyRecordSeconds", dailyRecordSeconds.toString());
                
                totalHoursDisplay.textContent = formatLongestTimeDisplay(dailyRecordSeconds);
            }
        }
        
        totalSeconds = 0;
        updateTimerDisplay();
    }
});

// ==========================================
// 5. APPLICATION LAUNCH RUNTIME INITIALIZATION
// ==========================================
isPaused = true;
playBtn.style.display = "block";
timerDisplay.style.display = "none";
updateTimerDisplay();

streakCountDisplay.textContent = currentStreak;
totalHoursDisplay.textContent = formatLongestTimeDisplay(dailyRecordSeconds);