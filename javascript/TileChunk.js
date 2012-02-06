function TileChunk(tilesPieces) {
    this.tilesPieces = tilesPieces;
    this.sprites = [];
    TileChunk.prototype.getTilePiece = function (x, y, scale) {
        return sonicManager.SonicLevel.TilePieces[this.tilesPieces[Math.floor((x / scale.x / 16)) + Math.floor((y / scale.y / 16)) * 8]];
    };

    TileChunk.prototype.draw = function (canvas, position, scale) {
        var fd;
        if ((fd = sonicManager.SpriteCache.tileChunks[this.index * 9000 + scale.y * 10 + scale.x]) != null) {
            if (fd.loaded) {
                canvas.drawImage(fd, position.x , position.y);
            }
        } else {
            for (var i = 0; i < this.tilesPieces.length; i++) {
                sonicManager.SonicLevel.TilePieces[this.tilesPieces[i]].draw(canvas, { x: position.x + (i % 8) * 16 * scale.x, y: position.y + Math.floor(i / 8) * 16 * scale.y }, scale);
            }
        }

        return true;
    };

}
