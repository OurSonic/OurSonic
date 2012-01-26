var DEBUGs = true;


SonicLevel = {
    Tiles: [],
    TilePieces: [],
    TileChunks: []
};

function compareTiles(tiles, tiles2, colors) {
    var i;
    for (i = 0; i < tiles.length; i++) {
        if (tiles[i].equals(colors)) {
            return i;
        }
    }
    for (i = 0; i < tiles2.length; i++) {
        if (tiles2[i].equals(colors)) {
            return tiles.length + i;
        }
    }
    return -1;
}

function compareTilePieces(tilePieces, tilePieces2, tp) {
    var i;
    for (i = 0; i < tilePieces.length; i++) {
        if (tilePieces[i].equals(tp)) {
            return i;
        }
    }
    for (i = 0; i < tilePieces2.length; i++) {
        if (tilePieces2[i].equals(tp)) {
            return tilePieces.length + i;
        }
    }
    return -1;
}


function importChunkFromImage(image) {
    var data = _H.getImageData(image);
    if (data.length != 128 * 128 * 4) {
        alert('Chunk size incorrect');
    }
    var start = SonicLevel.Tiles.length;
    var tiles = [];
    var x;
    var y;
    var tileIndexes = [];
    var tilePieceIndexes = [];
    var ind;
    for (var tY = 0; tY < 16; tY++) {
        for (var tX = 0; tX < 16; tX++) {
            var colors = [];
            for (y = 0; y < 8; y++) {
                for (x = 0; x < 8; x++) {
                    var f = ((tY * 8 + y) * 128) * 4 + (tX * 8 + x) * 4;
                    colors.push(new Color(data[f], data[f + 1], data[f + 2]));
                }
            }
            ind = compareTiles(SonicLevel.Tiles, tiles, colors);
            if (ind == -1) {
                tileIndexes.push(start + tiles.length);
                tiles.push(new Tile(colors));
            } else {
                tileIndexes.push(ind);
            }
        }
    }
    var i;
    for (i = 0; i < tiles.length; i++) {
        SonicLevel.Tiles.push(tiles[i]);
    }

    var tilePieces = [];

    var startPieces = SonicLevel.TilePieces.length;
    for (y = 0; y < 8; y++) {
        for (x = 0; x < 8; x++) {
            var tp = [tileIndexes[((y * 2) * 16 + (x * 2))],
                tileIndexes[((y * 2) * 16 + (x * 2 + 1))],
                tileIndexes[((y * 2 + 1) * 16 + (x * 2))],
                tileIndexes[((y * 2 + 1) * 16 + (x * 2 + 1))]];
            ind = compareTilePieces(SonicLevel.TilePieces, tilePieces, tp);
            if (ind == -1) {
                tilePieceIndexes.push(startPieces + tilePieces.length);
                tilePieces.push(new TilePiece(defaultHeightMask(), tp));
            } else {
                tilePieceIndexes.push(ind);
            }
        }
    }
    for (i = 0; i < tilePieces.length; i++) {
        SonicLevel.TilePieces.push(tilePieces[i]);
    }
    var pieces = [];
    for (y = 0; y < 8; y++) {
        for (x = 0; x < 8; x++) {
            pieces.push(tilePieceIndexes[y * 8 + x]);
        }
    }

    SonicLevel.TileChunks.push(new TileChunk(pieces));
}
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
            tilePieces.push(new TilePiece(heightMask, [ind, ind + 1, ind + 2, ind + 3]));
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
window.requestAnimFrame = (function (ff) {
    /*
    if (window.requestAnimationFrame)
    return window.requestAnimationFrame(ff);
    if (window.webkitRequestAnimationFrame)
    return window.webkitRequestAnimationFrame(ff);
    if (window.mozRequestAnimationFrame)
    return window.mozRequestAnimationFrame(ff);
    if (window.oRequestAnimationFrame)
    return window.oRequestAnimationFrame(ff);
    if (window.msRequestAnimationFrame)
    return window.msRequestAnimationFrame(ff);*/
    window.setTimeout(ff, 1000 / 60);
});



