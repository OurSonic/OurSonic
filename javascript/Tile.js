function Tile(colors) {
    this.colors = colors;
    ;
    this.sprites = [];
    Tile.prototype.changeColor = function (x, y, color) {
        this.colors[x][y] = color;
        this.sprites = [];
    };


    Tile.prototype.checkGood = function (canvas, pos, scale, xflip, yflip, palette, layer, animationFrame) {

        if (this.index[0] != 'A') {
            for (var i = 0; i < sonicManager.SonicLevel.Animations.length; i++) {
                var an = sonicManager.SonicLevel.Animations[i];
                var anin = an.AnimationTileIndex;
                var num = an.NumberOfTiles;
                if (this.index >= anin && this.index < anin + num) {
                    if (sonicManager.CACHING) return true;
                    var ind = animationFrame || ((_H.floor(sonicManager.drawTickCount % (an.Frames.length * 10) / 10)));
                    var frame = an.Frames[ind];
                    if (!frame) {
                        frame = an.Frames[0];//fixors
                    }
                    var file = sonicManager.SonicLevel.AnimatedFiles[an.AnimationFile];
                    var va = file[frame.StartingTileIndex + (this.index - anin)];
                    if (va) {
                        if (canvas.fillStyle != "rbga(255,255,255,255)") canvas.fillStyle = "rbga(255,255,255,255)";
                        va.draw(canvas, pos, scale, xflip, yflip, palette, layer, animationFrame);
                        return true;
                    }
                    
                }
            }
        }
        return false;
    };
    Tile.prototype.drawUI = function (canvas, pos, scale, xflip, yflip, palette) {


        for (var i = 0; i < this.colors.length; i++) {
            for (var j = 0; j < this.colors[i].length; j++) {
                var gj = this.colors[i][j];
                if (gj == 0) continue;

                //canvas.drawImage(sonicManager.SonicLevel.Palette[palette][gj], pos.x + ((i)) * scale.x, pos.y + (j) * scale.y, scale.x, scale.y);

                var m = sonicManager.SonicLevel.Palette[palette][gj];
                if (canvas.fillStyle != "#" + m)
                    canvas.fillStyle = "#" + m;  

                if (xflip) {
                    if (yflip) {
                        canvas.fillRect(pos.x + (7 - (i)) * scale.x, pos.y + (7 - j) * scale.y, scale.x, scale.y);
                    } else {
                        canvas.fillRect(pos.x + (7 - (i)) * scale.x, pos.y + (j) * scale.y, scale.x, scale.y);

                    }
                } else {
                    if (yflip) {
                        canvas.fillRect(pos.x + ((i)) * scale.x, pos.y + (7 - j) * scale.y, scale.x, scale.y);
                    } else {
                        canvas.fillRect(pos.x + ((i)) * scale.x, pos.y + (j) * scale.y, scale.x, scale.y);
                    }
                }


            }
        }

        /*  if (showOutline) {
        canvas.strokeStyle = "#DD0033";
        canvas.lineWidth = 3;
        canvas.strokeRect(pos.x, pos.y, 8 * scale.x, 8 * scale.y);
        }*/


    }
    Tile.prototype.draw = function (canvas, pos, scale, xflip, yflip, palette, layer, animationFrame) {
        if (this.checkGood(canvas, pos, scale, xflip, yflip, palette, layer, animationFrame)) {
            return;
        }
        var fd;
        if ((fd = sonicManager.SpriteCache.tiles[this.index + " " + xflip + " " + yflip + " " + palette + " " + scale.y + " " + scale.x])) {
            if (this.index[0] != 'A') {
                canvas.putImageData(fd, pos.x, pos.y);
            } else {
                canvas.drawImage(fd, pos.x, pos.y);
            }
        } else {
            if (pos.x < 0 || pos.y < 0) return;
            _H.save(canvas);
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

            _H.restore(canvas);
            pos.x = oPos.x;
            pos.y = oPos.y;

            var cx = this.colors.length * scale.x;
            var cy = this.colors.length * scale.y;
            if (this.index[0] != 'A') {
                sonicManager.SpriteCache.tiles[this.index + " " + xflip + " " + yflip + " " + palette + " " + scale.y + " " + scale.x] = canvas.getImageData(oPos.x, oPos.y, cx, cy);
            } else {

                /*  var canv = _H.defaultCanvas(8 * scale.x, 8 * scale.y);
                var ctx = canv.context;
                ctx.putImageData(canvas.getImageData(oPos.x, oPos.y, scale.x * 8, scale.y * 8), 0, 0);
                sonicManager.SpriteCache.tiles[this.index + " " + xflip + " " + yflip + " " + palette ] = _H.loadSprite(canv.canvas.toDataURL("image/png"));
                */
            }


        }

        /*  if (showOutline) {
        canvas.strokeStyle = "#DD0033";
        canvas.lineWidth = 3;
        canvas.strokeRect(pos.x, pos.y, 8 * scale.x, 8 * scale.y);
        }*/


    };

}
