﻿function TileChunk(tilePieces) {
    this.tilePieces = tilePieces;
    this.hLayer = [[]];
    this.sprites = [];
    TileChunk.prototype.getTilePiece = function (x, y, scale) {
        return sonicManager.SonicLevel.Blocks[this.tilePieces[_H.floor((x / scale.x / 16))][_H.floor((y / scale.y / 16))]];
    };
    TileChunk.prototype.onlyBackground = function () {
        for (var i = 0; i < this.tilePieces.length; i++) {
            for (var j = 0; j < this.tilePieces[i].length; j++) {
                var r = this.tilePieces[i][j];
                var pm = sonicManager.SonicLevel.Blocks[r.Block];
                if (pm) {
                    if (!pm.onlyBackground()) {
                        return false;
                    }
                }
            }
        }
        return true;
    };
    TileChunk.prototype.draw = function (canvas, position, scale, layer) {
        var fd;
        if ((fd = sonicManager.SpriteCache.tileChunks[layer + " " + this.index + " " + scale.y + " " + scale.x])) {
            if (fd == 1) return;
            if (fd.loaded) {
                canvas.drawImage(fd, position.x, position.y);


                for (var i = 0; i < this.tilePieces.length; i++) {
                    for (var j = 0; j < this.tilePieces[i].length; j++) {
                        var r = this.tilePieces[i][j];
                        var pm = sonicManager.SonicLevel.Blocks[r.Block];
                        if (pm) {
                            pm.draw(canvas, { x: position.x + i * 16 * scale.x, y: position.y + j * 16 * scale.y }, scale, layer, r.XFlip, r.YFlip,true);
                        }
                    }
                }
            }
        } else {
            for (var i = 0; i < this.tilePieces.length; i++) {
                for (var j = 0; j < this.tilePieces[i].length; j++) {
                    var r = this.tilePieces[i][j];
                    var pm = sonicManager.SonicLevel.Blocks[r.Block];
                    if (pm) {
                        pm.draw(canvas, { x: position.x + i * 16 * scale.x, y: position.y + j * 16 * scale.y }, scale, layer, r.XFlip, r.YFlip);
                    }
                }
            }
        }

        return true;
    };

}
