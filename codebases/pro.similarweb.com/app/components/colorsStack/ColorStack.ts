import * as _ from "lodash";
export default class ColorStack {
    private _colors;
    private _available;

    constructor(colors: string[]) {
        this._colors = _.clone(colors);
        this.reset();
    }

    public reset() {
        this._available = _.clone(this._colors);
    }

    public acquire() {
        if (!this._available.length) {
            this.reset();
        }

        return this._available.shift();
    }

    public release(color) {
        this._available.unshift(color);
    }
}
