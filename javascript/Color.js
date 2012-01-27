function Color(r, g, b) {
    this.r = r;
    this.g = g;
    this.b = b;
    if (r != undefined)
        this._style = "#" + (r.toString(16).length == 1 ? "0" + r.toString(16) : r.toString(16))
            + (g.toString(16).length == 1 ? "0" + g.toString(16) : g.toString(16))
                + (b.toString(16).length == 1 ? "0" + b.toString(16) : b.toString(16));

    Color.prototype.style = function () {
        return this._style;
    };
    Color.prototype.setData = function (data, index) {
        data[index] = this.r;
        data[index + 1] = this.g;
        data[index + 2] = this.b;
        data[index + 3] = 255;
    };
    Color.prototype.equals = function(j) {
        return j.r == this.r && j.g == this.g && j.b == this.b;
    };
}
