function Sonic(sonicLevel, scale) {
    this.x = 104;
    this.y = 1584;
    this.obtainedRing = [];
    this.rings = 0;
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

    this.angle = 0;

    this.tick = function () {
        if (this.debugging) {
            var debugSpeed = 10;

            if (this.holdingRight) {
                this.x += debugSpeed;
            } if (this.holdingLeft) {
                this.x -= debugSpeed;
            } if (this.crouching) {
                this.y += debugSpeed;
            }
            if (this.jumping) {
                this.y -= debugSpeed;
            }

            return;
        }

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
                    this.spinDashSpeed -= (_H.floor(this.spinDashSpeed / 125)) / 256;
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
                        break;
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
                            this.xsp = (8 + _H.floor(this.spinDashSpeed) / 2) * (this.facing ? 1 : -1);
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
            } else if ((this.runningTick++) % (_H.floor(8 - absxsp)) == 0) {
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
                    } else if ((this.runningTick++) % (_H.floor(2 - absxsp)) == 0) {
                        this.spriteState = "spindash" + ((j + 1) % 6);
                    }
                } else {
                    if (this.spriteState.substring(0, this.spriteState.length - 1) != "duck") {
                        this.spriteState = "duck0";
                        this.runningTick = 1;
                    } else if ((this.runningTick++) % (_H.floor(4 - absxsp)) == 0) {
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
                    this.haltSmoke.push({ x: _H.floor(this.x), y: _H.floor(this.y) });
                }
            }

        } else if (this.currentlyBall) {

            if (this.spriteState.substring(0, this.spriteState.length - 1) != "balls") {
                this.spriteState = "balls0";
                this.runningTick = 1;
            } else if ((this.runningTick++) % (_H.floor(8 - absxsp)) == 0) {
                ;
                this.spriteState = "balls" + ((j + 1) % 5);
            }
        } else if (absxsp < 6) {
            if (this.spriteState.substring(0, this.spriteState.length - 1) != "running") {
                this.spriteState = "running0";
                this.runningTick = 1;
            } else if ((this.runningTick++) % (_H.floor(8 - absxsp)) == 0 || (_H.floor(8 - absxsp) == 0)) {
                this.spriteState = "running" + ((j + 1) % 8);
            }

        } else if (absxsp >= 6) {
            if (this.spriteState.substring(0, this.spriteState.length - 1) != "fastrunning") {
                this.spriteState = "fastrunning0";
                this.runningTick = 1;
            } else if (((this.runningTick++) % (Math.ceil(8 - absxsp)) == 0) || (_H.floor(8 - absxsp) == 0)) {
                this.spriteState = "fastrunning" + ((j + 1) % 4);
            }

        }

        this.x += this.xsp;
        this.y += this.ysp;


        var fx = _H.floor(this.x);
        var fy = _H.floor(this.y);

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
                sensorA = this.checkCollisionLine(fx - 9, fy, 36, 1);
                sensorB = this.checkCollisionLine(fx + 9, fy, 36, 1);

                if (sensorA == -1 && sensorB == -1) {
                    this.state = SonicState.Air;
                } else {
                    if (sensorA.pos >= 0 && sensorB.pos >= 0) {
                        this.angle = sensorA.angle;
                        if (sensorA.pos < sensorB.pos) {
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
                sensorA = this.checkCollisionLine(fx - 9, fy, 20, 1);
                sensorB = this.checkCollisionLine(fx + 9, fy, 20, 1);

                if (sensorA == -1 && sensorB == -1) {
                    this.state = SonicState.Air;
                } else {

                    if (sensorA.pos >= 0 && sensorB.pos >= 0) {
                        this.angle = sensorA.angle;
                        if (sensorA.pos < sensorB.pos) {
                            if (this.y + (20) >= sensorA.pos) {
                                this.angle = sensorA.angle;
                                this.y = fy = sensorA.pos - 19;
                                this.rolling = this.currentlyBall = false;
                                this.state = SonicState.Ground;
                                this.ysp = 0;
                            }

                        } else {
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
                    }
                    else
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

                sensorA = this.checkCollisionLine(fx - 9, fy, 20, 3);
                sensorB = this.checkCollisionLine(fx + 9, fy, 20, 3);

                if ((sensorA == -1 && sensorB == -1)) {

                } else {
                    if (sensorA.pos >= 0 && sensorB.pos >= 0) {
                        this.angle = sensorA.angle;
                        if (sensorA.pos < sensorB.pos) {
                            if (this.y + (20) >= sensorA.pos) {
                                this.angle = sensorA.angle;
                                this.y = fy = sensorA.pos + 20;
                                this.ysp = 0;
                            }
                        } else {
                            if (this.y + (20) >= sensorB.pos) {
                                this.angle = sensorB.angle;
                                this.y = fy = sensorB.pos + 20;
                                this.ysp = 0;
                            }
                        }
                    }
                    else
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
        this.spriteState = "normal";
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



        var _x = _H.floor(x / 128);
        var _y = _H.floor(y / 128);
        var tc = sonicManager.SonicLevel.TileChunks[sonicManager.SonicLevel.ChunkMap[_x + _y * sonicManager.SonicLevel.LevelWidth]];
        var curh = sonicManager.SonicLevel.curHeightMap ? tc.heightBlocks1 : tc.heightBlocks2;
        var cura = sonicManager.SonicLevel.curHeightMap ? tc.angleMap1 : tc.angleMap2;

        var __x = x - _x * 128;
        var __y = y - _y * 128;



        var start = __y * 128 + __x;
        var hlen = 128;
        var i;
        var m;
        var curc = 0;
        switch (direction) {
            case 0:
                //left to right

                if (x + length > sonicManager.SonicLevel.LevelWidth * 128)
                    return { pos: sonicManager.SonicLevel.LevelWidth * 128 - 20, angle: null };


                for (i = 0; i < length; i++) {

                    if (__x + i >= 128) {
                        tc = sonicManager.SonicLevel.TileChunks[sonicManager.SonicLevel.ChunkMap[_x + 1 + _y * sonicManager.SonicLevel.LevelWidth]];
                        curh = sonicManager.SonicLevel.curHeightMap ? tc.heightBlocks1 : tc.heightBlocks2;
                        cura = sonicManager.SonicLevel.curHeightMap ? tc.angleMap1 : tc.angleMap2;
                        __x -= 128;
                    }

                    if (x + i > this.LevelWidth || curh[__y * 128 + (__x + i)])
                        return { pos: x + i, angle: cura[_H.floor((__y) / 16) * 8 + _H.floor((__x + i) / 16)] };
                }
                break;
            case 1:
                //top to bottom
                if (y + length > sonicManager.SonicLevel.LevelHeight * 128)
                    return { pos: sonicManager.SonicLevel.LevelHeight * 128 - 20, angle: null };
                for (i = 0, m = length * hlen; i < m; i += hlen) {

                    if (__y + curc >= 128) {
                        tc = sonicManager.SonicLevel.TileChunks[sonicManager.SonicLevel.ChunkMap[_x + (_y + 1) * sonicManager.SonicLevel.LevelWidth]];
                        curh = sonicManager.SonicLevel.curHeightMap ? tc.heightBlocks1 : tc.heightBlocks2;
                        cura = sonicManager.SonicLevel.curHeightMap ? tc.angleMap1 : tc.angleMap2;

                        __y -= 128;
                        start -= 128 * 128;
                    }
                    curc++;
                    if (curh[start + i]) {
                        return { pos: y + (i / hlen), angle: cura[_H.floor((__y + curc) / 16) * 8 + _H.floor((__x) / 16)] };
                    }
                }
                break;
            case 2:
                //right to left
                if (x - length < 0)
                    return { pos: 0 + 20, angle: null };

                for (i = 0; i < length; i++) {
                    if (__x - i < 0) {
                        tc = sonicManager.SonicLevel.TileChunks[sonicManager.SonicLevel.ChunkMap[(_x - 1) + _y * sonicManager.SonicLevel.LevelWidth]];
                        curh = sonicManager.SonicLevel.curHeightMap ? tc.heightBlocks1 : tc.heightBlocks2;
                        cura = sonicManager.SonicLevel.curHeightMap ? tc.angleMap1 : tc.angleMap2;

                        __x += 128;

                    }


                    if (x - i < 0 || curh[curh[y * this.LevelWidth + (__x - i)]])
                        return { pos: x - i, angle: cura[_H.floor((__y) / 16) * 8 + _H.floor((__x - i) / 16)] };
                }
                break;
            case 3:
                //bottom to top 
                if (y - length < 0)
                    return { pos: 20, angle: null };


                for (i = 0, m = length * hlen; i < m; i += hlen) {
                    if (__y - curc < 0) {
                        tc = sonicManager.SonicLevel.TileChunks[sonicManager.SonicLevel.ChunkMap[_x + (_y - 1) * sonicManager.SonicLevel.LevelWidth]];
                        curh = sonicManager.SonicLevel.curHeightMap ? tc.heightBlocks1 : tc.heightBlocks2;
                        cura = sonicManager.SonicLevel.curHeightMap ? tc.angleMap1 : tc.angleMap2;

                        __y += 128;
                        start += 128 * 128;
                    }
                    curc++;

                    if (curh[start - i])
                        return { pos: y - (i / hlen), angle: cura[_H.floor((__y - curc) / 16) * 8 + _H.floor((__x) / 16)] };
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
        canvas.fillStyle = "White";
        canvas.fillText("Rings: " + this.rings, pos.x + 90, pos.y + 45);
        canvas.fillText("Angle: " + this.angle, pos.x + 90, pos.y + 75);
        canvas.fillText("Position: " + _H.floor(this.x) + ", " + _H.floor(this.y), pos.x + 90, pos.y + 100);
        canvas.fillText("Speed: " + this.xsp.toFixed(3) + ", " + this.ysp.toFixed(3), pos.x + 90, pos.y + 130);
    };

    this.draw = function (canvas, scale) {
        var fx = _H.floor(this.x);
        var fy = _H.floor(this.y);
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
                var yOffset = 0;// 40 - (cur.height / scale.y);


                canvas.translate(((fx - sonicManager.windowLocation.x) * scale.x), ((fy - sonicManager.windowLocation.y + yOffset) * scale.y));





                if (!this.facing) {
                    //canvas.translate(cur.width, 0);
                    canvas.scale(-1, 1);
                    canvas.rotate(this.angle * Math.PI / 180);

                    canvas.drawImage(cur, -cur.width / 2, -cur.height / 2);

                    if (this.spinDash) {
                        canvas.drawImage(sonicManager.SpriteCache.sonicSprites[("spinsmoke" + _H.floor((sonicManager.drawTickCount % 14) / 2)) + scale.x + scale.y],
                            (-cur.width / 2) - 25 * scale.x, -cur.height / 2+(yOffset * scale.y), cur.width, cur.height);
                    }
                } else {
                    canvas.rotate(-this.angle * Math.PI / 180);
                    canvas.drawImage(cur, -cur.width / 2, -cur.height / 2);


                    if (this.spinDash) {
                        canvas.drawImage(sonicManager.SpriteCache.sonicSprites[("spinsmoke" + _H.floor((sonicManager.drawTickCount % 14) / 2)) + scale.x + scale.y],
                           (-cur.width / 2) - 25 * scale.x, -cur.height / 2+(yOffset * scale.y), cur.width, cur.height);
                    }

                }

                /*
                canvas.strokeStyle = "#FFF";
                canvas.lineWidth = 4;
                canvas.strokeRect(-cur.width / 2, -cur.height / 2, cur.width, cur.height);
                */
                canvas.restore();

                for (var i = 0; i < this.haltSmoke.length; i++) {
                    var lo = this.haltSmoke[i];
                    canvas.drawImage(sonicManager.SpriteCache.sonicSprites[("haltsmoke" + _H.floor((sonicManager.drawTickCount % (4 * 6)) / 6)) + scale.x + scale.y],
                            ((lo.x - sonicManager.windowLocation.x - 25) * scale.x), ((lo.y + 12 - sonicManager.windowLocation.y + yOffset) * scale.y));
                    if (_H.floor(((sonicManager.drawTickCount + 6) % (4 * 6)) / 6) == 0) {
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

        if (!this.justHit)
            this.jumping = true;
    };

    this.pressCrouch = function () {


        if (!this.justHit)
            this.crouching = true;

    };
    this.pressLeft = function () {


        if (!this.justHit)
            this.holdingLeft = true;

    };
    this.pressRight = function () {


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

        this.LevelWidth = sonicLevel.LevelWidth * 128;
        for (var mc = 0; mc < sonicLevel.TileChunks.length; mc++) {
            var chunk = sonicLevel.TileChunks[mc];
            var hm1 = chunk.heightMap1;
            var hm2 = chunk.heightMap2;

            var dd;
            var hb1 = chunk.heightBlocks1 = [];
            var hb2 = chunk.heightBlocks2 = [];
            hb1.length = 128 * 128;
            hb2.length = 128 * 128;

            for (var _y = 0; _y < 8; _y++) {
                for (var _x = 0; _x < 8; _x++) {
                    //  var tp = sonicLevel.TilePieces[chunk.tilesPieces[_y * 8 + _x]];
                    var hd1 = hm1[_x + _y * 8];
                    var hd2 = hm2[_x + _y * 8];
                    if (hd1 == 0) continue;
                    var __x;
                    var __y;

                    if (hd1 == 1) {
                        for (__y = 0; __y < 16; __y++) {
                            for (__x = 0; __x < 16; __x++) {
                                dd = (_x * 16 + __x) + (_y * 16 + __y) * (128);
                                hb1[dd] = true;
                                hb2[dd] = true;
                            }
                        }
                        continue;
                    }
                    hd1 = hd1.items;
                    hd2 = hd2.items;

                    for (__y = 0; __y < 16; __y++) {
                        for (__x = 0; __x < 16; __x++) {
                            dd = (_x * 16 + __x) + (_y * 16 + __y) * (128);

                            hb1[dd] = hd1[__x] > 16 - __y;
                            hb2[dd] = hd2[__x] > 16 - __y;

                            //imap[(x * 128 + _x * 16 + __x) + (y * 128 + _y * 16 + __y) * (this.LevelWidth)] = tp.heightMask.angle;
                        }
                    }
                }


            }
        }


    };
    this.buildHeightInfo(sonicLevel);
}


SonicState = { Air: 0, Ground: 1 };