class T {
    constructor(){
        this._matrix = [
            [0, 0, 0],
            [1, 1, 1],
            [0, 1, 0]
        ];
    }

    get matrix() {
        return this._matrix
    }

    set matrix(matrix) {
        this._matrix = matrix;
    }
}

export default T;