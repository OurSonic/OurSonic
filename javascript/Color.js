function Color(r, g, b) {
    this.r = r;
    this.g = g;
    this.b = b;
    this._style = "#" + (r.toString(16).length == 1 ? "0" + r.toString(16) : r.toString(16))
        + (g.toString(16).length == 1 ? "0" + g.toString(16) : g.toString(16))
            + (b.toString(16).length == 1 ? "0" + b.toString(16) : b.toString(16));

    this.style = function () {
        return this._style;
    };
    this.setData = function (data, index) {
        data[index] = this.r;
        data[index + 1] = this.g;
        data[index + 2] = this.b;
        data[index + 3] = 255;
    };
}
