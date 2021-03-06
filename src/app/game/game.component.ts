import { identifierModuleUrl } from '@angular/compiler';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.css'],
})
export class GameComponent implements OnInit {
  constructor() {}

  gameBoard = [
    ['X', 'O', 'X'],
    ['O', 'X', 'O'],
    ['X', 'O', 'X'],
  ];

  computer = 'O';
  player = 'X';
  playerTurn = 'X';

  playerGoesFirst = true;
  gameOver = false;
  twoPlayerMode = false;

  displayMessage = '';

  scores = {};

  startGame() {
    this.playerTurn = 'X';
    this.gameOver = false;
    this.displayMessage = 'Enjoy the game!';

    if (!this.twoPlayerMode) {
      if (this.playerGoesFirst) {
        this.computer = 'O';
        this.player = 'X';
      } else {
        this.computer = 'X';
        this.player = 'O';
      }
    }

    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        this.gameBoard[i][j] = '';
        // Goes through the indexs of Game Board to its initial playable state
      }
    }

    // This code sets the scores for the MiniMax Algorithm to ensure the computer plays properly
    if (!this.twoPlayerMode && this.computer === 'X') {
      this.scores = {
        X: 1,
        O: -1,
        Draw: 0,
      };
      this.computerMove();
    } else if (!this.twoPlayerMode && this.computer === 'O') {
      this.scores = {
        O: 1,
        X: -1,
        Draw: 0,
      };
    }
  }

  computerMove() {
    if (this.gameOver) {
      return (this.displayMessage =
        'The game has ended! Please start a New Game');
    }
    // Set the initial value to ensure that any value received will be its next move.
    // For this program we could have as easily chosen -2
    let bestScore = -Infinity;
    let move;

    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        if (this.gameBoard[i][j] === '') {
          this.gameBoard[i][j] = this.computer;
          // With this code we place the computer's 'marker' in the next available spot and run MiniMax to score the move
          // We do this for every spot to determine the best move for the computer

          let score = this.minimax(this.gameBoard, 0, false);
          this.gameBoard[i][j] = '';
          if (score > bestScore) {
            bestScore = score;
            move = { i, j };
          }
        }
      }
    }
    this.gameBoard[move.i][move.j] = this.computer;
    if (this.computer === 'X') {
      this.playerTurn = 'O';
    } else if (this.computer === 'O') {
      this.playerTurn = 'X';
    }

    const result = this.isGameOver();
    if (result === 'Draw') {
      this.gameOver = true;
      this.displayMessage = `The game is a ${result}`;

      return;
    }
    if (result === 'O' || result === 'X') {
      this.gameOver = true;
      this.displayMessage = `${result} has won the game!`;

      return;
    }
  }

  minimax(gameBoard, depth, isMaximizing) {
    let result = this.isGameOver();
    // The first thing we do is check if this will end the game, if it does this is one of its best moves
    // To make this better we could have this return infinity to indicate this will cause the computer to win
    if (result !== null) {
      return this.scores[result];
    }
    if (!isMaximizing) {
      // The next step is for the computer to see what the players next turn could look like based of the computers move
      let bestScore = Infinity;
      for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
          if (gameBoard[i][j] === '') {
            gameBoard[i][j] = this.player;
            let score = this.minimax(gameBoard, depth + 1, true);
            gameBoard[i][j] = '';
            bestScore = Math.min(score, bestScore);
          }
        }
      }
      return bestScore;
    } else {
      // Now we have the computer envision its turn after the players turn and the process repeats
      let bestScore = -Infinity;
      for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
          if (gameBoard[i][j] === '') {
            gameBoard[i][j] = this.computer;
            let score = this.minimax(gameBoard, depth + 1, false);
            gameBoard[i][j] = '';
            bestScore = Math.max(score, bestScore);
          }
        }
      }
      return bestScore;
    }
  }

  nextTurn(event) {
    const idString = event.currentTarget.id;
    const rowId = idString.charAt(3);
    const squareId = idString.charAt(10);

    this.placeMarker(rowId, squareId);
  }

  placeMarker(rowId, squareId) {
    if (this.gameOver) {
      return (this.displayMessage =
        'The game has ended! Please start a New Game');
    }

    if (this.gameBoard[rowId][squareId] !== '') {
      this.displayMessage = 'that spot is taken!';
      return;
    }

    if (this.playerTurn === 'X') {
      this.gameBoard[rowId][squareId] = 'X';
      this.playerTurn = 'O';
    } else {
      this.gameBoard[rowId][squareId] = 'O';
      this.playerTurn = 'X';
    }

    const result = this.isGameOver();
    if (result === 'Draw') {
      this.gameOver = true;
      this.displayMessage = `The game is a ${result}`;

      return;
    }
    if (result === 'O' || result === 'X') {
      this.gameOver = true;
      this.displayMessage = `${result} has won the game!`;

      return;
    }
    if (!this.twoPlayerMode) {
      this.computerMove();
    }
  }

  isWinner(a, b, c) {
    return a === b && b === c && a != '';
  }

  isGameOver() {
    let winner = null;

    for (let i = 0; i < 3; i++) {
      if (
        this.isWinner(
          this.gameBoard[i][0],
          this.gameBoard[i][1],
          this.gameBoard[i][2]
        )
      ) {
        winner = this.gameBoard[i][0];
      }
    }

    for (let i = 0; i < 3; i++) {
      if (
        this.isWinner(
          this.gameBoard[0][i],
          this.gameBoard[1][i],
          this.gameBoard[2][i]
        )
      ) {
        winner = this.gameBoard[0][i];
      }
    }

    //checking for diagnal winner
    if (
      this.isWinner(
        this.gameBoard[0][0],
        this.gameBoard[1][1],
        this.gameBoard[2][2]
      )
    ) {
      winner = this.gameBoard[0][0];
    }
    if (
      this.isWinner(
        this.gameBoard[2][0],
        this.gameBoard[1][1],
        this.gameBoard[0][2]
      )
    ) {
      winner = this.gameBoard[2][0];
    }

    let openSpots = 0;
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        if (this.gameBoard[i][j] === '') {
          openSpots++;
        }
      }
    }

    if (winner === null && openSpots === 0) {
      return 'Draw';
    } else {
      return winner;
    }
  }

  isMarked(i, j) {
    const row = i;
    const square = j;

    if (this.gameOver) {
      return true;
    }

    if (this.gameBoard[row][square] !== '') {
      return true;
    }
    if (
      this.gameBoard[row][square] === 'X' ||
      this.gameBoard[row][square] === 'O'
    ) {
      return false;
    }
  }

  ngOnInit(): void {}
}
