function UIManager(sonicManager, mainCanvas, scale) {
    this.UIAreas = [];
    this.messages = [];
    sonicManager.uiManager = this;


    this.runSonic = function () {
        sonicManager.uiManager.levelManagerArea.visible = false;
        sonicManager.uiManager.solidTileArea.visible = false;
        sonicManager.uiManager.levelInformation.visible = false;
        sonicManager.uiManager.modifyTileArea.visible = false;
        sonicManager.uiManager.modifyTileChunkArea.visible = false;
        sonicManager.uiManager.solidTileArea.visible = false;
        sonicManager.uiManager.debuggerArea.visible = true;
        if (sonicManager.background)
            sonicManager.background.cache(sonicManager.scale);
        sonicManager.windowLocation = _H.defaultWindowLocation(0, mainCanvas, scale);
        sonicManager.sonicToon = new Sonic(sonicManager.SonicLevel, sonicManager.scale);
        sonicManager.sonicToon.obtainedRing = [];

        window.Engine.resizeCanvas();
    };

    var textFont = this.textFont = "18pt Calibri ";
    this.smallTextFont = "12pt Calibri ";
    this.buttonFont = "13pt Arial bold";
    this.smallButtonFont = "11pt Arial bold";
    mainCanvas.font = textFont;
    this.indexes = { tpIndex: 0, modifyIndex: 0, modifyTPIndex: 0 };
    this.dragger = new Dragger(function (xsp, ysp) {
        sonicManager.windowLocation.x += xsp;
        sonicManager.windowLocation.y += ysp;
    });
    this.draw = function (canvas) {
        this.dragger.tick();

        _H.save(canvas);

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
        _H.restore(canvas);

    };

    this.onMouseScroll = function (evt) {
        var delta = evt.wheelDelta ? evt.wheelDelta / 40 : evt.detail ? -evt.detail : 0;


        for (var ij = 0; ij < this.UIAreas.length; ij++) {
            var are = this.UIAreas[ij];
            if (are.visible && are.y <= evt.y && are.y + are.height > evt.y && are.x <= evt.x && are.x + are.width > evt.x) {
                evt = {
                    x: evt.x - are.x - 10,
                    y: evt.y - are.y - 10,
                    delta: delta
                };
                return are.scroll(evt);
            }
        }
        return false;
    };
    this.onClick = function (e) {
        var cell = _H.getCursorPosition(e);
        cell.x -= 10;
        cell.y -= 10;
        var goodArea = null;
        var are;
        var ij;
        var cl = JSLINQ(this.UIAreas).OrderBy(function (f) {
            return -f.depth;
        });
        for (var ij = 0; ij < cl.items.length; ij++) {
            are = cl.items[ij];
            if (are.visible && are.y <= cell.y && are.y + are.height > cell.y && are.x <= cell.x && are.x + are.width > cell.x) {
                goodArea = are;
                var ec = { x: cell.x - are.x, y: cell.y - are.y };
                are.click(ec);
                break;
            }
        }

        if (goodArea) {
            for (ij = 0; ij < this.UIAreas.length; ij++) {
                are = this.UIAreas[ij];
                if (goodArea == are) {
                    are.depth = 1;
                    are.focus();
                } else {
                    if (are.visible) {
                        are.depth = 0;
                        are.loseFocus();
                    }
                }
            }

            return true;
        } else {
            for (ij = 0; ij < this.UIAreas.length; ij++) {
                are = this.UIAreas[ij];
                if (are.visible) {
                    are.depth = 0;
                    are.loseFocus();
                }
            }

        }
        return false;
    };

    this.onMouseMove = function (e) {
        if (this.dragger.isDragging()) {
            this.dragger.mouseMove(e);
            return false;
        }
        var cell = _H.getCursorPosition(e);
        cell.x -= 10;
        cell.y -= 10;

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
        this.dragger.mouseMove(e);
        return false;

    };
    this.onMouseUp = function (e) {
        var cell = _H.getCursorPosition(e, true);
        cell.x -= 10;
        cell.y -= 10;

        for (var ij = 0; ij < this.UIAreas.length; ij++) {
            var are = this.UIAreas[ij];
            var ec = { x: cell.x - are.x, y: cell.y - are.y };
            are.mouseUp(ec);
        }
        this.dragger.mouseUp(e);
    };
    this.onKeyDown = function (e) {

        for (var ij = 0; ij < this.UIAreas.length; ij++) {
            var are = this.UIAreas[ij];
            are.onKeyDown(e);
        }
    };



    this.updateTitle = function (str) {
        document.title = str + " | Our Sonic";
        sonicManager.uiManager.curLevelName = str;
    };


    this.loadGame = function (lvl, mainCanvas) {
        sonicManager.loading = true;
        sonicManager.uiManager.updateTitle("Decoding");
        sonicManager.SonicLevel = jQuery.parseJSON(_H.decodeString(lvl));
        sonicManager.uiManager.updateTitle("Determining Level Information");
        var fc;
        var j;
        if (!sonicManager.SonicLevel.Chunks)
            sonicManager.SonicLevel.Chunks = [];
        if (!sonicManager.SonicLevel.Blocks)
            sonicManager.SonicLevel.Blocks = [];
        if (!sonicManager.SonicLevel.Tiles)
            sonicManager.SonicLevel.Tiles = [];
        if (!sonicManager.SonicLevel.Rings)
            sonicManager.SonicLevel.Rings = [];


        sonicManager.SonicLevel.LevelWidth = sonicManager.SonicLevel.ForegroundWidth;
        sonicManager.SonicLevel.LevelHeight = sonicManager.SonicLevel.ForegroundHeight;


        var q, r, l, o;
        var mf = decodeNumeric(sonicManager.SonicLevel.Foreground);
        sonicManager.SonicLevel.ChunkMap = [];
        for (q = 0; q < sonicManager.SonicLevel.ForegroundWidth; q++) {
            sonicManager.SonicLevel.ChunkMap[q] = [];
            for (r = 0; r < sonicManager.SonicLevel.ForegroundHeight; r++) {
                sonicManager.SonicLevel.ChunkMap[q][r] = mf[q + r * sonicManager.SonicLevel.ForegroundWidth];
            }
        }
        var mf = decodeNumeric(sonicManager.SonicLevel.Background);
        sonicManager.SonicLevel.BGChunkMap = [];
        for (q = 0; q < sonicManager.SonicLevel.BackgroundWidth; q++) {
            sonicManager.SonicLevel.BGChunkMap[q] = [];
            for (r = 0; r < sonicManager.SonicLevel.BackgroundHeight; r++) {
                sonicManager.SonicLevel.BGChunkMap[q][r] = mf[q + r * sonicManager.SonicLevel.BackgroundWidth];
            }
        } /*
        for (l = 0; l < sonicManager.SonicLevel.Objects.length; l++) {
            o = sonicManager.SonicLevel.Objects[l];
            _H.ObjectParse(o, (function (r) {
                return function (rq) {
                    sonicManager.SonicLevel.Objects[r] = rq;
                };
            })(l));
        }*/
        for (l = 0; l < sonicManager.SonicLevel.Objects.length; l++) {
            sonicManager.SonicLevel.Objects[l] = new LevelObjectInfo(sonicManager.SonicLevel.Objects[l]);
        }



        var objectKeys = [];
        for (l = 0; l < sonicManager.SonicLevel.Objects.length; l++) {
            o = sonicManager.SonicLevel.Objects[l].key;

            if (JSLINQ(objectKeys).Count(function (p) { return p == o; }) == 0) {
                objectKeys.push(o);
            }
        }



        OurSonic.SonicLevels.getObjects(objectKeys, function (objects) {
            window.CachedObjects = [];
            for (l = 0; l < sonicManager.SonicLevel.Objects.length; l++) {
                o = sonicManager.SonicLevel.Objects[l].key;
                if (window.CachedObjects[o]) {
                    sonicManager.SonicLevel.Objects[l].ObjectData = window.CachedObjects[o];
                    continue;
                }
                var d = JSLINQ(objects).First(function (p) { return p.key == o; });
                if (!d) {
                    sonicManager.SonicLevel.Objects[l].ObjectData = new LevelObject(o);
                    continue;
                }

                var dr = _H.extend(new LevelObject(""), jQuery.parseJSON(d.value));

                dr = sonicManager.objectManager.extendObject(dr);
                window.CachedObjects[o] = dr;
                sonicManager.SonicLevel.Objects[l].ObjectData = dr;
            }

        });



        /*
        var jm = [];
        jm[0] = [];
        jm[1] = [];
        jm[2] = [];
        jm[3] = [];
        for (var qc = 0; qc < sonicManager.SonicLevel.Palette.length;qc++ ) {
        jm[_H.floor(qc / 16)][qc % 16] = sonicManager.SonicLevel.Palette[qc];
        }
        sonicManager.SonicLevel.Palette=jm;*/

        var value, td;
        sonicManager.SonicLevel.curPaletteIndex = 0;
        sonicManager.SonicLevel.palAn = [];
        sonicManager.SonicLevel.curHeightMap = true;
        for (j = 0; j < sonicManager.SonicLevel.Tiles.length; j++) {
            fc = sonicManager.SonicLevel.Tiles[j];
            sonicManager.SonicLevel.Tiles[j] = decodeNumeric(fc);

            mj = [];
            for (l = 0; l < sonicManager.SonicLevel.Tiles[j].length; l++) {
                value = sonicManager.SonicLevel.Tiles[j][l];
                mj.push(value >> 4);
                mj.push(value & 0xF);
            }
            sonicManager.SonicLevel.Tiles[j] = { colors: mj };
            td = sonicManager.SonicLevel.Tiles[j];
            mf = [];
            for (o = 0; o < 8; o++) {
                mf[o] = [];
            }
            for (n = 0; n < td.colors.length; n++) {
                mf[n % 8][_H.floor(n / 8)] = td.colors[n];
            }
            td.colors = mf;
            td.index = j;
            sonicManager.SonicLevel.Tiles[j] = _H.extend(new Tile(), td);
        }


        var acs = sonicManager.SonicLevel.AnimatedChunks = [];
        if (sonicManager.SonicLevel.AnimatedFiles) {
            for (jc = 0; jc < sonicManager.SonicLevel.AnimatedFiles.length; jc++) {
                var fcc = sonicManager.SonicLevel.AnimatedFiles[jc];
                for (j = 0; j < fcc.length; j++) {
                    fc = fcc[j];
                    fcc[j] = decodeNumeric(fc);

                    mj = [];
                    for (l = 0; l < fcc[j].length; l++) {
                        value = fcc[j][l];
                        mj.push(value >> 4);
                        mj.push(value & 0xF);
                    }
                    fcc[j] = { colors: mj };
                    td = fcc[j];
                    mf = [];
                    for (o = 0; o < 8; o++) {
                        mf[o] = [];
                    }
                    for (n = 0; n < td.colors.length; n++) {
                        mf[n % 8][_H.floor(n / 8)] = td.colors[n];
                    }
                    td.colors = mf;
                    td.index = "A" + j + "_" + jc;
                    fcc[j] = _H.extend(new Tile(), td);

                }
            }
        }


        for (j = 0; j < sonicManager.SonicLevel.Blocks.length; j++) {
            fc = sonicManager.SonicLevel.Blocks[j];
            mj = new TilePiece();
            mj.index = j;
            mj.tiles = [];
            for (p = 0; p < fc.length; p++) {
                mj.tiles.push(fc[p]);

            }
            sonicManager.SonicLevel.Blocks[j] = mj;
        }


        var m;

        sonicManager.SonicLevel.Angles = decodeNumeric(sonicManager.SonicLevel.Angles);
        sonicManager.SonicLevel.CollisionIndexes1 = decodeNumeric(sonicManager.SonicLevel.CollisionIndexes1);
        sonicManager.SonicLevel.CollisionIndexes2 = decodeNumeric(sonicManager.SonicLevel.CollisionIndexes2);

        for (i = 0; i < sonicManager.SonicLevel.HeightMaps.length; i++) {

            var b1 = true;
            var b2 = true;
            for (m = 0; m < sonicManager.SonicLevel.HeightMaps[i].length; m++) {
                if (b1 && sonicManager.SonicLevel.HeightMaps[i][m] != 0) {
                    b1 = false;
                }
                if (b2 && sonicManager.SonicLevel.HeightMaps[i][m] != 16) {
                    b2 = false;
                }
            }

            if (b1) {
                sonicManager.SonicLevel.HeightMaps[i] = 0;
            } else if (b2) {
                sonicManager.SonicLevel.HeightMaps[i] = 1;
            } else
                sonicManager.SonicLevel.HeightMaps[i] = new HeightMask(sonicManager.SonicLevel.HeightMaps[i]);
        }

        var jc;
        for (j = 0; j < sonicManager.SonicLevel.Chunks.length; j++) {
            fc = sonicManager.SonicLevel.Chunks[j];

            var mj = new TileChunk();
            mj.index = j;
            mj.tilePieces = [];
            for (var i = 0; i < 8; i++) {
                mj.tilePieces[i] = [];
            }
            for (var p = 0; p < fc.length; p++) {
                mj.tilePieces[p % 8][_H.floor(p / 8)] = (fc[p]);

            }
            sonicManager.SonicLevel.Chunks[j] = mj;
            mj.animated = [];
            for (var ic = 0; ic < mj.tilePieces.length; ic++) {
                for (var jc = 0; jc < mj.tilePieces[ic].length; jc++) {
                    var r = mj.tilePieces[ic][jc];
                    var pm = sonicManager.SonicLevel.Blocks[r.Block];
                    if (pm) {
                        for (var ci = 0; ci < pm.tiles.length; ci++) {
                            var mjc = pm.tiles[ci];
                            if (sonicManager.SonicLevel.Tiles[mjc.Tile]) {
                                var fa = sonicManager.containsAnimatedTile(mjc.Tile);
                                if (fa != undefined) {
                                    mj.animated[jc * 8 + ic] = fa;
                                    acs[j] = (mj);
                                }
                            }
                        }
                    }

                }
            }



            /*for (je = 0; je < fc.angleMap1.length; je++) {
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
            fc.heightMap1[je][jc] = sonicManager.SonicLevel.HeightMaps[fc.heightMap1[je][jc]];
            }
            }

            for (je = 0; je < fc.heightMap2.length; je++) {
            for (jc = 0; jc < fc.heightMap2[je].length; jc++) {
            fc.heightMap2[je][jc] = sonicManager.SonicLevel.HeightMaps[fc.heightMap2[je][jc]];
            }
            }*/

        }

        if (sonicManager.SonicLevel.PaletteItems[0]) {
            for (var k = 0; k < sonicManager.SonicLevel.PaletteItems[0].length; k++) {
                var pal = sonicManager.SonicLevel.PaletteItems[0][k];
                pal.Palette = eval(pal.Palette);
                
                //below this is bad
                if (pal.TotalLength == 0)
                    pal.TotalLength = pal.Palette.length;
                if (pal.SkipIndex == 0)
                    pal.SkipIndex = Math.floor(pal.Palette.length / 8);
                //^
            }
        }
        for (var kd = 0; kd < sonicManager.SonicLevel.Blocks.length; kd++) {
            var dj = sonicManager.SonicLevel.Blocks[kd];
            dj.animatedFrames = [];

            for (var i = 0; i < dj.tiles.length; i++) {
                var mj = dj.tiles[i];
                if (sonicManager.SonicLevel.Tiles[mj.Tile]) {

                    var pl = JSLINQ(sonicManager.SonicLevel.Tiles[mj.Tile].getAllPaletteIndexes());


                    if (sonicManager.SonicLevel.PaletteItems[0]) {
                        for (var k = 0; k < sonicManager.SonicLevel.PaletteItems[0].length; k++) {
                            var pal = sonicManager.SonicLevel.PaletteItems[0][k];


                            for (var m = 0; m < pal.Pieces.length; m++) {
                                var mje = pal.Pieces[m];

                                if (mj.Palette == mje.PaletteIndex) {
                                    if (pl.Any(function (J) {
                                        return J == mje.PaletteOffset / 2 || J == mje.PaletteOffset / 2 + 1;
                                    })) {
                                        dj.animatedFrames.push(k);
                                    }
                                }
                            }

                        }

                    }
                }

            }
        }


        var finished = function () {
            sonicManager.uiManager.levelManagerArea.visible = true;
            sonicManager.loading = false;
            sonicManager.uiManager.modifyTC.tileChunk = sonicManager.SonicLevel.Chunks[0];
            sonicManager.uiManager.modifyTilePieceArea.tilePiece = sonicManager.uiManager.modifyTP.tilePiece = sonicManager.SonicLevel.Blocks[0];

        };

        //        var inds = sonicManager.inds = { r:0,t: 0, tp: 0, tc: 0, total: (sonicManager.SonicLevel.Chunks.length * 2 + sonicManager.SonicLevel.Blocks.length * 5 + sonicManager.SonicLevel.Tiles.length), done: false };

        sonicManager.CACHING = true;
        sonicManager.preLoadSprites(scale, function () {
            //          inds.r = 1;
            sonicManager.CACHING = false;
            finished();

            sonicManager.uiManager.updateTitle("Level Loaded");
            sonicManager.forceResize();


            var dl = _H.getQueryString();
            if (dl["run"]) {
                setTimeout(sonicManager.uiManager.runSonic, 1000);
            }

        }, sonicManager.uiManager.updateTitle);


        /*
        var scal = scale;
        for (j = 0; j < sonicManager.SonicLevel.Tiles.length; j++) {
        fc = sonicManager.SonicLevel.Tiles[j];
        fc.cacheImage(mainCanvas, scal, function (j) {
        inds.t++;
        var done1 = function (c) {
        inds.tp++;
        if (inds.tp == sonicManager.SonicLevel.Blocks.length * 5) {

        var done2 = function (c2) {
        inds.tc++;

        finished();
        };

        for (j = 0; j < sonicManager.SonicLevel.Chunks.length; j++) {
        fc = sonicManager.SonicLevel.Chunks[j];
        fc.cacheImage(mainCanvas, scal, 1, done2);
        fc.cacheImage(mainCanvas, scal, 2, done2);
        }
        }
        };
        if (inds.t == sonicManager.SonicLevel.Tiles.length) {
        for (j = 0; j < sonicManager.SonicLevel.Blocks.length; j++) {
        fc = sonicManager.SonicLevel.Blocks[j];
        fc.cacheImage(mainCanvas, scal, 0, done1);
        fc.cacheImage(mainCanvas, scal, 1, done1);
        fc.cacheImage(mainCanvas, scal, 2, done1);
        fc.cacheImage(mainCanvas, scal, 3, done1);
        fc.cacheImage(mainCanvas, scal, 4, done1);
        }
        }
        });
        }*/


    };


    window.BGEditorArea();
    window.ColorEditorArea();
    window.DebuggerArea();
    window.SolidTileArea();
    window.LevelInformationArea();
    window.LevelManagerArea();
    window.ModifyTileArea();
    window.ModifyTilePieceArea();
    window.ModifyTileChunkArea();
    window._TileChunkArea();
    window._TilePieceArea();
    window.ObjectFrameworkArea();
    window.ObjectFrameworkListArea();
    window.ObjectInfoArea();

}




