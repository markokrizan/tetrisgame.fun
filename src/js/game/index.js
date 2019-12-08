import Game from './Game.js';
import Player from './Player.js';

const canvas = document.getElementById('tetris');
const context = canvas.getContext('2d');
const scoreEl = document.getElementById('score');

const scale = {
    x: 20,
    y: 20
}

const arenaSize = {
    x: 12,
    y: 20
}

const pieceColors = [
    null,
    'red',
    'blue',
    'violet',
    'green',
    'purple',
    'orange',
    'pink'
];

const backgroundColor = '#000'; 

const player = new Player();
const game = new Game(
    canvas, 
    context, 
    scale, 
    backgroundColor,
    player, 
    pieceColors, 
    scoreEl,
    arenaSize
);

document.addEventListener('keydown', event => {
    game.handleKeyEvent(event.keyCode);
});

game.init();



