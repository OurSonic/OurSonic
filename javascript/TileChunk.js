function TileChunk(tilesPieces) {
    this.tilesPieces = tilesPieces;
    this.hLayer = [[]];
    this.sprites = [];
    TileChunk.prototype.getTilePiece = function (x, y, scale) {
        return sonicManager.SonicLevel.TilePieces[this.tilesPieces[_H.floor((x / scale.x / 16)) ][_H.floor((y / scale.y / 16)) ]];
    };

    TileChunk.prototype.draw = function (canvas, position, scale, layer) {
        var fd;
        if ((fd = sonicManager.SpriteCache.tileChunks[layer + " " + this.index + " " + scale.y + " " + scale.x])) {
            if (fd.loaded) {
                canvas.drawImage(fd, position.x, position.y);
            }
        } else {
            for (var i = 0; i < this.tilesPieces.length; i++) {
                for (var j = 0; j < this.tilesPieces[i].length; j++) {

                    if (this.hLayer[i][j] == layer) {
                        sonicManager.SonicLevel.TilePieces[this.tilesPieces[i][j]].draw(canvas, { x: position.x + i * 16 * scale.x, y: position.y + j * 16 * scale.y }, scale, layer);
                    }
                }
            }
        }

        return true;
    };

}
