function Editor(size) {
    this.colors = [];
    this.size = size;
    for (var i = 0; i < size.x; i++) {
        this.colors[i] = [];
        for (var j = 0; j < size.y; j++) {
            this.colors[i][j] = Math.floor(Math.random() * 16777215).toString(16); ;
        }
    }
    this.lineWidth = 1;
    this.currentColor = "FFFFFF";
    this.showOutline = true;
    this.draw = function (canvas, pos, scale) {
        canvas.strokeStyle = "#000000";
        canvas.lineWidth = 1;
        for (var x = 0; x < this.size.x; x++) {
            for (var y = 0; y < this.size.y; y++) {

                //  var negative = _H.negateColor(this.colors[x][y]);
                if (canvas.fillStyle != "#" + this.colors[x][y])
                    canvas.fillStyle = "#" + this.colors[x][y];

                //if (canvas.strokeStyle != "#" + negative)
                //    canvas.strokeStyle = "#" + negative;

                canvas.fillRect(pos.x + x * scale.x, pos.y + y * scale.y, scale.x, scale.y);
                if (this.showOutline) canvas.strokeRect(pos.x + x * scale.x, pos.y + y * scale.y, scale.x, scale.y);

            }
        }
    };
    this.drawPixel = function (location, scale) {
        this.colors[_H.floor(location.x / scale.x)][_H.floor(location.y / scale.y)] = this.currentColor;
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
                this.colors[location1.x][location1.y] = this.currentColor;
            } else {
                var k,c;
                for (k = -halfwidth; k < halfwidth; k++) {
                    for (c = -halfwidth; c < halfwidth; c++) {
                        this.colors[Math.min(Math.max(0, location1.x + k), this.size.x)][Math.min(Math.max(0, location1.y+c), this.size.y)] = this.currentColor;

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



        /*for (var x = Math.min(location1.x, location2.x); x < Math.max(location1.x, location2.x); x++) {
        for (var y = Math.min(location1.y, location2.y); y < Math.max(location1.y, location2.y); y++) {
        this.colors[_H.floor(location.x / scale.x)][_H.floor(location.y / scale.y)] = this.currentColor;
        }
        }*/


    };
}