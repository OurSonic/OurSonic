﻿function Tile(colors) {
    this.colors = colors;
    ;
    this.sprites = [];
    Tile.prototype.changeColor = function (x, y, color) {
        this.colors[y * 8 + x] = color;
        this.sprites = [];
    };

    Tile.prototype.cacheImage = function (canvas, scale, completed) {
        if (!this.sprites) this.sprites = [];
        var sps = this.sprites[scale.y * 100 + scale.x];

        if (!sps) {

            var d = canvas.createImageData(8 * scale.x, 8 * scale.y);
            _H.setDataFromColors(d.data, this.colors, scale, 8);
            this.sprites[scale.y * 100 + scale.x] = _H.loadSprite(_H.getBase64Image(d), completed);
        }

    };

    Tile.prototype.draw = function (canvas, pos, scale, showOutline) {
        if (!this.sprites) this.sprites = [];
        var sps = this.sprites[scale.y * 100 + scale.x];
        if (!sps) {
            this.cacheImage(canvas, scale);
            sps = this.sprites[scale.y * 100 + scale.x];
        }
        if (sps.loaded) {
            canvas.drawImage(sps, Math.floor(pos.x), Math.floor(pos.y));
            if (showOutline) {
                canvas.strokeStyle = "#DD0033";
                canvas.lineWidth = 3;
                canvas.strokeRect(pos.x, pos.y, 8 * scale.x, 8 * scale.y);
            }

        } else {
            for (var i = 0; i < this.colors.length; i++) {
                canvas.fillStyle = this.colors[i];
                canvas.fillRect(pos.x + (i % 8) * scale.x, pos.y + Math.floor(i / 8) * scale.y, scale.x, scale.x);
            } if (showOutline) {
                canvas.strokeStyle = "#DD0033";
                canvas.lineWidth = 3;
                canvas.strokeRect(pos.x, pos.y, 8 * scale.x, 8 * scale.y);
            }
            return false;
        } 




        //canvas.fillStyle = "#FFFFFF";
        //canvas.fillText(sonicManager.SonicLevel.Tiles.indexOf(this), pos.x + 4 * scale.x, pos.y + 4 * scale.y);

        return true;
    };

    Tile.prototype.equals = function (cols) {
        for (var i = 0; i < this.colors.length; i++) {
            var j = cols[i];
            var c = this.colors[i];
            if (j!=c)
                return false;
        }
        return true;
    };
}
