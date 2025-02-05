
const cells = document.querySelectorAll('[data-cell]');
const board = document.getElementById('gameboard');
const winningMessageText = document.getElementById('winner');
const winningMessage = document.getElementById('winning-message');
const restartButton = document.getElementById('restart-button');
const twoPlayerModeButton = document.getElementById('two-player-mode');
const aiModeButton = document.getElementById('ai-mode');

let isXTurn = true;
let isAgainstAI = false;

const WINNING_COMBINATIONS = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6]
];

twoPlayerModeButton.addEventListener('click', () => startGame(false));
aiModeButton.addEventListener('click', () => startGame(true));

restartButton.addEventListener('click', () => startGame(isAgainstAI));

function startGame(againstAI) {
  isXTurn = true;
  isAgainstAI = againstAI;
  document.getElementById('mode-selection').classList.add('hide');
  board.classList.remove('hide');

  cells.forEach(cell => {
    cell.classList.remove('taken', 'x', 'o');
    cell.textContent = '';
    cell.addEventListener('click', handleClick, { once: true });
  });
  winningMessageText.textContent = "";
  winningMessage.classList.add('hide');
  restartButton.classList.add('hide');
}

function handleClick(e) {
  const cell = e.target;
  const currentClass = isXTurn ? 'x' : 'o';
  placeMark(cell, currentClass);

  if (checkWin(currentClass)) {
    endGame(false);
  } else if (isDraw()) {
    endGame(true);
  } else {
    swapTurns();
    if (isAgainstAI && !isXTurn) {
      setTimeout(aiMove, 500);
    }
  }
}

function aiMove() {
  const availableCells = [...cells].filter(cell => !cell.classList.contains('taken'));
  const randomCell = availableCells[Math.floor(Math.random() * availableCells.length)];
  placeMark(randomCell, 'o');

  if (checkWin('o')) {
    endGame(false);
  } else if (isDraw()) {
    endGame(true);
  } else {
    swapTurns();
  }
}

function placeMark(cell, currentClass) {
  cell.textContent = currentClass.toUpperCase();
  cell.classList.add(currentClass, 'taken');
}

function swapTurns() {
  isXTurn = !isXTurn;
}

function checkWin(currentClass) {
  return WINNING_COMBINATIONS.some(combination => {
    return combination.every(index => {
      return cells[index].classList.contains(currentClass);
    });
  });
}

function isDraw() {
  return [...cells].every(cell => {
    return cell.classList.contains('x') || cell.classList.contains('o');
  });
}

function endGame(draw) {
  if (draw) {
    winningMessageText.textContent = "It's a Draw!";
  } else {
    winningMessageText.textContent = `${isXTurn ? 'X Wins !!' : 'O Wins !!'}`;
  }
  winningMessage.classList.remove('hide');
  restartButton.classList.remove('hide');
}
