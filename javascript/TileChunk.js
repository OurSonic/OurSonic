function TileChunk(tilesPieces) {
    this.tilesPieces = tilesPieces;
    this.sprites = [];
    TileChunk.prototype.getTilePiece = function (x, y, scale) {
        return sonicManager.SonicLevel.TilePieces[this.tilesPieces[Math.floor((x / scale.x / 16)) + Math.floor((y / scale.y / 16)) * 8]];
    };

    TileChunk.prototype.cacheImage = function (canvas, scale, state,completed) {


        if (!this.sprites)
            this.sprites = [];
        var i;

        var mx = state * 200 + scale.y * 50 + scale.x;
        if (!this.sprites[mx]) {
            var cg = document.createElement("canvas");
            cg.width = 128 * scale.x;
            cg.height = 128 * scale.y;
            var cv = cg.getContext('2d');
            for (i = 0; i < this.tilesPieces.length; i++) {

                if (!sonicManager.SonicLevel.TilePieces[this.tilesPieces[i]].draw(cv, { x: (i % 8) * 16 * scale.x, y: Math.floor(i / 8) * 16 * scale.y }, scale, state == 2 ? 4 : 3,null,false))
                    return false;
                if (state == 1) {
                    cv.lineWidth = 1;
                    cv.strokeStyle = "#FFFFFF";
                    cv.strokeRect((i % 8) * 16 * scale.x, Math.floor(i / 8) * 16 * scale.y, 16 * scale.x, 16 * scale.y);
                }
            }
            this.sprites[mx] = _H.loadSprite(cg.toDataURL("image/png"), completed);

        }
        return true;
    };
    TileChunk.prototype.draw = function (canvas, position, scale, state) {


        if (!this.sprites)
            this.sprites = [];
        var i;
        for (i = 0; i < this.tilesPieces.length; i++) {
            var j = sonicManager.SonicLevel.TilePieces[this.tilesPieces[i]].sprites;
            if (!j || j.length == 0) {
                this.sprites = [];

                break;
            }
        }

        var mx = state * 200 + scale.y * 50 + scale.x;
        if (!this.sprites[mx]) {
            var cg = document.createElement("canvas");
            cg.width = 128 * scale.x;
            cg.height = 128 * scale.y;
            var cv = cg.getContext('2d');
            for (i = 0; i < this.tilesPieces.length; i++) {

                if (!sonicManager.SonicLevel.TilePieces[this.tilesPieces[i]].draw(cv, { x: (i % 8) * 16 * scale.x, y: Math.floor(i / 8) * 16 * scale.y }, scale, state == 2 ? 4 : 3))
                    return false;
                if (state == 1) {
                    cv.lineWidth = 1;
                    cv.strokeStyle = "#FFFFFF";
                    cv.strokeRect((i % 8) * 16 * scale.x, Math.floor(i / 8) * 16 * scale.y, 16 * scale.x, 16 * scale.y);
                }
            }
            this.sprites[mx] = _H.loadSprite(cg.toDataURL("image/png"));

        }
        if (this.sprites[mx].loaded) {
            canvas.drawImage(this.sprites[mx], Math.floor(position.x), Math.floor(position.y));
        };
        return true;
    };

}
