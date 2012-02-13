function Tile(colors) {
    this.colors = colors;
    ;
    this.sprites = [];
    Tile.prototype.changeColor = function (x, y, color) {
        this.colors[x][y] = color;
        this.sprites = [];
    };



    Tile.prototype.draw = function (canvas, pos, scale, state, showOutline,layer) {


        for (var i = 0; i < this.colors.length; i++) {
            for (var j = 0; j < this.colors[i].length; j++) {
            var m = sonicManager.SonicLevel.palletIndexes[this.colors[i][j]];

            if (m == "000000") continue; 
            canvas.fillStyle = "#" + m;
            switch (state) {
                case 0:
                    canvas.fillRect(pos.x + ((i)) * scale.x, pos.y + (j) * scale.y, scale.x, scale.x);
                    break;
                case 1:
                    canvas.fillRect(pos.x + (7 - (i)) * scale.x, pos.y + (j) * scale.y, scale.x, scale.x);
                    break;
                case 2:
                    canvas.fillRect(pos.x + ((i)) * scale.x, pos.y + (7 - j) * scale.y, scale.x, scale.x);
                    break;
                case 3:
                    canvas.fillRect(pos.x + (7 - (i )) * scale.x, pos.y + (7 - j) * scale.y, scale.x, scale.x);
                    break;
            }
        }
    }


        if (showOutline) {
            canvas.strokeStyle = "#DD0033";
            canvas.lineWidth = 3;
            canvas.strokeRect(pos.x, pos.y, 8 * scale.x, 8 * scale.y);
        }


    };
     
}
