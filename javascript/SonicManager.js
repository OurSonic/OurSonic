

function SonicManager(mainCanvas) {
    this.windowLocation = { x: 0, y: 0, width: 320, height: 240 };
    var scale = this.scale = { x: 2, y: 2 };
    this.loading = true;
    this.showHeightMap = false;
    this.goodRing = new Ring(false);
    this.activeRings = [];

    this.uiManager = new UIManager(this, mainCanvas, this.scale);

    this.SonicLevel = {
        Tiles: [],
        TilePieces: [],
        TileChunks: [],
        ChunkMap: [],
        Rings: {}
    };


    var lamesauce = new TileChunk() + new TilePiece() + new Tile() + new HeightMask();

    for (var x_ = 0; x_ < 10; x_++) {
        for (var y_ = 0; y_ < 10; y_++) {
            this.SonicLevel.ChunkMap[y_ * 10 + x_] = 0;
        }
    }

    this.clickState = ClickState.PlaceChunk;


    this.onClick = function (e) {
        if (e.shiftKey) {
            var ch = this.SonicLevel.TileChunks[this.SonicLevel.ChunkMap[Math.floor(e.x / (128 * scale.x)) + Math.floor(e.y / (128 * scale.y)) * 10]];

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
                    this.SonicLevel.ChunkMap[Math.floor(e.x / (128 * scale.x)) + Math.floor(e.y / (128 * scale.y)) * 10] = this.uiManager.indexes.modifyIndex;
                    break;
                case ClickState.PlaceRing:
                    var ex = Math.floor((e.x - Math.floor(e.x / (128 * scale.x)) * (128 * scale.x)) / (scale.x));
                    var ey = Math.floor((e.y - Math.floor(e.y / (128 * scale.y)) * (128 * scale.y)) / (scale.y));

                    var es = (Math.floor(ex / 16)) + (Math.floor(e.x / (128 * scale.x))) * 8;
                    var ek = (Math.floor(ey / 16)) + (Math.floor(e.y / (128 * scale.y))) * 8;

                    if (this.SonicLevel.Rings[ek * 8 * 10 + es]) {
                        delete this.SonicLevel.Rings[ek * 8 * 10 + es];
                        //                        this.SonicLevel.Rings = this.SonicLevel.Rings.splice(this.SonicLevel.Rings.indexOf(ek * 8 * 10 + es), 1);
                    } else {
                        this.SonicLevel.Rings[ek * 8 * 10 + es] = { x: es, y: ek };
                    }

                    break;
                default:
            }
        }


        
    };

    this.tickCount = 0;
    this.drawTickCount = 0;

    this.tick = function (that) {
        if (that.sonicToon) {
            that.tickCount++;
            if (that.loading) {
                if (!that.sonicToon.isLoading()) {
                    that.loading = false;
                }
            } else {
                that.sonicToon.tick(that.SonicLevel, scale);
                if (that.sonicToon.y > 128 * 10) {
                    that.sonicToon.y = 0;
                }
                if (that.sonicToon.x > 128 * 10) {
                    that.sonicToon.x = 0;
                }
            }
        }
    };

    this.draw = function (canvas) {
        canvas.save();
        this.drawTickCount++;
        if (!this.inds || !this.inds.done) {
            if (!this.inds) return;
            canvas.fillStyle = "white";
            canvas.fillText("Loading...   " + (this.inds.tc + this.inds.tp + this.inds.t) + " / " + (this.inds.total), 95, 95);
            canvas.restore();
            return;
        }




        if (this.sonicToon) {
            if (this.loading) {
                canvas.fillStyle = "white";
                canvas.fillText("Loading...", 60, 60);
                canvas.restore();
                return;
            }

            canvas.beginPath();
            canvas.rect(0, 0, this.windowLocation.width * scale.x, this.windowLocation.height * scale.x);
            canvas.clip();
            this.windowLocation.x = Math.floor(this.sonicToon.x - 160);
            this.windowLocation.y = Math.floor(this.sonicToon.y - 180);
            if (this.windowLocation.x < 0) this.windowLocation.x = 0;
            if (this.windowLocation.y < 0) this.windowLocation.y = 0;

            if (this.windowLocation.x > 128 * 10 - this.windowLocation.width) this.windowLocation.x = 128 * 10 - this.windowLocation.width;
            if (this.windowLocation.y > 128 * 10 - this.windowLocation.height) this.windowLocation.y = 128 * 10 - this.windowLocation.height;
        }

        for (var j = 0; j < this.SonicLevel.ChunkMap.length; j++) {
            if (!this.SonicLevel.TileChunks[this.SonicLevel.ChunkMap[j]]) continue;
            var cX = (j % 10);
            var cY = Math.floor(j / 10);

            var pos = { x: cX * 128 * scale.x, y: cY * 128 * scale.y };
            if (!this.sonicToon || (pos.x >= (this.windowLocation.x - 128) * scale.x && pos.y >= (this.windowLocation.y - 128) * scale.y &&
                pos.x <= (this.windowLocation.x + 128) * scale.x + this.windowLocation.width * scale.x && pos.y <= (this.windowLocation.y + 128) * scale.y + this.windowLocation.height * scale.y)) {

                var posj = { x: pos.x - this.windowLocation.x * scale.x, y: pos.y - this.windowLocation.y * scale.x };

                var state = this.showHeightMap ? 2 : this.sonicToon ? 0 : 1;
                this.SonicLevel.TileChunks[this.SonicLevel.ChunkMap[j]].draw(canvas, posj, scale, state);


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
            if (ac.tickCount > 256 ) {
                _H.remove(this.activeRings,ac);
            } 
        }
       
        if (this.sonicToon) {
            this.sonicToon.draw(canvas, scale);
            if (this.windowLocation.x < 0) this.windowLocation.x = 0;
            if (this.windowLocation.y < 0) this.windowLocation.y = 0;

            if (this.windowLocation.x > 128 * 10 - this.windowLocation.width) this.windowLocation.x = 128 * 10 - this.windowLocation.width;
            if (this.windowLocation.y > 128 * 10 - this.windowLocation.height) this.windowLocation.y = 128 * 10 - this.windowLocation.height;




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
                    tilePieces.push(new TilePiece(new HeightMask(RotationMode.Ground, 180), tp));
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



    this.SpriteCache = { rings: [] };
    this.preLoadSprites = function(scale, completed) {
        var ci = this.SpriteCache.rings;
        var inj = 0;

        var spriteLocations = [];

        for (var j = 0; j < 4; j++) {
            spriteLocations[j] = "assets/Sprites/ring" + j + ".png";
            this.imageLength++;
        }

        for (var i = 0; i < spriteLocations.length; i++) {

            var sp = i * 200;
            ci[sp] = _H.loadSprite(spriteLocations[i], function(jd) {
                ci[jd.tag * 200 + scale.x * 100 + scale.y] = _H.scaleSprite(jd, scale, function(jc) {
                    inj = inj + 1;
                    if (inj == 4) {
                        if (completed) completed();
                    }
                });
            });
            ci[sp].tag = i;


        }
    };
}





ClickState = { PlaceChunk: 0, PlaceRing: 1 };