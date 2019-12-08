class L {
    constructor(){
        this._matrix = [
            [0, 3, 0],
            [0, 3, 0],
            [0, 3, 3]
        ];
    }

    get matrix() {
        return this._matrix
    }

    set matrix(matrix) {
        this._matrix = matrix;
    }
}

export default L;