

function SonicManager(mainCanvas) {
    var scale = this.scale = { x: 2, y: 2 };
    this.windowLocation = _H.defaultWindowLocation(1);
    this.showHeightMap = false;
    this.goodRing = new Ring(false);
    this.activeRings = [];

    this.uiManager = new UIManager(this, mainCanvas, this.scale);

    this.SonicLevel = {
        Tiles: [],
        TilePieces: [],
        TileChunks: [],
        ChunkMap: [],
        Rings: {},
        curHeightMap: true, LevelWidth: 0, LevelHeight: 0
    };


    var lamesauce = new TileChunk() + new TilePiece() + new Tile() + new HeightMask();
    this.SonicLevel.ChunkMap = [];
    this.clickState = ClickState.PlaceChunk;


    this.onClick = function (e) {
        if (e.shiftKey) {
            var ch = this.SonicLevel.TileChunks[this.SonicLevel.ChunkMap[Math.floor(e.x / (128 * scale.x)) + Math.floor(e.y / (128 * scale.y)) * sonicManager.SonicLevel.LevelWidth]];

            var tp = ch.getTilePiece((e.x - Math.floor(e.x / (128 * scale.x)) * (128 * scale.x)), (e.y - Math.floor(e.y / (128 * scale.y)) * (128 * scale.y)), scale);
            if (tp) {
                this.uiManager.indexes.tpIndex = this.SonicLevel.TilePieces.indexOf(tp);
                this.uiManager.modifyTilePieceArea.tilePiece = tp;
                this.uiManager.solidTileArea.visible = true;
            }
        } else
            if (!e.button || e.button == 0) {
                switch (this.clickState) {
                    case ClickState.PlaceChunk:
                        this.SonicLevel.ChunkMap[Math.floor(e.x / (128 * scale.x)) + Math.floor(e.y / (128 * scale.y)) * sonicManager.SonicLevel.LevelWidth] = this.uiManager.indexes.modifyIndex;
                        break;
                    case ClickState.PlaceRing:
                        var ex = Math.floor((e.x - Math.floor(e.x / (128 * scale.x)) * (128 * scale.x)) / (scale.x));
                        var ey = Math.floor((e.y - Math.floor(e.y / (128 * scale.y)) * (128 * scale.y)) / (scale.y));

                        var es = (Math.floor(ex / 16)) + (Math.floor(e.x / (128 * scale.x))) * 8;
                        var ek = (Math.floor(ey / 16)) + (Math.floor(e.y / (128 * scale.y))) * 8;

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
            that.sonicToon.tick(that.SonicLevel, scale);
            if (that.sonicToon.y > 128 * sonicManager.SonicLevel.LevelHeight) {
                that.sonicToon.y = 0;
            }
            if (that.sonicToon.x > 128 * sonicManager.SonicLevel.LevelWidth) {
                that.sonicToon.x = 0;
            }
        }
    };

    this.draw = function (canvas) {
        canvas.save();
        this.drawTickCount++;
        if (this.loading) {
            canvas.fillStyle = "white";
            canvas.fillText("Loading...   " /*+ (this.inds.tc + this.inds.tp + this.inds.t) + " / " + (this.inds.total)*/, 95, 95);
            canvas.restore();
            return;
        }


        if (this.sonicToon) {
            canvas.translate(canvas.canvas.width / 2 - this.windowLocation.width * scale.x / 2, canvas.canvas.height / 2 - this.windowLocation.height * scale.y / 2);

            canvas.fillStyle = "#000000";
            canvas.fillRect(0, 0, this.windowLocation.width * scale.x, this.windowLocation.height * scale.x);

            canvas.beginPath();
            canvas.rect(0, 0, this.windowLocation.width * scale.x, this.windowLocation.height * scale.x);
            canvas.clip();
            this.windowLocation.x = Math.floor(this.sonicToon.x - 160);
            this.windowLocation.y = Math.floor(this.sonicToon.y - 180);
        }


        if (this.windowLocation.x < 0) this.windowLocation.x = 0;
        if (this.windowLocation.y < 0) this.windowLocation.y = 0;

        if (this.windowLocation.x > 128 * sonicManager.SonicLevel.LevelWidth - this.windowLocation.width) this.windowLocation.x = 128 * sonicManager.SonicLevel.LevelWidth - this.windowLocation.width;
        if (this.windowLocation.y > 128 * sonicManager.SonicLevel.LevelHeight - this.windowLocation.height) this.windowLocation.y = 128 * sonicManager.SonicLevel.LevelHeight - this.windowLocation.height;



        for (var j = 0; j < this.SonicLevel.ChunkMap.length; j++) {
            if (!this.SonicLevel.TileChunks[this.SonicLevel.ChunkMap[j]]) continue;
            var cX = (j % sonicManager.SonicLevel.LevelWidth);
            var cY = Math.floor(j / sonicManager.SonicLevel.LevelWidth);

            var pos = { x: cX * 128 * scale.x, y: cY * 128 * scale.y };
            if ((pos.x >= (this.windowLocation.x - 128) * scale.x && pos.y >= (this.windowLocation.y - 128) * scale.y &&
                pos.x <= (this.windowLocation.x + 128) * scale.x + this.windowLocation.width * scale.x && pos.y <= (this.windowLocation.y + 128) * scale.y + this.windowLocation.height * scale.y)) {

                var posj = { x: pos.x - this.windowLocation.x * scale.x, y: pos.y - this.windowLocation.y * scale.x };

                this.SonicLevel.TileChunks[this.SonicLevel.ChunkMap[j]].draw(canvas, posj, scale, 0);


                if (!this.sonicToon) {
                    canvas.strokeStyle = "#DD0033";
                    canvas.lineWidth = 3;
                    canvas.strokeRect(posj.x, posj.y, 128 * scale.x, 128 * scale.y);
                }
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


        for (var j = 0; j < this.SonicLevel.ChunkMap.length; j++) {
            if (!this.SonicLevel.TileChunks[this.SonicLevel.ChunkMap[j]]) continue;
            var cX = (j % sonicManager.SonicLevel.LevelWidth);
            var cY = Math.floor(j / sonicManager.SonicLevel.LevelWidth);

            var pos = { x: cX * 128 * scale.x, y: cY * 128 * scale.y };
            if ((pos.x >= (this.windowLocation.x - 128) * scale.x && pos.y >= (this.windowLocation.y - 128) * scale.y &&
                pos.x <= (this.windowLocation.x + 128) * scale.x + this.windowLocation.width * scale.x && pos.y <= (this.windowLocation.y + 128) * scale.y + this.windowLocation.height * scale.y)) {

                var posj = { x: pos.x - this.windowLocation.x * scale.x, y: pos.y - this.windowLocation.y * scale.x };
                var chunk = this.SonicLevel.TileChunks[this.SonicLevel.ChunkMap[j]];
                chunk.draw(canvas, posj, scale, 1);




                if (this.showHeightMap) {


                    var fd;
                    if ((fd = sonicManager.SpriteCache.heightMapChunks[(this.SonicLevel.curHeightMap ? 1 : 2) + " " + chunk.index + " " + scale.y + " " + scale.x])) {
                        if (fd.loaded) {
                            canvas.drawImage(fd, posj.x, posj.y);
                        }

                    } else {
                        var hm = this.SonicLevel.curHeightMap ? chunk.heightMap1 : chunk.heightMap2;

                        for (var _y = 0; _y < 8; _y++) {
                            for (var _x = 0; _x < 8; _x++) {


                                var hd = hm[_x + _y * 8];

                                if (hd == 0) continue;
                                if (hd == 1) {
                                    canvas.fillStyle = "rgba(24,98,235,0.6)";
                                    canvas.fillRect(posj.x + (_x * 16) * scale.x, posj.y + (_y * 16) * scale.y, scale.x * 16, scale.y * 16);
                                    continue;
                                }
                                hd.draw(canvas, { x: posj.x + (_x * 16) * scale.x, y: posj.y + (_y * 16) * scale.y }, scale, -1);

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
            this.sonicToon.drawUI(canvas, { x: 0, y: 0 }, scale);

        }

    };

    this.importChunkFromImage = function (image) {
        var data = _H.getImageData(image);
        if (data.length != 128 * 128 * 4) {
            alert('Chunk size incorrect');
        }
        var start = this.SonicLevel.Tiles.length;
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

                        colors.push(_H.colorFromData(data, f));
                    }
                }
                ind = _H.compareTiles(this.SonicLevel.Tiles, tiles, colors);
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
            this.SonicLevel.Tiles.push(tiles[i]);
        }

        var tilePieces = [];

        var startPieces = this.SonicLevel.TilePieces.length;
        for (y = 0; y < 8; y++) {
            for (x = 0; x < 8; x++) {
                var tp = [tileIndexes[((y * 2) * 16 + (x * 2))],
                    tileIndexes[((y * 2) * 16 + (x * 2 + 1))],
                    tileIndexes[((y * 2 + 1) * 16 + (x * 2))],
                    tileIndexes[((y * 2 + 1) * 16 + (x * 2 + 1))]];
                ind = _H.compareTilePieces(this.SonicLevel.TilePieces, tilePieces, tp);
                if (ind == -1) {
                    tilePieceIndexes.push(startPieces + tilePieces.length);
                    tilePieces.push(new TilePiece(tp));
                } else {
                    tilePieceIndexes.push(ind);
                }
            }
        }
        for (i = 0; i < tilePieces.length; i++) {
            this.SonicLevel.TilePieces.push(tilePieces[i]);
        }
        var pieces = [];
        for (y = 0; y < 8; y++) {
            for (x = 0; x < 8; x++) {
                pieces.push(tilePieceIndexes[y * 8 + x]);
            }
        }

        this.SonicLevel.TileChunks.push(new TileChunk(pieces));
    };



    this.SpriteCache = { rings: [], tileChunks: [], tilePeices: [], tiles: [], sonicSprites: [], heightMaps: [], heightMapChunks: [] };
    this.preLoadSprites = function (scale, completed, update) {
        var ci = this.SpriteCache.rings;
        var inj = 0;

        var spriteLocations = [];

        for (var j = 0; j < 4; j++) {
            spriteLocations[j] = "assets/Sprites/ring" + j + ".png";
            this.imageLength++;
        }
        var that = this;

        for (var i = 0; i < spriteLocations.length; i++) {

            var sp = i * 200;
            ci[sp] = _H.loadSprite(spriteLocations[i], function (jd) {
                ci[jd.tag * 200 + scale.x * 100 + scale.y] = _H.scaleSprite(jd, scale, function (jc) {
                    inj = inj + 1;
                    if (inj == 4) {
                        that.loadingStepOne();
                    }
                });
            });
            ci[sp].tag = i;
        }


        var md;
        var ind_ = { tps: 0, tcs: 0, ss: 0, hms: 0, hmc: 0 };

        this.loadingStepOne = function () {
            update("preloading tiles");

            var dn = function () {
                ind_.tps++;
                if (ind_.tps == that.SonicLevel.TilePieces.length * 2) {
                    that.loadingStepFour();
                }
            };

            for (var k = 0; k < this.SonicLevel.TilePieces.length; k++) {

                var canv = _H.defaultCanvas(16 * scale.x, 16 * scale.y);
                var ctx = canv.context;
                ctx.clearRect(0, 0, canv.width, canv.height);

                md = this.SonicLevel.TilePieces[k];
                md.draw(ctx, { x: 0, y: 0 }, scale, 0);
                var fc = canv.canvas.toDataURL("image/png");
                this.SpriteCache.tilePeices[0 + " " + md.index + " " + scale.y + " " + scale.x] = _H.loadSprite(fc, dn);

                canv = _H.defaultCanvas(16 * scale.x, 16 * scale.y);
                ctx = canv.context;
                ctx.clearRect(0, 0, canv.width, canv.height);

                md.draw(ctx, { x: 0, y: 0 }, scale, 1);
                var fc = canv.canvas.toDataURL("image/png");
                this.SpriteCache.tilePeices[1 + " " + md.index + " " + scale.y + " " + scale.x] = _H.loadSprite(fc, dn);
            }
        };

        this.loadingStepFour = function () {
            update("preloading height masks");


            var done = function () {
                ind_.hms++;
                if (ind_.hms == that.SonicLevel.heightIndexes.length) {
                    that.loadingStepTwo();
                }
            };


            for (var k = 0; k < this.SonicLevel.heightIndexes.length; k++) {
                var canv = _H.defaultCanvas(16 * scale.x, 16 * scale.y);
                var ctx = canv.context;
                ctx.clearRect(0, 0, canv.width, canv.height);
                md = this.SonicLevel.heightIndexes[k];
                md.index = k;
                md.draw(ctx, { x: 0, y: 0 }, scale, -1);
                var fc = canv.canvas.toDataURL("image/png");
                this.SpriteCache.heightMaps[md.index + " " + scale.y + " " + scale.x] = _H.loadSprite(fc, done);

            }
        };

        this.loadingStepTwo = function () {
            update("preloading chunks");


            var done = function () {
                if (ind_.tcs == that.SonicLevel.TileChunks.length * 2 && ind_.hmc == that.SonicLevel.TileChunks.length * 2) {
                    that.loadingStepThree();
                }
            };


            for (var k = 0; k < this.SonicLevel.TileChunks.length; k++) {
                var canv = _H.defaultCanvas(128 * scale.x, 128 * scale.y);
                var ctx = canv.context;
                ctx.clearRect(0, 0, canv.width, canv.height);
                md = this.SonicLevel.TileChunks[k];
                md.draw(ctx, { x: 0, y: 0 }, scale, 0);
                var fc = canv.canvas.toDataURL("image/png");
                this.SpriteCache.tileChunks[0 + " " + md.index + " " + scale.y + " " + scale.x] = _H.loadSprite(fc, function (f) { ind_.tcs++; done(); });

                canv = _H.defaultCanvas(128 * scale.x, 128 * scale.y);
                ctx = canv.context;
                ctx.clearRect(0, 0, canv.width, canv.height);

                md.draw(ctx, { x: 0, y: 0 }, scale, 1);
                var fc = canv.canvas.toDataURL("image/png");
                this.SpriteCache.tileChunks[1 + " " + md.index + " " + scale.y + " " + scale.x] = _H.loadSprite(fc, function (f) { ind_.tcs++; done(); });


                var posj = { x: 0, y: 0 };


                canv = _H.defaultCanvas(128 * scale.x, 128 * scale.y);
                ctx = canv.context;
                ctx.clearRect(0, 0, canv.width, canv.height);

                var hm = md.heightMap1;
                for (var _y = 0; _y < 8; _y++) {
                    for (var _x = 0; _x < 8; _x++) {
                        var hd = hm[_x + _y * 8];
                        if (hd == 0) continue;
                        if (hd == 1) {
                            ctx.fillStyle = "rgba(24,98,235,0.6)";
                            ctx.fillRect(posj.x + (_x * 16) * scale.x, posj.y + (_y * 16) * scale.y, scale.x * 16, scale.y * 16);
                            continue;
                        }
                        hd.draw(ctx, { x: posj.x + (_x * 16) * scale.x, y: posj.y + (_y * 16) * scale.y }, scale, -1);
                    }
                }

                var fc = canv.canvas.toDataURL("image/png");
                this.SpriteCache.heightMapChunks[1 + " " + md.index + " " + scale.y + " " + scale.x] = _H.loadSprite(fc, function (f) { ind_.hmc++; done(); });
                 


                canv = _H.defaultCanvas(128 * scale.x, 128 * scale.y);
                ctx = canv.context;
                ctx.clearRect(0, 0, canv.width, canv.height);

                var hm = md.heightMap2;
                for (var _y = 0; _y < 8; _y++) {
                    for (var _x = 0; _x < 8; _x++) {
                        var hd = hm[_x + _y * 8];
                        if (hd == 0) continue;
                        if (hd == 1) {
                            ctx.fillStyle = "rgba(24,98,235,0.6)";
                            ctx.fillRect(posj.x + (_x * 16) * scale.x, posj.y + (_y * 16) * scale.y, scale.x * 16, scale.y * 16);
                            continue;
                        }
                        hd.draw(ctx, { x: posj.x + (_x * 16) * scale.x, y: posj.y + (_y * 16) * scale.y }, scale, -1);
                    }
                }

                var fc = canv.canvas.toDataURL("image/png");
                this.SpriteCache.heightMapChunks[2 + " " + md.index + " " + scale.y + " " + scale.x] = _H.loadSprite(fc, function (f) { ind_.hmc++; done(); });

            }
        };


        this.loadingStepThree = function () {

            update("preloading sonic");

            this.spriteLocations = [];
            this.imageLength = 0;

            this.spriteLocations["normal"] = "assets/Sprites/sonic.png";
            this.imageLength++;
            var j;
            for (j = 0; j < 4; j++) {
                this.spriteLocations["fastrunning" + j] = "assets/Sprites/fastrunning" + j + ".png";
                this.imageLength++;
            }
            for (j = 0; j < 8; j++) {
                this.spriteLocations["running" + j] = "assets/Sprites/running" + j + ".png";
                this.imageLength++;
            }
            for (j = 0; j < 4; j++) {
                this.spriteLocations["breaking" + j] = "assets/Sprites/breaking" + j + ".png";
                this.imageLength++;
            }
            for (j = 0; j < 5; j++) {
                this.spriteLocations["balls" + j] = "assets/Sprites/balls" + j + ".png";
                this.imageLength++;
            }
            for (j = 0; j < 2; j++) {
                this.spriteLocations["duck" + j] = "assets/Sprites/duck" + j + ".png";
                this.imageLength++;
            }
            for (j = 0; j < 2; j++) {
                this.spriteLocations["hit" + j] = "assets/Sprites/hit" + j + ".png";
                this.imageLength++;
            }
            for (j = 0; j < 6; j++) {
                this.spriteLocations["spindash" + j] = "assets/Sprites/spindash" + j + ".png";
                this.imageLength++;
            }

            for (j = 0; j < 7; j++) {
                this.spriteLocations["spinsmoke" + j] = "assets/Sprites/spinsmoke" + j + ".png";
                this.imageLength++;
            }
            for (j = 0; j < 4; j++) {
                this.spriteLocations["haltsmoke" + j] = "assets/Sprites/haltsmoke" + j + ".png";
                this.imageLength++;
            }
            var ci = this.SpriteCache.sonicSprites;
            for (var sp in this.spriteLocations) {
                ci[sp] = _H.loadSprite(this.spriteLocations[sp], function (jd) {
                    ci[jd.tag + scale.x + scale.y] = _H.scaleSprite(jd, scale, function (jc) {
                        ind_.ss++;
                        if (ind_.ss == that.imageLength) {
                            if (completed) completed();
                        }

                    });
                });
                ci[sp].tag = sp;
            }


        };



    };
}





ClickState = { PlaceChunk: 0, PlaceRing: 1 };