

function SonicManager(mainCanvas, resize) {
    var scale = this.scale = { x: 2, y: 2 };
    window.sonicManager = this;
    this.windowLocation = _H.defaultWindowLocation(1, mainCanvas, scale);
    this.showHeightMap = false;
    this.goodRing = new Ring(false);
    this.activeRings = [];
    this.forceResize = resize;

    this.background = null;

    this.uiManager = new UIManager(this, mainCanvas, this.scale);

    this.SonicLevel = {
        Tiles: [],
        Blocks: [],
        Chunks: [],
        ChunkMap: [[]],
        Rings: {},
        curHeightMap: true, LevelWidth: 0, LevelHeight: 0
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

    var lamesauce = new TileChunk() + new TilePiece() + new Tile() + new HeightMask();
    this.SonicLevel.ChunkMap = [[]];
    this.clickState = ClickState.Dragging;



    this.onClick = function (e) {
        e = { x: e.x / scale.x + this.windowLocation.x, y: e.y / scale.y + this.windowLocation.y };

        if (!e.button || e.button == 0) {
            switch (this.clickState) {
                case ClickState.Dragging:
                    return;
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

                    break;
                case ClickState.PlaceRing:
                    var ex = _H.floor((e.x));
                    var ey = _H.floor((e.y));
                    this.SonicLevel.Rings.push({ X: ex, Y: ey });
                    break;
                case ClickState.PlaceObject:
                    var ex = _H.floor((e.x));
                    var ey = _H.floor((e.y));

                    for (var l = 0; l < sonicManager.SonicLevel.Objects.length; l++) {
                        var o = sonicManager.SonicLevel.Objects[l];

                        if (_H.intersects2(o.getRect(), { X: ex, Y: ey })) {
                            alert(_H.stringify(o));
                        }
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
        _H.save(canvas);
        this.drawTickCount++;
        if ((this.spriteLoader && !this.spriteLoader.tick()) || this.loading) {
            canvas.fillStyle = "white";
            canvas.fillText("Loading...   " /*+ (this.inds.tc + this.inds.tp + this.inds.t) + " / " + (this.inds.total)*/, 95, 95);
            _H.restore(canvas);
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

            if (this.background) {
                this.background.draw(canvas, { x: -_H.floor(this.windowLocation.x / 2) * scale.x, y: -(_H.floor(this.windowLocation.y / 4)) * scale.y }, scale, wOffset);
            }
        }


        if (this.windowLocation.x < 0) this.windowLocation.x = 0;
        if (this.windowLocation.y < 0) this.windowLocation.y = 0;

        if (this.windowLocation.x > 128 * sonicManager.SonicLevel.LevelWidth - this.windowLocation.width) this.windowLocation.x = 128 * sonicManager.SonicLevel.LevelWidth - this.windowLocation.width;
        if (this.windowLocation.y > 128 * sonicManager.SonicLevel.LevelHeight - this.windowLocation.height) this.windowLocation.y = 128 * sonicManager.SonicLevel.LevelHeight - this.windowLocation.height;
        var offs = [];
        for (var i = -1; i < this.windowLocation.width / 128; i += 1) {
            for (var a = -1; a < this.windowLocation.height / 128; a += 1) {
                offs.push({ x: i, y: a });
            }
        }

        if (this.SonicLevel.Chunks && this.SonicLevel.Chunks.length > 0) {
            var cd = this.SonicLevel.AnimatedChunks;
            for (var k = 0; k < cd.length; k++) {
                cd[k].animatedTick();
            }

            var fxP = _H.floor((this.windowLocation.x + 128) / 128);
            var fyP = _H.floor((this.windowLocation.y + 128) / 128);
            for (var off in offs) {
                var _xP = fxP + offs[off].x;
                var _yP = fyP + offs[off].y;
                if (_xP < 0 || _yP < 0 || _xP >= this.SonicLevel.LevelWidth || _yP >= this.SonicLevel.LevelHeight) continue;
                var chunk = this.SonicLevel.Chunks[this.SonicLevel.ChunkMap[_xP][_yP]];

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
                        if (this.windowLocation.intersects(r))
                            this.goodRing.draw(canvas, { x: (r.X) - this.windowLocation.x, y: (r.Y) - this.windowLocation.y }, scale, true);
                } else {
                    if (this.windowLocation.intersects(r))
                        this.goodRing.draw(canvas, { x: (r.X) - this.windowLocation.x, y: (r.Y) - this.windowLocation.y }, scale, false);
                }
            }
            for (var l = 0; l < sonicManager.SonicLevel.Objects.length; l++) {
                var o = sonicManager.SonicLevel.Objects[l];
                if (this.sonicToon) {
                    if (this.windowLocation.intersects({ X: o.ObjectData.X, Y: o.ObjectData.Y }))
                        o.draw(canvas, { x: (o.ObjectData.X) - this.windowLocation.x, y: (o.ObjectData.Y) - this.windowLocation.y }, scale, true);
                } else {
                    if (this.windowLocation.intersects({ X: o.ObjectData.X, Y: o.ObjectData.Y }))
                        o.draw(canvas, { x: (o.ObjectData.X) - this.windowLocation.x, y: (o.ObjectData.Y) - this.windowLocation.y }, scale, false);
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
                var _xP = fxP + offs[off].x;
                var _yP = fyP + offs[off].y;
                if (_xP < 0 || _yP < 0 || _xP >= this.SonicLevel.LevelWidth || _yP >= this.SonicLevel.LevelHeight) continue;
                var chunk = this.SonicLevel.Chunks[this.SonicLevel.ChunkMap[_xP][_yP]];

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

                    }
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
        /*
        var tileStep = sm.addStep("Tiles", function (k, done) {
        var canv = _H.defaultCanvas(16 * scale.x, 16 * scale.y);
        var ctx = canv.context;
        ctx.clearRect(0, 0, canv.width, canv.height);

        md = that.SonicLevel.Blocks[k];
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
        if (ind_.tps == that.SonicLevel.Blocks.length * 2) {
        return true;
        }
        return false;
        });



        for (var k = 0; k < this.SonicLevel.Blocks.length; k++) {
        sm.addIterationToStep(tileStep, k);
        }*/


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
            ctx.clearRect(0, 0, canv.width, canv.height);
            md = that.SonicLevel.Chunks[k];


            md.draw(ctx, { x: 0, y: 0 }, scale, false);
            var fc = canv.canvas.toDataURL("image/png");

            that.SpriteCache.tileChunks[false + " " + md.index + " " + scale.y + " " + scale.x + " -"] = _H.loadSprite(fc, function (f) {
                ind_.tcs++;
                done();
            });

            canv = _H.defaultCanvas(128 * scale.x, 128 * scale.y);
            ctx = canv.context;
            ctx.clearRect(0, 0, canv.width, canv.height);


            if (!md.onlyBackground()) {
                md.draw(ctx, { x: 0, y: 0 }, scale, true);
                var fc = canv.canvas.toDataURL("image/png");
                that.SpriteCache.tileChunks[true + " " + md.index + " " + scale.y + " " + scale.x + " -"] = _H.loadSprite(fc, function (f) {
                    ind_.tcs++;
                    done();
                });
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
                    var fc = canv.canvas.toDataURL("image/png");
                    that.SpriteCache.tileChunks[true + " " + md.index + " " + scale.y + " " + scale.x + " " + c] = _H.loadSprite(fc, function (f) {

                    });

                    canv = _H.defaultCanvas(128 * scale.x, 128 * scale.y);
                    ctx = canv.context;
                    ctx.clearRect(0, 0, canv.width, canv.height);

                    md.draw(ctx, { x: 0, y: 0 }, scale, false, c);
                    var fc = canv.canvas.toDataURL("image/png");
                    that.SpriteCache.tileChunks[false + " " + md.index + " " + scale.y + " " + scale.x + " " + c] = _H.loadSprite(fc, function (f) {

                    });
                }
                sonicManager.CACHING = true;
            }


            var posj = { x: 0, y: 0 };
            canv = _H.defaultCanvas(128 * scale.x, 128 * scale.y);
            ctx = canv.context;
            ctx.clearRect(0, 0, canv.width, canv.height);



            var canv2 = _H.defaultCanvas(128 * scale.x, 128 * scale.y);
            var ctx2 = canv2.context;

            ctx2.clearRect(0, 0, canv2.width, canv2.height);


            for (var _y = 0; _y < 8; _y++) {
                for (var _x = 0; _x < 8; _x++) {
                    var tp = md.tilePieces[_x][_y];
                    var hd = sonicManager.SonicLevel.HeightMaps[sonicManager.SonicLevel.CollisionIndexes1[tp.Block]];
                    var __x = _x;
                    var __y = _y;
                    if (hd == 0) {

                    } else
                        if (hd == 1) {
                            if (tp.Solid1 > 0) {
                                ctx.fillStyle = HeightMask.colors[tp.Solid1];
                                ctx.fillRect(posj.x + (__x * 16) * scale.x, posj.y + (__y * 16) * scale.y, scale.x * 16, scale.y * 16);
                            }

                        }
                        else {
                            var posm = { x: posj.x + (__x * 16) * scale.x, y: posj.y + (__y * 16) * scale.y };
                            hd.draw(ctx, posm, scale, -1, tp.XFlip, tp.YFlip, tp.Solid1);
                        }

                    /*
                    
                    var vangle = sonicManager.SonicLevel.Angles[mjj];
                    posm.x += 16 * scale.x / 2;
                    posm.y += 16 * scale.y / 2;
                    ctx.strokeStyle = "#DDD";
                    ctx.font = "18pt courier ";
                    ctx.shadowColor = "";
                    ctx.shadowBlur = 0;
                    ctx.lineWidth = 1;

                    ctx.strokeText(vangle.toString(16), posm.x - 12, posm.y + 7);*/

                    hd = sonicManager.SonicLevel.HeightMaps[sonicManager.SonicLevel.CollisionIndexes2[tp.Block]];
                    if (hd == 0) continue;
                    if (hd == 1) {
                        if (tp.Solid2 > 0) {
                            ctx2.fillStyle = HeightMask.colors[tp.Solid2];
                            ctx2.fillRect(posj.x + (__x * 16) * scale.x, posj.y + (__y * 16) * scale.y, scale.x * 16, scale.y * 16);
                        }


                        continue;
                    }
                    var posm = { x: posj.x + (__x * 16) * scale.x, y: posj.y + (__y * 16) * scale.y };
                    hd.draw(ctx2, posm, scale, -1, tp.XFlip, tp.YFlip, tp.Solid2);

                    /*

                    var vangle = sonicManager.SonicLevel.Angles[mjj];
                  
                    posm.x += 16 * scale.x / 2;
                    posm.y += 16 * scale.y / 2;

                    ctx2.strokeStyle = "#DDD";
                    ctx2.font = "18pt courier ";
                    ctx2.shadowColor = "";
                    ctx2.shadowBlur = 0;
                    ctx2.lineWidth = 1;
                    ctx2.strokeText(!vangle ? "XX" : vangle.toString(16), posm.x - 12, posm.y + 7);*/

                }
            }

            var fc = canv.canvas.toDataURL("image/png");
            that.SpriteCache.heightMapChunks[1 + " " + md.index + " " + scale.y + " " + scale.x] = _H.loadSprite(fc, function (f) { ind_.hmc++; done(); });


            fc = canv2.canvas.toDataURL("image/png");
            that.SpriteCache.heightMapChunks[2 + " " + md.index + " " + scale.y + " " + scale.x] = _H.loadSprite(fc, function (f) { ind_.hmc++; done(); });

        }, function () {
            if (ind_.tcs >= that.SonicLevel.Chunks.length * 2 / speed && ind_.hmc >= that.SonicLevel.Chunks.length * 2 / speed) {

                return true;
            }
            return false;
        }, false);

        for (var k = 0; k < this.SonicLevel.Chunks.length; k++) {
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
        }, false);




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
        for (j = 0; j < 2; j++) {
            that.spriteLocations["lookingup" + j] = "assets/Sprites/lookingup" + j + ".png";
            that.imageLength++;
            sm.addIterationToStep(sonicStep, "lookingup" + j);
        }



        /*var bgStep = sm.addStep("Background data", function (sp, done) {

        var canv = _H.defaultCanvas(that.SonicLevel.BackgroundWidth * 128 * scale.x, that.SonicLevel.BackgroundHeight * 128 * scale.y);
        var ctx = canv.context;
        ctx.clearRect(0, 0, canv.width, canv.height);

        for (var x = 0; x <that.SonicLevel.BackgroundWidth; x++) {
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

        });
        sm.addIterationToStep(bgStep, 0);
        
        */



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

