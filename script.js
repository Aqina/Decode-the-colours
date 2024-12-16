// Existing Variables
const circlesContainer = document.getElementById('circles');
const paletteContainer = document.getElementById('palette');
const submitBtn = document.getElementById('submitBtn');
const feedbackText = document.getElementById('feedbackText');
const movesLeftText = document.getElementById('movesLeft');
const winModal = document.getElementById('winModal');
const tryAgainModal = document.getElementById('tryAgainModal');
const nextLevelBtn = document.getElementById('nextLevelBtn');
const retryBtn = document.getElementById('retryBtn');
const moveOrderContent = document.getElementById('moveOrderContent');
const modalOverlay = document.getElementById('modalOverlay'); // Add overlay reference
const levelTag = document.getElementById('currentLevel'); // Reference to the level tag
// Exit Button 
const exitButton = document.getElementById('exitButton');
const exitModal = document.getElementById('exitModal');
const exitCloseBtn = document.getElementById('exitCloseBtn');
//audio
const correctSound = document.getElementById('correctSound');
const incorrectSound = document.getElementById('incorrectSound');
//game compliation 
const completionModal = document.getElementById('completionModal');
const restartGameBtn = document.getElementById('restartGameBtn');

// Show Exit Modal 
exitButton.addEventListener('click', () => {
  exitModal.classList.add('active'); // Show modal
});

// Close Exit Modal
exitCloseBtn.addEventListener('click', () => {
  exitModal.classList.remove('active'); // Hide modal
});


// Select buttons and modals
const skipModal = document.getElementById('skipModal');
const hintsModal = document.getElementById('hintsModal');
const rulesModal = document.getElementById('rulesModal');

// Buttons to trigger modals
const skipButton = document.getElementById('skipButton');
const hintsButton = document.getElementById('hintsButton');
const rulesButton = document.getElementById('rulesButton');

// Buttons to close modals
const skipCloseBtn = document.getElementById('skipCloseBtn');
const hintsCloseBtn = document.getElementById('hintsCloseBtn');
const rulesCloseBtn = document.getElementById('rulesCloseBtn');

// Function to show modals
function showModal(modal) {
  modal.classList.add('active');
  modalOverlay.classList.add('active');
}

// Function to hide modals
function hideModal(modal) {
  modal.classList.remove('active');
  modalOverlay.classList.remove('active');
}

// Event Listeners for Opening Modals
skipButton.addEventListener('click', () => showModal(skipModal));
hintsButton.addEventListener('click', () => showModal(hintsModal));
rulesButton.addEventListener('click', () => showModal(rulesModal));

// Event Listeners for Closing Modals
skipCloseBtn.addEventListener('click', () => hideModal(skipModal));
hintsCloseBtn.addEventListener('click', () => hideModal(hintsModal));
rulesCloseBtn.addEventListener('click', () => hideModal(rulesModal));

// Close modals by clicking on overlay
modalOverlay.addEventListener('click', () => {
  hideModal(skipModal);
  hideModal(hintsModal);
  hideModal(rulesModal);
});


// Variables
let currentSelection = null;
let attempts = 0;
let maxAttempts = 5;
let currentLevel = 1;

// Level Configuration
const levels = [
  { circles: 2, palette: ['purple', 'orange', 'green'], solution: ['green', 'orange'] },
  { circles: 3, palette: ['purple', 'orange', 'green', 'red', 'blue', 'yellow'], solution: ['red', 'blue', 'green'] },
  { circles: 4, palette: ['purple', 'orange', 'green', 'red', 'blue', 'yellow', 'cyan', 'pink'], solution: ['cyan', 'pink', 'yellow', 'blue'] },
];

// Show Modal and Overlay
function showModal(modal) {
  modal.classList.add('active');
  modalOverlay.classList.add('active');
}

// Hide Modal and Overlay
function hideModal(modal) {
  modal.classList.remove('active');
  modalOverlay.classList.remove('active');
}

// Add Attempts to the Move Order
function addAttempt(attemptNumber, selectedColors, correctColor, correctPosition) {
  const attemptContainer = document.createElement('div');
  attemptContainer.classList.add('move-order-attempt');

  const attemptTitle = document.createElement('h3');
  attemptTitle.textContent = `${attemptNumber}.`;
  attemptContainer.appendChild(attemptTitle);

  const colorRow = document.createElement('div');
  colorRow.classList.add('color-row');
  selectedColors.forEach((color) => {
    const colorCircle = document.createElement('div');
    colorCircle.classList.add('color-circle');
    colorCircle.style.backgroundColor = color;
    colorRow.appendChild(colorCircle);
  });
  attemptContainer.appendChild(colorRow);

  const correctColorText = document.createElement('p');
  correctColorText.textContent = `Correct colour : ${correctColor}`;
  attemptContainer.appendChild(correctColorText);

  const correctPositionText = document.createElement('p');
  correctPositionText.textContent = `Correct colour and position : ${correctPosition}`;
  attemptContainer.appendChild(correctPositionText);

  moveOrderContent.appendChild(attemptContainer);
}

