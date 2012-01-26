function Tile(colors) {
    this.colors = colors;

    this.imageData = null;
    this.oldScale = 0;
    this.changeColor = function(x, y, color) {
        this.colors[y * 8 + x] = color;
        this.oldScale = 0;
    };

    this.draw = function (canvas, pos, scale, showOutline) {

        if (scale != this.oldScale) {
            this.oldScale = scale;
            var d = canvas.createImageData(8 * scale.x, 8 * scale.y);
            _H.setDataFromColors(d.data, this.colors, scale);
            this.imageData = d;
        }

        canvas.putImageData(this.imageData, pos.x, pos.y);
        if (showOutline) {
            canvas.strokeStyle = "#DD0033";
            canvas.lineWidth = 3;
            canvas.strokeRect(pos.x, pos.y, 8 * scale.x, 8 * scale.y);
        }
        /*for (var i = 0; i < this.colors.length; i++) {
        canvas.fillStyle = this.colors[i].style();
        canvas.fillRect(pos.x + (i % 8) * pixelWidth, pos.y + Math.floor(i / 8) * pixelWidth, pixelWidth, pixelWidth);
        }*/


        //canvas.fillStyle = "#FFFFFF";
        //canvas.fillText(SonicLevel.Tiles.indexOf(this), pos.x + 4 * scale.x, pos.y + 4 * scale.y);


    };

    this.equals = function (cols) {
        for (var i = 0; i < this.colors.length; i++) {

            if (cols[i]._style != this.colors[i]._style)
                return false;
        }
        return true;
    };
}
