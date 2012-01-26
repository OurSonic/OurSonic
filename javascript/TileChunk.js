function TileChunk(tilesPieces) {
    this.tilesPieces = tilesPieces;

    this.draw = function (canvas, position, scale) {
        for (var i = 0; i < this.tilesPieces.length; i++) {

            SonicLevel.TilePieces[this.tilesPieces[i]].draw(canvas, { x: position.x + (i % 8) * 16 * scale.x, y: position.y + Math.floor(i / 8) * 16 * scale.y },scale, false);
            canvas.lineWidth = 1;
            canvas.strokeStyle = "#FFFFFF";
            canvas.strokeRect(position.x + (i % 8) * 16 * scale.x, position.y + Math.floor(i / 8) * 16 * scale.y, 16 * scale.x, 16 * scale.y);

        }
    };

}
