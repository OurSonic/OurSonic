

function SonicManager(mainCanvas) {
    var scale = this.scale = { x: 2, y: 2 };
    this.windowLocation = _H.defaultWindowLocation(1);
    this.showHeightMap = false;
    this.goodRing = new Ring(false);
    this.activeRings = [];

    this.background = new ParallaxBG("assets/TileChunks/plane b.png", { x: 1, y: 1 });

    this.uiManager = new UIManager(this, mainCanvas, this.scale);

    this.SonicLevel = {
        Tiles: [],
        TilePieces: [],
        TileChunks: [],
        ChunkMap: [[]],
        Rings: {},
        curHeightMap: true, LevelWidth: 0, LevelHeight: 0
    };



    var lamesauce = new TileChunk() + new TilePiece() + new Tile() + new HeightMask();
    this.SonicLevel.ChunkMap = [[]];
    this.clickState = ClickState.PlaceChunk;



    this.onClick = function (e) {
        if (e.shiftKey) {
            var ch = this.SonicLevel.TileChunks[this.SonicLevel.ChunkMap[_H.floor(e.x / (128 * scale.x)), _H.floor(e.y / (128 * scale.y))]];

            var tp = ch.getTilePiece((e.x - _H.floor(e.x / (128 * scale.x)) * (128 * scale.x)), (e.y - _H.floor(e.y / (128 * scale.y)) * (128 * scale.y)), scale);
            if (tp) {
                this.uiManager.indexes.tpIndex = this.SonicLevel.TilePieces.indexOf(tp);
                this.uiManager.modifyTilePieceArea.tilePiece = tp;
                this.uiManager.solidTileArea.visible = true;
            }
        } else
            if (!e.button || e.button == 0) {
                switch (this.clickState) {
                    case ClickState.PlaceChunk:
                        this.SonicLevel.ChunkMap[_H.floor(e.x / (128 * scale.x)), _H.floor(e.y / (128 * scale.y))] = this.uiManager.indexes.modifyIndex;
                        break;
                    case ClickState.PlaceRing:
                        var ex = _H.floor((e.x - _H.floor(e.x / (128 * scale.x)) * (128 * scale.x)) / (scale.x));
                        var ey = _H.floor((e.y - _H.floor(e.y / (128 * scale.y)) * (128 * scale.y)) / (scale.y));

                        var es = (_H.floor(ex / 16)) + (_H.floor(e.x / (128 * scale.x))) * 8;
                        var ek = (_H.floor(ey / 16)) + (_H.floor(e.y / (128 * scale.y))) * 8;

                        if (this.SonicLevel.Rings[ek * 8 * sonicManager.SonicLevel.LevelWidth + es]) {
                            delete this.SonicLevel.Rings[ek * 8 * sonicManager.SonicLevel.LevelWidth + es];
                            //                        this.SonicLevel.Rings = this.SonicLevel.Rings.splice(this.SonicLevel.Rings.indexOf(ek * 8 * sonicManager.SonicLevel.LevelWidth + es), 1);
                        } else {
                            this.SonicLevel.Rings[ek * 8 * sonicManager.SonicLevel.LevelWidth + es] = { x: es, y: ek };
                        }

                        break;
                    default:
                }
            }



    };

    this.tickCount = 0;
    this.drawTickCount = 0;

    this.tick = function (that) {
        if (that.loading) return;
        if (that.sonicToon) {
            that.tickCount++;

            that.sonicToon.ticking = true;
            try {
                that.sonicToon.tick(that.SonicLevel, scale);
            } finally {
                that.sonicToon.ticking = false;
            }
            if (that.sonicToon.y > 128 * sonicManager.SonicLevel.LevelHeight) {
                that.sonicToon.y = 0;
            }
            if (that.sonicToon.x > 128 * sonicManager.SonicLevel.LevelWidth) {
                that.sonicToon.x = 0;
            }
        }
    };
    this.screenOffset = { x: mainCanvas.canvas.width / 2 - this.windowLocation.width * scale.x / 2, y: mainCanvas.canvas.height / 2 - this.windowLocation.height * scale.y / 2 };
    this.draw = function (canvas) {
        canvas.save();
        this.drawTickCount++;
        if ((this.spriteLoader && !this.spriteLoader.tick()) || this.loading) {
            canvas.fillStyle = "white";
            canvas.fillText("Loading...   " /*+ (this.inds.tc + this.inds.tp + this.inds.t) + " / " + (this.inds.total)*/, 95, 95);
            canvas.restore();
            return;
        }
        this.screenOffset = { x: canvas.canvas.width / 2 - this.windowLocation.width * scale.x / 2, y: canvas.canvas.height / 2 - this.windowLocation.height * scale.y / 2 };


        if (this.sonicToon) {
            if (this.sonicToon.ticking) {
                while (true) {
                    if (!this.sonicToon.ticking) break;
                }
            }
            canvas.translate(this.screenOffset.x, this.screenOffset.y);

            canvas.fillStyle = "#000000";
            canvas.fillRect(0, 0, this.windowLocation.width * scale.x, this.windowLocation.height * scale.x);

            canvas.beginPath();
            canvas.rect(0, 0, this.windowLocation.width * scale.x, this.windowLocation.height * scale.x);
            canvas.clip();
            this.windowLocation.x = _H.floor(this.sonicToon.x - 160);
            this.windowLocation.y = _H.floor(this.sonicToon.y - 180);

            var wOffset = _H.floor(this.windowLocation.x / scale.x);

            this.background.draw(canvas, { x: -_H.floor(this.windowLocation.x / 2) * scale.x, y: -(_H.floor(this.windowLocation.y / 4)) * scale.y }, scale, wOffset);
            this.background.draw(canvas, { x: -_H.floor(this.windowLocation.x / 2) * scale.x + this.background.width * scale.x, y: -(_H.floor(this.windowLocation.y / 4)) * scale.y }, scale, wOffset);

        }


        if (this.windowLocation.x < 0) this.windowLocation.x = 0;
        if (this.windowLocation.y < 0) this.windowLocation.y = 0;

        if (this.windowLocation.x > 128 * sonicManager.SonicLevel.LevelWidth - this.windowLocation.width) this.windowLocation.x = 128 * sonicManager.SonicLevel.LevelWidth - this.windowLocation.width;
        if (this.windowLocation.y > 128 * sonicManager.SonicLevel.LevelHeight - this.windowLocation.height) this.windowLocation.y = 128 * sonicManager.SonicLevel.LevelHeight - this.windowLocation.height;
        var offs = [];
        for (var i = -128; i < this.windowLocation.width; i += 128) {
            for (var a = -128; a < this.windowLocation.height; a += 128) {
                offs.push({ x: i, y: a });
            }
        }

        if (this.SonicLevel.TileChunks && this.SonicLevel.TileChunks.length > 0) {
            for (var off in offs) {
                var xP = (this.windowLocation.x + offs[off].x + 128) / 128;
                var yP = (this.windowLocation.y + offs[off].y + 128) / 128;
                var _xP = _H.floor(xP);
                var _yP = _H.floor(yP);
                if (_xP < 0 || _yP < 0) continue;
                var chunk = this.SonicLevel.TileChunks[this.SonicLevel.ChunkMap[_xP][_yP]];

                if (!chunk) continue;

                var pos = { x: _xP * 128 * scale.x, y: _yP * 128 * scale.y };

                var posj = { x: pos.x - this.windowLocation.x * scale.x, y: pos.y - this.windowLocation.y * scale.x };

                chunk.draw(canvas, posj, scale, false);
                if (!this.sonicToon) {
                    canvas.strokeStyle = "#DD0033";
                    canvas.lineWidth = 3;
                    canvas.strokeRect(posj.x, posj.y, 128 * scale.x, 128 * scale.y);
                }

            }

            for (var ring in this.SonicLevel.Rings) {
                var r = this.SonicLevel.Rings[ring];
                if (this.sonicToon) {
                    if (!this.sonicToon.obtainedRing[ring])
                        this.goodRing.draw(canvas, { x: (r.x) * 16 - this.windowLocation.x, y: (r.y) * 16 - this.windowLocation.y }, scale, true);
                } else {
                    this.goodRing.draw(canvas, { x: (r.x) * 16 - this.windowLocation.x, y: (r.y) * 16 - this.windowLocation.y }, scale, false);
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
                if (this.windowLocation.y < 0) this.windowLocation.y = 0;

                if (this.windowLocation.x > 128 * sonicManager.SonicLevel.LevelWidth - this.windowLocation.width) this.windowLocation.x = 128 * sonicManager.SonicLevel.LevelWidth - this.windowLocation.width;
                if (this.windowLocation.y > 128 * sonicManager.SonicLevel.LevelHeight - this.windowLocation.height) this.windowLocation.y = 128 * sonicManager.SonicLevel.LevelHeight - this.windowLocation.height;

            }

            for (var off in offs) {
                var xP = (this.windowLocation.x + offs[off].x + 128) / 128;
                var yP = (this.windowLocation.y + offs[off].y + 128) / 128;
                var _xP = _H.floor(xP);
                var _yP = _H.floor(yP);
                if (_xP < 0 || _yP < 0) continue;
                var chunk = this.SonicLevel.TileChunks[this.SonicLevel.ChunkMap[_xP][_yP]];

                if (!chunk) continue;

                var pos = { x: _xP * 128 * scale.x, y: _yP * 128 * scale.y };

                var posj = { x: pos.x - this.windowLocation.x * scale.x, y: pos.y - this.windowLocation.y * scale.x };

                chunk.draw(canvas, posj, scale, true);
                if (!this.sonicToon) {
                    canvas.strokeStyle = "#DD0033";
                    canvas.lineWidth = 3;
                    canvas.strokeRect(posj.x, posj.y, 128 * scale.x, 128 * scale.y);
                }



                if (this.showHeightMap) {


                    var fd;
                    if ((fd = sonicManager.SpriteCache.heightMapChunks[(this.SonicLevel.curHeightMap ? 1 : 2) + " " + chunk.index + " " + scale.y + " " + scale.x])) {
                        if (fd.loaded) {
                            canvas.drawImage(fd, posj.x, posj.y);
                        }

                    } else {
                        var hm = this.SonicLevel.curHeightMap ? sonicManager.SonicLevel.CollisionIndexes1 : sonicManager.SonicLevel.CollisionIndexes2;
                        //                            var md = this.SonicLevel.curHeightMap ? chunk.angleMap1 : chunk.angleMap2;

                        for (var _y = 0; _y < 8; _y++) {
                            for (var _x = 0; _x < 8; _x++) {

                                var tp = chunk.tilePieces[_x][_y];
                                var hd = sonicManager.SonicLevel.heightIndexes[hm[tp.Block]];

                                if (hd == 0) continue;
                                if (hd == 1) {
                                    canvas.fillStyle = "rgba(24,98,235,0.6)";
                                    canvas.fillRect(posj.x + (_x * 16) * scale.x, posj.y + (_y * 16) * scale.y, scale.x * 16, scale.y * 16);
                                    continue;
                                }
                                var posm = { x: posj.x + (_x * 16) * scale.x, y: posj.y + (_y * 16) * scale.y };
                                hd.draw(canvas, posm, scale, -1, tp.XFlip, tp.YFlip);


                                if (false && md[_x][_y] != null) {

                                    var vangle = md[_x][_y];
                                    posm.x += 16 * scale.x / 2;
                                    posm.y += 16 * scale.y / 2;

                                    canvas.moveTo(posm.x, posm.y);
                                    //ctx.lineTo(posj.x + (_x * 16) * scale.x + 16 * scale.x / 2, posj.y + (_y * 16) * scale.y + 16 * scale.y / 2);

                                    canvas.lineTo(posm.x + _H.sin((vangle)) * 10 * scale.x, posm.y + _H.cos((vangle)) * 10 * scale.y);

                                    canvas.strokeStyle = "#D141FF";
                                    canvas.lineWidth = 4;
                                    canvas.stroke();
                                }

                            }
                        }
                    }
                }


                if (!this.sonicToon) {
                    canvas.strokeStyle = "#DD0033";
                    canvas.lineWidth = 3;
                    canvas.strokeRect(posj.x, posj.y, 128 * scale.x, 128 * scale.y);
                }





            }


        }
        canvas.restore();

        if (this.sonicToon) {
            this.sonicToon.drawUI(canvas, { x: this.screenOffset.x, y: this.screenOffset.y }, scale);
        }

    };

    this.spriteLoader = null;
    this.SpriteCache = { rings: [], tileChunks: [], tilePeices: [], tiles: [], sonicSprites: [], heightMaps: [], heightMapChunks: [] };
    this.preLoadSprites = function (scale, completed, update) {
        this.SpriteCache = { rings: [], tileChunks: [], tilePeices: [], tiles: [], sonicSprites: [], heightMaps: [], heightMapChunks: [] };

        var ci = this.SpriteCache.rings;
        var inj = 0;

        var spriteLocations = [];

        for (var j = 0; j < 4; j++) {
            spriteLocations[j] = "assets/Sprites/ring" + j + ".png";
            this.imageLength++;
        }
        var that = this;


        var md;
        var ind_ = { sprites: 0, tps: 0, tcs: 0, ss: 0, hms: 0, hmc: 0 };

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
        });



        for (var i = 0; i < spriteLocations.length; i++) {
            sm.addIterationToStep(spriteStep, i);
        }

        var that = this;
        /*
        var tileStep = sm.addStep("Tiles", function (k, done) {
            var canv = _H.defaultCanvas(16 * scale.x, 16 * scale.y);
            var ctx = canv.context;
            ctx.clearRect(0, 0, canv.width, canv.height);

            md = that.SonicLevel.TilePieces[k];
            md.draw(ctx, { x: 0, y: 0 }, scale, false);
            var fc = canv.canvas.toDataURL("image/png");
            that.SpriteCache.tilePeices[false + " " + md.index + " " + scale.y + " " + scale.x] = _H.loadSprite(fc, done);

            canv = _H.defaultCanvas(16 * scale.x, 16 * scale.y);
            ctx = canv.context;
            ctx.clearRect(0, 0, canv.width, canv.height);

            md.draw(ctx, { x: 0, y: 0 }, scale, true);
            var fc = canv.canvas.toDataURL("image/png");
            that.SpriteCache.tilePeices[true + " " + md.index + " " + scale.y + " " + scale.x] = _H.loadSprite(fc, done);

        }, function () {
            ind_.tps++;
            if (ind_.tps == that.SonicLevel.TilePieces.length*2) {
                return true;
            }
            return false;
        });



        for (var k = 0; k < this.SonicLevel.TilePieces.length; k++) {
            sm.addIterationToStep(tileStep, k);
        }*/





        var heightStep = sm.addStep("Height Maps", function (k, done) {
            var canv = _H.defaultCanvas(16 * scale.x, 16 * scale.y);
            var ctx = canv.context;
            ctx.clearRect(0, 0, canv.width, canv.height);
            md = that.SonicLevel.heightIndexes[k];
            md.index = k;
            md.draw(ctx, { x: 0, y: 0 }, scale, -1);
            var fc = canv.canvas.toDataURL("image/png");
            that.SpriteCache.heightMaps[md.index + " " + scale.y + " " + scale.x] = _H.loadSprite(fc, done);

        }, function () {
            ind_.hms++;
            if (ind_.hms == that.SonicLevel.heightIndexes.length) {
                return true;
            }
            return false;
        });


        for (var k = 0; k < this.SonicLevel.heightIndexes.length; k++) {

            sm.addIterationToStep(heightStep, k);
        }




        var chunkStep = sm.addStep("Chunk Maps", function (k, done) {
            var canv = _H.defaultCanvas(128 * scale.x, 128 * scale.y);
            var ctx = canv.context;
            ctx.clearRect(0, 0, canv.width, canv.height);
            md = that.SonicLevel.TileChunks[k];
            md.draw(ctx, { x: 0, y: 0 }, scale, false);
            var fc = canv.canvas.toDataURL("image/png");
            that.SpriteCache.tileChunks[false + " " + md.index + " " + scale.y + " " + scale.x] = _H.loadSprite(fc, function (f) { ind_.tcs++; done(); });

            canv = _H.defaultCanvas(128 * scale.x, 128 * scale.y);
            ctx = canv.context;
            ctx.clearRect(0, 0, canv.width, canv.height);

            md.draw(ctx, { x: 0, y: 0 }, scale, true);
            var fc = canv.canvas.toDataURL("image/png");
            that.SpriteCache.tileChunks[true + " " + md.index + " " + scale.y + " " + scale.x] = _H.loadSprite(fc, function (f) { ind_.tcs++; done(); });

            var posj = { x: 0, y: 0 };

            canv = _H.defaultCanvas(128 * scale.x, 128 * scale.y);
            ctx = canv.context;
            ctx.clearRect(0, 0, canv.width, canv.height);

            for (var _y = 0; _y < 8; _y++) {
                for (var _x = 0; _x < 8; _x++) {
                    var tp = md.tilePieces[_x][_y];
                    var mjj = sonicManager.SonicLevel.CollisionIndexes1[tp.Block];
                    var hd = sonicManager.SonicLevel.heightIndexes[mjj];
                    if (hd == 0) continue;
                    var __x = _x;
                    var __y = _y;
                    if (hd == 1) {
                        ctx.fillStyle = "rgba(24,98,235,0.6)";
                        ctx.fillRect(posj.x + (__x * 16) * scale.x, posj.y + (__y * 16) * scale.y, scale.x * 16, scale.y * 16);
                        continue;
                    }
                    var posm = { x: posj.x + (__x * 16) * scale.x, y: posj.y + (__y * 16) * scale.y };
                    hd.draw(ctx, posm, scale, -1, tp.XFlip, tp.YFlip, tp.Solid1);

                    var vangle = sonicManager.SonicLevel.Angles[mjj];
                    if (vangle != 0xFF) {


                        posm.x += 16 * scale.x / 2;
                        posm.y += 16 * scale.y / 2;

                        ctx.moveTo(posm.x, posm.y);
                        //ctx.lineTo(posj.x + (_x * 16) * scale.x + 16 * scale.x / 2, posj.y + (_y * 16) * scale.y + 16 * scale.y / 2);

                        ctx.lineTo(posm.x + _H.sin((vangle) * (Math.PI / 180)) * 10 * scale.x, posm.y + _H.cos((vangle) * (Math.PI / 180)) * 10 * scale.y);

                        ctx.strokeStyle = "#D141FF";
                        ctx.lineWidth = 2;
                        ctx.stroke();
                    }
                }
            }

            var fc = canv.canvas.toDataURL("image/png");
            that.SpriteCache.heightMapChunks[1 + " " + md.index + " " + scale.y + " " + scale.x] = _H.loadSprite(fc, function (f) { ind_.hmc++; done(); });



            canv = _H.defaultCanvas(128 * scale.x, 128 * scale.y);
            ctx = canv.context;
            ctx.clearRect(0, 0, canv.width, canv.height);

            for (var _y = 0; _y < 8; _y++) {
                for (var _x = 0; _x < 8; _x++) {
                    var tp = md.tilePieces[_x][_y];
                    var hd = sonicManager.SonicLevel.heightIndexes[sonicManager.SonicLevel.CollisionIndexes2[tp.Block]];
                    if (hd == 0) continue;
                    var __x = _x;
                    var __y = _y;
                    if (hd == 1) {
                        ctx.fillStyle = "rgba(24,98,235,0.6)";
                        ctx.fillRect(posj.x + (__x * 16) * scale.x, posj.y + (__y * 16) * scale.y, scale.x * 16, scale.y * 16);
                        continue;
                    }
                    var posm = { x: posj.x + (__x * 16) * scale.x, y: posj.y + (__y * 16) * scale.y };
                    hd.draw(ctx, posm, scale, -1, tp.XFlip, tp.YFlip, tp.Solid2);
                }
            }

            var fc = canv.canvas.toDataURL("image/png");
            that.SpriteCache.heightMapChunks[2 + " " + md.index + " " + scale.y + " " + scale.x] = _H.loadSprite(fc, function (f) { ind_.hmc++; done(); });

        }, function () {
            if (ind_.tcs == that.SonicLevel.TileChunks.length * 2 && ind_.hmc == that.SonicLevel.TileChunks.length * 2) {
                return true;
            }
            return false;
        });

        for (var k = 0; k < this.SonicLevel.TileChunks.length; k++) {
            sm.addIterationToStep(chunkStep, k);
        }






        var sonicStep = sm.addStep("Sonic Sprites", function (sp, done) {
            var ci = that.SpriteCache.sonicSprites;
            ci[sp] = _H.loadSprite(that.spriteLocations[sp], function (jd) {
                ci[jd.tag + scale.x + scale.y] = _H.scaleSprite(jd, scale, done);
            });
            ci[sp].tag = sp;
        }, function () {
            ind_.ss++;
            if (ind_.ss == that.imageLength) {
                return true;
            }
            return false;
        });




        that.spriteLocations = [];
        that.imageLength = 0;

        that.spriteLocations["normal"] = "assets/Sprites/sonic.png";
        sm.addIterationToStep(sonicStep, "normal");
        that.imageLength++;
        var j;
        for (j = 0; j < 4; j++) {
            that.spriteLocations["fastrunning" + j] = "assets/Sprites/fastrunning" + j + ".png";
            that.imageLength++;
            sm.addIterationToStep(sonicStep, "fastrunning" + j);
        }
        for (j = 0; j < 8; j++) {
            that.spriteLocations["running" + j] = "assets/Sprites/running" + j + ".png";
            that.imageLength++;
            sm.addIterationToStep(sonicStep, "running" + j);
        }
        for (j = 0; j < 4; j++) {
            that.spriteLocations["breaking" + j] = "assets/Sprites/breaking" + j + ".png";
            that.imageLength++;
            sm.addIterationToStep(sonicStep, "breaking" + j);
        }
        for (j = 0; j < 5; j++) {
            that.spriteLocations["balls" + j] = "assets/Sprites/balls" + j + ".png";
            that.imageLength++;
            sm.addIterationToStep(sonicStep, "balls" + j);
        }
        for (j = 0; j < 2; j++) {
            that.spriteLocations["duck" + j] = "assets/Sprites/duck" + j + ".png";
            that.imageLength++;
            sm.addIterationToStep(sonicStep, "duck" + j);
        }
        for (j = 0; j < 2; j++) {
            that.spriteLocations["hit" + j] = "assets/Sprites/hit" + j + ".png";
            that.imageLength++;
            sm.addIterationToStep(sonicStep, "hit" + j);
        }
        for (j = 0; j < 6; j++) {
            that.spriteLocations["spindash" + j] = "assets/Sprites/spindash" + j + ".png";
            that.imageLength++;
            sm.addIterationToStep(sonicStep, "spindash" + j);
        }

        for (j = 0; j < 7; j++) {
            that.spriteLocations["spinsmoke" + j] = "assets/Sprites/spinsmoke" + j + ".png";
            that.imageLength++;
            sm.addIterationToStep(sonicStep, "spinsmoke" + j);
        }
        for (j = 0; j < 4; j++) {
            that.spriteLocations["haltsmoke" + j] = "assets/Sprites/haltsmoke" + j + ".png";
            that.imageLength++;
            sm.addIterationToStep(sonicStep, "haltsmoke" + j);
        }






    };
}

ClickState = { PlaceChunk: 0, PlaceRing: 1 };

function SpriteLoader(completed, update) {
    var that = this;
    this.stepIndex = 0;
    this.steps = [];
    this.tickIndex = 0;
    this.tick = function () {
        if (this.stepIndex == this.steps.length) {
            completed();
            return true;
        }
        var stp = this.steps[this.stepIndex];

        if (that.tickIndex%5==0)
            update("Caching: " + stp.title + " " + (that.tickIndex + "/" + stp.iterations.length);

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
    this.addStep = function (title, method, onFinish) {
        this.steps.push({ title: title, method: method, finish: onFinish, iterations: [] });
        return this.steps.length - 1;
    };
    this.addIterationToStep = function (stepIndex, index) {
        this.steps[stepIndex].iterations.push(index);
    };
}

