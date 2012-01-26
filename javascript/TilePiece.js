function TilePiece(heightMask, tiles) {
    this.heightMask = heightMask;
    this.tiles = tiles;

    this.draw = function (canvas, position, scale, showHeightMask) {

        for (var i = 0; i < this.tiles.length; i++) {
            SonicLevel.Tiles[this.tiles[i]].draw(canvas, { x: position.x + (i % 2) * 8 * scale.x, y: position.y + Math.floor(i / 2) * 8 * scale.y },scale);
        }

        canvas.fillStyle = "#FFFFFF";
        canvas.fillText(SonicLevel.TilePieces.indexOf(this), position.x + 8 * scale.x, position.y + 8 * scale.y);

        if (showHeightMask)
            this.heightMask.draw(canvas, position, scale);
    };
    this.equals = function (tp) {
        for (var i = 0; i < this.tiles.length; i++) {

            if (tp[i] != this.tiles[i])
                return false;
        }
        return true;
    };

}
