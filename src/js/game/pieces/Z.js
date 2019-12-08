class Z {
    constructor(){
        this._matrix = [
            [7, 7, 0],
            [0, 7, 7],
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

export default Z;