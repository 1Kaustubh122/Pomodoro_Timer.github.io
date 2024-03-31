let timerInterval;
let timeLeft;
let isRunning = false;
let sessions = [];
let completedSessions = 0;

const timerDisplay = document.getElementById('timer');
const startButton = document.getElementById('start');
const pauseButton = document.getElementById('pause');
const resetButton = document.getElementById('reset');
const workDurationInput = document.getElementById('work-duration');
const breakDurationInput = document.getElementById('break-duration');
const completedSessionsDisplay = document.getElementById('completed-sessions');
const sessionList = document.getElementById('session-list');

startButton.addEventListener('click', startTimer);
pauseButton.addEventListener('click', pauseTimer);
resetButton.addEventListener('click', resetTimer);

function startTimer() {
  if (!isRunning) {
    isRunning = true;
    startButton.disabled = true;
    pauseButton.disabled = false;
    resetButton.disabled = false;

    const workDuration = parseInt(workDurationInput.value) * 60;
    const breakDuration = parseInt(breakDurationInput.value) * 60;
    timerInterval = setInterval(() => {
      if (timeLeft > 0) {
        timeLeft--;
        updateTimerDisplay();
        updateProgressBar();
      } else {
        clearInterval(timerInterval);
        if (isRunning) {
          // Track session
          const sessionType = timeLeft === 0 ? 'Work' : 'Break';
          sessions.push({
            type: sessionType,
            duration: sessionType === 'Work' ? workDuration : breakDuration,
            timestamp: new Date().toLocaleString()
          });
          completedSessions++;
          completedSessionsDisplay.textContent = completedSessions;
          saveSessions();
          renderSessionList();

          // Switch to break or work duration
          timeLeft = timeLeft === 0 ? breakDuration : workDuration;
          startTimer();
        }
      }
    }, 1000);

    timeLeft = workDuration;
    updateTimerDisplay();
    updateProgressBar();
  }
}

function pauseTimer() {
  if (isRunning) {
    isRunning = false;
    clearInterval(timerInterval);
    pauseButton.disabled = true;
    startButton.disabled = false;
  }
}

function resetTimer() {
  clearInterval(timerInterval);
  isRunning = false;
  startButton.disabled = false;
  pauseButton.disabled = true;
  resetButton.disabled = true;

  timeLeft = parseInt(workDurationInput.value) * 60;
  updateTimerDisplay();
  updateProgressBar();
}

function updateTimerDisplay() {
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  timerDisplay.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

function updateProgressBar() {
  const progress = (1 - timeLeft / (parseInt(workDurationInput.value) * 60)) * 100;
  document.getElementById('progress-bar-fill').style.width = `${progress}%`;
}

function saveSessions() {
  localStorage.setItem('sessions', JSON.stringify(sessions));
}

function renderSessionList() {
  sessionList.innerHTML = '';
  sessions.forEach(session => {
    const listItem = document.createElement('li');
    listItem.textContent = `${session.type} - ${session.duration / 60} minutes (${session.timestamp})`;
    sessionList.appendChild(listItem);
  });
}

// Load saved sessions on page load
document.addEventListener('DOMContentLoaded', () => {
  const storedSessions = localStorage.getItem('sessions');
  if (storedSessions) {
    sessions = JSON.parse(storedSessions);
    completedSessions = sessions.length;
    completedSessionsDisplay.textContent = completedSessions;
    renderSessionList();
  }
});

