function Color(r, g, b) {
    this.r = r;
    this.g = g;
    this.b = b;

    Color.prototype.style = function () {
        if (!this._style) {
            var _r = r.toString(16);
            var _g = g.toString(16);
            var _b = b.toString(16);
            this._style = "#" + (_r.length == 1 ? "0" + _r : _r)
                + (_g.length == 1 ? "0" + _g : _g)
                    + (_b.length == 1 ? "0" + _b : _b);
        }
        
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
