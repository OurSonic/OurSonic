

function SonicManager(mainCanvas, resize) {
    Engine.canvasWidth = $(window).width();
    Engine.canvasHeight = $(window).height();
    var $sonicSprites;
    $.getJSON('Content/sprites/sonic.js', function (data) {
        $sonicSprites = data;
    });
    this.objectManager = new ObjectManager(this);
    this.objectManager.init();



    var scl = 2;
    var scale = this.scale = { x: scl, y: scl };
    this.realScale = { x: 1, y: 1 };

    window.sonicManager = this;
    this.mainCanvas = mainCanvas;

    this.windowLocation = _H.defaultWindowLocation(1, mainCanvas, scale);


    this.showHeightMap = false;
    this.goodRing = new Ring(false);
    this.activeRings = [];
    this.forceResize = resize;

    this.background = null;
    this.screenOffset = { x: mainCanvas.canvas.width / 2 - this.windowLocation.width * scale.x / 2, y: mainCanvas.canvas.height / 2 - this.windowLocation.height * scale.y / 2 };


    this.uiManager = new UIManager(this, mainCanvas, this.scale);
    //this.uiManager.objectFrameworkArea.populate(new LevelObject("Somekey"));


    this.clickState = ClickState.Dragging;
    this.tickCount = 0;
    this.drawTickCount = 0;
    this.inHaltMode = false;
    this.waitingForTickContinue = false;
    this.waitingForDrawContinue = false;

    this.SonicLevel = {
        Tiles: [],
        Blocks: [],
        Chunks: [],
        ChunkMap: [[]],
        Rings: {},
        curHeightMap: true, LevelWidth: 0, LevelHeight: 0, curPaletteIndex: 0
    };

    this.containsAnimatedTile = function (index) {
        for (var i = 0; i < sonicManager.SonicLevel.Animations.length; i++) {
            var an = sonicManager.SonicLevel.Animations[i];
            var anin = an.AnimationTileIndex;
            var num = an.NumberOfTiles;
            if (index >= anin && index < anin + num) {
                return an;
            }
        }
        return undefined;
    };



    this.onClick = function (e) {
        e = { x: e.x / scale.x + this.windowLocation.x, y: e.y / scale.y + this.windowLocation.y };

        if (!e.button || e.button == 0) {
            switch (this.clickState) {
                case ClickState.Dragging:
                    return false;
                    break;
                case ClickState.PlaceChunk:
                    var ex, ey;
                    ex = _H.floor(e.x / (128));
                    ey = _H.floor(e.y / (128));
                    var ch = this.SonicLevel.Chunks[this.SonicLevel.ChunkMap[ex][ey]];

                    var tp = ch.getBlock((e.x - ex * (128)), (e.y - ey * (128)));
                    if (tp) {
                        var tpc = ch.getTilePiece((e.x - ex * (128)), (e.y - ey * (128)));
                        this.uiManager.indexes.tpIndex = this.SonicLevel.Blocks.indexOf(tp);
                        this.uiManager.modifyTilePieceArea.tilePiece = tp;
                        this.uiManager.solidTileArea.visible = true;
                        this.uiManager.modifyTilePieceArea.tpc = tpc;
                    }
                    return true;
                    break;
                case ClickState.PlaceRing:
                    var ex = _H.floor((e.x));
                    var ey = _H.floor((e.y));
                    this.SonicLevel.Rings.push({ X: ex, Y: ey });
                    return true;
                    break;
                case ClickState.PlaceObject:
                    var ex = _H.floor((e.x));
                    var ey = _H.floor((e.y));

                    for (var l = 0; l < sonicManager.SonicLevel.Objects.length; l++) {
                        var o = sonicManager.SonicLevel.Objects[l];

                        if (_H.intersects2(o.getRect(), { X: ex, Y: ey })) {
                            alert("Object Data: " + _H.stringify(o));
                        }
                    }

                    return true;

                    break;
                default:
            }
        }

        return false;


    };

    this.tickObjects = function () {


        for (var l = 0; l < sonicManager.SonicLevel.Objects.length; l++) {

            var obj = sonicManager.SonicLevel.Objects[l];

            if (this.windowLocation.intersects({ x: obj.x, y: obj.y })) {

                obj.ObjectData.tick(obj, sonicManager.SonicLevel, sonicManager.sonicToon);
            }
        }

    };

    var that = this; //internetexplorer doesnt take a this param in setinterval
    this.tick = function () {
        if (that.loading) return;
        if (that.sonicToon) {

            if (that.inHaltMode) {
                if (that.waitingForTickContinue) {
                    return;
                }
            }
            that.tickCount++;

            that.tickObjects();


            that.sonicToon.ticking = true;
            try {
                that.sonicToon.tick(that.SonicLevel, scale);
            }
            catch (exc) {
                var txt = "There was an error on this page.\n\n";
                txt += "Error description: " + exc.message + "\n\n";
                txt += "Stack: " + exc.stack + "\n\n";
                txt += "Click OK to continue.\n\n";

                alert(txt);
                throw exc;
            }
            finally {
                that.sonicToon.ticking = false;
            }

            if (that.inHaltMode) {
                if (that.waitingForTickContinue) {
                    return;
                } else {
                    that.waitingForTickContinue = true;
                    that.waitingForDrawContinue = false;
                }
            }

            if (that.sonicToon.x > 128 * sonicManager.SonicLevel.LevelWidth) {
                that.sonicToon.x = 0;
            }
        }
    };
    this.draw = function (canvas) {


        if (this.inHaltMode) {
            canvas.fillStyle = "white";
            canvas.font = "21pt arial bold";
            canvas.fillText("HALT MODE\r\n Press: P to step\r\n        O to resume", 10, 120);

            if (this.waitingForDrawContinue) {
                return;
            } else {
                this.waitingForDrawContinue = true;
            }
        }


        _H.save(canvas);

        this.drawTickCount++;
        if ((this.spriteLoader && !this.spriteLoader.tick()) || this.loading) {
            canvas.fillStyle = "white";
            canvas.fillText("Loading...   " /*+ (this.inds.tc + this.inds.tp + this.inds.t) + " / " + (this.inds.total)*/, 95, 95);
            _H.restore(canvas);
            return;
        }
        this.screenOffset = { x: 0, y: 0 };


        if (this.sonicToon) {
            canvas.scale(this.realScale.x, this.realScale.y);

            if (this.sonicToon.ticking) {
                while (true) {
                    if (!this.sonicToon.ticking) break;
                }
            }
            canvas.translate(this.screenOffset.x, this.screenOffset.y);

            canvas.fillStyle = "#000000";
            canvas.fillRect(0, 0, this.windowLocation.width * scale.x, this.windowLocation.height * scale.x);


            this.windowLocation.x = _H.floor(this.sonicToon.x - this.windowLocation.width / 2);
            this.windowLocation.y = _H.floor(this.sonicToon.y - this.windowLocation.height / 2);

            if (this.background) {
                var wOffset = this.windowLocation.x;
                var bw = (this.background.width / scale.x);
                var movex = _H.floor(wOffset / bw) * bw;
                this.background.draw(canvas, { x: -_H.floor(this.windowLocation.x) * scale.x + movex, y: -(_H.floor(this.windowLocation.y / 4)) * scale.y }, scale, wOffset);
                this.background.draw(canvas, { x: -_H.floor(this.windowLocation.x) * scale.x + movex + this.background.width, y: -(_H.floor(this.windowLocation.y / 4)) * scale.y }, scale, wOffset);

            }
        }


        if (this.windowLocation.x < 0) this.windowLocation.x = 0;
        //    if (this.windowLocation.y < 0) this.windowLocation.y = 0;

        if (this.windowLocation.x > 128 * sonicManager.SonicLevel.LevelWidth - this.windowLocation.width) this.windowLocation.x = 128 * sonicManager.SonicLevel.LevelWidth - this.windowLocation.width;
        //      if (this.windowLocation.y > 128 * sonicManager.SonicLevel.LevelHeight - this.windowLocation.height) this.windowLocation.y = 128 * sonicManager.SonicLevel.LevelHeight - this.windowLocation.height;
        var offs = [];
        var w1 = this.windowLocation.width / 128;
        var h1 = this.windowLocation.height / 128;
        for (var i = -1; i < w1; i += 1) {
            for (var a = -1; a < h1; a += 1) {
                offs.push({ x: i, y: a });
            }
        }
        var bounds = { x: -32, y: -32, width: this.windowLocation.width * scale.x + 32, height: this.windowLocation.height * scale.y + 32, intersects: _H.intersects };





        if (this.SonicLevel.Chunks && this.SonicLevel.Chunks.length > 0) {



            for (var x = 0; false && x < that.SonicLevel.BackgroundWidth; x++) {
                for (var y = 0; y < that.SonicLevel.BackgroundHeight; y++) {
                    var ck = sonicManager.SonicLevel.Chunks[that.SonicLevel.BGChunkMap[x][y]];
                    if (ck) {
                        if (!ck.isEmpty())
                            ck.draw(canvas, { x: x * 128 * scale.x - this.windowLocation.x * scale.x, y: y * 128 * scale.y - this.windowLocation.y * scale.y }, scale, 0, undefined, bounds);

                    }
                }
            }



            if (false) {
                var changePal = ["88EEEE", "22EEEE", "44AAEE", "4466EE", "22EEEE", "44AAEE", "4466EE", "88EEEE", "44AAEE", "4466EE", "88EEEE", "22EEEE", "4466EE", "88EEEE", "22EEEE", "44AAEE", ];

                if (this.drawTickCount % 0x20 == 0x18) {
                    this.SonicLevel.curPaletteIndex = 3;
                } else if (this.drawTickCount % 0x20 == 0x10) {
                    this.SonicLevel.curPaletteIndex = 2;
                } else if (this.drawTickCount % 0x20 == 0x8) {
                    this.SonicLevel.curPaletteIndex = 1;
                } else if (this.drawTickCount % 0x20 == 0x0) {
                    this.SonicLevel.curPaletteIndex = 0;
                }

                this.SonicLevel.Palette[2][0x16 / 2] = changePal[this.SonicLevel.curPaletteIndex * 4 + 0];
                this.SonicLevel.Palette[2][0x16 / 2 + 1] = changePal[this.SonicLevel.curPaletteIndex * 4 + 1];
                this.SonicLevel.Palette[2][0x1A / 2] = changePal[this.SonicLevel.curPaletteIndex * 4 + 2];
                this.SonicLevel.Palette[2][0x1A / 2 + 1] = changePal[this.SonicLevel.curPaletteIndex * 4 + 3];
            }
            if (false) {
                var changePal = ["CCEEEE", "EEEEEE", "88EEEE", "0044EE", "CCEEEE", "88EEEE", "88EEEE", "EEEEEE", "AAEEEE", "6688EE", "88EEEE", "88EEEE", "88EEEE", "0044EE", "88EEEE", "6688EE", "66EEEE", "EEEEEE", "88EEEE", "0044EE", "AAEEEE", "88EEEE", "88EEEE", "EEEEEE", "88EEEE", "6688EE", "88EEEE", "88EEEE", "88EEEE", "0044EE", "88EEEE", "6688EE", "66EEEE", "EEEEEE", "88EEEE", "0044EE", "88EEEE", "88EEEE", "88EEEE", "EEEEEE", "AAEEEE", "6688EE", "88EEEE", "88EEEE", "CCEEEE", "0044EE", "88EEEE", "6688EE", "CCEEEE", "EEEEEE", "88EEEE", "0044EE", "CCEEEE", "88EEEE", "88EEEE", "EEEEEE", "CCEEEE", "6688EE", "88EEEE", "88EEEE", "CCEEEE", "0044EE", "88EEEE", "6688EE", ];


                for (var j = 0; j < 0x50; j += 0x8) {
                    if (this.drawTickCount % 0x50 == j) {
                        this.SonicLevel.curPaletteIndex = j / 0x8;
                    }
                }
                this.SonicLevel.Palette[3][0x4 / 2] = changePal[this.SonicLevel.curPaletteIndex * 2 + 0];
                this.SonicLevel.Palette[3][0x4 / 2 + 1] = changePal[this.SonicLevel.curPaletteIndex * 2 + 1];
            }

            if (false) {
                var changePal = ["000000", "666600", "EEEE00", "222200", "444400", "CCCC00", "444400", "222200", "AAAA00", "666600", "000000", "888800", "888800", "000000", "666600", "AAAA00", "222200", "444400", "CCCC00", "444400", "222200", "EEEE00", "666600", "000000", "EEEE00", "888800", "000000", "CCCC00", "AAAA00", "222200", "AAAA00", "CCCC00", "444400", "888800", "EEEE00", "666600", "666600", "EEEE00", "888800", "444400", "CCCC00", "AAAA00", "222200", "AAAA00", "CCCC00", "000000", "888800", "EEEE00", ];

                for (var j = 0; j < 0x60; j += 0x6) {
                    if (this.drawTickCount % 0x60 == j) {
                        this.SonicLevel.curPaletteIndex = j / 0x8;
                    }
                }
                this.SonicLevel.Palette[3][0x12 / 2] = changePal[this.SonicLevel.curPaletteIndex * 4 + 0];
                this.SonicLevel.Palette[3][0x12 / 2 + 1] = changePal[this.SonicLevel.curPaletteIndex * 4 + 1];
                this.SonicLevel.Palette[3][0x16 / 2] = changePal[this.SonicLevel.curPaletteIndex * 4 + 2];
                this.SonicLevel.Palette[3][0x16 / 2 + 1] = changePal[this.SonicLevel.curPaletteIndex * 4 + 3];
            }
            /*
            {
            var changePal = ["0022EE", "AA8800", "EE00CC", "2244CC", "CC6600", "EE00EE", "4466AA", "CC4400", "CC00EE", "448888", "EE2200", "AA00EE", "66AA66", "EE0000", "8800EE", "66CC44", "EE0022", "6600EE", "88EE22", "EE0044", "4400EE", "88EE00", "EE0066", "2200EE", "88CC00", "EE0088", "0000EE", "AAAA00", "EE00AA", "0000EE", "AA8800", "EE00CC", "0022EE", "CC6600", "EE00EE", "2244CC", "CC4400", "CC00EE", "4466AA", "EE2200", "AA00EE", "448888", "EE0000", "8800EE", "66AA66", "EE0022", "6600EE", "66CC44", "EE0044", "4400EE", "88EE22", "EE0066", "2200EE", "88EE00", "EE0088", "0000EE", "88CC00", "EE00AA", "0000EE", "AAAA00", "EE00CC", "0022EE", "AA8800", "EE00EE", "2244CC", "CC6600", "CC00EE", "4466AA", "CC4400", "AA00EE", "448888", "EE2200", "8800EE", "66AA66", "EE0000", "6600EE", "66CC44", "EE0022", "4400EE", "88EE22", "EE0044", "2200EE", "88EE00", "EE0066", "0000EE", "88CC00", "EE0088", "0000EE", "AAAA00", "EE00AA", ]; ;
            //cnz3
            for (var j = 0; j < 0xB4; j += 0x6) {
            if (this.drawTickCount % 0xB4 == j) {
            this.SonicLevel.palAn[0] = j / 0x8;
            }
            }
            this.SonicLevel.Palette[2][0x12 / 2] = changePal[this.SonicLevel.palAn[0] * 4 + 0];
            this.SonicLevel.Palette[2][0x12 / 2 + 1] = changePal[this.SonicLevel.palAn[0] * 4 + 1];
            this.SonicLevel.Palette[2][0x16 / 2] = changePal[this.SonicLevel.palAn[0] * 4 + 2];
            this.SonicLevel.Palette[2][0x16 / 2 + 1] = changePal[this.SonicLevel.palAn[0] * 4 + 3];
            }
            {
            var changePal = ["00EE22", "EECCEE", "22EE44", "CCAAEE", "44EE66", "AA88EE", "66EE88", "8866EE", "88EEAA", "6644EE", "AAEECC", "4422EE", "CCEEEE", "2200EE", "EEEEEE", "0000EE", "CCEEEE", "2200EE", "AAEECC", "4422EE", "88EEAA", "6644EE", "66EE88", "8866EE", "44EE66", "AA88EE", "22EE44", "CCAAEE", "00EE22", "EECCEE", "00EE00", "EEEEEE", ]; ;
            //cnz5
            for (var j = 0; j < 0x40; j += 0x4) {
            if (this.drawTickCount % 0x40 == j) {
            this.SonicLevel.palAn[1] = j / 0x8;
            }
            }
            this.SonicLevel.Palette[2][0xE / 2] = changePal[this.SonicLevel.palAn[1] * 4 + 0];
            this.SonicLevel.Palette[2][0xE / 2 + 1] = changePal[this.SonicLevel.palAn[1] * 4 + 1];

            }*/


            if (this.SonicLevel.PaletteItems[0]) {
                for (var k = 0; k < this.SonicLevel.PaletteItems[0].length; k++) {
                    var pal = this.SonicLevel.PaletteItems[0][k];
                    var p = eval(pal.Palette);

                    for (var j = 0; j <= pal.TotalLength; j += pal.SkipIndex) {
                        if (this.drawTickCount % (pal.TotalLength + pal.SkipIndex) == j) {
                            this.SonicLevel.palAn[k] = j / pal.SkipIndex;
                        }
                    }

                    for (var m = 0; m < pal.Pieces.length; m++) {
                        var mj = pal.Pieces[m];
                        this.SonicLevel.Palette[mj.PaletteIndex][mj.PaletteOffset / 2] = p[this.SonicLevel.palAn[k] * (pal.Pieces.length * 2) + 0 + (mj.PaletteMultiply)];
                        this.SonicLevel.Palette[mj.PaletteIndex][mj.PaletteOffset / 2 + 1] = p[this.SonicLevel.palAn[k] * (pal.Pieces.length * 2) + 1 + (mj.PaletteMultiply)];
                    }


                }


                var longHash = 0;

                for (var k = 0; k < this.SonicLevel.PaletteItems[0].length; k++) {
                    if (longHash == 0) {
                        longHash = ((this.SonicLevel.palAn[k] + 1) * Math.pow(10, k));
                    } else
                        longHash += ((this.SonicLevel.palAn[k] + 1) * Math.pow(10, k));

                }
                this.SonicLevel.curPaletteIndex = longHash;
            }



            var fxP = _H.floor((this.windowLocation.x + 128) / 128);
            var fyP = _H.floor((this.windowLocation.y + 128) / 128);
            for (var off in offs) {
                var _xP = fxP + offs[off].x;
                var _yP = fyP + offs[off].y;
                var _yPreal = fyP + offs[off].y;
                if (_xP < 0 || _xP >= this.SonicLevel.LevelWidth) continue;

                _yP = _H.mod(_yP, this.SonicLevel.LevelHeight);

                var ind = this.SonicLevel.ChunkMap[_xP][_yP];
                var chunk = this.SonicLevel.Chunks[ind];

                var anni = this.SonicLevel.AnimatedChunks[ind];
                if (anni)
                    anni.animatedTick();

                if (!chunk) continue;

                var pos = { x: _H.floor(_xP * 128 * scale.x), y: _H.floor(_yPreal * 128 * scale.y) };

                var posj = { x: _H.floor(pos.x - this.windowLocation.x * scale.x), y: _H.floor(pos.y - this.windowLocation.y * scale.x) };

                if (!chunk.isEmpty())
                    chunk.draw(canvas, posj, scale, 0, undefined, bounds);
                if (false && !this.sonicToon) {
                    canvas.strokeStyle = "#DD0033";
                    canvas.lineWidth = 3;
                    canvas.strokeRect(posj.x, posj.y, 128 * scale.x, 128 * scale.y);
                }



            }

            for (var ring in this.SonicLevel.Rings) {
                var r = this.SonicLevel.Rings[ring];
                if (this.sonicToon) {
                    if (!this.sonicToon.obtainedRing[ring])
                        if (this.windowLocation.intersects(r))
                            this.goodRing.draw(canvas, { x: (r.X) - this.windowLocation.x, y: (r.Y) - this.windowLocation.y }, scale, true);
                } else {
                    if (this.windowLocation.intersects(r))
                        this.goodRing.draw(canvas, { x: (r.X) - this.windowLocation.x, y: (r.Y) - this.windowLocation.y }, scale, false);
                }
            }

            for (var l = 0; l < sonicManager.SonicLevel.Objects.length; l++) {
                var o = sonicManager.SonicLevel.Objects[l];
                if (this.windowLocation.intersects({ x: o.x, y: o.y })) {
                    o.draw(canvas, ((o.x) - this.windowLocation.x) * scale.x, ((o.y) - this.windowLocation.y) * scale.y, scale, this.sonicToon);
                }
            }


            for (var i = this.activeRings.length - 1; i >= 0; i--) {
                var ac = this.activeRings[i];
                ac.draw(canvas, { x: ac.x - this.windowLocation.x, y: ac.y - this.windowLocation.y }, scale);
                if (ac.tickCount > 256) {
                    _H.remove(this.activeRings, ac);
                }
            }

            if (this.sonicToon) {
                this.sonicToon.draw(canvas, scale);
                if (this.windowLocation.x < 0) this.windowLocation.x = 0;
                //if (this.windowLocation.y < 0) this.windowLocation.y = 0;

                if (this.windowLocation.x > 128 * sonicManager.SonicLevel.LevelWidth - this.windowLocation.width) this.windowLocation.x = 128 * sonicManager.SonicLevel.LevelWidth - this.windowLocation.width;
                //if (this.windowLocation.y > 128 * sonicManager.SonicLevel.LevelHeight - this.windowLocation.height) this.windowLocation.y = 128 * sonicManager.SonicLevel.LevelHeight - this.windowLocation.height;

            }
            for (var off in offs) {
                var _xP = fxP + offs[off].x;
                var _yP = fyP + offs[off].y;
                var _yPreal = fyP + offs[off].y;
                if (_xP < 0 || _xP >= this.SonicLevel.LevelWidth) continue;

                _yP = _H.mod(_yP, this.SonicLevel.LevelHeight);

                var chunk = this.SonicLevel.Chunks[this.SonicLevel.ChunkMap[_xP][_yP]];

                if (!chunk) continue;

                var pos = { x: _xP * 128 * scale.x, y: _yPreal * 128 * scale.y };

                var posj = { x: (_H.floor(pos.x - this.windowLocation.x * scale.x)), y: _H.floor(pos.y - this.windowLocation.y * scale.y) };

                if (!chunk.isEmpty() && !chunk.onlyBackground())
                    chunk.draw(canvas, posj, scale, 1, null, bounds);
                if (false && !this.sonicToon) {
                    canvas.strokeStyle = "#DD0033";
                    canvas.lineWidth = 3;
                    canvas.strokeRect(posj.x, posj.y, 128 * scale.x, 128 * scale.y);
                }



                if (this.showHeightMap) {
                    var fd = sonicManager.SpriteCache.heightMapChunks[(this.SonicLevel.curHeightMap ? 1 : 2) + " " + chunk.index + " " + scale.y + " " + scale.x];
                    if (!fd) {
                        var md = chunk;
                        var posj1 = { x: 0, y: 0 };
                        var canv = _H.defaultCanvas(128 * scale.x, 128 * scale.y);
                        var ctx = canv.context;
                        canv.width = canv.width;
                        for (var _y = 0; _y < 8; _y++) {
                            for (var _x = 0; _x < 8; _x++) {
                                var tp = md.tilePieces[_x][_y];

                                var hd = sonicManager.SonicLevel.HeightMaps[(this.SonicLevel.curHeightMap ? sonicManager.SonicLevel.CollisionIndexes1[tp.Block] : sonicManager.SonicLevel.CollisionIndexes2[tp.Block])];

                                var __x = _x;
                                var __y = _y;
                                var vangle;
                                var posm = { x: posj1.x + (__x * 16) * scale.x, y: posj1.y + (__y * 16) * scale.y };



                                if (hd == undefined) continue;
                                if (hd == 0) {

                                } else if (hd == 1) {
                                    if ((this.SonicLevel.curHeightMap ? tp.Solid1 : tp.Solid2) > 0) {
                                        ctx.fillStyle = HeightMask.colors[this.SonicLevel.curHeightMap ? tp.Solid1 : tp.Solid2];
                                        ctx.fillRect(posj1.x + (__x * 16) * scale.x, posj1.y + (__y * 16) * scale.y, scale.x * 16, scale.y * 16);
                                    }
                                }
                                else {
                                    vangle = sonicManager.SonicLevel.Angles[(this.SonicLevel.curHeightMap ? sonicManager.SonicLevel.CollisionIndexes1[tp.Block] : sonicManager.SonicLevel.CollisionIndexes2[tp.Block])];

                                    hd.draw(ctx, posm, scale, -1, tp.XFlip, tp.YFlip, this.SonicLevel.curHeightMap ? tp.Solid1 : tp.Solid2, vangle);
                                    /*   posm.x += 16 * scale.x / 2;
                                    posm.y += 16 * scale.y / 2;
                                    ctx.strokeStyle = "#DDD";
                                    ctx.font = "18pt courier ";
                                    ctx.shadowColor = "";
                                    ctx.shadowBlur = 0;
                                    ctx.lineWidth = 1;
                                    ctx.strokeText(vangle.toString(16), posm.x - 12, posm.y + 7);*/
                                }
                            }
                        }
                        //  var fc = canv.canvas.toDataURL("image/png");
                        fd = that.SpriteCache.heightMapChunks[(this.SonicLevel.curHeightMap ? 1 : 2) + " " + md.index + " " + scale.y + " " + scale.x] = canv.canvas;
                    }
                    canvas.drawImage(fd, posj.x, posj.y);
                }


                if (!this.sonicToon) {
                    canvas.strokeStyle = "#DD0033";
                    canvas.lineWidth = 3;
                    canvas.strokeRect(posj.x, posj.y, 128 * scale.x, 128 * scale.y);
                }





            }

        }
        _H.restore(canvas);

        if (this.sonicToon) {
            this.sonicToon.drawUI(canvas, { x: this.screenOffset.x, y: this.screenOffset.y }, scale);
        }

    };

    this.spriteLoader = null;
    this.SpriteCache = null;
    this.preLoadSprites = function (scale, completed, update) {
        this.SpriteCache = { rings: [], tileChunks: [], tilepieces: [], tiles: [], sonicSprites: [], heightMaps: [], heightMapChunks: [] };

        var ci = this.SpriteCache.rings;
        var inj = 0;

        var spriteLocations = [];

        for (var j = 0; j < 4; j++) {
            spriteLocations[j] = "assets/Sprites/ring" + j + ".png";
            this.imageLength++;
        }
        var that = this;


        var md;
        var ind_ = { sprites: 0, tps: 0, tcs: 0, ss: 0, hms: 0, hmc: 0, tls: 0, px: 0, aes: 0 };

        var sm = this.spriteLoader = new SpriteLoader(completed, update);
        var spriteStep = sm.addStep("Sprites", function (i, done) {
            var sp = i * 200;
            ci[sp] = _H.loadSprite(spriteLocations[i], function (jd) {
                ci[jd.tag * 200 + scale.x * 100 + scale.y] = _H.scaleSprite(jd, scale, function (jc) {
                    done();
                });
            });
            ci[sp].tag = i;
        }, function () {
            ind_.sprites = ind_.sprites + 1;
            if (ind_.sprites == 4) {
                return true;
            }
            return false;
        }, false);


        for (var i = 0; i < spriteLocations.length; i++) {
            sm.addIterationToStep(spriteStep, i);
        }

        var that = this;
        var tileStep = sm.addStep("Tiles", function (k, done) {
            var canv = _H.defaultCanvas(16 * scale.x, 16 * scale.y);
            var ctx = canv.context;
            canv.width = canv.width;
            md = that.SonicLevel.Blocks[k];
            md.draw(ctx, { x: 0, y: 0 }, scale, false);
            that.SpriteCache.tilepieces[false + " " + md.index + " " + scale.y + " " + scale.x] = canv.canvas;




            canv = _H.defaultCanvas(16 * scale.x, 16 * scale.y);
            ctx = canv.context;
            canv.width = canv.width;

            md.draw(ctx, { x: 0, y: 0 }, scale, true);
            that.SpriteCache.tilepieces[true + " " + md.index + " " + scale.y + " " + scale.x] = canv.canvas;
            done();
            done();

        }, function () {
            ind_.tps++;
            if (ind_.tps == that.SonicLevel.Blocks.length * 2) {
                return true;
            }
            return false;
        }, true);



        for (var k = 0; k < this.SonicLevel.Blocks.length; k++) {
            sm.addIterationToStep(tileStep, k);
        }


        var speed = 1;
        /*
        var pixelStep = sm.addStep("Pixels", function (k, done) {

        var ca = _H.defaultCanvas(1, 1);
        ca.fillStyle = "#" + sonicManager.SonicLevel.Palette[k.x][k.y];
        ca.context.fillRect(0, 0, 1, 1);
        sonicManager.SonicLevel.Palette[k.x][k.y] = _H.loadSprite(ca.canvas.toDataURL("image/png"), done);


        }, function () {
        ind_.px++;
        if (ind_.px >= 16*4) {
        return true;
        }
        return false;
        });

        for (var qc = 0; qc < sonicManager.SonicLevel.Palette.length; qc++) {
        for (var qcc = 0; qcc < sonicManager.SonicLevel.Palette[qc].length; qcc++) {
        sm.addIterationToStep(pixelStep, { x: qc, y: qcc });
        }
        }
        */


        /*        var heightStep = sm.addStep("Height Maps", function (k, done) {
        var canv = _H.defaultCanvas(16 * scale.x, 16 * scale.y);
        var ctx = canv.context;
        ctx.clearRect(0, 0, canv.width, canv.height);
        md = that.SonicLevel.HeightMaps[k];
        md.index = k;
        md.draw(ctx, { x: 0, y: 0 }, scale, -1, false, false, 0);
        var fc = canv.canvas.toDataURL("image/png");
        that.SpriteCache.heightMaps[md.index] = _H.loadSprite(fc, done);


        }, function () {
        ind_.hms++;
        if (ind_.hms >= that.SonicLevel.HeightMaps.length / speed) {
        return true;
        }
        return false;
        });


        for (var k = 0; k < this.SonicLevel.HeightMaps.length; k++) {

        sm.addIterationToStep(heightStep, k);
        }*/


        /*
        var tileStep = sm.addStep("Tile Maps", function (k, done) {
        var canv = _H.defaultCanvas(16 * scale.x, 16 * scale.y);
        var ctx = canv.context;
        ctx.clearRect(0, 0, canv.width, canv.height);
        md = that.SonicLevel.Tiles[k];
        md.index = k;
        md.draw(ctx, { x: 0, y: 0 }, scale,  false, false, 0);
        var fc = canv.canvas.toDataURL("image/png");
        that.SpriteCache.tiles[md.index] = _H.loadSprite(fc, done);

        }, function () {
        ind_.tls++;
        if (ind_.tls >= that.SonicLevel.Tiles.length  / speed) {
        return true;
        }
        return false;
        });


        for (var k = 0; k < this.SonicLevel.Tiles.length; k++) { 
        sm.addIterationToStep(tileStep, k);
        }
        */

        var numOfAnimations = 0;

        /* var aTileStep = sm.addStep("Animated Tile Maps", function (k, done) {

        for (var m = 0; m < 4; m++) {
        var canv = _H.defaultCanvas(8 * scale.x, 8 * scale.y);
        var ctx = canv.context;
        k.draw(ctx, { x: 0, y: 0 }, scale, false, false, m);
        sonicManager.SpriteCache.tiles[k.index + " " + false + " " + false + " " + m] = _H.loadSprite(canv.canvas.toDataURL("image/png"), done);

        canv = _H.defaultCanvas(8 * scale.x, 8 * scale.y);
        ctx = canv.context;
        k.draw(ctx, { x: 0, y: 0 }, scale, true, false, m);
        sonicManager.SpriteCache.tiles[k.index + " " + true + " " + false + " " + m] = _H.loadSprite(canv.canvas.toDataURL("image/png"), done);

        canv = _H.defaultCanvas(8 * scale.x, 8 * scale.y);
        ctx = canv.context;
        k.draw(ctx, { x: 0, y: 0 }, scale, false, true, m);
        sonicManager.SpriteCache.tiles[k.index + " " + false + " " + true + " " + m] = _H.loadSprite(canv.canvas.toDataURL("image/png"), done);

        canv = _H.defaultCanvas(8 * scale.x, 8 * scale.y);
        ctx = canv.context;
        k.draw(ctx, { x: 0, y: 0 }, scale, true, true, m);
        sonicManager.SpriteCache.tiles[k.index + " " + true + " " + true + " " + m] = _H.loadSprite(canv.canvas.toDataURL("image/png"), done);



        }

        }, function () {
        ind_.aes++;
        if (ind_.aes >= numOfAnimations * 4 * 4) {
        return true;
        }
        return false;
        }, true);

        for (jc = 0; jc < sonicManager.SonicLevel.AnimatedFiles.length; jc++) {
        var fcc = sonicManager.SonicLevel.AnimatedFiles[jc];
        for (j = 0; j < fcc.length; j++) {
        sm.addIterationToStep(aTileStep, fcc[j]);
        numOfAnimations++;
        }
        }*/


        var chunkStep = sm.addStep("Chunk Maps", function (k, done) {

            var canv = _H.defaultCanvas(128 * scale.x, 128 * scale.y);
            var ctx = canv.context;
            canv.width = canv.width;
            md = that.SonicLevel.Chunks[k];
            /*

            md.draw(ctx, { x: 0, y: 0 }, scale, false);
            //var fc = canv.canvas.toDataURL("image/png");

            that.SpriteCache.tileChunks[false + " " + md.index + " " + scale.y + " " + scale.x + " -"] = canv.canvas;
            ind_.tcs++;
            done();

            canv = _H.defaultCanvas(128 * scale.x, 128 * scale.y);
            ctx = canv.context;
            ctx.clearRect(0, 0, canv.width, canv.height);


            if (!md.onlyBackground()) {
            md.draw(ctx, { x: 0, y: 0 }, scale, true);
            //  var fc = canv.canvas.toDataURL("image/png");
            that.SpriteCache.tileChunks[true + " " + md.index + " " + scale.y + " " + scale.x + " -"] = canv.canvas;
            ind_.tcs++;
            done();
            } else {
            that.SpriteCache.tileChunks[true + " " + md.index + " " + scale.y + " " + scale.x + " -"] = 1;
            ind_.tcs++;
            done();
            }


            if (md.animated) {
            sonicManager.drawTickCount = 0;
            sonicManager.CACHING = false;
            for (var c = 0; c < md.animated.Frames.length; c++) {
            var frame = md.animated.Frames[c];

            canv = _H.defaultCanvas(128 * scale.x, 128 * scale.y);
            ctx = canv.context;
            ctx.clearRect(0, 0, canv.width, canv.height);

            md.draw(ctx, { x: 0, y: 0 }, scale, true, c);
            //   var fc = canv.canvas.toDataURL("image/png");
            that.SpriteCache.tileChunks[true + " " + md.index + " " + scale.y + " " + scale.x + " " + c] = canv.canvas;
            canv = _H.defaultCanvas(128 * scale.x, 128 * scale.y);
            ctx = canv.context;
            ctx.clearRect(0, 0, canv.width, canv.height);

            md.draw(ctx, { x: 0, y: 0 }, scale, false, c);
            // var fc = canv.canvas.toDataURL("image/png");
            that.SpriteCache.tileChunks[false + " " + md.index + " " + scale.y + " " + scale.x + " " + c] = canv.canvas;
            }
            sonicManager.CACHING = true;
            }*/


            var posj = { x: 0, y: 0 };
            canv = _H.defaultCanvas(128 * scale.x, 128 * scale.y);
            ctx = canv.context;
            ctx.clearRect(0, 0, canv.width, canv.height);
            for (var _y = 0; _y < 8; _y++) {
                for (var _x = 0; _x < 8; _x++) {
                    var tp = md.tilePieces[_x][_y];
                    var hd = sonicManager.SonicLevel.HeightMaps[sonicManager.SonicLevel.CollisionIndexes1[tp.Block]];
                    var __x = _x;
                    var __y = _y;
                    var vangle;
                    var posm = { x: posj.x + (__x * 16) * scale.x, y: posj.y + (__y * 16) * scale.y };



                    if (hd == undefined) continue;
                    if (hd == 0) {

                    } else if (hd == 1) {
                        if (tp.Solid1 > 0) {
                            ctx.fillStyle = HeightMask.colors[tp.Solid1];
                            ctx.fillRect(posj.x + (__x * 16) * scale.x, posj.y + (__y * 16) * scale.y, scale.x * 16, scale.y * 16);
                        }
                    }
                    else {
                        vangle = sonicManager.SonicLevel.Angles[sonicManager.SonicLevel.CollisionIndexes1[tp.Block]];

                        hd.draw(ctx, posm, scale, -1, tp.XFlip, tp.YFlip, tp.Solid1, vangle);
                        /*   posm.x += 16 * scale.x / 2;
                        posm.y += 16 * scale.y / 2;
                        ctx.strokeStyle = "#DDD";
                        ctx.font = "18pt courier ";
                        ctx.shadowColor = "";
                        ctx.shadowBlur = 0;
                        ctx.lineWidth = 1;
                        ctx.strokeText(vangle.toString(16), posm.x - 12, posm.y + 7);*/
                    }
                }
            }
            //  var fc = canv.canvas.toDataURL("image/png");
            that.SpriteCache.heightMapChunks[1 + " " + md.index + " " + scale.y + " " + scale.x] = canv.canvas;
            ind_.hmc++; done();




            canv = _H.defaultCanvas(128 * scale.x, 128 * scale.y);
            ctx = canv.context;
            ctx.clearRect(0, 0, canv.width, canv.height);
            for (var _y = 0; _y < 8; _y++) {
                for (var _x = 0; _x < 8; _x++) {
                    var tp = md.tilePieces[_x][_y];
                    var hd = sonicManager.SonicLevel.HeightMaps[sonicManager.SonicLevel.CollisionIndexes2[tp.Block]];
                    var __x = _x;
                    var __y = _y;
                    var vangle;
                    var posm = { x: posj.x + (__x * 16) * scale.x, y: posj.y + (__y * 16) * scale.y };
                    if (hd == undefined) continue;

                    if (hd == 0) {

                    } else if (hd == 1) {
                        if (tp.Solid2 > 0) {
                            ctx.fillStyle = HeightMask.colors[tp.Solid2];
                            ctx.fillRect(posj.x + (__x * 16) * scale.x, posj.y + (__y * 16) * scale.y, scale.x * 16, scale.y * 16);
                        }
                    }
                    else {
                        vangle = sonicManager.SonicLevel.Angles[sonicManager.SonicLevel.CollisionIndexes2[tp.Block]];

                        hd.draw(ctx, posm, scale, -1, tp.XFlip, tp.YFlip, tp.Solid2, vangle);
                        /*   posm.x += 16 * scale.x / 2;
                        posm.y += 16 * scale.y / 2;
                        ctx.strokeStyle = "#DDD";
                        ctx.font = "18pt courier ";
                        ctx.shadowColor = "";
                        ctx.shadowBlur = 0;
                        ctx.lineWidth = 1;
                        ctx.strokeText(vangle.toString(16), posm.x - 12, posm.y + 7);*/

                    }
                }
            }
            //  var fc = canv.canvas.toDataURL("image/png");
            that.SpriteCache.heightMapChunks[2 + " " + md.index + " " + scale.y + " " + scale.x] = canv.canvas;
            ind_.hmc++; done();


        }, function () {
            if (/*ind_.tcs >= that.SonicLevel.Chunks.length * 2 / speed && */ind_.hmc >= that.SonicLevel.Chunks.length * 2 / speed) {

                return true;
            }
            return false;
        }, true);

        for (var k = 0; k < this.SonicLevel.Chunks.length; k++) {
            sm.addIterationToStep(chunkStep, k);
        }



        var sonicStep = sm.addStep("Sonic Sprites", function (sp, done) {

            var cci = that.SpriteCache.sonicSprites;

            for (var spritec in $sonicSprites) {
                cci[spritec + scale.x + scale.y] = _H.scaleCSImage($sonicSprites[spritec], scale);
            }

            done();
        }, function () {
            return true;
        }, false);



        that.spriteLocations = [];
        sm.addIterationToStep(sonicStep, true);



        var bgStep = sm.addStep("Background data", function (sp, done) {

            var canv = _H.defaultCanvas(that.SonicLevel.BackgroundWidth * 128 * scale.x, that.SonicLevel.BackgroundHeight * 128 * scale.y);
            var ctx = canv.context;
            ctx.clearRect(0, 0, canv.width, canv.height);

            for (var x = 0; x < that.SonicLevel.BackgroundWidth; x++) {
                for (var y = 0; y < that.SonicLevel.BackgroundHeight; y++) {
                    var ck = sonicManager.SonicLevel.Chunks[that.SonicLevel.BGChunkMap[x][y]];
                    if (ck) {
                        ck.draw(ctx, { x: x * 128 * scale.x, y: y * 128 * scale.y }, scale, 0);
                    }
                }
            }

            that.SpriteCache.bgImage = _H.loadSprite(canv.canvas.toDataURL("image/png"), done);


        }, function () {
            that.background = new ParallaxBG(that.SpriteCache.bgImage, { x: 1, y: 1 });
            return true;

        }, true);
        sm.addIterationToStep(bgStep, 0);





    };
}

