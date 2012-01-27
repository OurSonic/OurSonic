var DEBUGs = true;

textFont = "18pt sans-serrif ";
buttonFont = "13pt Arial bold";
SonicLevel = {
    Tiles: [],
    TilePieces: [],
    TileChunks: [],
    ChunkMap: []
};
for (var x_ = 0; x_ < 10; x_++) {
    for (var y_ = 0; y_ < 10; y_++) {
        SonicLevel.ChunkMap[y_ * 10 + x_] = 0;
    }
}

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
                tilePieces.push(new TilePiece(new HeightMask(RotationMode.Ground, 45), tp));
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

window.requestAnimFrame = (function (ff) {
    if (window.requestAnimationFrame)
        return window.requestAnimationFrame(ff);
    if (window.webkitRequestAnimationFrame)
        return window.webkitRequestAnimationFrame(ff);
    if (window.mozRequestAnimationFrame)
        return window.mozRequestAnimationFrame(ff);
    if (window.oRequestAnimationFrame)
        return window.oRequestAnimationFrame(ff);
    if (window.msRequestAnimationFrame)
        return window.msRequestAnimationFrame(ff);
    window.setTimeout(ff, 1000 / 60);
});


function SonicEngine(canvasName) {
    var that = this;
    that.UIAreas = [];
    that.messages = [];
    this.canvas = $("#" + canvasName);
    this.canvasItem = document.getElementById(canvasName).getContext("2d");
    this.canvasItem.font = textFont;


    this.canvasWidth = 0;
    this.canvasHeight = 0;

    var modifyTilePieceArea;


    var debuggerArea = new UiArea(1300, 40, 200, 170, true);
    debuggerArea.visible = false;
    that.UIAreas.push(debuggerArea);
    debuggerArea.addControl(new TextArea(30, 25, "Debugger", textFont, "blue"));
    debuggerArea.addControl(new Button(95, 60, 60, 22, "Stop", buttonFont, "rgb(50,150,50)", function () {

        windowLocation.x = 0;
        windowLocation.y = 0;
        debuggerArea.visible = false;
        tileChunkArea.visible = true;
        solidTileArea.visible = false;
        levelInformation.visible = true;

        sonicToon = null;
    }
    ));

    new TileChunk();
    new TilePiece();
    new Tile();
    new HeightMask();
    new Color();

    var solidTileArea = new UiArea(40, 40, 430, 400, true);
    solidTileArea.visible = false;
    that.UIAreas.push(solidTileArea);
    solidTileArea.addControl(new TextArea(30, 25, "Modify Solid Tile", textFont, "blue"));
    var tpIndex = 0;

    solidTileArea.addControl(new Button(50, 35, 25, 22, "<<", buttonFont, "rgb(50,150,50)",
        function () {
            if (tpIndex > 0)
                modifyTilePieceArea.tilePiece = SonicLevel.TilePieces[--tpIndex];
        }));

    solidTileArea.addControl(new Button(50, 35, 25, 22, "<<", buttonFont, "rgb(50,150,50)",
        function () {
            if (tpIndex > 0)
                modifyTilePieceArea.tilePiece = SonicLevel.TilePieces[--tpIndex];
        }));
    solidTileArea.addControl(new Button(360, 80, 45, 22, "Full", buttonFont, "rgb(50,150,50)",
        function () {
            for (var i = 0; i < 16; i++) {
                modifyTilePieceArea.tilePiece.heightMask.items[i] = 16;

            }
        }));

    solidTileArea.addControl(new Button(200, 35, 180, 22, "Modify Height Map", buttonFont, "rgb(50,150,50)",
    function () {
        modifyTilePieceArea.state = (modifyTilePieceArea.state + 1) % 3;
        switch (modifyTilePieceArea.state) {
            case 0:
                this.text = "Modify Height Map";
                break;
            case 1:
                this.text = "Modify Tile Direction";
                break;
            case 2:
                this.text = "Modify Tile Colors";
                break;
        }
    }));
    solidTileArea.addControl(modifyTilePieceArea = new TilePieceArea(30, 70, { x: 4 * 5, y: 4 * 5 }, null));


    var levelInformation = new UiArea(900, 70, 420, 360);
    levelInformation.visible = true;
    that.UIAreas.push(levelInformation);
    levelInformation.addControl(new TextArea(30, 25, "Level Manager", textFont, "blue"));
    levelInformation.addControl(new TextArea(30, 52, function () {
        return !curLevelName ? "Level Not Saved" : ("Current Level: " + curLevelName);
    }, textFont, "black"));
    levelInformation.addControl(new Button(190, 70, 100, 22, "Save Level", buttonFont, "rgb(50,150,50)",
    function () {
        if (curLevelName) {
            OurSonic.SonicLevels.SaveLevelInformation(curLevelName, _H.stringify(SonicLevel), function (c) { }, function (c) { alert("Failure: " + _H.stringify(c)); });
        } else {
            OurSonic.SonicLevels.saveLevel((_H.stringify(SonicLevel)), function (j) {
                addLevelToList(curLevelName);
            });

        }
    }));


    levelInformation.addControl(new Button(190, 105, 160, 22, "Load Empty Level", buttonFont, "rgb(50,150,50)",
    function () {
        tileChunkArea.visible = true;
        loadingText.visible = true;
        var index = 1;
        var tim = function () {
            var max = 10;
            if (index == max) {
                setTimeout(function () {
                    modifyTileChunkArea.tileChunk = SonicLevel.TileChunks[0];
                    loadingText.visible = false;
                }, 500);
                return;
            }
            setTimeout(tim, 100);

            var image = new Image();
            image.onload = function () {
                loadingText.text = "Loading " + index + "/" + max;
                importChunkFromImage(image);
            };
            var j = "assets/TileChunks/HiPlane" + index++ + ".png";
            image.src = j;

        };
        setTimeout(tim, 100);



    }));

    var ctls;
    levelInformation.addControl(ctls = new ScrollBox(30, 70, 25, 11, 130, "rgb(50,60,127)"));

    var curLevelName;
    OurSonic.SonicLevels.getLevels(function (lvls) {
        for (var i = 0; i < lvls.length; i++) {
            var lvlName = lvls[i];
            addLevelToList(lvlName);
        }
    });


    function addLevelToList(name) {
        ctls.addControl(btn = new Button(0, 0, 0, 0, name, "10pt Arial", "rgb(50,190,90)", function () {
            curLevelName = name;
            OurSonic.SonicLevels.openLevel(name, function (lvl) {
                tileChunkArea.visible = true;

                SonicLevel = jQuery.parseJSON((lvl));
                var fc;
                var j;
                for (j = 0; j < SonicLevel.TileChunks.length; j++) {
                    fc = SonicLevel.TileChunks[j];

                    fc.__proto__ = TileChunk.prototype;
                }
                for (j = 0; j < SonicLevel.TilePieces.length; j++) {
                    fc = SonicLevel.TilePieces[j];
                    fc.__proto__ = TilePiece.prototype;
                    fc.heightMask.__proto__ = HeightMask.prototype;
                }
                for (j = 0; j < SonicLevel.Tiles.length; j++) {
                    fc = SonicLevel.Tiles[j];
                    fc.__proto__ = Tile.prototype;
                    for (var d = 0; d < fc.colors.length; d++) {
                        fc.colors[d].__proto__ = Color.prototype;
                    }
                }

                modifyTileChunkArea.tileChunk = SonicLevel.TileChunks[0];
            });
        }));
    }

    var tileChunkArea = new UiArea(490, 40, 400, 400);
    tileChunkArea.visible = false;
    that.UIAreas.push(tileChunkArea);
    tileChunkArea.addControl(new TextArea(30, 25, "Modify Tile Chunks", textFont, "blue"));
    var loadingText;
    tileChunkArea.addControl(loadingText = new TextArea(270, 25, "Loading", textFont, "green"));
    loadingText.visible = false;
    var modifyTileChunkArea;
    var tcIndex = 0;


    tileChunkArea.addControl(new Button(200, 35, 60, 22, "Run", buttonFont, "rgb(50,150,50)",
        function () {
            tileChunkArea.visible = false;
            solidTileArea.visible = false;
            levelInformation.visible = false;
            debuggerArea.visible = true;
            sonicToon = new Sonic(SonicLevel);
        }));


    tileChunkArea.addControl(new Button(50, 35, 25, 22, "<<", buttonFont, "rgb(50,150,50)",
        function () {
            if (tcIndex > 0)
                modifyTileChunkArea.tileChunk = SonicLevel.TileChunks[--tcIndex];
        }));
    tileChunkArea.addControl(new Button(80, 35, 25, 22, ">>", buttonFont, "rgb(50,150,50)",
        function () {
            if (tcIndex < SonicLevel.TileChunks.length)
                modifyTileChunkArea.tileChunk = SonicLevel.TileChunks[++tcIndex];
        }));

    tileChunkArea.addControl(modifyTileChunkArea = new TileChunkArea(30, 70, { x: 2, y: 2 }, null));







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
    document.getElementById(canvasName).addEventListener('DOMMouseScroll', handleScroll, false);
    document.getElementById(canvasName).addEventListener('mousewheel', handleScroll, false);

    document.getElementById(canvasName).addEventListener('touchmove', canvasMouseMove);
    document.getElementById(canvasName).addEventListener('touchstart', canvasOnClick);
    document.getElementById(canvasName).addEventListener('touchend', canvasMouseUp);

    document.getElementById(canvasName).addEventListener('mousedown', canvasOnClick);
    document.getElementById(canvasName).addEventListener('mouseup', canvasMouseUp);
    document.getElementById(canvasName).addEventListener('mousemove', canvasMouseMove);

    $(document).keydown(doKeyDown);
    $(document).keyup(doKeyUp);


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
            var ch = SonicLevel.TileChunks[SonicLevel.ChunkMap[Math.floor(e.x / (128 * scale.x)) + Math.floor(e.y / (128 * scale.y)) * 10]];

            var tp = ch.getTilePiece((e.x - Math.floor(e.x / (128 * scale.x)) * (128 * scale.x)), (e.y - Math.floor(e.y / (128 * scale.y)) * (128 * scale.y)), scale);
            if (tp) {
                modifyTilePieceArea.tilePiece = tp;
                solidTileArea.visible = true;
            }
        } else {
            if (!e.button || e.button == 0) {
                SonicLevel.ChunkMap[Math.floor(e.x / (128 * scale.x)) + Math.floor(e.y / (128 * scale.y)) * 10] = tcIndex;
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


    function handleScroll(evt) {
        evt.preventDefault();
        var delta = evt.wheelDelta ? evt.wheelDelta / 40 : evt.detail ? -evt.detail : 0;


        for (var ij = 0; ij < that.UIAreas.length; ij++) {
            var are = that.UIAreas[ij];
            if (are.visible && are.y <= evt.y && are.y + are.height > evt.y && are.x <= evt.x && are.x + are.width > evt.x) {
                evt = { x: evt.x - are.x,
                    y: evt.y - are.y, delta: delta
                };
                return are.scroll(evt);
            }
        }

        return evt.preventDefault() && false;
    };







    function doKeyDown(evt) {
        switch (evt.keyCode) {
            case 38:  /* Up arrow was pressed */
                if (sonicToon)
                    sonicToon.pressJump();

                break;
            case 40:  /* Down arrow was pressed */
                if (sonicToon)
                    sonicToon.pressCrouch();

                break;
            case 37:  /* Left arrow was pressed */
                if (sonicToon)
                    sonicToon.pressLeft();
                break;
            case 39:  /* Right arrow was pressed */
                if (sonicToon)
                    sonicToon.pressRight();
                break;
        }
    }
    function doKeyUp(evt) {
        switch (evt.keyCode) {
            case 38:  /* Up arrow was pressed */
                if (sonicToon)
                    sonicToon.releaseJump();

                break;
            case 40:  /* Down arrow was pressed */
                if (sonicToon)
                    sonicToon.releaseCrouch();

                break;
            case 37:  /* Left arrow was pressed */
                if (sonicToon)
                    sonicToon.releaseLeft();
                break;
            case 39:  /* Right arrow was pressed */
                if (sonicToon)
                    sonicToon.releaseRight();
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

    var scale = { x: 2, y: 2 };


    var sonicToon;
    that.tick = function () {
        if (sonicToon)
            sonicToon.tick(SonicLevel, scale);
    };
    windowLocation = { x: 0, y: 0, width: 320, height: 240 };

    that.draw = function () {
        requestAnimFrame(that.draw);
        clear(that.canvasItem);


        that.canvasItem.save();

        if (sonicToon) {
            that.canvasItem.beginPath();
            that.canvasItem.rect(0, 0, windowLocation.width * scale.x, windowLocation.height * scale.x);
            that.canvasItem.clip();
            windowLocation.x = Math.floor(sonicToon.x - 160);
            windowLocation.y = Math.floor(sonicToon.y - 180);
            if (windowLocation.x < 0) windowLocation.x = 0;
        }

        for (var j = 0; j < SonicLevel.ChunkMap.length; j++) {
            if (!SonicLevel.TileChunks[SonicLevel.ChunkMap[j]]) continue;
            var pos = { x: (j % 10) * 128 * scale.x, y: Math.floor(j / 10) * 128 * scale.y };
            if (!sonicToon || (pos.x >= (windowLocation.x - 128) * scale.x && pos.y >= (windowLocation.y - 128) * scale.y &&
                pos.x <= (windowLocation.x + 128) * scale.x + windowLocation.width * scale.x && pos.y <= (windowLocation.y + 128) * scale.y + windowLocation.height * scale.y)) {

                var posj = { x: pos.x - windowLocation.x * scale.x, y: pos.y - windowLocation.y * scale.x };

                SonicLevel.TileChunks[SonicLevel.ChunkMap[j]].
                    draw(that.canvasItem, posj, scale, !sonicToon);

                if (!sonicToon) {
                    that.canvasItem.strokeStyle = "#DD0033";
                    that.canvasItem.lineWidth = 3;
                    that.canvasItem.strokeRect(posj.x, posj.y, 128 * scale.x, 128 * scale.y);
                }
            }

        }

        if (sonicToon) {
            sonicToon.x -= windowLocation.x;
            sonicToon.y -= windowLocation.y;
            sonicToon.draw(that.canvasItem, scale);
            sonicToon.x += windowLocation.x;
            sonicToon.y += windowLocation.y;

            if (windowLocation.x < 0) windowLocation.x = 0;
            if (windowLocation.y < 0) windowLocation.y = 0;
        }

        that.canvasItem.restore();
        that.canvasItem.save();

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
        that.canvasItem.restore();

    };


    $(window).resize(this.resizeCanvas);
    this.resizeCanvas();
    window.setInterval(that.tick, 1000 / 60);
    requestAnimFrame(that.draw);
};


