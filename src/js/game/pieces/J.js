class J {
    constructor(){
        this._matrix = [
            [0, 4, 0],
            [0, 4, 0],
            [4, 4, 0]
        ];
    }

    get matrix() {
        return this._matrix;
    }

    set matrix(matrix) {
        this._matrix = matrix;
    }
}

export default J;