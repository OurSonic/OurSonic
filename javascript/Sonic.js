function Sonic(sonicLevel, scale) {
    this.x = 280;
    this.y = 130;
    this.obtainedRing = [];
    this.rings = 0;
    this.angleInformation = [];
    this.heightInformation = [];
    this.debugging = false;
    this.jumping = false;
    this.crouching = false;
    this.holdingLeft = false;
    this.holdingRight = false;
    this.LevelWidth = 0;
    this.xsp = 0;
    this.ysp = 0;
    this.sonicLastHitTick = 0;
    this.sonicJustHitTick = 0;
    this.acc = 0.046875;
    this.dec = 0.5;
    this.frc = 0.046875;

    this.rdec = 0.125;
    this.rfrc = 0.0234375;
    this.runningTick = 0;
    this.jmp = -6.5;
    this.grv = 0.21875;
    this.air = 0.09375;
    this.runningDir = 1;
    this.standStill = true;
    this.sonicLevel = sonicLevel;
    this.state = SonicState.Ground;
    this.haltSmoke = [];

    this.facing = true;
    this.ticking = false;
    this.breaking = 0;
    this.wasJumping = false;
    this.ducking = false;
    this.spinDash = false;
    this.myRec = {};
    this.spinDashSpeed = 0;

    this.angle = 180;

    this.tick = function () {
        if (this.debugging) return;

        this.ticking = true;

        this.myRec = { left: this.x - 5, right: this.x + 5, top: this.y - 20, bottom: this.y + 20 };
        switch (this.state) {
            case SonicState.Ground:

                if (this.justHit) {
                    this.justHit = false;
                    this.sonicJustHitTick = sonicManager.drawTickCount;
                    this.xsp = 0;
                }
                if (this.spinDash) {
                    this.spinDashSpeed -= (Math.floor(this.spinDashSpeed / 125)) / 256;
                }

                if (this.wasJumping && !this.jumping) {
                    this.wasJumping = false;
                }
                if (Math.abs(this.xsp) < .5) {
                    this.rolling = false;
                    this.currentlyBall = false;
                }



                if (this.wasJumping && this.jumping) {

                } else if (this.jumping) {

                    this.wasJumping = true;
                    if (this.ducking) {
                        this.spinDash = true;
                        this.spinDashSpeed += 2;
                        if (this.spinDashSpeed > 8)
                            this.spinDashSpeed = 8;

                        this.spriteState = "spindash0";
                    }
                    else {
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
                        }
                    } else {
                        if (Math.abs(this.xsp) > 4.5) {
                            this.facing = false;
                            this.breaking = 1;
                            this.runningTick = 0;
                        }

                        this.runningDir = 1;
                    }
                } else if (this.holdingLeft) {
                    this.facing = false;

                    if (this.runningDir == -1) {

                    } else {
                        if (Math.abs(this.xsp) > 4.5) {
                            this.facing = true;
                            this.breaking = -1;
                            this.runningTick = 0;
                        }

                        this.runningDir = -1;
                    }
                } else {
                    this.ducking = false;
                    if (this.crouching) {
                        if (Math.abs(this.xsp) > 1.03125) {
                            this.rolling = true;
                            this.currentlyBall = true;
                        } else {
                            this.ducking = true;
                        }
                    } else {
                        if (this.spinDash) {
                            this.xsp = (8 + Math.floor(this.spinDashSpeed) / 2) * (this.facing ? 1 : -1);
                            this.spinDash = false;
                            this.rolling = true;
                            this.currentlyBall = true;
                        }
                    }


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

                this.ysp += this.justHit ? 0.1875 : this.grv;
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
            if (this.xsp > 0) {

                if (this.rolling) {
                    this.xsp -= this.rdec;
                } else {
                    this.xsp -= this.dec;
                }
            } else if (this.xsp > -max) {

                if (!this.rolling) {
                    this.xsp -= this.acc;
                }
                if (this.xsp < -max) this.xsp = -max;
            }
        } else if (this.holdingRight) {
            if (this.xsp < 0) {
                if (this.rolling) {
                    this.xsp += this.rdec;
                } else {
                    this.xsp += this.dec;
                }
            } else if (this.xsp < max) {
                if (!this.rolling) {
                    this.xsp += this.acc;
                }
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


        if (this.justHit) {
            if (this.spriteState.substring(0, this.spriteState.length - 1) != "hit") {
                this.spriteState = "hit0";
                this.runningTick = 1;
            } else if ((this.runningTick++) % (Math.floor(8 - absxsp)) == 0) {
                this.spriteState = "hit1";
            }
        }
        else if (absxsp == 0 && this.state == SonicState.Ground) {

            this.runningDir = 0;

            if (this.ducking) {

                if (this.spinDash) {
                    if (this.spriteState.substring(0, this.spriteState.length - 1) != "spindash") {
                        this.spriteState = "spindash0";
                        this.runningTick = 1;
                    } else if ((this.runningTick++) % (Math.floor(2 - absxsp)) == 0) {
                        this.spriteState = "spindash" + ((j + 1) % 6);
                    }
                } else {
                    if (this.spriteState.substring(0, this.spriteState.length - 1) != "duck") {
                        this.spriteState = "duck0";
                        this.runningTick = 1;
                    } else if ((this.runningTick++) % (Math.floor(4 - absxsp)) == 0) {
                        this.spriteState = "duck1";
                    }
                }

            } else {
                this.spriteState = "normal";
                this.standStill = true;
                this.currentlyBall = false;
                this.rolling = false;
                this.runningTick = 0;
            }
        } else if (this.breaking != 0) {
            if (this.spriteState.substring(0, this.spriteState.length - 1) != "breaking") {
                this.spriteState = "breaking0";
                this.runningTick = 1;
            } else if ((this.runningTick++) % (7) == 0) {
                this.spriteState = "breaking" + ((j + 1) % 4);
                if (j == 0) {
                    this.haltSmoke.push({ x: Math.floor(this.x), y: Math.floor(this.y) });
                }
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
            } else if (((this.runningTick++) % (Math.ceil(8 - absxsp)) == 0) || (Math.floor(8 - absxsp) == 0)) {
                this.spriteState = "fastrunning" + ((j + 1) % 4);
            }

        }

        this.x += this.xsp;
        this.y += this.ysp;


        var fx = Math.floor(this.x);
        var fy = Math.floor(this.y);

        var sensorA, sensorB;

        if ((sensorA = this.checkCollisionLine(fx - 9, fy + 4, 20, 0)) != -1) {
            if (sensorA.pos < fx) {
                this.x = fx = sensorA.pos + 11;
                this.xsp = 0;
            } else {
                this.x = fx = sensorA.pos - 11;
                this.xsp = 0;
            }
        }


        if (sonicManager.tickCount % 4 == 0) {
            this.checkCollisionWithRing();
        }




        switch (this.state) {
            case SonicState.Ground:
                if ((sensorA = this.checkCollisionLine(fx - 9, fy, 36, 1)) == -1 && (sensorB = this.checkCollisionLine(fx + 9, fy, 36, 1)) == -1) {
                    this.state = SonicState.Air;
                } else {

                    if (!!sensorA && !!sensorB) {
                        this.angle = sensorA.angle;
                        if (sensorA.pos > sensorB.pos) {
                            this.angle = sensorA.angle;
                            this.y = fy = sensorA.pos - 19;
                        } else {
                            this.angle = sensorB.angle;
                            this.y = fy = sensorB.pos - 19;
                        }
                    }
                    else
                        if (sensorA.pos > -1) {
                            this.angle = sensorA.angle;
                            this.y = fy = sensorA.pos - 19;
                        } else
                            if (sensorB.pos > -1) {
                                this.angle = sensorB.angle;
                                this.y = fy = sensorB.pos - 19;
                            }
                }


                break;
            case SonicState.Air:
                if ((sensorA = this.checkCollisionLine(fx - 9, fy, 20, 1)) == -1 && (sensorB = this.checkCollisionLine(fx + 9, fy, 20, 1)) == -1) {
                    this.state = SonicState.Air;
                } else {


                    if (sensorA.pos > -1) {
                        if (this.y + (20) >= sensorA.pos) {
                            this.angle = sensorA.angle;
                            this.y = fy = sensorA.pos - 19;
                            this.rolling = this.currentlyBall = false;
                            this.state = SonicState.Ground;
                            this.ysp = 0;
                        }
                    } else
                        if (sensorB.pos > -1) {
                            if (this.y + (20) >= sensorB.pos) {
                                this.angle = sensorB.angle;
                                this.y = fy = sensorB.pos - 19;
                                this.rolling = this.currentlyBall = false;
                                this.state = SonicState.Ground;
                                this.ysp = 0;
                            }
                        }
                }


                if (((sensorA = this.checkCollisionLine(fx - 9, fy, 20, 3)) == -1 && (sensorB = this.checkCollisionLine(fx + 9, fy, 20, 3)) == -1)) {

                } else {
                    if (sensorA.pos > -1) {
                        if (this.y + (20) >= sensorA.pos) {
                            this.angle = sensorA.angle;
                            this.y = fy = sensorA.pos + 20;
                            this.ysp = 0;
                        }
                    } else
                        if (sensorB.pos > -1) {
                            if (this.y + (20) >= sensorB.pos) {
                                this.angle = sensorB.angle;
                                this.y = fy = sensorB.pos + 20;
                                this.ysp = 0;
                            }
                        }
                }

                break;
        }


    };
    this.debug = function () {
        this.debugging = !this.debugging;
        this.xsp = 0;
        this.ysp = 0;
        this.spriteState="normal";
    };
    this.hit = function () {
        if (sonicManager.drawTickCount - this.sonicJustHitTick < 120)
            return;
        this.justHit = true;
        this.ysp = -4;
        this.xsp = 2 * (-1);
        this.sonicLastHitTick = sonicManager.drawTickCount;
        var t = 0;
        var angle = 101.25;
        var n = false;
        var speed = 4;
        while (t < this.rings) {
            var ring = new Ring(true);
            sonicManager.activeRings.push(ring);
            ring.x = this.x;
            ring.y = this.y - 10;
            ring.ysp = -Math.sin(angle) * speed;
            ring.xsp = Math.cos(angle) * speed;

            if (n) {
                ring.ysp *= -1;
                angle += 22.5;
            }
            n = !n;
            t++;
            if (t == 16) {
                speed = 2;
                angle = 101.25;
            }
        }
        this.rings = 0;

    };
    this.checkCollisionWithRing = function () {
        var me = this.myRec;
        for (var ring in sonicManager.SonicLevel.Rings) {
            var pos = sonicManager.SonicLevel.Rings[ring];
            if (this.obtainedRing[ring]) continue;
            var _x = pos.x * 8 * scale.x;
            var _y = pos.y * 8 * scale.y;
            if (_H.intersectRect(me, { left: _x - 8 * scale.x, right: _x + 8 * scale.x, top: _y - 8 * scale.y, bottom: _y + 8 * scale.y })) {
                this.rings++;
                this.obtainedRing[ring] = true;
            }
        }
    };


    this.sensorA = 0;

    this.checkCollisionLine = function (x, y, length, direction) {
        var start = y * this.LevelWidth + x;
        var hlen = this.LevelWidth;
        var i;
        var m;
        switch (direction) {
            case 0:
                //left to right
                for (i = 0; i < length; i++) {
                    if (x + i < 0 || this.heightInformation[y * this.LevelWidth + (x + i)]) return { pos: x + i, angle: this.angleInformation[y * this.LevelWidth + (x + i)] };
                }
                break;
            case 1:
                //top to bottom
                for (i = 0, m = length * hlen; i < m; i += hlen) {
                    if (this.heightInformation[start + i]) return { pos: y + (i / hlen), angle: this.angleInformation[y * this.LevelWidth + (x + i)] };
                }
                break;
            case 2:
                //right to left
                for (i = 0; i < length; i++) {
                    if (x - i < 0 || this.heightInformation[this.heightInformation[y * this.LevelWidth + (x - i)]]) return { pos: x - i, angle: this.angleInformation[y * this.LevelWidth + (x + i)] };
                }
                break;
            case 3:
                //bottom to top 
                for (i = 0, m = length * hlen; i < m; i += hlen) {
                    if (this.heightInformation[start - i]) return { pos: y - (i / hlen), angle: this.angleInformation[y * this.LevelWidth + (x + i)] };
                }
                break;
        }
        return -1;
    };

    this.spriteState = "normal";
    this.isLoading = function () {
        return this.imageLoaded[0] < this.imageLength;
    };
    this.drawUI = function (canvas, pos, scale) {
        canvas.font = "13pt Arial bold";
        canvas.fillStyle = "Blue";
        canvas.fillText("Rings: " + this.rings, pos.x + 30, pos.y + 45);
    };

    this.draw = function (canvas, scale) {
        var fx = Math.floor(this.x);
        var fy = Math.floor(this.y);
        var cur;

        var mc = sonicManager.drawTickCount - this.sonicJustHitTick;
        if (mc < 120) {
            if (mc % 8 < 4) {
                return;
            }
        }

        if (cur = sonicManager.SpriteCache.sonicSprites[this.spriteState + scale.x + scale.y]) {
            if (cur.loaded) {
                canvas.save();
                var yOffset = 40 - (cur.height / scale.y);
           //     canvas.strokeStyle = "#FFF";
              //  canvas.strokeText(((180 + this.angle) % 360), ((fx - 15 - sonicManager.windowLocation.x) * scale.x) + cur.width, ((fy - 50 - sonicManager.windowLocation.y + yOffset) * scale.y));
                //                
              //  canvas.translate(((fx - 15 - sonicManager.windowLocation.x) * scale.x), ((fy - 20 - sonicManager.windowLocation.y + yOffset) * scale.y));
            
                /*      var ang = ((180 + this.angle) % 360);
                if (ang != 0) {
                canvas.translate(-cur.width / 2, -cur.height / 2);
                }

                if (!this.facing) {

                 //     canvas.rotate(-(ang) * (Math.PI / 180));
                    canvas.scale(-1, 1);
                    canvas.drawImage(cur, ((fx - 15 - sonicManager.windowLocation.x) * scale.x) - cur.width, ((fy - 20 - sonicManager.windowLocation.y + yOffset) * scale.y), cur.width, cur.height);
                    if (this.spinDash) {
                        canvas.drawImage(this.cachedImages[("spinsmoke" + Math.floor((sonicManager.drawTickCount % 14) / 2)) + scale.x + scale.y], -25 * scale.x, 0, cur.width, cur.height);
                    }
                } else {

                //    canvas.rotate(-(ang) * (Math.PI / 180));
                    canvas.drawImage(cur, ((fx - 15 - sonicManager.windowLocation.x) * scale.x), ((fy - 20 - sonicManager.windowLocation.y + yOffset) * scale.y), cur.width, cur.height);
                    if (this.spinDash) {
                        canvas.drawImage(this.cachedImages[("spinsmoke" + Math.floor((sonicManager.drawTickCount % 14) / 2)) + scale.x + scale.y],
                            -25, 0, cur.width, cur.height);
                    }

                }
                canvas.restore();

                for (var i = 0; i < this.haltSmoke.length; i++) {
                    var lo = this.haltSmoke[i];
                    canvas.drawImage(this.cachedImages[("haltsmoke" + Math.floor((sonicManager.drawTickCount % (4 * 6)) / 6)) + scale.x + scale.y],
                            ((lo.x - sonicManager.windowLocation.x - 25) * scale.x), ((lo.y + 12 - sonicManager.windowLocation.y + yOffset) * scale.y));
                    if (Math.floor(((sonicManager.drawTickCount + 6) % (4 * 6)) / 6) == 0) {
                        this.haltSmoke.splice(i, 1);
                    }
                }*/





                if (!this.facing) {
                    canvas.translate(((fx - 15 - sonicManager.windowLocation.x) * scale.x) + cur.width, ((fy - 20 - sonicManager.windowLocation.y + yOffset) * scale.y));
                    canvas.scale(-1, 1);
                    canvas.drawImage(cur, 0, 0, cur.width, cur.height);
                    if (this.spinDash) {
                        canvas.drawImage(sonicManager.SpriteCache.sonicSprites[("spinsmoke" + Math.floor((sonicManager.drawTickCount % 14) / 2)) + scale.x + scale.y], -25 * scale.x, 0, cur.width, cur.height);
                    }
                } else {
                    canvas.drawImage(cur, ((fx - 15 - sonicManager.windowLocation.x) * scale.x), ((fy - 20 - sonicManager.windowLocation.y + yOffset) * scale.y), cur.width, cur.height);
                    if (this.spinDash) {
                        canvas.drawImage(sonicManager.SpriteCache.sonicSprites[("spinsmoke" + Math.floor((sonicManager.drawTickCount % 14) / 2)) + scale.x + scale.y],
                            ((fx - 15 - sonicManager.windowLocation.x - 25) * scale.x), ((fy - 20 - sonicManager.windowLocation.y + yOffset) * scale.y), cur.width, cur.height);
                    }

                }
                canvas.restore();

                for (var i = 0; i < this.haltSmoke.length; i++) {
                    var lo = this.haltSmoke[i];
                    canvas.drawImage(sonicManager.SpriteCache.sonicSprites[("haltsmoke" + Math.floor((sonicManager.drawTickCount % (4 * 6)) / 6)) + scale.x + scale.y],
                            ((lo.x - sonicManager.windowLocation.x - 25) * scale.x), ((lo.y + 12 - sonicManager.windowLocation.y + yOffset) * scale.y));
                    if (Math.floor(((sonicManager.drawTickCount + 6) % (4 * 6)) / 6) == 0) {
                        this.haltSmoke.splice(i, 1);
                    }
                }



            }

        } else if (cur = sonicManager.SpriteCache.sonicSprites[this.spriteState]) {
            if (cur.loaded)
                sonicManager.SpriteCache.sonicSprites[this.spriteState + scale.x + scale.y] = _H.scaleSprite(cur, scale);
        } else {
            sonicManager.SpriteCache.sonicSprites[this.spriteState] = _H.loadSprite(this.spriteLocations[this.spriteState]);
        }

    };

    this.runningDir = 0;
    this.kill = function () {

    };
    this.pressJump = function () {
        if (this.debugging) {
            this.y -= 15;
            return;
        }
        if (!this.justHit)
            this.jumping = true;
    };

    this.pressCrouch = function () {
        if (this.debugging) {
            this.y += 15;
            return;
        }

        if (!this.justHit)
            this.crouching = true;

    };
    this.pressLeft = function () {
        if (this.debugging) {
            this.x -= 15;
            return;
        }

        if (!this.justHit)
            this.holdingLeft = true;

    };
    this.pressRight = function () {
        if (this.debugging) {
            this.x += 15;
            return;
        }

        if (!this.justHit)
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
        var imap = [];
        hmap.length = sonicLevel.ChunkMap.length * 128 * 128;
        imap.length = sonicLevel.ChunkMap.length * 128 * 128;

        this.LevelWidth = sonicLevel.LevelWidth * 128;
        for (var y = 0; y < sonicLevel.LevelHeight; y++) {
            for (var x = 0; x < sonicLevel.LevelWidth; x++) {
                var chunk = sonicLevel.TileChunks[sonicLevel.ChunkMap[y * sonicLevel.LevelWidth + x]];
                for (var _y = 0; _y < 8; _y++) {
                    for (var _x = 0; _x < 8; _x++) {
                        var tp = sonicLevel.TilePieces[chunk.tilesPieces[_y * 8 + _x]];

                        var mp = sonicLevel.heightMap1[((x * 8) + _x) + ((y * 8) + _y) * sonicLevel.LevelWidth * 8];
                      

                        for (var __y = 0; __y < 16; __y++) {
                            for (var __x = 0; __x < 16; __x++) {


                                var mj = _H.parseNumber(mp[__x]); 

                                hmap[(x * 128 + _x * 16 + __x) + (y * 128 + _y * 16 + __y) * (this.LevelWidth)] = mj > 15 - __y;
                                //imap[(x * 128 + _x * 16 + __x) + (y * 128 + _y * 16 + __y) * (this.LevelWidth)] = tp.heightMask.angle;
                            }
                        }
                    }
                }

            }
        }
        this.heightInformation = hmap;
        this.angleInformation = imap;
    };
    this.buildHeightInfo(sonicLevel);
}


SonicState = { Air: 0, Ground: 1 };