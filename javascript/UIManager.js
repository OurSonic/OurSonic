function UIManager(sonicManager, mainCanvas) {
    this.UIAreas = [];
    this.messages = [];

    var textFont = this.textFont = "18pt sans-serrif ";
    var buttonFont=this.buttonFont = "13pt Arial bold";
    mainCanvas.font = textFont;

    this.draw = function (canvas) {
        canvas.save();

        var cl = JSLINQ(this.UIAreas).OrderBy(function (f) {
            return f.depth;
        });

        for (var ij = 0; ij < cl.items.length; ij++) {
            var are = cl.items[ij];
            are.draw(canvas);
        }

        if (DEBUGs) {
            for (var i = 0; i < this.messages.length; i++) {
                canvas.fillText(this.messages[i], 10, 25 + i * 30);
            }
        }
        canvas.restore();

    };

    this.onMouseScroll = function (evt) {
        var delta = evt.wheelDelta ? evt.wheelDelta / 40 : evt.detail ? -evt.detail : 0;


        for (var ij = 0; ij < this.UIAreas.length; ij++) {
            var are = this.UIAreas[ij];
            if (are.visible && are.y <= evt.y && are.y + are.height > evt.y && are.x <= evt.x && are.x + are.width > evt.x) {
                evt = {
                    x: evt.x - are.x,
                    y: evt.y - are.y,
                    delta: delta
                };
                return are.scroll(evt);
            }
        }
        return false;
    };
    this.onClick = function (e) {
        var cell = _H.getCursorPosition(e);
        var goodArea = null;
        var are;
        var ij;
        for (ij = 0; ij < this.UIAreas.length; ij++) {
            are = this.UIAreas[ij];
            if (are.visible && are.y <= cell.y && are.y + are.height > cell.y && are.x <= cell.x && are.x + are.width > cell.x) {
                goodArea = are;
                var ec = { x: cell.x - are.x, y: cell.y - are.y };
                are.click(ec);
            }
        }

        if (goodArea) {
            for (ij = 0; ij < this.UIAreas.length; ij++) {
                are = this.UIAreas[ij];
                if (goodArea == are) {
                    are.depth = 1;
                } else are.depth = 0;
            }

            return true;
        }
        return false;
    };

    this.onMouseMove = function (e) {

        var cell = _H.getCursorPosition(e);
        var cl = JSLINQ(this.UIAreas).OrderBy(function (f) {
            return -f.depth;
        });

        for (var ij = 0; ij < cl.items.length; ij++) {
            var are = cl.items[ij];
            if (are.dragging || (are.visible && are.y <= cell.y &&
                are.y + are.height > cell.y &&
                    are.x <= cell.x &&
                        are.x + are.width > cell.x)) {
                cell = { x: cell.x - are.x, y: cell.y - are.y };
                return are.mouseMove(cell);

            }
        }
        return false;

    };
    this.onMouseUp = function (e) {
        var cell = _H.getCursorPosition(e, true);
        for (var ij = 0; ij < this.UIAreas.length; ij++) {
            var are = this.UIAreas[ij];
            var ec = { x: cell.x - are.x, y: cell.y - are.y };
            are.mouseUp(ec);
        }
    };


    


    var debuggerArea = this.debuggerArea = new UiArea(1300, 40, 200, 170,this, true);
    debuggerArea.visible = false;
    this.UIAreas.push(debuggerArea);
    debuggerArea.addControl(new TextArea(30, 25, "Debugger", textFont, "blue"));
    debuggerArea.addControl(new Button(95, 60, 60, 22, "Stop", buttonFont, "rgb(50,150,50)", function () {

        sonicManager.windowLocation.x = 0;
        sonicManager.windowLocation.y = 0;
        debuggerArea.visible = false;
        tileChunkArea.visible = true;
        solidTileArea.visible = false;
        levelInformation.visible = true;
        sonicManager.sonicToon = null;
    }
    ));

    var indexes = this.indexes = { tcIndex: 0, tpIndex: 0 };
    

    var solidTileArea = this.solidTileArea = new UiArea(40, 40, 430, 400,this, true);
    solidTileArea.visible = false;
    this.UIAreas.push(solidTileArea);
    solidTileArea.addControl(new TextArea(30, 25, "Modify Solid Tile", textFont, "blue"));
    


    solidTileArea.addControl(new Button(50, 35, 25, 22, "<<", buttonFont, "rgb(50,150,50)",
        function () {
            if (indexes.tpIndex > 0)
                modifyTilePieceArea.tilePiece = sonicManager.SonicLevel.TilePieces[--indexes.tpIndex];
        }));

    solidTileArea.addControl(new Button(75, 35, 25, 22, ">>", buttonFont, "rgb(50,150,50)",
        function () {
            if (indexes.tpIndex < sonicManager.SonicLevel.TilePieces.length)
                modifyTilePieceArea.tilePiece = sonicManager.SonicLevel.TilePieces[++indexes.tpIndex];
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
    var modifyTilePieceArea = this.modifyTilePieceArea = new TilePieceArea(30, 70, { x: 4 * 5, y: 4 * 5 }, null);
    solidTileArea.addControl(modifyTilePieceArea);


    var levelInformation = this.levelInformation = new UiArea(900, 70, 420, 360,this);
    levelInformation.visible = true;
    this.UIAreas.push(levelInformation);
    levelInformation.addControl(new TextArea(30, 25, "Level Manager", textFont, "blue"));
    levelInformation.addControl(new TextArea(30, 52, function () {
        return !curLevelName ? "Level Not Saved" : ("Current Level: " + curLevelName);
    }, textFont, "black"));
    levelInformation.addControl(new Button(190, 70, 100, 22, "Save Level", buttonFont, "rgb(50,150,50)",
    function () {
        if (curLevelName) {
            OurSonic.SonicLevels.SaveLevelInformation(curLevelName, _H.stringify(sonicManager.SonicLevel), function (c) { }, function (c) { alert("Failure: " + _H.stringify(c)); });
        } else {
            OurSonic.SonicLevels.saveLevel((_H.stringify(sonicManager.SonicLevel)), function (j) {
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
            var max = 86;
            if (index == max) {
                setTimeout(function () {
                    modifyTileChunkArea.tileChunk = sonicManager.SonicLevel.TileChunks[0];
                    loadingText.visible = false;
                }, 500);
                return;
            }
            setTimeout(tim, 100);

            var image = new Image();
            image.onload = function () {
                loadingText.text = "Loading " + index + "/" + max;
                sonicManager.importChunkFromImage(image);
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
        var btn;
        ctls.addControl(btn = new Button(0, 0, 0, 0, name, "10pt Arial", "rgb(50,190,90)", function () {
            curLevelName = name;
            OurSonic.SonicLevels.openLevel(name, function (lvl) {
                tileChunkArea.visible = true;

                sonicManager.SonicLevel = jQuery.parseJSON((lvl));
                var fc;
                var j;
                for (j = 0; j < sonicManager.SonicLevel.TileChunks.length; j++) {
                    fc = sonicManager.SonicLevel.TileChunks[j];

                    fc.__proto__ = TileChunk.prototype;
                }
                for (j = 0; j < sonicManager.SonicLevel.TilePieces.length; j++) {
                    fc = sonicManager.SonicLevel.TilePieces[j];
                    fc.__proto__ = TilePiece.prototype;
                    fc.heightMask.__proto__ = HeightMask.prototype;
                }
                for (j = 0; j < sonicManager.SonicLevel.Tiles.length; j++) {
                    fc = sonicManager.SonicLevel.Tiles[j];
                    fc.__proto__ = Tile.prototype;
                    for (var d = 0; d < fc.colors.length; d++) {
                        fc.colors[d].__proto__ = Color.prototype;
                    }
                }

                modifyTileChunkArea.tileChunk = sonicManager.SonicLevel.TileChunks[0];
            });
        }));
    }

    var tileChunkArea = this.tileChunkArea = new UiArea(490, 40, 400, 400,this);
    tileChunkArea.visible = false;
    this.UIAreas.push(tileChunkArea);
    tileChunkArea.addControl(new TextArea(30, 25, "Modify Tile Chunks", textFont, "blue"));
    var loadingText;
    tileChunkArea.addControl(loadingText = new TextArea(270, 25, "Loading", textFont, "green"));
    loadingText.visible = false;

    tileChunkArea.addControl(new Button(200, 35, 60, 22, "Run", buttonFont, "rgb(50,150,50)",
        function () {
            tileChunkArea.visible = false;
            solidTileArea.visible = false;
            levelInformation.visible = false;
            debuggerArea.visible = true;
            sonicManager.loading = true;
            sonicManager.sonicToon = new Sonic(sonicManager.SonicLevel, sonicManager.scale);
        }));


    tileChunkArea.addControl(new Button(50, 35, 25, 22, "<<", buttonFont, "rgb(50,150,50)",
        function () {
            if (indexes.tcIndex > 0)
                modifyTileChunkArea.tileChunk = sonicManager.SonicLevel.TileChunks[--indexes.tcIndex];
        }));
    tileChunkArea.addControl(new Button(80, 35, 25, 22, ">>", buttonFont, "rgb(50,150,50)",
        function () {
            if (indexes.tcIndex < sonicManager.SonicLevel.TileChunks.length)
                modifyTileChunkArea.tileChunk = sonicManager.SonicLevel.TileChunks[++indexes.tcIndex];
        }));

    var modifyTileChunkArea = this.modifyTileChunkArea = new TileChunkArea(30, 70, { x: 2, y: 2 }, null);
    tileChunkArea.addControl(modifyTileChunkArea);




}