function Sonic(sonicLevel) {
    this.x = 10;
    this.y = 0;
    this.jumping = false;
    this.crouching = false;
    this.holdingLeft = false;
    this.holdingRight = false;
    this.levelWidth = 0;
    this.xsp = 0;
    this.ysp = 0;

    this.acc = 0.046875;
    this.dec = 0.5;
    this.frc = 0;

    this.jmp = 0;
    this.grv = 0.21875;



    this.sprite = new Image();
    var sprite1 = this.sprite;
    this.sprite.onload = function () {
        sprite1.loaded = true;
    };
    var j = "assets/Sprites/sonic.png";
    this.sprite.src = j;
    this.sonicLevel = sonicLevel;
    this.state = SonicState.Air;
    this.imageReady = false;
    this.tickCount = 0;
    this.draw = function (canvas, scale) {

        if (this.sprite.loaded && !this.imageReady) {
            var data = _H.getImageData(this.sprite);
            var colors = [];
            for (var f = 0; f < data.length; f += 4) {
                colors.push(new Color(data[f], data[f + 1], data[f + 2]));
            }

            var d = canvas.createImageData(this.sprite.width * scale.x, this.sprite.height * scale.y);

            _H.setDataFromColors(d.data, colors, scale, this.sprite.width, new Color(0, 0, 0));


            this.sprite = new Image();
            sprite1 = this.sprite;
            this.imageReady = true;
            this.sprite.onload = function () {
                sprite1.loaded = true;
            };
            this.sprite.src = _H.getBase64Image(d);

        }

        if (this.imageReady && this.sprite.loaded)
            canvas.drawImage(this.sprite, (this.x - 15) * scale.x, (this.y - 20) * scale.y, this.sprite.width, this.sprite.height);

        canvas.fillStyle = "white";

        canvas.fillRect((this.x ) * scale.x, (this.y ) * scale.y, 5, 5);

    };

    this.runningDir = 0;
    this.kill = function () {

    };

    this.tick = function (scale) {
        var fx = Math.floor(this.x);
        var fy = Math.floor(this.y);


        if (this.state == SonicState.Ground) {
            this.ysp = 0;
            if (this.holdingRight) {
                this.runningDir = +1;
                this.xsp += this.acc;
            } else
                if (this.holdingLeft) {
                    this.runningDir = -1;
                    this.xsp -= this.acc;
                }

            if (!this.holdingRight && !this.holdingLeft && this.runningDir != 0) {
                if (this.runningDir < 0) {
                    this.xsp += this.dec;
                    if (this.xsp > 0) {
                        this.xsp = 0;
                        this.runningDir = 0;
                    }
                } else if (this.runningDir > 0) {
                    this.xsp -= this.dec;
                    if (this.xsp < 0) {
                        this.xsp = 0;
                        this.runningDir = 0;
                    }
                }
            }

            var bad = false;
            while (this.heightInformation[((fx - 10) + (fy + 4) * this.levelWidth)]) {
                this.x++;
                fx++;
                bad = true;
                this.xsp = 0;

            }
            while (this.heightInformation[((fx + 10) + (fy + 4) * this.levelWidth)]) {
                if (bad)
                    this.kill();
                this.x--;
                fx--;
                this.xsp = 0;

            }
        } else {
            this.ysp += this.grv;
        }

        if (this.ysp >= 16)
            this.ysp = 16;

        if (!this.heightInformation[((fx - 9) + (fy + 20) * this.levelWidth)] && !this.heightInformation[((fx + 9) + (fy + 20) * this.levelWidth)]) {
            this.state = SonicState.Air;
        } else {
            this.state = SonicState.Ground;
            this.ysp = 0;

            while (this.heightInformation[((fx - 9) + (fy + 20) * this.levelWidth)] && this.heightInformation[((fx + 9) + (fy + 20) * this.levelWidth)]) {
                fy -= 1;
            }
            this.y = fy + 1;

        }


        this.x += this.xsp;
        this.y += this.ysp;

        /*var x = Math.floor(this.x / 128);
        var y = Math.floor(this.y / 128);

        var chunk = this.sonicLevel.TileChunks[this.sonicLevel.ChunkMap[x + y * 10]];
        x = this.x - x * 128;
        y = this.y - y * 128;

        var _x = Math.floor((x / 16));
        var _y = Math.floor((y / 16));

        if (!chunk) alert('');
        var tp = chunk.getTilePiece(x, y, { x: 1, y: 1 });
        _x = x - (_x * 16);
        _y = y - (_y * 16);
        */
        //        alert(tp.heightMask.items[_x] + " " + _y);

    };
    this.pressJump = function () {
        this.jumping = true;
    };

    this.pressCrouch = function () {
        this.crouching = true;

    };
    this.pressLeft = function () {
        this.holdingLeft = true;

    };
    this.pressRight = function () {
        this.holdingRight = true;

    };

    this.releaseJump = function () {
        this.jumping = false;

    };
    this.releaseCrouch = function () {
        this.crouching = false;
    };
    this.releaseLeft = function () {
        this.holdingLeft = false;
    };
    this.releaseRight = function () {
        this.holdingRight = false;

    };

    this.buildHeightInfo = function () {
        var hmap = [];
        hmap.length = sonicLevel.ChunkMap.length * 128 * 128;
        var size = Math.sqrt(sonicLevel.ChunkMap.length);
        this.levelWidth = size * 128;
        for (var y = 0; y < size; y++) {
            for (var x = 0; x < size; x++) {
                var chunk = sonicLevel.TileChunks[sonicLevel.ChunkMap[y * size + x]];
                for (var _y = 0; _y < 8; _y++) {
                    for (var _x = 0; _x < 8; _x++) {
                        var tp = sonicLevel.TilePieces[chunk.tilesPieces[_y * 8 + _x]];
                        for (var __y = 0; __y < 16; __y++) {
                            for (var __x = 0; __x < 16; __x++) {
                                //alert((x * 128 + _x * 8 + __x) + " " + (y * 128 + _y * 8 + __y) + " "  + "    " + ((x * 128 + _x * 8 + __x) + (y * 128 + _y * 8 + __y) * (size * 128)));
                                //                                alert(tp.heightMask.items[__x]+" "+__y);
                                hmap[(x * 128 + _x * 16 + __x) + (y * 128 + _y * 16 + __y) * (size * 128)] = (tp.heightMask.items[__x]) > 16 - __y;
                            }
                        }
                    }
                }

            }
        }
        return hmap;
    }
    this.heightInformation = this.buildHeightInfo(sonicLevel);
}


SonicState = { Air: 0, Ground: 1 }