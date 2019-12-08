class S {
    constructor(){
        this._matrix = [
            [0, 6, 6],
            [6, 6, 0],
            [0, 0, 0]
        ];
    }

    get matrix() {
        return this._matrix
    }

    set matrix(matrix) {
        this._matrix = matrix;
    }
}

export default S;