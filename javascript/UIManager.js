function UIManager(sonicManager, mainCanvas, scale) {
    this.UIAreas = [];
    this.messages = [];

    var textFont = this.textFont = "18pt sans-serrif ";
    var buttonFont = this.buttonFont = "13pt Arial bold";
    mainCanvas.font = textFont;
    var indexes = this.indexes = {   tpIndex: 0, modifyIndex: 0, modifyTPIndex: 0 };

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




    var debuggerArea = this.debuggerArea = new UiArea(1347, 95, 200, 240, this, true);
    debuggerArea.visible = false;
    this.UIAreas.push(debuggerArea);
    debuggerArea.addControl(new TextArea(30, 25, "Debugger", textFont, "blue"));
    debuggerArea.addControl(new Button(40, 60, 60, 22, "Stop", buttonFont, "rgb(50,150,50)", function () {
        sonicManager.windowLocation = _H.defaultWindowLocation(1);
 
        debuggerArea.visible = false;
        solidTileArea.visible = false;
        levelInformation.visible = true;
        levelManagerArea.visible = true;
        sonicManager.sonicToon = null;
    }
    ));



    debuggerArea.addControl(new Button(40, 95, 90, 22, "Hit Sonic", buttonFont, "rgb(50,150,50)", function () {
        sonicManager.sonicToon.hit();
    }
    ));

    debuggerArea.addControl(new Button(40, 130, 160, 22, "Show Height Map", buttonFont, "rgb(50,150,50)", function () {
        if (this.text == "Show Height Map") {
            sonicManager.showHeightMap = true;
            this.text = "Hide Height Map";
        } else {
            sonicManager.showHeightMap = false;
            this.text = "Show Height Map";
        }
    }
    ));
    debuggerArea.addControl(new Button(40, 160, 160, 22, "Switch Height Map", buttonFont, "rgb(50,150,50)", function () {
        sonicManager.SonicLevel.curHeightMap = !sonicManager.SonicLevel.curHeightMap;
    }
    ));
    debuggerArea.addControl(new Button(40, 190, 160, 22, "Debug Sonic", buttonFont, "rgb(50,150,50)", function () {
        if (this.text == "Debug Sonic") {
            sonicManager.sonicToon.debugging = true;
            this.text = "Normal Sonic";
        } else {
            sonicManager.sonicToon.debugging = false;
            this.text = "Debug Sonic";
        }

    }
    ));


    var solidTileArea = this.solidTileArea = new UiArea(40, 450, 430, 400, this, true);
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
            this.sprites = [];
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
    var modifyTilePieceArea = this.modifyTilePieceArea = new TilePieceArea(30, 70, { x: 4 * 5, y: 4 * 5 }, null,0);
    solidTileArea.addControl(modifyTilePieceArea);


    var bgEditor = this.bgEditor = new UiArea(100, 440, 420, 360, this,true);
     bgEditor.visible = true;
     this.UIAreas.push(bgEditor);
     bgEditor.addControl(new TextArea(30, 25, "BG Editor", textFont, "blue"));
     bgEditor.addControl(new TileBGEditArea(60, 35, sonicManager.background));
 
    
    

    var levelInformation = this.levelInformation = new UiArea(500, 440, 420, 360, this);
    levelInformation.visible = true;
    this.UIAreas.push(levelInformation);
    levelInformation.addControl(new TextArea(30, 25, "Level Selector", textFont, "blue"));
    levelInformation.addControl(new TextArea(30, 52, function () {
        return !curLevelName ? "Level Not Saved" : ("Current Level: " + curLevelName);
    }, textFont, "black"));
    levelInformation.addControl(new Button(190, 70, 100, 22, "Save Level", buttonFont, "rgb(50,150,50)",
    function () {
        if (curLevelName) {
            OurSonic.SonicLevels.SaveLevelInformation(curLevelName, Base64.encode(_H.stringify(sonicManager.SonicLevel)), function (c) { }, function (c) { alert("Failure: " + _H.stringify(c)); });
        } else {
            OurSonic.SonicLevels.saveLevel(Base64.encode(_H.stringify(sonicManager.SonicLevel)), function (j) {
                addLevelToList(curLevelName);
            });

        }
    }));


    levelInformation.addControl(new Button(190, 105, 160, 22, "Load Empty Level", buttonFont, "rgb(50,150,50)",
    function () {

        levelManagerArea.visible = true;
        loadingText.visible = true;
        var index = 0;
        var tim = function () {
            var max = 188;
            if (index == max) {
                setTimeout(function () {
                    alert(_H.stringify(sonicManager.SonicLevel));
                    loadGame(_H.stringify(sonicManager.SonicLevel), mainCanvas);
                    loadingText.visible = false;
                }, 500);
                return;
            }
            setTimeout(tim, 100);

            _H.loadSprite("assets/TileChunks/Tile" + index++ + ".png", function (image) {
                loadingText.text = "Loading " + index + "/" + max;
                sonicManager.importChunkFromImage(image);
                if (index == max) {
                    sonicManager.inds = { done: true };
                }
            });

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
            curLevelName = "Downloading"; 
            OurSonic.SonicLevels.getLevel(name, function (lvl) {
                curLevelName = "loading"; 
                curLevelName = name; loadGame(lvl, mainCanvas);
            });
        }));
    }
     






    var levelManagerArea = this.levelManagerArea = new UiArea(500, 25, 400, 400, this);
    levelManagerArea.visible = false;
    this.UIAreas.push(levelManagerArea);
    levelManagerArea.addControl(new TextArea(30, 25, "Level Manager", textFont, "blue"));
    var loadingText;
    levelManagerArea.addControl(loadingText = new TextArea(270, 25, "Loading", textFont, "green"));
    loadingText.visible = false;

    levelManagerArea.addControl(new Button(35, 100, 160, 22, "Show Height Map", buttonFont, "rgb(50,150,50)", function () {
        if (this.text == "Show Height Map") {
            sonicManager.showHeightMap = true;
            this.text = "Hide Height Map";
        } else {
            sonicManager.showHeightMap = false;
            this.text = "Show Height Map";
        }
    }
    ));

    levelManagerArea.addControl(new Button(200, 150, 160, 22, "Place Chunks", buttonFont, "rgb(50,150,50)",
        function () {

            sonicManager.clickState = (sonicManager.clickState + 1) % 2;
            switch (sonicManager.clickState) {
                case ClickState.PlaceChunk:
                    this.text = "Place Chunks";
                    break;
                case ClickState.PlaceRing:
                    this.text = "Place Rings";
                    break;
            }

        }));

        levelManagerArea.addControl(new Button(200, 180, 160, 22, "Switch Height Map", buttonFont, "rgb(50,150,50)", function () {
            sonicManager.SonicLevel.curHeightMap = !sonicManager.SonicLevel.curHeightMap;
        }
    ));

    levelManagerArea.addControl(new Button(35, 150, 160, 22, "Modify Chunks", buttonFont, "rgb(50,150,50)",
        function () {
            modifyTileChunkArea.visible = true;

        }));

    levelManagerArea.addControl(new Button(35, 150, 160, 22, "Modify Chunks", buttonFont, "rgb(50,150,50)",
        function () {
            modifyTileChunkArea.visible = true;

        }));
    levelManagerArea.addControl(new Button(35, 175, 160, 22, "Modify Tile Pieces", buttonFont, "rgb(50,150,50)",
        function () {
            solidTileArea.visible = true;

        }));
    levelManagerArea.addControl(new Button(35, 200, 160, 22, "Modify Tiles", buttonFont, "rgb(50,150,50)",
        function () {
            modifyTileArea.visible = true;

        }));


        levelManagerArea.addControl(new Button(200, 35, 60, 22, "Run", buttonFont, "rgb(50,150,50)",
        function () {
            levelManagerArea.visible = false;
            solidTileArea.visible = false;
            levelInformation.visible = false;
            modifyTileArea.visible = false;
            modifyTileChunkArea.visible = false;
            solidTileArea.visible = false;
            debuggerArea.visible = true;
            sonicManager.background.cache(sonicManager.scale);
            sonicManager.windowLocation = _H.defaultWindowLocation(0);
            sonicManager.sonicToon = new Sonic(sonicManager.SonicLevel, sonicManager.scale);
        }));




    var modifyTileChunkArea = this.modifyTileChunkArea = new UiArea(900, 450, 400, 400, this, true);
    modifyTileChunkArea.visible = false;
    this.UIAreas.push(modifyTileChunkArea);
    modifyTileChunkArea.addControl(new TextArea(30, 25, "Modify Tile Chunk", textFont, "blue"));



    var modifyTC = this.modifyTC = new TileChunkArea(30, 70, { x: 2, y: 2 }, null, 1);

    modifyTileChunkArea.addControl(modifyTC);

    modifyTileChunkArea.addControl(new Button(50, 35, 25, 22, "<<", buttonFont, "rgb(50,150,50)",
        function () {
            if (indexes.modifyIndex > 0)
                modifyTC.tileChunk = sonicManager.SonicLevel.TileChunks[--indexes.modifyIndex];
        }));
    modifyTileChunkArea.addControl(new Button(80, 35, 25, 22, ">>", buttonFont, "rgb(50,150,50)",
        function () {
            if (indexes.modifyIndex < sonicManager.SonicLevel.TileChunks.length)
                modifyTC.tileChunk = sonicManager.SonicLevel.TileChunks[++indexes.modifyIndex];
        }));


    var modifyTP = this.modifyTP = new TilePieceArea(300, 160, { x: 2*3, y: 2*3 }, null,3);

    modifyTileChunkArea.addControl(modifyTP);

    modifyTileChunkArea.addControl(new Button(300, 100, 25, 22, "<<", buttonFont, "rgb(50,150,50)",
        function () {
            if (indexes.modifyTPIndex > 0)
                modifyTP.tilePiece = modifyTC.setToTile = sonicManager.SonicLevel.TilePieces[--indexes.modifyTPIndex];
        }));
    modifyTileChunkArea.addControl(new Button(330, 100, 25, 22, ">>", buttonFont, "rgb(50,150,50)",
        function () {
            if (indexes.modifyTPIndex < sonicManager.SonicLevel.TilePieces.length)
                modifyTP.tilePiece = modifyTC.setToTile = sonicManager.SonicLevel.TilePieces[++indexes.modifyTPIndex];
        }));






    var modifyTileArea = this.modifyTileArea = new UiArea(900, 25, 400, 400, this, true);
    modifyTileArea.visible = false;
    this.UIAreas.push(modifyTileArea);
    modifyTileArea.addControl(new TextArea(30, 25, "Modify Tile", textFont, "blue"));

    function loadGame(lvl, mainCanvas) {
        levelManagerArea.visible = true;
        sonicManager.loading = true;
        sonicManager.SonicLevel = jQuery.parseJSON(lvl);
         
        var fc;
        var j;
        if (!sonicManager.SonicLevel.TileChunks)
            sonicManager.SonicLevel.TileChunks = [];
        if (!sonicManager.SonicLevel.TilePieces)
            sonicManager.SonicLevel.TilePieces = [];
        if (!sonicManager.SonicLevel.TileData)
            sonicManager.SonicLevel.TileData = [];
        if (!sonicManager.SonicLevel.Rings)
            sonicManager.SonicLevel.Rings = {};


        sonicManager.SonicLevel.curHeightMap=true;

        var fd;
        var je;

        for (var i = 0; i < sonicManager.SonicLevel.heightIndexes.length; i++) {
            var m = [];
            if (sonicManager.SonicLevel.heightIndexes[i] == "0000000000000000") {
                sonicManager.SonicLevel.heightIndexes[i] = 0;
                continue;
            }
            if (sonicManager.SonicLevel.heightIndexes[i] == "gggggggggggggggg") {
                sonicManager.SonicLevel.heightIndexes[i] = 1;
                continue;
            }
            for (var k = 1; k < 17; k++) {
                m[k-1] = _H.parseNumber(sonicManager.SonicLevel.heightIndexes[i][k]);
            }

            var rot = parseInt(sonicManager.SonicLevel.heightIndexes[i][0]);
            switch (rot) {
                case 0:
                    rot = RotationMode.Floor; break;
                case 1:
                    rot = RotationMode.RightWall; break;
                case 2:
                    rot = RotationMode.Ceiling; break;
                case 3:
                    rot = RotationMode.LeftWall; break;
            default:
            }

            sonicManager.SonicLevel.heightIndexes[i] = new HeightMask(rot,0,m);
        }

        for (j = 0; j < sonicManager.SonicLevel.TileChunks.length; j++) {
            fc = sonicManager.SonicLevel.TileChunks[j];
            fc.__proto__ = TileChunk.prototype;
            fc.index = j; 
             
            for (je = 0; je < fc.angleMap1.length; je++) {
                for (jc = 0; jc < fc.angleMap1[je].length; jc++) {
                    fc.angleMap1[je][jc] = parseInt(fc.angleMap1[je][jc], 16);
                }
            }
            for (je = 0; je < fc.angleMap2.length; je++) {
                for (jc = 0; jc < fc.angleMap2[je].length; jc++) {
                    fc.angleMap2[je][jc] = parseInt(fc.angleMap2[je][jc], 16);
                }
            }


            for (je = 0; je < fc.heightMap1.length; je++) {
                for (jc = 0; jc < fc.heightMap1[je].length; jc++) {
                    fc.heightMap1[je][jc] = sonicManager.SonicLevel.heightIndexes[fc.heightMap1[je][jc]];
                }
            }

            for (je = 0; je < fc.heightMap2.length; je++) {
                for (jc = 0; jc < fc.heightMap2[je].length; jc++) {
                    fc.heightMap2[je][jc] = sonicManager.SonicLevel.heightIndexes[fc.heightMap2[je][jc]];
                }
            }
 
        }
        for (j = 0; j < sonicManager.SonicLevel.TilePieces.length; j++) {
            fc = sonicManager.SonicLevel.TilePieces[j];
            fc.__proto__ = TilePiece.prototype;
            fc.index = j;
        }
        for (j = 0; j < sonicManager.SonicLevel.TileData.length; j++) {
            fc = sonicManager.SonicLevel.TileData[j];
            fc.__proto__ = Tile.prototype;
            fc.index = j;
        }


        var finished = function () {

            inds.done = true;
            sonicManager.loading = false;
            modifyTC.tileChunk = sonicManager.SonicLevel.TileChunks[0];
            modifyTilePieceArea.tilePiece = modifyTP.tilePiece = sonicManager.SonicLevel.TilePieces[0];

        };

        var inds = sonicManager.inds = { r:0,t: 0, tp: 0, tc: 0, total: (sonicManager.SonicLevel.TileChunks.length * 2 + sonicManager.SonicLevel.TilePieces.length * 5 + sonicManager.SonicLevel.TileData.length), done: false };
        curLevelName = "preloading sprites";
        sonicManager.preLoadSprites(scale, function () {
            inds.r = 1;
            finished();
            curLevelName = "level loaded";
        }, function (str) {
            curLevelName = str;
        });
        /*
        var scal = scale;
        for (j = 0; j < sonicManager.SonicLevel.Tiles.length; j++) {
            fc = sonicManager.SonicLevel.Tiles[j];
            fc.cacheImage(mainCanvas, scal, function (j) {
                inds.t++;
                var done1 = function (c) {
                    inds.tp++;
                    if (inds.tp == sonicManager.SonicLevel.TilePieces.length * 5) {

                        var done2 = function (c2) {
                            inds.tc++;

                            finished();
                        };

                        for (j = 0; j < sonicManager.SonicLevel.TileChunks.length; j++) {
                            fc = sonicManager.SonicLevel.TileChunks[j];
                            fc.cacheImage(mainCanvas, scal, 1, done2);
                            fc.cacheImage(mainCanvas, scal, 2, done2);
                        }
                    }
                };
                if (inds.t == sonicManager.SonicLevel.Tiles.length) {
                    for (j = 0; j < sonicManager.SonicLevel.TilePieces.length; j++) {
                        fc = sonicManager.SonicLevel.TilePieces[j];
                        fc.cacheImage(mainCanvas, scal, 0, done1);
                        fc.cacheImage(mainCanvas, scal, 1, done1);
                        fc.cacheImage(mainCanvas, scal, 2, done1);
                        fc.cacheImage(mainCanvas, scal, 3, done1);
                        fc.cacheImage(mainCanvas, scal, 4, done1);
                    }
                }
            });
        }*/
        

    }

}

