function TileChunk(tilePieces) {
    this.tilePieces = tilePieces;
    this.hLayer = [[]];
    this.sprites = [];
    TileChunk.prototype.getTilePiece = function (x, y, scale) {
        return sonicManager.SonicLevel.TilePieces[this.tilePieces[_H.floor((x / scale.x / 16)) ][_H.floor((y / scale.y / 16)) ]];
    };

    TileChunk.prototype.draw = function (canvas, position, scale, layer) {
        var fd;
        if (layer == 1) return;
        if ((fd = sonicManager.SpriteCache.tileChunks[layer + " " + this.index + " " + scale.y + " " + scale.x])) {
            if (fd.loaded) {
                canvas.drawImage(fd, position.x, position.y);
            }
        } else {
            for (var i = 0; i < this.tilePieces.length; i++) {
                for (var j = 0; j < this.tilePieces[i].length; j++) {
                    var r = this.tilePieces[i][j];
                    if (true || this.hLayer[i][j] == layer) {
                        sonicManager.SonicLevel.TilePieces[r.Block].draw(canvas, { x: position.x + i * 16 * scale.x, y: position.y + j * 16 * scale.y }, scale, layer, r.XFlip, r.YFlip);
                    }
                }
            }
        }

        return true;
    };

}
