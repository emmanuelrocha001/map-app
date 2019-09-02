// new p5();

class Cell {
    constructor(x, y, size) {
        this._x_position = x;
        this._y_position = y;
        this._size = size;
        this._visited = false;
        this._type = null;
    }

    get get_x_position() {
        return this._x_position;
    }

    get get_y_position() {
        return this._y_position;
    }

    get get_size() {
        return this._size;
    }

    get get_visited() {
        return this._visited;
    }

    set set_visited(visited) {
        this._visited = visited;
    }

    get get_type() {
        return this._type;
    }

    set set_type(type) {
        this._type = type;
    }









}