class O {
    constructor(){
        this._matrix = [
            [2, 2],
            [2, 2]
        ];
    }

    get matrix() {
        return this._matrix
    }

    set matrix(matrix) {
        this._matrix = matrix;
    }
}

export default O;