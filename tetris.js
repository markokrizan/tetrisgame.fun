const canvas = document.getElementById('tetris');
const context = canvas.getContext('2d');

context.scale(20, 20);

function arenaSweep() {
    let rowCount = 1;

    outer : for (let y = arena.length - 1; y > 0; --y) {
        for (let x = 0; x < arena[y].length; ++x) {
            //if 0s in row = not fully populated
            if (arena[y][x] === 0) {
                continue outer;
            }
        }

        //take that row, fill with 0s and put on top
        const row = arena.splice(y, 1)[0].fill(0);
        arena.unshift(row);

        ++y;

        player.score += rowCount * 10;
        rowCount *= 2;
    }
}

context.fillRect(0, 0, canvas.clientWidth, canvas.clientHeight);

//Pieces are represented with a matrix

//T shape
const matrix = [
    [0, 0, 0],
    [1, 1, 1],
    [0, 1, 0]
];

//check for collision with arena
function collide(arena, player) {
    //take player matrix and offset
    const [m, o] = [player.matrix, player.pos];

    //handle colisions
    for(let y = 0; y < m.length; ++y) {
        for(let x = 0; x < m[y].length; ++x) {
            if(
                m[y][x] !== 0 && 
                (arena[y + o.y] &&
                arena[y + o.y][x + o.x]) !== 0
            ){
                return true;
            } 
        }
    }

    return false;
}

//create any matrix of w and h
function createMatrix(w, h) {
    const matrix = [];

    while(h--) {
        matrix.push(new Array(w).fill(0)); //for every point of height make a with array of lenght w and fill with 0
    }

    return matrix;
}

function createPiece(type) {
    if (type === "T") {
        return [
            [0, 0, 0],
            [1, 1, 1],
            [0, 1, 0]
        ];
    }

    if (type === "O") {
        return [
            [2, 2],
            [2, 2]
        ];
    }

    if (type === "L") {
        return [
            [0, 3, 0],
            [0, 3, 0],
            [0, 3, 3]
        ];
    }

    if (type === "J") {
        return [
            [0, 4, 0],
            [0, 4, 0],
            [4, 4, 0]
        ];
    }

    if (type === "I") {
        return [
            [0, 5, 0, 0],
            [0, 5, 0, 0],
            [0, 5, 0, 0],
            [0, 5, 0, 0]
        ];
    }

    if (type === "S") {
        return [
            [0, 6, 6],
            [6, 6, 0],
            [0, 0, 0]
        ];
    }

    if (type === "Z") {
        return [
            [7, 7, 0],
            [0, 7, 7],
            [0, 0, 0]
        ];
    }
}

//redraw
function draw() {
    context.fillStyle = '#000'; 
    context.fillRect(0, 0, canvas.clientWidth, canvas.clientHeight); //clear

    drawMatrix(arena, {x: 0, y: 0}); 
    drawMatrix(player.matrix, player.pos); //redraw
}

//draw the matrix
function drawMatrix(matrix, offset) {
    matrix.forEach((row, y) => {
        row.forEach((value, x) => {
            if (value !== 0) {
                context.fillStyle = colors[value];
                context.fillRect(
                    x + offset.x, //move the pice with offset
                    y + offset.y, 
                    1, 1);
            }
        });
    });
} 

//merge arena matrix with current player piece matrix
function merge(arena, player) {
    player.matrix.forEach((row, y) => {
        row.forEach((value, x) => {
            if (value !== 0) {
                arena[y + player.pos.y][x + player.pos.x] = value;
            }
        });
    });
}

function playerDrop() {
    player.pos.y++;

    //if coliding if arena back up
    if(collide(arena, player)){
        player.pos.y--;
        merge(arena, player); //merge piece with arena and save it within the arena matrix
        playerReset();
        arenaSweep();
        updateScore();
    }

    dropCounter = 0; //delay drop for one seccond so both dont happen
}

function playerMove(dir) {
    player.pos.x += dir;

    //go reverse way if colision with arena
    if( collide(arena, player)) {
        player.pos.x -= dir;
    }
}

function playerReset() {
    const pieces = 'ILJOTSZ';
    player.matrix = createPiece(pieces[pieces.length * Math.random() | 0]);
    player.pos.y = 0;
    player.pos.x = (arena[0].length / 2 | 0) - 
                   (player.matrix[0].length / 2 | 0);

    //if there is an immediate colision - game is over
    if (collide(arena, player)) {
        //fill entire arena matrix with 0s 
        arena.forEach(row => row.fill(0));
        //reset score
        player.score = 0;
        updateScore();
    }
}

//concrete player piece rotate function
function playerRotate(dir) {
    const pos = player.pos.x;
    let offset = 1;

    rotate(player.matrix, dir);  

    //fix rotation within wall
    while (collide(arena, player)) {
        player.pos.x += offset;
        offset = -(offset + (offset > 0 ? 1 : -1));

        if(offset > player.matrix[0].length) {
            rotate(player.matrix, -dir);
            player.pos.x = pos;
            return;
        }
    }
}


//generic matrix rotation function
function rotate(matrix, dir) {
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

let dropCounter = 0; 
let dropInterval = 1000; //in what ms is the piece redrawn one step down

//last time the board was in a certain state?
let lastTime = 0;

//anytime a value changes redraw
function update(time = 0) {
    const deltaTime = time - lastTime; //time difference ?
    lastTime = time;
    
    //drop the piece one step down every seccond
    dropCounter += deltaTime;
    if(dropCounter > dropInterval) {
        playerDrop(); 
    }

    draw();
    requestAnimationFrame(update);
}

function updateScore() {
    document.getElementById('score').innerText = player.score;
}

//alter the colors and make a real map with piece
const colors = [
    null,
    'red',
    'blue',
    'violet',
    'green',
    'purple',
    'orange',
    'pink'
];

const arena = createMatrix(12, 20);
console.log(arena);
console.table(arena);

//player object with the current position and the current piece matrix
const player = {
    pos: {x: 0, y: 0},
    matrix: null,
    score: 0
} 

document.addEventListener('keydown', event => {
    //left
    if (event.keyCode === 37) {
        playerMove(-1);
    }

    //right
    if (event.keyCode === 39) {
        playerMove(1);
    }

    //down
    if (event.keyCode === 40) {
        playerDrop();
    }

    //q - rotate left
    if (event.keyCode === 81) {
        playerRotate(-1);
    }

    //w - rotate right
    if (event.keyCode === 87) {
        playerRotate(1);
    }

});

playerReset();
updateScore();

//init the game with the first rerender  
update();