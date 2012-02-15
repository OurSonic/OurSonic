function TilePiece(heightMask, tiles) {
    this.tiles = tiles;

    TilePiece.prototype.click = function (x, y, state) {


        //sonicManager.SonicLevel.Tiles[this.tiles[_H.floor(x / 8) + _H.floor(y / 8) * 2]].changeColor(x % 8, y % 8, new Color(0, 0, 0));



    };
    TilePiece.prototype.mouseOver = function (x, y) {
        //sonicManager.SonicLevel.Tiles[this.tiles[_H.floor(x / 8) + _H.floor(y / 8) * 2]].tempColor(x % 8, y % 8, new Color(122, 5, 122));
    };
    TilePiece.prototype.onlyBackground = function () {
        for (var i = 0; i < this.tiles.length; i++) {
            var mj = this.tiles[i];
            if (sonicManager.SonicLevel.Tiles[mj.Tile]) {
                if (mj.Priority == true) {
                    return false;
                }
            }
        }
        return true;
    }; 

    TilePiece.prototype.draw = function (canvas, position, scale, layer, xflip, yflip) {

        var drawOrder;
        if (xflip) {
            if (yflip) {
                drawOrder = [3, 2, 1, 0];
            } else {
                drawOrder = [1, 0, 3, 2];
            }
        } else {
            if (yflip) {
                drawOrder = [2, 3, 0, 1];
            } else {
                drawOrder = [0, 1, 2, 3];
            }
        }
        var fd;
        if ((fd = sonicManager.SpriteCache.tilePeices[layer + " " + this.index + " " + scale.y + " " + scale.x])) {
            if (fd.loaded) {
                canvas.drawImage(fd, position.x, position.y);
            }
        } else {
            for (var i = 0; i < this.tiles.length; i++) {
                var mj = this.tiles[i];
                if (sonicManager.SonicLevel.Tiles[mj.Tile]) {
                    if (mj.Priority == layer) { 
                        sonicManager.SonicLevel.Tiles[mj.Tile].draw(canvas,
                        { x: position.x + (drawOrder[i] % 2) * 8 * scale.x, y: position.y + _H.floor(drawOrder[i] / 2) * 8 * scale.y }, scale,
                        _H.xor(xflip, mj.XFlip), _H.xor(yflip, mj.YFlip), mj.Palette, false, layer);
                    }
                }
            }
            /* canvas.lineWidth = 2;
            canvas.strokeStyle = "#D142AA";
            canvas.strokeRect(position.x, position.y, 16 * scale.x, 16 * scale.y);*/
        }





        //canvas.fillStyle = "#FFFFFF";
        //canvas.fillText(sonicManager.SonicLevel.Blocks.indexOf(this), position.x + 8 * scale.x, position.y + 8 * scale.y);


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

function defaultBlocks(heightMask) {
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
function defaultChunks() {
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
    return "rgb(" + _H.floor(Math.random() * 255) + "," + _H.floor(Math.random() * 255) + "," + _H.floor(Math.random() * 255) + ")";
}
*/