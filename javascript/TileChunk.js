function TileChunk(tilesPieces) {
    this.tilesPieces = tilesPieces;
    TileChunk.prototype.getTilePiece = function (x, y, scale) {
        return SonicLevel.TilePieces[this.tilesPieces[Math.floor((x / scale.x / 16)) + Math.floor((y / scale.y / 16)) * 8]];
    };

    TileChunk.prototype .draw = function (canvas, position, scale, drawLines) {
        for (var i = 0; i < this.tilesPieces.length; i++) {

            SonicLevel.TilePieces[this.tilesPieces[i]].draw(canvas, { x: position.x + (i % 8) * 16 * scale.x, y: position.y + Math.floor(i / 8) * 16 * scale.y }, scale, false);
            if (drawLines) {
                canvas.lineWidth = 1;
                canvas.strokeStyle = "#FFFFFF";
                canvas.strokeRect(position.x + (i % 8) * 16 * scale.x, position.y + Math.floor(i / 8) * 16 * scale.y, 16 * scale.x, 16 * scale.y);
            }
        }
    };

}