// Function to update the level tag dynamically
function updateLevelTag() {
  levelTag.textContent = `L${currentLevel}`;
}

// Function to generate a random solution from the palette
function randomizeSolution(palette, numberOfCircles) {
  const shuffledPalette = [...palette].sort(() => Math.random() - 0.5); // Shuffle the palette
  return shuffledPalette.slice(0, numberOfCircles); // Take 'numberOfCircles' random colors
}

// Level Setup
function setupLevel(level) {
  const levelConfig = levels[level - 1];
  circlesContainer.innerHTML = '';
  paletteContainer.innerHTML = '';
  feedbackText.textContent = '';
  moveOrderContent.innerHTML = '';
  attempts = 0;
  movesLeftText.textContent = maxAttempts;

  updateLevelTag(); // Update level tag for each new level

  // Always use predefined solutions (no randomization)
  console.log(`Level ${level} Solution: `, levelConfig.solution); // Log solution for testing

  // Generate palette colors
  levelConfig.palette.forEach((color) => {
    const paletteColor = document.createElement('div');
    paletteColor.classList.add('palette-color');
    paletteColor.style.backgroundColor = color;
    paletteColor.addEventListener('click', () => {
      currentSelection = color;
      document.querySelectorAll('.palette-color').forEach((p) => (p.style.border = '2px solid #333'));
      paletteColor.style.border = '4px solid #007bff';
    });
    paletteContainer.appendChild(paletteColor);
  });

  // Create circles
  for (let i = 0; i < levelConfig.circles; i++) {
    const circle = document.createElement('div');
    circle.classList.add('circle');
    circle.addEventListener('click', () => {
      if (currentSelection) {
        circle.style.backgroundColor = currentSelection;
        circle.setAttribute('data-color', currentSelection);
      } else {
        alert('Please select a color first!');
      }
    });
    circlesContainer.appendChild(circle);
  }
}


// Function to play sound
function playSound(audioElement) {
  audioElement.currentTime = 0; // Reset sound to the start
  audioElement.play();
}

// Show Win Modal with Sound
function showWinModal() {
  playSound(correctSound); // Play correct sound
  showModal(winModal);     // Show the win modal
}

// Show Lose Modal with Sound
function showLoseModal() {
  playSound(incorrectSound); // Play incorrect sound
  showModal(tryAgainModal);  // Show the lose modal
}

// Update existing logic to use the new functions
submitBtn.addEventListener('click', () => {
  const selectedColors = Array.from(circlesContainer.children).map((circle) => circle.getAttribute('data-color'));
  if (selectedColors.includes(null) || selectedColors.includes(undefined)) {
    feedbackText.textContent = 'Please fill all circles!';
    feedbackText.style.color = 'red';
    return;
  }

  const levelConfig = levels[currentLevel - 1];
  const solution = levelConfig.solution;
  let correctColorAndPosition = 0;
  let correctColor = 0;

  selectedColors.forEach((color, index) => {
    if (color === solution[index]) {
      correctColorAndPosition++;
    } else if (solution.includes(color)) {
      correctColor++;
    }
  });

  attempts++;
  movesLeftText.textContent = Math.max(maxAttempts - attempts, 0);

  addAttempt(attempts, selectedColors, correctColor, correctColorAndPosition);

  if (correctColorAndPosition === solution.length) {
    setTimeout(() => showWinModal(), 300); // Show win modal with sound
  } else if (attempts >= maxAttempts) {
    setTimeout(() => showLoseModal(), 300); // Show lose modal with sound
  }
});


// Retry Button
retryBtn.addEventListener('click', () => {
  hideModal(tryAgainModal);
  setupLevel(currentLevel);
});

// Replay Button
const replayBtn = document.getElementById('replayBtn');
replayBtn.addEventListener('click', () => {
  hideModal(winModal);
  setupLevel(currentLevel); // Restart the current level
});

// Next Level Button
nextLevelBtn.addEventListener('click', () => {
  hideModal(winModal);
  currentLevel++;
  if (currentLevel > levels.length) {
    showModal(completionModal); // Show the completion modal
  } else {
    setupLevel(currentLevel);
  }
});

// Restart Game Button
restartGameBtn.addEventListener('click', () => {
  hideModal(completionModal);
  currentLevel = 1; // Reset to level 1
  setupLevel(currentLevel); // Restart the game
});

// Skip Button Functionality
skipButton.addEventListener('click', () => {
  currentLevel++;
  if (currentLevel > levels.length) {
    currentLevel = 1; // Reset to level 1 if skipping the last level
  }
  setupLevel(currentLevel); // Load the next level
});


// Overlay Click to Close Modals
modalOverlay.addEventListener('click', () => {
  hideModal(winModal);
  hideModal(tryAgainModal);
});

// Initialize Game
setupLevel(currentLevel);
