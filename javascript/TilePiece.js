function TilePiece(heightMask, tiles) {
    this.tiles = tiles;

    TilePiece.prototype.click = function (x, y, state) {


        //sonicManager.SonicLevel.Tiles[this.tiles[Math.floor(x / 8) + Math.floor(y / 8) * 2]].changeColor(x % 8, y % 8, new Color(0, 0, 0));



    };
    TilePiece.prototype.mouseOver = function (x, y) {
        //sonicManager.SonicLevel.Tiles[this.tiles[Math.floor(x / 8) + Math.floor(y / 8) * 2]].tempColor(x % 8, y % 8, new Color(122, 5, 122));
    };


    TilePiece.prototype.draw = function (canvas, position, scale,layer) {



        var fd;
        if ((fd = sonicManager.SpriteCache.tilePeices[layer + " " + this.index + " " + scale.y + " " + scale.x])) {
            if (fd.loaded) {
                canvas.drawImage(fd, position.x, position.y);
            }
        } else {
            for (i = 0; i < this.tiles.length; i++) {
                var mj = this.tiles[i];
                sonicManager.SonicLevel.TileData[mj.TileIndex].draw(canvas, { x: position.x + (i % 2) * 8 * scale.x, y: position.y + Math.floor(i / 2) * 8 * scale.y }, scale, mj.State, false, layer);
            } 
        }
        


    

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
    Floor: 134,
    RightWall: 224,
    Ceiling: 314,
    LeftWall: 44
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
            tilePieces.push(new TilePiece(heightMask, [ind, ind + 1, ind + 2, ind + 3],RotationMode.Floor));
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