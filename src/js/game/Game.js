import I from "./pieces/I";
import J from "./pieces/J";
import L from "./pieces/L";
import O from "./pieces/O";
import S from "./pieces/S";
import T from "./pieces/T";
import Z from "./pieces/Z";
import Arena from './Arena';

class Game {

    constructor(canvas, context, scale, backgroundColor, player, pieceColors, scoreEl, arenaSize){
        this.canvas = canvas;
        this.context = context;
        this.backgroundColor = backgroundColor;
        this.arena = new Arena(this.createMatrix(arenaSize.x, arenaSize.y));
        this.player = player;
        this.pieceColors = pieceColors;
        this.scoreEl = scoreEl;

        this.dropCounter = 0;
        this.dropInterval = 1000;
        this.lastTime = 0;

        this.context.scale(scale.x, scale.y);

        this.pieces = [
            new I(),
            new J(),
            new L(),
            new O(),
            new S(),
            new T(),
            new Z()
        ];

        this.KEY_ARROW_DOWN = 40;
        this.KEY_ARROW_LEFT = 37;
        this.KEY_ARROW_RIGHT = 39;
        this.KEY_Q = 81;
        this.KEY_W = 87;


        this.context.fillRect(0, 0, this.canvas.clientWidth, this.canvas.clientHeight);
    }

    arenaSweep() {
        let rowCount = 1;
    
        outer : for (let y = this.arena.matrix.length - 1; y > 0; --y) {
            for (let x = 0; x < this.arena.matrix[y].length; ++x) {
                if (this.arena.matrix[y][x] === 0) {
                    continue outer;
                }
            }
 
            const row = this.arena.matrix.splice(y, 1)[0].fill(0);
            this.arena.matrix.unshift(row);
    
            ++y;
    
            this.player.score += rowCount * 10;
            rowCount *= 2;
        }
    }

    haveCollided() {
        const [matrix, offset] = [this.player.matrix, this.player.position];
    
        for(let y = 0; y < matrix.length; ++y) {
            for(let x = 0; x < matrix[y].length; ++x) {
                if(
                    matrix[y][x] !== 0 && 
                    (this.arena.matrix[y + offset.y] &&
                    this.arena.matrix[y + offset.y][x + offset.x]) !== 0
                ){
                    return true;
                } 
            }
        }
    
        return false;
    }

    createMatrix(width, height) {
        const matrix = [];
    
        while(height--) {
            matrix.push(new Array(width).fill(0));
        }
    
        return matrix;
    }

    draw() {
        this.context.fillStyle = this.backgroundColor; 
        this.context.fillRect(0, 0, this.canvas.clientWidth, this.canvas.clientHeight);
    
        this.drawMatrix(this.arena.matrix, {x: 0, y: 0}); 
        this.drawMatrix(this.player.matrix, this.player.position);
    }

    drawMatrix(matrix, offset) {
        matrix.forEach((row, y) => {
            row.forEach((value, x) => {
                if (value !== 0) {
                    this.context.fillStyle = this.pieceColors[value];
                    this.context.fillRect(
                        x + offset.x, //move the pice with offset
                        y + offset.y, 
                        1, 1);
                }
            });
        });
    }

    merge() {
        this.player.matrix.forEach((row, y) => {
            row.forEach((value, x) => {
                if (value !== 0) {
                    this.arena.matrix[y + this.player.position.y][x + this.player.position.x] = value;
                }
            });
        });
    }

    playerDrop() {
        this.player.position.y++;
    
        if(this.haveCollided()){
            this.player.position.y--;
            this.merge();
            this.playerReset();
            this.arenaSweep();
            this.updateScore();
        }
    
        this.dropCounter = 0;
    }

    playerMove(dir) {
        this.player.position.x += dir;
    
        if(this.haveCollided()) {
            this.player.position.x -= dir;
        }
    }

    getRandomPiece() {
        return this.pieces[this.pieces.length * Math.random() | 0];
    }

    playerReset() {
        this.player.matrix = this.getRandomPiece().matrix;
        this.player.position.y = 0;  

        this.player.position.x = (this.arena.matrix[0].length / 2 | 0) - 
                       (this.player.matrix[0].length / 2 | 0);
    
        if (this.haveCollided()) {
            this.arena.matrix.forEach(row => row.fill(0));
            this.player.score = 0;
            this.updateScore();
        }
    }

    playerRotate(dir) {
        const pos = this.player.position.x;
        let offset = 1;
    
        this.rotateMatrix(this.player.matrix, dir);  
    
        while (this.haveCollided()) {
            this.player.position.x += offset;
            offset = -(offset + (offset > 0 ? 1 : -1));
    
            if(offset > this.player.matrix[0].length) {
                this.rotateMatrix(this.player.matrix, -dir);
                this.player.position.x = pos;
                return;
            }
        }
    }

    rotateMatrix(matrix, dir) {
        for (let y = 0; y < matrix.length; ++y) {
            for (let x = 0; x < y; ++x) {
                [
                    matrix[x][y],
                    matrix[y][x],
                ] = [
                    matrix[y][x],
                    matrix[x][y]
                ]
            }
        }
    
        if(dir > 0) {
            matrix.forEach(row => row.reverse());
        } else {
            matrix.reverse();
        }
    }

    update(time = 0) {
        const deltaTime = time - this.lastTime;
        this.lastTime = time;
        
        this.dropCounter += deltaTime;
        if(this.dropCounter > this.dropInterval) {
            this.playerDrop(); 
        }
    
        this.draw();
        requestAnimationFrame(this.update.bind(this));
    }

    updateScore() {
        this.scoreEl.innerText = this.player.score;
    }

    handleKeyEvent(keyCode) {
        if (keyCode === this.KEY_ARROW_LEFT) {
            this.playerMove(-1);
        }

        if (keyCode === this.KEY_ARROW_RIGHT) {
            this.playerMove(1);
        }

        if (keyCode === this.KEY_ARROW_DOWN) {
            this.playerDrop();
        }

        if (keyCode === this.KEY_Q) {
            this.playerRotate(-1);
        }

        if (keyCode === this.KEY_W) {
            this.playerRotate(1);
        }
    }
    

    init(){
        this.playerReset();
        this.updateScore();
        this.update();
    }
}

export default Game;