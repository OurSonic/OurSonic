function TilePiece(heightMask, tiles) {
    this.heightMask = heightMask;
    this.tiles = tiles;
    this.sprites = [];

    TilePiece.prototype.click = function (x, y, state) {
        switch (state) {
            case 0:
                this.heightMask.setItem(x, y);
                break;
            case 1:
                break;
            case 2:

                sonicManager.SonicLevel.Tiles[this.tiles[Math.floor(x / 8) + Math.floor(y / 8) * 2]].changeColor(x % 8, y % 8, new Color(122, 122, 122));
                break;
        }


    };
    TilePiece.prototype.mouseOver = function (x, y) {
        //sonicManager.SonicLevel.Tiles[this.tiles[Math.floor(x / 8) + Math.floor(y / 8) * 2]].tempColor(x % 8, y % 8, new Color(122, 5, 122));
    };
    TilePiece.prototype.draw = function (canvas, position, scale, state) {
        if (!this.sprites)
            this.sprites = [];
        var i;
        for (i = 0; i < this.tiles.length; i++) {
            var j = sonicManager.SonicLevel.Tiles[this.tiles[i]].sprites;
            if (!j || j.length == 0) {
                this.sprites = [];
                break;
            }
        }
        if (state < 3) {
            for (i = 0; i < this.tiles.length; i++) {
                if (!sonicManager.SonicLevel.Tiles[this.tiles[i]].draw(canvas, { x: Math.floor(position.x) + (i % 2) * 8 * scale.x, y: Math.floor(position.y) + Math.floor(i / 2) * 8 * scale.y }, scale, state != 3))
                    return false;
            }
            this.heightMask.draw(canvas, position, scale, state);
            return true;
        }


        var mx = state * 200 + scale.y * 50 + scale.x;
        if (!this.sprites[mx]) {
            var cg = document.createElement("canvas");
            cg.width = 2 * 8 * scale.x;
            cg.height = 2 * 8 * scale.y;
            var cv = cg.getContext('2d');
            for (i = 0; i < this.tiles.length; i++) {
                if (!sonicManager.SonicLevel.Tiles[this.tiles[i]].draw(cv, { x: (i % 2) * 8 * scale.x, y: Math.floor(i / 2) * 8 * scale.y }, scale, state < 3))
                    return false;

                if (state == 4)
                    this.heightMask.draw(cv, { x: (i % 2) * 8 * scale.x, y: Math.floor(i / 2) * 8 * scale.y }, scale, -1);

            } this.sprites[mx] = _H.loadSprite(cg.toDataURL("image/png"));


        }

        if (this.sprites[mx].loaded) {
            canvas.drawImage(this.sprites[mx], Math.floor(position.x), Math.floor(position.y));
        } else return false;


        //canvas.fillStyle = "#FFFFFF";
        //canvas.fillText(sonicManager.SonicLevel.TilePieces.indexOf(this), position.x + 8 * scale.x, position.y + 8 * scale.y);


        return true;
    };
    TilePiece.prototype.equals = function (tp) {
        for (var i = 0; i < this.tiles.length; i++) {

            if (tp[i] != this.tiles[i])
                return false;
        }
        return true;
    };

}


RotationMode = {
    Ground: 134,
    Right: 224,
    Ceiling: 314,
    Left: 44
}; /*
function defaultHeightMask() {
    var hm = new HeightMask();
    hm.init();
    return hm;
}


function defaultTiles(tile) {
    var tiles = [];
    for (var x = 0; x < 16; x++) {
        for (var y = 0; y < 16; y++) {
            tiles.push(tile);
        }
    }
    return tiles;
}

function defaultTilePieces(heightMask) {
    var tilePieces = [];
    var ind = 0;
    for (var x = 0; x < 8; x++) {
        for (var y = 0; y < 8; y++) {
            tilePieces.push(new TilePiece(heightMask, [ind, ind + 1, ind + 2, ind + 3],RotationMode.Ground));
            ind += 4;
        }
    }
    return tilePieces;
}
function defaultTileChunks() {
    var tileChunks = [];
    for (var x = 0; x < 1; x++) {
        for (var y = 0; y < 1; y++) {
            var ind = 0;
            var tilePieces = [];
            for (var x_ = 0; x_ < 8; x_++) {
                for (var y_ = 0; y_ < 8; y_++) {
                    tilePieces.push(ind++);
                }
            }
            tileChunks.push(new TileChunk(tilePieces));

        }
    }

    return tileChunks;
}
function defaultColors(col) {
    var cols = [];
    for (var x = 0; x < 8; x++) {
        for (var y = 0; y < 8; y++) {
            cols.push(col);
        }
    }
    return cols;
}


function randColor() {
    return "rgb(" + Math.floor(Math.random() * 255) + "," + Math.floor(Math.random() * 255) + "," + Math.floor(Math.random() * 255) + ")";
}
*/