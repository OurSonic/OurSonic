function SonicManager(mainCanvas) {
    this.windowLocation = { x: 0, y: 0, width: 320, height: 240 };
    this.uiManager = new UIManager(this, mainCanvas);

    var scale =this.scale= { x: 2, y: 2 };

    this.SonicLevel = {
        Tiles: [],
        TilePieces: [],
        TileChunks: [],
        ChunkMap: []
    };


    var lamesauce = new TileChunk() + new TilePiece() + new Tile() + new HeightMask() + new Color();
    
    for (var x_ = 0; x_ < 10; x_++) {
        for (var y_ = 0; y_ < 10; y_++) {
            this.SonicLevel.ChunkMap[y_ * 10 + x_] = 0;
        }
    }


    this.onClick = function(e) {
        if (e.shiftKey) {
            var ch = this.SonicLevel.TileChunks[this.SonicLevel.ChunkMap[Math.floor(e.x / (128 * scale.x)) + Math.floor(e.y / (128 * scale.y)) * 10]];

            var tp = ch.getTilePiece((e.x - Math.floor(e.x / (128 * scale.x)) * (128 * scale.x)), (e.y - Math.floor(e.y / (128 * scale.y)) * (128 * scale.y)), scale);
            if (tp) {
                this.uiManager.indexes.tpIndex = this.SonicLevel.TilePieces.indexOf(tp);
                this.uiManager.modifyTilePieceArea.tilePiece = tp;
                this.uiManager.solidTileArea.visible = true;
            }
        } else {
            if (!e.button || e.button == 0) {
                this.SonicLevel.ChunkMap[Math.floor(e.x / (128 * scale.x)) + Math.floor(e.y / (128 * scale.y)) * 10] = this.uiManager.indexes.tcIndex;
            }
        }
    };
    this.tick = function (that) {

        if (that.sonicToon) {
            if (that.loading) {
                if (!that.sonicToon.isLoading()) {
                    that.loading = false;
                }
            }
            that.sonicToon.tick(that.SonicLevel, scale);
        }
    };
    this.loading = true;
    this.draw = function (canvas) {
        canvas.save();



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
        }

        for (var j = 0; j < this.SonicLevel.ChunkMap.length; j++) {
            if (!this.SonicLevel.TileChunks[this.SonicLevel.ChunkMap[j]]) continue;
            var pos = { x: (j % 10) * 128 * scale.x, y: Math.floor(j / 10) * 128 * scale.y };
            if (!this.sonicToon || (pos.x >= (this.windowLocation.x - 128) * scale.x && pos.y >= (this.windowLocation.y - 128) * scale.y &&
                pos.x <= (this.windowLocation.x + 128) * scale.x + this.windowLocation.width * scale.x && pos.y <= (this.windowLocation.y + 128) * scale.y + this.windowLocation.height * scale.y)) {

                var posj = { x: pos.x - this.windowLocation.x * scale.x, y: pos.y - this.windowLocation.y * scale.x };
                
                this.SonicLevel.TileChunks[this.SonicLevel.ChunkMap[j]].
                    draw(canvas, posj, scale, !this.sonicToon);

                if (!this.sonicToon) {
                    canvas.strokeStyle = "#DD0033";
                    canvas.lineWidth = 3;
                    canvas.strokeRect(posj.x, posj.y, 128 * scale.x, 128 * scale.y);
                }
            }

        }

        if (this.sonicToon) {
            //        this.sonicToon.x -= this.windowLocation.x;
            //        this.sonicToon.y -= this.windowLocation.y;
            this.sonicToon.draw(canvas, scale);
            //        this.sonicToon.x += this.windowLocation.x;
            //        this.sonicToon.y += this.windowLocation.y;

            if (this.windowLocation.x < 0) this.windowLocation.x = 0;
            if (this.windowLocation.y < 0) this.windowLocation.y = 0;
        }

        canvas.restore();
    };

    this.importChunkFromImage = function(image) {
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
                        colors.push(new Color(data[f], data[f + 1], data[f + 2]));
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
                    tilePieces.push(new TilePiece(new HeightMask(RotationMode.Ground, 45), tp));
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
}





