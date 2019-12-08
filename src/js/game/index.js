import Arena from './Arena.js';
import Game from './Game.js';
import Player from './Player.js';

const canvas = document.getElementById('tetris');
const context = canvas.getContext('2d');

const arena = new Arena();
const player = new Player();
const game = new Game();

document.addEventListener('keydown', event => {
    game.handleKeyboardControl(event.keyCode);
});