function Dragger(onFling) {
    this.lastPos = null;
    this.xsp = 0;
    this.ysp = 0;
    this.lag = 0.925;
    this.click = function (e) {
        this.lastPos = { x: e.x, y: e.y };

    };
    this.isDragging = function (e) {
        return this.lastPos;
    };
    this.mouseUp = function (e) {
        this.lastPos = null;
    };
    this.mouseMove = function (e) {
        if (!this.lastPos) {
            return;
        }

        this.xsp += (this.lastPos.x - e.x) * 2.7;
        this.ysp += (this.lastPos.y - e.y) * 2.7;
        this.xsp = (this.xsp > 0 ? 1 : -1) * Math.min(Math.abs(this.xsp), 60);
        this.ysp = (this.ysp > 0 ? 1 : -1) * Math.min(Math.abs(this.ysp), 60);
        this.lastPos = { x: e.x, y: e.y };
    };
    this.tick = function () {

        onFling(this.xsp, this.ysp);
        if (this.xsp > 0)
            this.xsp *= this.lag;
        else
            this.xsp *= this.lag;

        if (this.ysp > 0)
            this.ysp *= this.lag;
        else
            this.ysp *= this.lag;

        if (Math.abs(this.xsp) <= 2)
            this.xsp = 0;
        if (Math.abs(this.ysp) <= 2)
            this.ysp = 0;

    };
}