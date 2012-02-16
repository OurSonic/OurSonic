function Tile(colors) {
    this.colors = colors;
    ;
    this.sprites = [];
    Tile.prototype.changeColor = function (x, y, color) {
        this.colors[x][y] = color;
        this.sprites = [];
    };



    Tile.prototype.draw = function (canvas, pos, scale, xflip, yflip, palette, layer) {
        if (this.index[0] != 'A') {
            for (var i = 0; i < sonicManager.SonicLevel.Animations.length; i++) {
                var an = sonicManager.SonicLevel.Animations[i];
                var anin = an.AnimationTileIndex;
                var num = an.NumberOfTiles;
                if (this.index >= anin && this.index < anin + num) {
                    if (sonicManager.CACHING) return;
                    var frame = an.Frames[(_H.floor(sonicManager.drawTickCount % (an.Frames.length * 10) / 10))];
                    var file = sonicManager.SonicLevel.AnimatedFiles[an.AnimationFile];
                    var va = file[frame.StartingTileIndex + (this.index - anin)];
                    if (va) {
                        va.draw(canvas, pos, scale, xflip, yflip, palette, layer);
                        return;
                    }
                }
            }
        }

        var fd;
        if ((fd = sonicManager.SpriteCache.tiles[this.index + " " + xflip + " " + yflip + " " + palette])) {
            canvas.putImageData(fd, pos.x, pos.y);

        } else {
            canvas.save();
            if (pos.x < 0 || pos.y < 0) return;
            var oPos = { x: pos.x, y: pos.y };

            if (xflip) {
                pos.x = -pos.x - this.colors.length * scale.x;
                canvas.scale(-1, 1);
            }
            if (yflip) {
                pos.y = -pos.y - this.colors.length * scale.y;
                canvas.scale(1, -1);
            }

            for (var i = 0; i < this.colors.length; i++) {
                for (var j = 0; j < this.colors[i].length; j++) {
                    var gj = this.colors[i][j];
                    if (gj == 0) continue;

                    //canvas.drawImage(sonicManager.SonicLevel.Palette[palette][gj], pos.x + ((i)) * scale.x, pos.y + (j) * scale.y, scale.x, scale.y);


                    var m = sonicManager.SonicLevel.Palette[palette][gj];
                    if (canvas.fillStyle != "#" + m)
                        canvas.fillStyle = "#" + m;
                    canvas.fillRect(pos.x + ((i)) * scale.x, pos.y + (j) * scale.y, scale.x, scale.y);


                }
            }

            canvas.restore();

            var cx = this.colors.length * scale.x;
            var cy = this.colors.length * scale.y;
            if (this.index[0] == 'A') {
                //oPos.x += sonicManager.screenOffset.x;
                //oPos.y += sonicManager.screenOffset.y;
            }
            sonicManager.SpriteCache.tiles[this.index + " " + xflip + " " + yflip + " " + palette] = canvas.getImageData(oPos.x, oPos.y, cx, cy);

        }

        /*  if (showOutline) {
        canvas.strokeStyle = "#DD0033";
        canvas.lineWidth = 3;
        canvas.strokeRect(pos.x, pos.y, 8 * scale.x, 8 * scale.y);
        }*/


    };

}
