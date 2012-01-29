function Sonic(sonicLevel, scale) {
    this.x = 20;
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
    this.frc = 0.046875;

    this.rdec = 0.125;
    this.rfrc = 0.0234375;

    this.jmp = -6.5;
    this.grv = 0.21875;
    this.air = 0.09375;

    this.standStill = true;
    this.sonicLevel = sonicLevel;
    this.state = SonicState.Ground;
    this.tickCount = 0;
    this.facing = true;
    this.ticking = false;
    this.breaking = 0;
    this.wasJumping = false;
    this.ducking = false;
    this.spinDash = false;

    this.tick = function () {
        this.ticking = true;


        switch (this.state) {
            case SonicState.Ground:
                if (this.wasJumping && !this.jumping) {
                    this.wasJumping = false;
                }

                this.ducking = false;
                if (this.crouching) {
                    if (this.xsp != 0) {
                        this.rolling = true;
                        this.currentlyBall = true;
                    } else {
                        this.ducking = true;
                    }
                } else {
                    this.spinDash = false;
                }

                if (this.wasJumping && this.jumping) {

                } else if (this.jumping) {

                    if (this.ducking) {
                        this.spinDash = true;
                    }
                    else {
                        this.wasJumping = true;
                        this.state = SonicState.Air;
                        this.currentlyBall = true;
                        this.ysp = this.jmp;
                    }
                }


                if (this.holdingLeft && this.standStill) {
                    this.facing = false;
                    this.standStill = false;
                    this.xsp -= this.acc;
                    this.runningDir = -1;
                    break;
                }
                if (this.holdingRight && this.standStill) {
                    this.facing = true;
                    this.standStill = false;
                    this.xsp += this.acc;
                    this.runningDir = 1;
                    break;
                }

                if (this.holdingRight) {
                    this.facing = true;
                    if (this.runningDir == 1) {

                        if (this.rolling) {

                        } else {
                            this.xsp += this.acc;
                        }
                    } else {
                        if (Math.abs(this.xsp) > 4.5) {
                            this.facing = false;
                            this.breaking = 1;
                            this.runningTick = 0;
                        }
                        if (this.rolling) {
                            this.xsp += this.rdec;
                        } else {
                            this.xsp += this.dec;
                        }
                        this.runningDir = 1;
                    }
                } else if (this.holdingLeft) {
                    this.facing = false;

                    if (this.runningDir == -1) {
                        if (this.rolling) {

                        } else {
                            this.xsp -= this.acc;
                        }
                    } else {
                        if (Math.abs(this.xsp) > 4.5) {
                            this.facing = true;
                            this.breaking = -1;
                            this.runningTick = 0;
                        }
                        if (this.rolling) {
                            this.xsp -= this.rdec;
                        } else {
                            this.xsp -= this.dec;
                        }
                        this.runningDir = -1;
                    }
                } else {
                    if (!this.rolling) {
                        this.xsp -= Math.min(Math.abs(this.xsp), this.frc) * (this.xsp > 0 ? 1 : -1);
                    }
                }
                if (this.rolling) {
                    this.xsp -= Math.min(Math.abs(this.xsp), this.rfrc) * (this.xsp > 0 ? 1 : -1);

                }

                break;
            case SonicState.Air:
                if (this.wasJumping) {
                    if (this.jumping) {

                    } else {
                        if (this.ysp < 0) {
                            if (this.ysp < -4) {
                                this.ysp = -4;
                            }
                        }
                    }
                }

                this.ysp += this.grv;
                if (this.ysp < 0 && this.ysp > -4) {
                    if (Math.abs(this.xsp) > 0.125) {
                        this.xsp *= 0.96875;
                    }
                }

                if (this.ysp > 16) this.ysp = 16;
                break;
        }

        var max = 6;
        if (this.holdingLeft) {
            if (this.xsp > 0)
                this.xsp -= this.dec;
            else if (this.xsp > -max) {
                this.xsp -= this.acc;
                if (this.xsp < -max) this.xsp = -max;
            }
        } else if (this.holdingRight) {
            if (this.xsp < 0)
                this.xsp += this.dec;
            else if (this.xsp < max) {
                this.xsp += this.acc;
                if (this.xsp > max) this.xsp = max;
            }
        }

        var absxsp = Math.abs(this.xsp);
        j = parseInt(this.spriteState.substring(this.spriteState.length - 1, this.spriteState.length));
        if (this.breaking > 0) {
            if (this.xsp > 0 || this.xsp == 0 || this.spriteState == "breaking3") {
                this.facing = false;
                this.breaking = 0;
            }
        } else if (this.breaking < 0) {
            if (this.xsp < 0 || this.xsp == 0 || this.spriteState == "breaking3") {
                this.breaking = 0;
                this.facing = true;
            }
        }

        if (absxsp == 0 && this.state == SonicState.Ground) {

            this.runningDir = 0;

            if (this.ducking) {

                if (this.spinDash) {
                    this.spriteState = "duck0";
                    this.runningTick = 1;

                } else {
                    if (this.spriteState.substring(0, this.spriteState.length - 1) != "duck") {
                        this.spriteState = "duck0";
                        this.runningTick = 1;
                    } else if ((this.runningTick++) % (Math.floor(8 - absxsp)) == 0) {
                        this.spriteState = "duck1";
                    }
                }

            } else {
                this.spriteState = "normal";
                this.standStill = true;
                this.currentlyBall = false;
                this.runningTick = 0;
            }
        } else if (this.breaking != 0) {
            if (this.spriteState.substring(0, this.spriteState.length - 1) != "breaking") {
                this.spriteState = "breaking0";
                this.runningTick = 1;
            } else if ((this.runningTick++) % (7) == 0) {
                this.spriteState = "breaking" + ((j + 1) % 4);
            }

        } else if (this.currentlyBall) {

            if (this.spriteState.substring(0, this.spriteState.length - 1) != "balls") {
                this.spriteState = "balls0";
                this.runningTick = 1;
            } else if ((this.runningTick++) % (Math.floor(8 - absxsp)) == 0) {
                ;
                this.spriteState = "balls" + ((j + 1) % 5);
            }
        } else if (absxsp < 6) {
            if (this.spriteState.substring(0, this.spriteState.length - 1) != "running") {
                this.spriteState = "running0";
                this.runningTick = 1;
            } else if ((this.runningTick++) % (Math.floor(8 - absxsp)) == 0 || (Math.floor(8 - absxsp) == 0)) {
                this.spriteState = "running" + ((j + 1) % 8);
            }

        } else if (absxsp >= 6) {
            if (this.spriteState.substring(0, this.spriteState.length - 1) != "fastrunning") {
                this.spriteState = "fastrunning0";
                this.runningTick = 1;
            } else if ((this.runningTick++) % (Math.ceil(8 - absxsp)) == 0 || (Math.floor(8 - absxsp) == 0)) {
                this.spriteState = "fastrunning" + ((j + 1) % 4);
            }

        }

        this.x += this.xsp;
        this.y += this.ysp;


        var fx = Math.floor(this.x);
        var fy = Math.floor(this.y);

        var sensorA, sensorB;

        if ((sensorA = this.checkCollisionLine(fx - 9, fy + 4, 20, 0)) != -1) {
            if (sensorA < fx) {
                this.x = fx = sensorA + 11;
                this.xsp = 0;
            } else {
                this.x = fx = sensorA - 11;
                this.xsp = 0;
            }
        }


        switch (this.state) {
            case SonicState.Ground:
                if ((sensorA = this.checkCollisionLine(fx - 9, fy, 20, 1)) == -1 && (sensorB = this.checkCollisionLine(fx + 9, fy, 20, 1)) == -1) {
                    this.state = SonicState.Air;
                } else {
                    if (sensorA > -1) {
                        this.y = fy = sensorA - 19;
                    } else
                        if (sensorB > -1) {
                            this.y = fy = sensorB - 19;
                        }
                }


                break;
            case SonicState.Air:

                if ((sensorA = this.checkCollisionLine(fx - 9, fy, 20, 1)) == -1 && (sensorB = this.checkCollisionLine(fx + 9, fy, 20, 1)) == -1) {
                    this.state = SonicState.Air;
                } else {
                    if (sensorA > -1) {
                        if (this.y + (20) >= sensorA) {
                            this.y = fy = sensorA - 19;
                            this.currentlyBall = false;
                            this.state = SonicState.Ground;
                            this.ysp = 0;
                        }
                    } else
                        if (sensorB > -1) {
                            if (this.y + (20) >= sensorB) {
                                this.y = fy = sensorB - 19;
                                this.currentlyBall = false;
                                this.state = SonicState.Ground;
                                this.ysp = 0;
                            }
                        }
                }

                break;
        }


    };
    this.sensorA = 0;

    this.checkCollisionLine = function (x, y, length, direction) {
        var start = y * this.levelWidth + x;
        var hlen = this.levelWidth;
        var i;
        var m;
        switch (direction) {
            case 0:
                //left to right
                for (i = 0; i < length; i++) {
                    if (x + i < 0 || this.heightInformation[y * this.levelWidth + (x + i)]) return x + i;
                }
                break;
            case 1:
                //top to bottom
                for (i = 0, m = length * hlen; i < m; i += hlen) {
                    if ( this.heightInformation[start + i]) return y + (i / hlen);
                }
                break;
            case 2:
                //right to left
                for (i = 0; i < length; i++) {
                    if (x - i < 0 || this.heightInformation[this.heightInformation[y * this.levelWidth + (x - i)]]) return x - i;
                }
                break;
            case 3:
                //bottom to top 
                for (i = 0, m = length * hlen; i < m; i += hlen) {
                    if (this.heightInformation[start - i]) return y - (i / hlen);
                }
                break;
        }
        return -1;
    };

    this.cachedImages = [];

    this.spriteState = "normal";
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

    var ci = this.cachedImages;
    var junkContext = _H.defaultCanvas().context;
    var imageLoaded = this.imageLoaded = [0];
    for (var sp in this.spriteLocations) {
        ci[sp] = _H.loadSprite(this.spriteLocations[sp], function (jd) {
            ci[jd.tag + scale.x + scale.y]=_H.scaleSprite(jd, scale, function (jc) {
                junkContext.drawImage(jc, 0, 0, jc.width, jc.height);
                junkContext.drawImage(jd, 0, 0, jd.width, jd.height);
                imageLoaded[0]++;

            });
        });
        ci[sp].tag = sp;
    }

    this.isLoading = function () {
        return this.imageLoaded[0] < this.imageLength;
    };

    this.draw = function (canvas, scale) {
        var fx = Math.floor(this.x);
        var fy = Math.floor(this.y);
        var cur;
        if (cur = this.cachedImages[this.spriteState + scale.x + scale.y]) {
            if (cur.loaded) {
                canvas.save();
                var yOffset=0;
                if (this.spinDash || this.ducking) {
                    yOffset = 6;
                } else {
                    if (this.currentlyBall) {
                        yOffset = 10;
                    }
                }

                if (!this.facing) {
                    canvas.translate(((fx - 15 - sonicManager.windowLocation.x) * scale.x) + cur.width, ((fy - 20 - sonicManager.windowLocation.y + yOffset) * scale.y));
                    canvas.scale(-1, 1);
                    canvas.drawImage(cur, 0, 0, cur.width, cur.height);
                } else {
                    canvas.drawImage(cur, ((fx - 15 - sonicManager.windowLocation.x) * scale.x), ((fy - 20 - sonicManager.windowLocation.y + yOffset) * scale.y), cur.width, cur.height);


                }
                canvas.restore();
                canvas.fillStyle = "#CF3";
                canvas.fillRect(((fx - sonicManager.windowLocation.x) * scale.x) - 5, ((fy - sonicManager.windowLocation.y + yOffset) * scale.y) - 5, 10, 10);

            }

        } else if (cur = this.cachedImages[this.spriteState]) {
            if (cur.loaded)
                this.cachedImages[this.spriteState + scale.x + scale.y] = _H.scaleSprite(cur, scale);
        } else {
            this.cachedImages[this.spriteState] = _H.loadSprite(this.spriteLocations[this.spriteState]);
        }

    };

    this.runningDir = 0;
    this.kill = function () {

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
                                hmap[(x * 128 + _x * 16 + __x) + (y * 128 + _y * 16 + __y) * (this.levelWidth)] = (tp.heightMask.items[__x]) > 16 - __y;
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