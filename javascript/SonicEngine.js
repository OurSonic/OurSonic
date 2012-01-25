var DEBUGs = true;


SonicLevel = {
    Tiles: defaultTiles(new Tile(defaultColors(new Color(17, 197, 255)))),
    TilePieces: defaultTilePieces(new HeightMap()),
    TileChunks: defaultTileChunks()
};


function importChunkFromImage(image) {
    var data = getImageData(image);
    if (data.length != 128 * 128 * 4) {
        alert('Chunk size incorrect');
    }
    var start = SonicLevel.Tiles.length;
    var tiles = [];
    var x;
    var y;
    for (var tY = 0; tY < 16; tY++) {
        for (var tX = 0; tX < 16; tX++) {
            var colors = [];
            for (y = 0; y < 8; y++) {
                for (x = 0; x < 8; x++) {
                    var f = ((tY * 8 + y) * 128) * 4 + (tX * 8 + x) * 4;
                    colors.push(new Color(data[f], data[f + 1], data[f + 2]));
                }
            }
            tiles.push(new Tile(colors));
        }
    }
    var i;
    for (i = 0; i < tiles.length; i++) {
        SonicLevel.Tiles.push(tiles[i]);
    }

    var tilePieces = [];

    for (y = 0; y < 8; y++) {
        for (x = 0; x < 8; x++) {
            tilePieces.push(new TilePiece(defaultHeightMap(), [
                    start + ((y * 2) * 16 + (x * 2)),
                    start + ((y * 2) * 16 + (x * 2 + 1)),
                    start + ((y * 2 + 1) * 16 + (x * 2)),
                    start + ((y * 2 + 1) * 16 + (x * 2 + 1))]));
        }
    }
    var startPieces = SonicLevel.TilePieces.length;
    for (i = 0; i < tilePieces.length; i++) {
        SonicLevel.TilePieces.push(tilePieces[i]);
    }
    var pieces = [];
    for (y = 0; y < 8; y++) {
        for (x = 0; x < 8; x++) {
            pieces.push(startPieces + y * 8 + x);
        }
    }

    SonicLevel.TileChunks.push(new TileChunk(pieces));
}
function defaultHeightMap() {
    var hm = new HeightMap();
    hm.init();
    return hm;
}
function getImageData(img) {
    var canvas = document.createElement("canvas");
    canvas.width = img.width;
    canvas.height = img.height;
    var ctx = canvas.getContext("2d");
    ctx.drawImage(img, 0, 0);
var data = ctx.getImageData(0, 0, img.width, img.height);
    return data.data;
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

function defaultTilePieces(heightMap) {
    var tilePieces = [];
    var ind = 0;
    for (var x = 0; x < 8; x++) {
        for (var y = 0; y < 8; y++) {
            tilePieces.push(new TilePiece(heightMap, [ind, ind + 1, ind + 2, ind + 3]));
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

    ;

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
                break;
            case 40:  /* Down arrow was pressed */
                var image = new Image();
                image.onload = function () {

                    importChunkFromImage(image);
                };
                var j = "http://localhost:59836/oursonic/assets/SonicImages/HiPlane26.png";
                image.src = j;
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

    /*var img = new Image();
    img.src = 'http://dested.com/spoke/assets/images/Brick.jpg';
    img.onload = function () { img.loaded = true; };*/


    var fps = 0, now, lastUpdate = (new Date) * 1 - 1; var fpsFilter = 60;
    var jcs = 0;

    function clear(ctx) {
        ctx.clearRect(0, 0, that.canvasWidth, that.canvasHeight);
    }


    that.draw = function () {
        requestAnimFrame(that.draw);
        clear(that.canvasItem);
        for (var j = 0; j < SonicLevel.TileChunks.length; j++) {
            SonicLevel.TileChunks[j].draw(that.canvasItem, { x: 25 + j * 150*pixelWidth, y: 25 });

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
            var fcs = 1000 / ((now = new Date) - lastUpdate);
            fps += (fcs - fps) / fpsFilter;
            lastUpdate = now;
            jcs++;

            that.canvasItem.font = 'bold 10px sans-serif';
            that.canvasItem.fillText('FPS: ' + fps.toFixed(1), 4, that.canvasHeight - 4);
            that.canvasItem.fillText('ss: ' + jcs, 4, that.canvasHeight - 25);
        }
    };


    $(window).resize(this.resizeCanvas);
    this.resizeCanvas();

    requestAnimFrame(that.draw);


};


var pixelWidth = 3;
function Tile(colors) {
    this.colors = colors;

    this.draw = function (canvas, pos) {
        for (var i = 0; i < this.colors.length; i++) {
            canvas.fillStyle = this.colors[i].style();
            canvas.fillRect(pos.x + (i % 8) * pixelWidth, pos.y + Math.floor(i / 8) * pixelWidth, pixelWidth, pixelWidth);
        }
    };
}

function TilePiece(heightMap, tiles) {
    this.heightMap = heightMap;
    this.tiles = tiles;

    this.draw = function (canvas, pos, showHeightMap) {

        for (var i = 0; i < this.tiles.length; i++) {
            SonicLevel.Tiles[this.tiles[i]].draw(canvas, { x: pos.x + (i % 2) * 8 * pixelWidth, y: pos.y + Math.floor(i / 2) * 8 * pixelWidth });
        }
        if (showHeightMap)
            this.heightMap.draw(canvas, pos, pixelWidth);
    };

}

function TileChunk(tilesPieces) {
    this.tilesPieces = tilesPieces;
    this.draw = function (canvas, pos) {
        for (var i = 0; i < this.tilesPieces.length; i++) {

            SonicLevel.TilePieces[this.tilesPieces[i]].draw(canvas, { x: pos.x + (i % 8) * 16 * pixelWidth, y: pos.y + Math.floor(i / 8) * 16 * pixelWidth }, false);

            canvas.strokeStyle = "#FFFFFF";
            canvas.strokeRect(pos.x + (i % 8) * 16 * pixelWidth, pos.y + Math.floor(i / 8) * 16 * pixelWidth, 16 * pixelWidth, 16 * pixelWidth);

        }
    };

}
function Color(r, g, b) {
    this.r = r;
    this.g = g;
    this.b = b;
    this._style = "#" + (r.toString(16).length == 1 ? "0" + r.toString(16) : r.toString(16))
        + (g.toString(16).length == 1 ? "0" + g.toString(16) : g.toString(16))
            + (b.toString(16).length == 1 ? "0" + b.toString(16) : b.toString(16));

    this.style = function () {
        return this._style;
    };
}
function HeightMap() {
    this.width = 16;
    this.height = 16;
    this.items = [];
    this.init = function () {
        this.items = [];
        for (var x = 0; x < 16; x++) {
            this.items[x] = [];
            for (var y = 0; y < 16; y++) {
                this.items[y * 16 + x] = false;
            }
        }

    };
    this.draw = function (canvas, pos, w) {
        for (var x = 0; x < 16; x++) {
            for (var y = 0; y < 16; y++) {
                if (this.items[y * 16 + x]) {
                    canvas.fillRect(pos.x + (x * w), pos.y + (y * w), w, w);
                } else {
                    canvas.strokeRect(pos.x + (x * w), pos.y + (y * w), w, w);
                }
            }
        }
    };
}


function stringify(obj, cc) {
    if (cc > 0) return "";
    if (!cc) cc = 0;
    var t = typeof (obj);
    if (t != "object" || obj === null) {
        // simple data type
        if (t == "string") obj = '"' + obj + '"';
        return String(obj);
    }
    else {
        // recurse array or object
        var n, v, json = [], arr = (obj && obj.constructor == Array);
        for (n in obj) {
            v = obj[n]; t = typeof (v);
            if (t == "string") v = '"' + v + '"';
            else if (t == "object" && v !== null) v = stringify(v, cc + 1);
            json.push((arr ? "" : '"' + n + '":') + String(v));
        }
        return (arr ? "[" : "{") + String(json) + (arr ? "]" : "}");
    }
}

