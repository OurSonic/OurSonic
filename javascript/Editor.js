function Editor(assetFrame) {
    this.assetFrame = assetFrame;

    this.lineWidth = 1;
    this.currentColor = "FFFFFF";
    this.showOutline = true;
    this.draw = function (canvas, pos, scale) {
        this.assetFrame.drawUI(canvas, pos, scale, this.showOutline);
    };
    this.drawPixel = function (location, scale) {
        this.assetFrame.colorMap[_H.floor(location.x / scale.x)][_H.floor(location.y / scale.y)] = this.currentColor;
    };
    this.drawLine = function (location1, location2, scale) {

        var halfwidth = _H.floor(this.lineWidth / 2);
        location1.x = _H.floor(location1.x / scale.x);
        location2.x = _H.floor(location2.x / scale.x);
        location1.y = _H.floor(location1.y / scale.y);
        location2.y = _H.floor(location2.y / scale.y);

        var dx = Math.abs((location2.x) - (location1.x));
        var dy = Math.abs((location2.y) - (location1.y));
        var sx = 1, sy = 1, e2;
        var error = dx - dy;
        if (location1.x > location2.x)
            sx = -1;
        if (location1.y > location2.y)
            sy = -1;
        while (true) { 
            if (this.lineWidth == 1) {
                this.assetFrame.colorMap[location1.x][location1.y] = this.currentColor;
            } else {
                var k, c;
                for (k = -halfwidth; k < halfwidth; k++) {
                    for (c = -halfwidth; c < halfwidth; c++) {
                        this.assetFrame.colorMap[Math.min(Math.max(0, location1.x + k), this.assetFrame.width)][Math.min(Math.max(0, location1.y + c), this.assetFrame.height)] = this.currentColor;
                    }
                } 
            }
            if (location1.x == location2.x && location1.y == location2.y)
                break;
            e2 = error * 2;
            if (e2 > -dy) {
                error -= dy;
                location1.x += sx;
            }
            if (e2 < dx) {
                error += dx;
                location1.y += sy;
            }
        }
    };
}