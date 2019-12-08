class Player {

    constructor(){
        this._position = {x: 0, y: 0},
        this._matrix =  null,
        this._score = 0
    }

    get matrix() {
        return this._matrix;
    }

    set matrix(matrix) {
        this._matrix = matrix;
    }

    get score() {
        return this._score;
    }

    set score(score) {
        this._score = score;
    }

    get position() {
        return this._position;
    }

    set position(position) {
        this._position = position;
    }
}

export default Player;