ClickState = { Dragging: 0, PlaceChunk: 1, PlaceRing: 2, PlaceObject: 3 };

function SpriteLoader(completed, update) {
    var that = this;
    this.stepIndex = 0;
    this.steps = [];
    this.done = false;
    this.tickIndex = 0;
    this.tick = function () {
        //this.stepIndex = this.steps.length;

        if (this.stepIndex == this.steps.length) {
            if (!this.done) {
                this.done = true;
                completed();
            }
            return true;
        }
        var stp = this.steps[this.stepIndex];
        if (!stp) return true;

        if (that.tickIndex % _H.floor(stp.iterations.length / 12) == 0)
            update("Caching: " + stp.title + " " + Math.floor(((that.tickIndex / stp.iterations.length) * 100)) + "%");

        if (stp.iterations.length > this.tickIndex) {
            stp.method(stp.iterations[this.tickIndex++], function () {
                if (stp.finish()) {
                    that.stepIndex++;
                    that.tickIndex = 0;
                }
            });
        }
        return false;
    };
    this.addStep = function (title, method, onFinish, disable) {
        if (disable)
            return -1;
        this.steps.push({ title: title, method: method, finish: onFinish, iterations: [] });
        return this.steps.length - 1;
    };
    this.addIterationToStep = function (stepIndex, index) {
        if (stepIndex == -1) return;
        this.steps[stepIndex].iterations.push(index);
    };
}

