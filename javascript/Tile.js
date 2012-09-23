function Tile(colors) {
    this.colors = colors;

    this.sprites = [];
    this.changeColor = function (x, y, color) {
        this.colors[x][y] = color;
        this.sprites = [];
    };
    this.curPaletteIndexes = undefined;
    this.getAllPaletteIndexes = function () {

        if (!this.curPaletteIndexes) {

            var d = [];
            var dEnumerable = JSLINQ(d);

            for (var i = 0; i < this.colors.length; i++) {
                for (var jf = 0; jf < this.colors[i].length; jf++) {
                    var gj = this.colors[i][jf];
                    if (gj == 0) continue;

                    if (!dEnumerable.Any(function (D) {
                        return D == gj;
                    })) {
                        d.push(gj);
                    }
                }
            }


            this.curPaletteIndexes = d;
        }
        return this.curPaletteIndexes;

    };
    this.clearCache = function() {
        this.curPaletteIndexes = undefined;

    };


    this.checkGood = function (canvas, pos, scale, xflip, yflip, palette, layer, animationFrame) {

        if (this.index[0] != 'A') {
            if (this.willAnimate === false) return false;

            if (this.willAnimate != undefined) {
                var an = this.willAnimate;
                var anin = an.AnimationTileIndex;

                if (sonicManager.CACHING) return true;

                var ind = animationFrame;

                var frame = an.Frames[ind];
                if (!frame) frame = an.Frames[0];
                var file = sonicManager.SonicLevel.AnimatedFiles[an.AnimationFile];
                var va = file[frame.StartingTileIndex + (this.index - anin)];
                if (va) {
                    if (canvas.fillStyle != "rbga(255,255,255,255)")
                        canvas.fillStyle = "rbga(255,255,255,255)";
                    va.draw(canvas, pos, scale, xflip, yflip, palette, layer, animationFrame);
                    return true;
                }
                return false;
            }
            for (var i = 0; i < sonicManager.SonicLevel.Animations.length; i++) {
                var an = sonicManager.SonicLevel.Animations[i];
                var anin = an.AnimationTileIndex;
                var num = an.NumberOfTiles;
                if (this.index >= anin && this.index < anin + num) {
                    if (sonicManager.CACHING) return true;
                    this.willAnimate = an;
                    var ind = animationFrame;
                    var frame = an.Frames[ind];
                    if (!frame) frame = an.Frames[0];
                    var file = sonicManager.SonicLevel.AnimatedFiles[an.AnimationFile];
                    var va = file[frame.StartingTileIndex + (this.index - anin)];
                    if (va) {
                        if (canvas.fillStyle != "rbga(255,255,255,255)")
                            canvas.fillStyle = "rbga(255,255,255,255)";
                        va.draw(canvas, pos, scale, xflip, yflip, palette, layer, animationFrame);
                        return true;
                    }

                }
            }
            this.willAnimate = false;
        }
        return false;
    };
    this.drawUI = function (canvas, pos, scale, xflip, yflip, palette) {


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


    };
    this.draw = function (canvas, pos, scale, xflip, yflip, palette, layer, animationFrame) {
        if (this.checkGood(canvas, pos, scale, xflip, yflip, palette, layer, animationFrame)) {
            return;
        }
        //var fd = sonicManager.SpriteCache.tiles[this.index + " " + xflip + " " + yflip + " " + palette + " " + scale.y + " " + scale.x + " " + layer + " " + animationFrame]
        //if (!fd) {

        var cx = this.colors.length * scale.x;
        var cy = this.colors.length * scale.y;
        var j = _H.defaultCanvas(cx, cy);


        if (pos.x < 0 || pos.y < 0) return;
        var oPos = { x: pos.x, y: pos.y };
        oPos = { x: 0, y: 0 };

        if (xflip) {
            oPos.x = -this.colors.length * scale.x;
            j.context.scale(-1, 1);
        }
        if (yflip) {
            oPos.y = -this.colors.length * scale.y;
            j.context.scale(1, -1);
        }

        for (var i = 0; i < this.colors.length; i++) {
            for (var jf = 0; jf < this.colors[i].length; jf++) {
                var gj = this.colors[i][jf];
                if (gj == 0) continue;

                //canvas.drawImage(sonicManager.SonicLevel.Palette[palette][gj], oPos.x + ((i)) * scale.x, oPos.y + (j) * scale.y, scale.x, scale.y);

                var m = sonicManager.SonicLevel.Palette[(palette + sonicManager.indexedPalette) % sonicManager.SonicLevel.Palette.length][gj];
                if (j.context.fillStyle != "#" + m)
                    j.context.fillStyle = "#" + m;
                j.context.fillRect(oPos.x + ((i)) * scale.x, oPos.y + (jf) * scale.y, scale.x, scale.y);


            }
        }
        fd = j.canvas;
        //  sonicManager.SpriteCache.tiles[this.index + " " + xflip + " " + yflip + " " + palette + " " + scale.y + " " + scale.x + " " + layer + " " + animationFrame] = fd;
        //  }
        canvas.drawImage(fd, pos.x, pos.y);

        /*  if (showOutline) {
        canvas.strokeStyle = "#DD0033";
        canvas.lineWidth = 3;
        canvas.strokeRect(pos.x, pos.y, 8 * scale.x, 8 * scale.y);
        }*/


    };

}
