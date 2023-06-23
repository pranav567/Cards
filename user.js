import { cardScore } from "./assets/taash/cards";

export default class User {
  constructor(name = "", coinBalance = 0, playerNumber) {
    this._name = name;
    this._cards = [];
    this._coinBalance = coinBalance;
    this._score = 0;
    this.playerNumber = playerNumber;
  }

  getScore() {
    return this._score;
  }

  checkBestValue(a, b) {
    if (a > 21) {
      if (b > 21) return a > b ? b : a;
      else return b;
    } else {
      if (b <= 21) return a > b ? a : b;
      else return a;
    }
  }

  computeScore() {
    let acePresent = false;
    let aceCount = 0;
    this._cards.forEach((obj) => {
      if (cardScore[obj].length == 2) {
        acePresent = true;
        ++aceCount;
      }
    });
    if (!acePresent) {
      let score = 0;
      this._cards.forEach((obj) => {
        score += cardScore[obj][0];
      });
      this._score = score;
    } else {
      let a = aceCount;
      let b = aceCount - 1 + 11;
      let score = 0;
      this._cards.forEach((obj) => {
        if (cardScore[obj].length == 1) score += cardScore[obj][0];
      });
      this._score = score;
      this._score = this.checkBestValue(this._score + a, this._score + b);
    }
  }

  getCards() {
    return this._cards;
  }

  addCard(card) {
    this._cards.push(card);
  }

  addCoins(amount) {
    this._coinBalance += amount;
  }

  removeCoins(amount) {
    this._coinBalance -= amount;
  }

  getCoinBalance() {
    return this._coinBalance;
  }

  isBalanceAvailable(number) {
    return this._coinBalance >= number;
  }

  getName() {
    return this._name;
  }

  reset() {
    this._cards = [];
    this._score = 0;
  }
}
