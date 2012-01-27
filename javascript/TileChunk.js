function TileChunk(tilesPieces) {
    this.tilesPieces = tilesPieces;
    this.sprites = [];
    TileChunk.prototype.getTilePiece = function (x, y, scale) {
        return SonicLevel.TilePieces[this.tilesPieces[Math.floor((x / scale.x / 16)) + Math.floor((y / scale.y / 16)) * 8]];
    };

    TileChunk.prototype.draw = function (canvas, position, scale, drawLines) {


        if (!this.sprites)
            this.sprites = [];
        if (!this.sprites[scale.y * 100 + scale.x]) {
            var cg = document.createElement("canvas");
            cg.width = 128 * scale.x;
            cg.height = 128 * scale.y;
            var cv = cg.getContext('2d');
            for (var i = 0; i < this.tilesPieces.length; i++) {

                if (!SonicLevel.TilePieces[this.tilesPieces[i]].draw(cv, { x: (i % 8) * 16 * scale.x, y: Math.floor(i / 8) * 16 * scale.y }, scale, false))
                    return false;
                if (drawLines) {
                    cv.lineWidth = 1;
                    cv.strokeStyle = "#FFFFFF";
                    cv.strokeRect((i % 8) * 16 * scale.x, Math.floor(i / 8) * 16 * scale.y, 16 * scale.x, 16 * scale.y);
                }
            }
                var sprite1;
                this.sprites[scale.y * 100 + scale.x] = sprite1 = new Image();
                sprite1.onload = function () {
                    sprite1.loaded = true;

                };
                sprite1.src = cg.toDataURL("image/png");

        }

        if (this.sprites[scale.y * 100 + scale.x].loaded) {
            canvas.drawImage(this.sprites[scale.y * 100 + scale.x], position.x, position.y);
        };
        return true;
    };

}
