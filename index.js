#!/usr/bin/env node

const readline = require('node:readline');
const { stdin: input, stdout: output } = require('node:process');
const fs = require('fs');
const rl = readline.createInterface({ input, output });
const path = require('path');

class GameHeadsTails {
  constructor(process) {
    this.path = process.argv[2];
    this.directStat = path.parse(__filename).dir;
  }

  init() {
    if (this.path) {
      this.startGame();
    } else {
      console.log('Укажите название файла со статистикой в параметре');
      rl.close();
    }
  }

  startGame() {
    this.makeNumber();
    rl.question('Отгадайте число 1 или 2 \n', (data) => {
      this.iteratingValues(data);
    });
  }

  makeNumber() {
    this.number = Math.round(Math.random() * 1 + 1);
  }

  iteratingValues(data) {
    if (Number(data) === this.number) {
      console.log('Вы выиграли');
      this.logFile('win');
      rl.question('Сыграем еще (да или нет) \n', (data) => {
        this.restartGame(data);
      });
    } else if (Number(data) !== this.number && [1, 2].includes(Number(data))) {
      console.log('Вы проиграли');
      this.logFile('loozes');
      rl.question('Сыграем еще (да или нет) \n', (data) => {
        this.restartGame(data);
      });
    } else {
      console.log('Введите 1 или 2');
      rl.on('line', (input) => {
        this.iteratingValues(input);
      });
    }
  }

  restartGame(data) {
    if (data.toUpperCase() === 'ДА') {
      this.startGame();
    } else if (data.toUpperCase() === 'НЕТ') {
      rl.close();
    } else {
      console.log(' Введите корректное значение (да или нет) \n');
      rl.on('line', (input) => {
        this.restartGame(input);
      });
    }
  }

  logFile(indicator) {
    try {
      if (fs.existsSync(`${this.directStat}//${this.path}.txt`)) {
        fs.readFile(
          `${this.directStat}//${this.path}.txt`,
          'utf8',
          (error, data) => {
            if (error) throw error;
            const stat = JSON.parse(data);
            if (indicator === 'win') {
              stat.win += 1;
            } else {
              stat.loses += 1;
            }
            stat.game += 1;
            fs.writeFile(
              `${this.directStat}//${this.path}.txt`,
              JSON.stringify(stat),
              (error) => {
                if (error) throw error; // если возникла ошибка
              }
            );
          }
        );
      } else {
        const stat = {
          game: 0,
          win: 0,
          loses: 0,
        };
        fs.writeFile(
          `${this.directStat}//${this.path}.txt`,
          JSON.stringify(stat),
          (error) => {
            if (error) throw error; // если возникла ошибка
          }
        );
        this.logFile(indicator);
      }
    } catch (err) {
      console.error(err);
    }
  }
}

const game = new GameHeadsTails(process);
game.init();