function randColor() {
    return "rgb(" + Math.floor(Math.random() * 255) + "," + Math.floor(Math.random() * 255) + "," + Math.floor(Math.random() * 255) + ")";
}

function SonicEngine(canvasName) {
    var that = this;
    that.UIAreas = [];
    that.messages = [];
    this.canvas = $("#" + canvasName);
    this.canvasItem = document.getElementById(canvasName).getContext("2d");


    this.canvasWidth = 0;
    this.canvasHeight = 0;


    /* var area = new UIArea(40, 40, 250, 220);
    that.UIAreas.push(area);
    area.addControl(new TextArea(25, 50, "Hi", "15pt Arial bold", "blue"));
    area.addControl(new Button(50, 50, 120, 22, "New Wire", "13pt Arial bold", "rgb(50,150,50)",
    function () {
    addEmptyWire("rgb(" + Math.floor(Math.random() * 255) + "," + Math.floor(Math.random() * 255) + "," + Math.floor(Math.random() * 255) + ")");
    }));
    var intv;
 
    area.addControl(new Button(30, 75, 180, 22, "Start Random", "13pt Arial bold", "rgb(50,150,50)",
    function () {
    if (this.text == "Start Random") {
    this.text = "Stop Random";
    intv = setInterval(tick3, 10);
    } else {
    this.text = "Start Random";
    clearInterval(intv);
    }
    }));
    var ctls;
    
    area.addControl(ctls = new ScrollBox(30, 100, 25, 4, 100, "rgb(50,60,127)"));
    */




    function getCursorPosition(event, print) {
        if (event.targetTouches && event.targetTouches.length > 0) event = event.targetTouches[0];

        if (event.pageX != null && event.pageY != null) {

            return { x: event.pageX, y: event.pageY };
        }
        if (print) alert(stringify(event));
        if (event.x != null && event.y != null) return { x: event.x, y: event.y };
        if (print) alert(stringify(event));
        return { x: event.clientX, y: event.clientY };
    }


    function canvasOnClick(e) {
        e.preventDefault();
        var cell = getCursorPosition(e);
        var goodArea = null;
        var are;
        var ij;
        for (ij = 0; ij < that.UIAreas.length; ij++) {
            are = that.UIAreas[ij];
            if (are.visible && are.y <= cell.y && are.y + are.height > cell.y && are.x <= cell.x && are.x + are.width > cell.x) {
                goodArea = are;
                var ec = { x: cell.x - are.x, y: cell.y - are.y };
                are.click(ec);
            }
        }

        if (goodArea) {
            for (ij = 0; ij < that.UIAreas.length; ij++) {
                are = that.UIAreas[ij];
                if (goodArea == are) {
                    are.depth = 1;
                } else are.depth = 0;
            }

            return false;

        }



        if (e.shiftKey) {


        } else {
            if (!e.button || e.button == 0) {
            }
        }

        return false;
    }

    function canvasMouseMove(e) {
        e.preventDefault();
        var cell = getCursorPosition(e);

        for (var ij = 0; ij < that.UIAreas.length; ij++) {
            var are = that.UIAreas[ij];
            if (are.visible && are.y <= cell.y &&
                    are.y + are.height > cell.y &&
                        are.x <= cell.x &&
                            are.x + are.width > cell.x) {
                cell = { x: cell.x - are.x, y: cell.y - are.y };

                return are.mouseMove(cell);
            }
        }


        return false;
    }

    function canvasMouseUp(e) {
        e.preventDefault();

        var cell = getCursorPosition(e, true);

        for (var ij = 0; ij < that.UIAreas.length; ij++) {
            var are = that.UIAreas[ij];
            var ec = { x: cell.x - are.x, y: cell.y - are.y };
            are.mouseUp(ec);
        }

    }


    var handleScroll = function (evt) {
        evt.preventDefault();
        var delta = evt.wheelDelta ? evt.wheelDelta / 40 : evt.detail ? -evt.detail : 0;


        for (var ij = 0; ij < that.UIAreas.length; ij++) {
            var are = that.UIAreas[ij];
            if (are.visible && are.y <= evt.y && are.y + are.height > evt.y && are.x <= evt.x && are.x + are.width > evt.x) {
                evt = { x: evt.x - are.x, y: evt.y - are.y, delta: delta };
                return are.scroll(evt);
            }
        }

        return evt.preventDefault() && false;
    };


    document.getElementById(canvasName).addEventListener('DOMMouseScroll', handleScroll, false);
    document.getElementById(canvasName).addEventListener('mousewheel', handleScroll, false);

    document.getElementById(canvasName).addEventListener('touchmove', canvasMouseMove);
    document.getElementById(canvasName).addEventListener('touchstart', canvasOnClick);
    document.getElementById(canvasName).addEventListener('touchend', canvasMouseUp);

    document.getElementById(canvasName).addEventListener('mousedown', canvasOnClick);
    document.getElementById(canvasName).addEventListener('mouseup', canvasMouseUp);
    document.getElementById(canvasName).addEventListener('mousemove', canvasMouseMove);

    window.addEventListener('keydown', doKeyDown, true);


    function doKeyDown(evt) {
        switch (evt.keyCode) {
            case 38:  /* Up arrow was pressed */
                alert(JSON.stringify(SonicLevel).length);

                break;
            case 40:  /* Down arrow was pressed */

                var index = 0;
                var tim = function () {
                    if (index == 5) return;
                    setTimeout(tim, 30);
                    var image = new Image();
                    image.onload = function () {

                        importChunkFromImage(image);
                    };
                    var j = "assets/SonicImages/HiPlane" + index++ + ".png";
                    image.src = j;

                };
                setTimeout(tim, 100);
                break;
            case 37:  /* Left arrow was pressed */
                break;
            case 39:  /* Right arrow was pressed */
                break;
        }
    }

    that.resizeCanvas = function () {
        that.canvasWidth = $(window).width();
        that.canvasHeight = $(window).height();

        that.canvas.attr("width", that.canvasWidth);
        that.canvas.attr("height", that.canvasHeight);
    };

    function clear(ctx) {
        ctx.clearRect(0, 0, that.canvasWidth, that.canvasHeight);
    }

    that.draw = function () {
        requestAnimFrame(that.draw);
        clear(that.canvasItem);
        var inc = 0;
        var scale = { x: 4, y: 4 };

        for (var j = SonicLevel.TileChunks.length - 9; j < SonicLevel.TileChunks.length; j++) {
            if (j < 0) continue;
            SonicLevel.TileChunks[j].draw(that.canvasItem, { x: 25 + (inc++) * 150 * scale.x, y: 25 }, scale);
        }


        /*if (img.loaded) {
        for (var j = 0; j < that.canvasWidth / img.width; j++) {
        for (var k = 0; k < that.canvasHeight / img.height; k++) {
        that.canvasItem.drawImage(img, j * img.width, k * img.height, img.width, img.height);
        }
        }
        }*/

        var cl = JSLINQ(that.UIAreas).OrderBy(function (f) {
            return f.depth;
        });

        for (var ij = 0; ij < cl.items.length; ij++) {
            var are = cl.items[ij];
            are.draw(that.canvasItem);
        }

        if (DEBUGs) {
            for (var i = 0; i < that.messages.length; i++) {
                that.canvasItem.fillText(that.messages[i], 10, 25 + i * 30);
            }
        }
    };


    $(window).resize(this.resizeCanvas);
    this.resizeCanvas();
    requestAnimFrame(that.draw);
};

