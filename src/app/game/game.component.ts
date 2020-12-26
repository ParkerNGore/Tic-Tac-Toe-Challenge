import { identifierModuleUrl } from '@angular/compiler';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.css'],
})
export class GameComponent implements OnInit {
  gameBoard = [
    ['X', 'O', 'X'],
    ['O', 'X', 'O'],
    ['X', 'O', 'X'],
  ];

  playerOne = 'X';
  playerTwo = 'O';

  isComputer = true;
  computer = this.playerOne;
  player = this.playerTwo;

  gameOver = false;

  twoPlayerMode = false;

  playerTurn = 'X';

  startGame() {
    this.playerTurn = 'X';
    this.gameOver = false;

    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        this.gameBoard[i][j] = '';
      }
    }

    if (this.isComputer && this.computer === 'X') {
      this.scores = {
        X: 1,
        O: -1,
        Draw: 0,
      };
      this.computerMove();
    } else if (this.isComputer && this.computer === 'O') {
      return alert('Computer is O');
    } else {
    }
  }

  computerMove() {
    if (this.gameOver) {
      return alert('The game has ended! Please start a New Game');
    }
    let bestScore = -Infinity;
    let move;

    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        if (this.gameBoard[i][j] === '') {
          this.gameBoard[i][j] = this.computer;

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
    if (result) {
      this.gameOver = true;
      alert(result);
      return;
    }
  }

  scores = {
    X: 1,
    O: -1,
    Draw: 0,
  };

  minimax(gameBoard, depth, isMaximizing) {
    let result = this.isGameOver();
    if (result !== null) {
      return this.scores[result];
    }
    if (isMaximizing) {
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
    } else {
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
      return alert('The game has ended! Please start a New Game');
    }

    if (this.gameBoard[rowId][squareId] !== '') {
      alert('that spot is taken!');
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
    if (result) {
      this.gameOver = true;
      alert(result);
      return;
    }
    if (!this.twoPlayerMode) {
      this.computerMove();
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

  constructor() {}

  ngOnInit(): void {}
}
