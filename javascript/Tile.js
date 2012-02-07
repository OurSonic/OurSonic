function Tile(colors) {
    this.colors = colors;
    ;
    this.sprites = [];
    Tile.prototype.changeColor = function (x, y, color) {
        this.colors[y * 8 + x] = color;
        this.sprites = [];
    };



    Tile.prototype.draw = function (canvas, pos, scale, state, showOutline,layer) {


        for (var i = 0; i < this.colors.length; i++) {
            var m = sonicManager.SonicLevel.pallet[this.colors[i]];

            if (m == "000000") continue; 
            canvas.fillStyle = "#" + m;
            switch (state) {
                case 0:
                    canvas.fillRect(pos.x + ((i % 8)) * scale.x, pos.y + (Math.floor(i / 8)) * scale.y, scale.x, scale.x);
                    break;
                case 1:
                    canvas.fillRect(pos.x + (7 - (i % 8)) * scale.x, pos.y + (Math.floor(i / 8)) * scale.y, scale.x, scale.x);
                    break;
                case 2:
                    canvas.fillRect(pos.x + ((i % 8)) * scale.x, pos.y + (7 - Math.floor(i / 8)) * scale.y, scale.x, scale.x);
                    break;
                case 3:
                    canvas.fillRect(pos.x + (7 - (i % 8)) * scale.x, pos.y + (7 - Math.floor(i / 8)) * scale.y, scale.x, scale.x);
                    break;
            }
        }

        if (showOutline) {
            canvas.strokeStyle = "#DD0033";
            canvas.lineWidth = 3;
            canvas.strokeRect(pos.x, pos.y, 8 * scale.x, 8 * scale.y);
        }


    };

    Tile.prototype.equals = function (cols) {
        for (var i = 0; i < this.colors.length; i++) {
            var j = cols[i];
            var c = this.colors[i];
            if (j != c)
                return false;
        }
        return true;
    };
}
