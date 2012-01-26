﻿function TilePiece(heightMask, tiles) {
    this.heightMask = heightMask;
    this.tiles = tiles;

    this.click = function (x, y, state) {
        switch (state) {
            case 0:
                this.heightMask.setItem(x, y);
                break;
            case 1:
                break;
            case 2:

                SonicLevel.Tiles[this.tiles[Math.floor(x / 8) + Math.floor(y / 8) * 2]].changeColor(x % 8, y % 8, new Color(122, 122, 122));
                break;
        }


    };
    this.mouseOver = function (x, y) {
        //SonicLevel.Tiles[this.tiles[Math.floor(x / 8) + Math.floor(y / 8) * 2]].tempColor(x % 8, y % 8, new Color(122, 5, 122));
    };
    this.draw = function (canvas, position, scale, showHeightMask) {

        for (var i = 0; i < this.tiles.length; i++) {
            SonicLevel.Tiles[this.tiles[i]].draw(canvas, { x: position.x + (i % 2) * 8 * scale.x, y: position.y + Math.floor(i / 2) * 8 * scale.y },scale,showHeightMask);
        }

        //canvas.fillStyle = "#FFFFFF";
        //canvas.fillText(SonicLevel.TilePieces.indexOf(this), position.x + 8 * scale.x, position.y + 8 * scale.y);

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