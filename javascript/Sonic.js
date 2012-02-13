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
    this.gsp = 0;
    this.rdec = 0.125;
    this.rfrc = 0.0234375;
    this.runningTick = 0;
    this.slp = 0.125;
    this.slpRollingUp = 0.078125;
    this.slpRollingDown = 0.3125;

    this.jmp = -6.5;
    this.grv = 0.21875;
    this.air = 0.09375;
    this.sonicLevel = sonicLevel;
    this.inAir = false;
    this.wasInAir = false;
    this.holdingJump = false;
    this.haltSmoke = [];

    this.hlock = 0;
    this.mode = RotationMode.Floor;

    this.facing = true;
    this.ticking = false;
    this.breaking = 0;

    this.ducking = false;
    this.spinDash = false;
    this.myRec = {};
    this.spinDashSpeed = 0;

    this.angle = 0xff;
    var oldSign;

    this.updateMode = function () {
        if (this.angle < 0x20 || this.angle > 0xE0) {
            this.mode = RotationMode.Floor;
        } else if (this.angle > 0x20 && this.angle < 0x60) {
            this.mode = RotationMode.LeftWall;
        } else if (this.angle > 0x60 && this.angle < 0xA0) {
            this.mode = RotationMode.Ceiling;
        } else if (this.angle > 0xA0 && this.angle < 0xE0) {
            this.mode = RotationMode.RightWall;
        }
    };

    this.tick = function () {
        if (this.debugging) {
            var debugSpeed = 15;

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
        this.updateMode();


        if (this.hlock > 0) {
            this.hlock--;
            this.holdingRight = false;
            this.holdingLeft = false;
        }


        this.myRec = { left: this.x - 5, right: this.x + 5, top: this.y - 20, bottom: this.y + 20 };
        var max = 6;
        if (this.jumping) {
            this.wasJumping = true;
        } else {
            if (this.wasJumping) {
                this.wasJumping = false;
            }
        }

        if (!this.inAir && this.wasInAir) {
            this.wasInAir = false;
            if (this.angle >= 0xF0 || this.angle <= 0x0F) {
                this.gsp = this.xsp;
            } else if ((this.angle >= 0xE0 && this.angle <= 0xEF) ||
                (this.angle >= 0x10 && this.angle <= 0x1F)) {
                this.gsp = this.ysp;
            } else if ((this.angle >= 0xC0 && this.angle <= 0xDF)) {
                this.gsp = -this.ysp;
            }
            else if (
                (this.angle >= 0x20 && this.angle <= 0x3F)) {
                this.gsp = this.ysp;
            }


            this.xsp = 0;
            this.ysp = 0;
        }


        if (!this.inAir && !this.rolling) {


            if (this.holdingRight && !this.holdingLeft) {
                this.facing = true;

                if (this.gsp >= 0) {
                    //accelerate 
                    this.gsp += this.acc;
                    if (this.gsp > max) this.gsp = max;
                }
                else {
                    //decelerate 
                    this.gsp += this.dec;
                    if (Math.abs(this.gsp) > 4.5) {
                        this.facing = false;
                        this.breaking = 1;
                        this.runningTick = 0;
                    }
                }
            }

            if (this.holdingLeft && !this.holdingRight) {
                this.facing = false;
                if (this.gsp <= 0) {
                    //accelerate 
                    this.gsp -= this.acc;
                    if (this.gsp < -max) this.gsp = -max;
                } else {
                    //decelerate 
                    this.gsp -= this.dec;
                    if (Math.abs(this.gsp) > 4.5) {
                        this.facing = true;
                        this.breaking = -1;
                        this.runningTick = 0;
                    }

                }
            }

            if (!this.holdingLeft && !this.holdingRight) {
                //friction
                this.gsp -= Math.min(Math.abs(this.gsp), this.frc) * (this.gsp > 0 ? 1 : -1);
            }


            oldSign = _H.sign(this.gsp);
            //slope
            this.gsp += this.slp * -_H.sin(this.angle);
            if (oldSign != _H.sign(this.gsp) && oldSign != 0) {
                this.hlock = 30;
            }

        }


        this.ducking = false;
        if (this.crouching) {
            if (Math.abs(this.gsp) > 1.03125) {
                this.rolling = true;
                this.currentlyBall = true;
            } else {
                this.ducking = true;
            }
        } else {
            if (this.spinDash) {
                this.gsp = (8 + _H.floor(this.spinDashSpeed) / 2) * (this.facing ? 1 : -1);
                this.spinDash = false;
                this.rolling = true;
                this.currentlyBall = true;
            }
        }



        if (!this.isAir && this.rolling) {

            //dec  
            if (this.holdingLeft) {
                if (this.gsp > 0) {
                    if (this.rolling) {
                        this.gsp = _H.max(0, this.gsp - this.rdec);
                    }
                }
            }
            if (this.holdingRight) {
                if (this.gsp < 0) {
                    if (this.rolling) {
                        this.gsp = _H.min(0, this.gsp + this.rdec);
                    }
                }
            }
            //friction
            this.gsp -= Math.min(Math.abs(this.gsp), this.rfrc) * (this.gsp > 0 ? 1 : -1);


            oldSign = _H.sign(this.gsp);

            //slope
            var ang = _H.sin(this.angle);
            if ((ang > 0) != (this.gsp > 0))
                this.gsp += -this.slpRollingUp * ang;
            else
                this.gsp += -this.slpRollingDown * ang;

            if (oldSign != _H.sign(this.gsp) && oldSign != 0) {
                this.hlock = 30;
            }

        }


        if (!this.inAir) {
            this.xsp = this.gsp * _H.cos(this.angle);
            this.ysp = this.gsp * -_H.sin(this.angle);

            if (Math.abs(this.gsp) < 2.5 && this.angle >= 0x40 && this.angle <= 0xC0) {
                if (this.mode == RotationMode.RightWall) this.x += 5;
                else if (this.mode == RotationMode.LeftWall) this.x -= 4;
                this.angle = 0x0;
                this.updateMode();
                this.hlock = 30;
            }


        }


        if (this.inAir) {
            if (this.holdingRight && !this.holdingLeft) {
                this.facing = true;

                if (this.xsp >= 0) {
                    //accelerate 
                    this.xsp += this.air;
                    if (this.xsp > max) this.xsp = max;
                }
                else {
                    //decelerate 
                    this.xsp -= this.air;
                }
            }
            if (this.holdingLeft && !this.holdingRight) {
                this.facing = false;
                if (this.xsp <= 0) {
                    //accelerate 
                    this.xsp -= this.air;
                    if (this.xsp < -max) this.xsp = -max;
                } else {
                    //decelerate 
                    this.xsp += this.air;
                }
            }


            if (this.wasInAir) {
                if (this.jumping) {

                } else {

                }
            }
            //gravity
            this.ysp += this.justHit ? 0.1875 : this.grv;

            //drag
            if (this.ysp < 0 && this.ysp > -4) {
                if (Math.abs(this.xsp) > 0.125) {
                    this.xsp *= 0.96875;
                }
            }

            if (this.ysp > 16) this.ysp = 16;
        }

        if (this.wasInAir && this.jumping) {

        } else if (this.jumping) {
            if (this.ducking) {
                this.spinDash = true;
                this.spinDashSpeed += 2;
                if (this.spinDashSpeed > 8)
                    this.spinDashSpeed = 8;

                this.spriteState = "spindash0";
            }
            else {
                this.wasInAir = true;
                this.inAir = true;
                this.currentlyBall = true;
                this.xsp = this.jmp * _H.sin(this.angle) + this.gsp * _H.cos(this.angle);
                this.ysp = this.jmp * _H.cos(this.angle);
            }
        }

        if (this.xsp > 0 && this.xsp < 0.008) {
            this.gsp = 0;
            this.xsp = 0;
        }
        if (this.xsp < 0 && this.xsp > -0.008) {
            this.gsp = 0;
            this.xsp = 0;
        }

        this.x += this.xsp;
        this.y += this.ysp;

        this.updateSprite();



        var fx = _H.floor(this.x);
        var fy = _H.floor(this.y);

        var sensorA, sensorB;


        var offsetX = -10;
        var offsetY = 4;
        if (this.mode == RotationMode.Floor) {
            if ((sensorA = this.checkCollisionLine(fx + offsetX, fy + offsetY, 20, 0)) != -1) {
                if (sensorA.pos < fx) {
                    this.x = fx = Math.ceil(sensorA.pos / 16) * 16 + 10;
                    this.gsp = 0;
                } else {
                    this.x = fx = Math.floor(sensorA.pos / 16) * 16 - 10;
                    this.gsp = 0;
                } if (this.inAir) this.xsp = 0;

            }
        }
        else if (this.mode == RotationMode.LeftWall) {
            if ((sensorA = this.checkCollisionLine(fx - offsetY, fy + offsetX, 20, 1)) != -1) {
                if (sensorA.pos > fy) {
                    this.y = fy = Math.ceil(sensorA.pos / 16) * 16 - 10;
                } else {
                    this.y = fy = Math.floor(sensorA.pos / 16) * 16 + 10;
                    this.gsp = 0;
                } if (this.inAir) this.xsp = 0;

            }

        }
        else if (this.mode == RotationMode.Ceiling) {

            if ((sensorA = this.checkCollisionLine(fx - offsetX, fy - offsetY, 20, 0)) != -1) {
                if (sensorA.pos < fx) {
                    this.x = fx = Math.ceil(sensorA.pos / 16) * 16 + 10;
                    this.gsp = 0;
                } else {
                    this.x = fx = Math.floor(sensorA.pos / 16) * 16 - 10;
                    this.gsp = 0;
                }
                if (this.inAir) this.xsp = 0;
            }

        }
        else if (this.mode == RotationMode.RightWall) {
            if ((sensorA = this.checkCollisionLine(fx + offsetY, fy + offsetX, 20, 1)) != -1) {
                if (sensorA.pos < fy) {
                    this.y = fy = Math.ceil(sensorA.pos / 16) * 16 - 11;
                    this.gsp = 0;
                } else {
                    this.y = fy = Math.floor(sensorA.pos / 16) * 16 + 11;
                    this.gsp = 0;
                } if (this.inAir) this.xsp = 0;

            }
        }


        if (sonicManager.tickCount % 4 == 0) {
            this.checkCollisionWithRing();
        }

        if (this.inAir) {
            this.angle = 0xff;
        }

        if (!this.inAir) {


            var lookLength = 24;
            offsetX = -9;
            offsetY = 0;
            if (this.mode == RotationMode.Floor) {

                sensorA = this.checkCollisionLine(fx + offsetX, fy + offsetY, lookLength, 1);
                sensorB = this.checkCollisionLine(fx - offsetX, fy + offsetY, lookLength, 1);

                if (sensorA == -1 && sensorB == -1) {
                    this.inAir = true;

                    this.wasInAir = true;
                } else {
                    if (sensorA.pos >= 0 && sensorB.pos >= 0) {
                        this.angle = sensorA.angle;
                        if (sensorA.pos < sensorB.pos) {
                            this.angle = sensorA.angle;
                            this.y = fy = sensorA.pos - 20;
                        } else {
                            this.angle = sensorB.angle;
                            this.y = fy = sensorB.pos - 20;
                        }
                    } else if (sensorA.pos > -1) {
                        this.angle = sensorA.angle;
                        this.y = fy = sensorA.pos - 20;
                    } else if (sensorB.pos > -1) {
                        this.angle = sensorB.angle;
                        this.y = fy = sensorB.pos - 20;
                    }
                }

            }
            else if (this.mode == RotationMode.LeftWall) {
                sensorA = this.checkCollisionLine(fx + offsetY, fy - offsetX, lookLength, 2);
                sensorB = this.checkCollisionLine(fx + offsetY, fy + offsetX, lookLength, 2);
                if (sensorA == -1 && sensorB == -1) {
                    this.inAir = true;
                    this.wasInAir = true;
                } else {
                    if (sensorA.pos >= 0 && sensorB.pos >= 0) {
                        if (sensorA.pos < sensorB.pos) {
                            this.angle = sensorA.angle;
                            this.x = fx = sensorA.pos + 20;
                        } else {
                            this.angle = sensorB.angle;
                            this.x = fx = sensorB.pos + 20;
                        }
                    } else if (sensorA.pos > -1) {
                        this.angle = sensorA.angle;
                        this.x = fx = sensorA.pos + 20;
                    } else if (sensorB.pos > -1) {
                        this.angle = sensorB.angle;
                        this.x = fx = sensorB.pos + 20;
                    }
                }
            }
            else if (this.mode == RotationMode.Ceiling) {
                sensorA = this.checkCollisionLine(fx + offsetX, fy - offsetY, lookLength, 3);
                sensorB = this.checkCollisionLine(fx - offsetX, fy - offsetY, lookLength, 3);

                if (sensorA == -1 && sensorB == -1) {
                    this.inAir = true;
                    this.wasInAir = true;
                } else {
                    if (sensorA.pos >= 0 && sensorB.pos >= 0) {
                        if (sensorA.pos < sensorB.pos) {
                            this.angle = sensorA.angle;
                            this.y = fy = sensorA.pos - 20;
                        } else {
                            this.angle = sensorB.angle;
                            this.y = fy = sensorB.pos - 20;
                        }
                    } else if (sensorA.pos > -1) {
                        this.angle = sensorA.angle;
                        this.y = fy = sensorA.pos - 20;
                    } else if (sensorB.pos > -1) {
                        this.angle = sensorB.angle;
                        this.y = fy = sensorB.pos - 20;
                    }
                }


            }
            else if (this.mode == RotationMode.RightWall) {
                sensorA = this.checkCollisionLine(fx + offsetY, fy - offsetX, lookLength, 0);
                sensorB = this.checkCollisionLine(fx + offsetY, fy + offsetX, lookLength, 0);

                if (sensorA == -1 && sensorB == -1) {
                    this.inAir = true;
                    this.wasInAir = true;
                } else {
                    if (sensorA.pos >= 0 && sensorB.pos >= 0) {
                        if (sensorA.pos < sensorB.pos) {
                            this.angle = sensorA.angle;
                            this.x = fx = sensorA.pos - 20;
                        } else {
                            this.angle = sensorB.angle;
                            this.x = fx = sensorB.pos - 20;
                        }
                    } else if (sensorA.pos > -1) {
                        this.angle = sensorA.angle;
                        this.x = fx = sensorA.pos - 20;
                    } else if (sensorB.pos > -1) {
                        this.angle = sensorB.angle;
                        this.x = fx = sensorB.pos - 20;
                    }
                }
            } this.updateMode();


        } else {
            sensorA = this.checkCollisionLine(fx - 9, fy, 20, 1);
            sensorB = this.checkCollisionLine(fx + 9, fy, 20, 1);

            if (sensorA == -1 && sensorB == -1) {
                this.inAir = true;
                this.wasInAir = true;
            } else {

                if (sensorA.pos >= 0 && sensorB.pos >= 0) {
                    if (sensorA.pos < sensorB.pos) {
                        if (this.y + (20) >= sensorA.pos) {
                            this.angle = sensorA.angle;
                            this.y = fy = sensorA.pos - 20;
                            this.rolling = this.currentlyBall = false;
                            this.inAir = false;
                        }

                    } else {
                        if (sensorB.pos > -1) {
                            if (this.y + (20) >= sensorB.pos) {
                                this.angle = sensorB.angle;
                                this.y = fy = sensorB.pos - 20;
                                this.rolling = this.currentlyBall = false;
                                this.inAir = false;
                            }
                        }
                    }
                } else if (sensorA.pos > -1) {
                    if (this.y + (20) >= sensorA.pos) {
                        this.angle = sensorA.angle;
                        this.y = fy = sensorA.pos - 20;
                        this.rolling = this.currentlyBall = false;
                        this.inAir = false;
                    }
                } else if (sensorB.pos > -1) {
                    if (this.y + (20) >= sensorB.pos) {
                        this.angle = sensorB.angle;
                        this.y = fy = sensorB.pos - 20;
                        this.rolling = this.currentlyBall = false;
                        this.inAir = false;
                    }
                }
            }
            this.updateMode();

            var cur = sonicManager.SpriteCache.sonicSprites[this.spriteState + scale.x + scale.y];
            var __h = cur.height / scale.y / 2;
            sensorA = this.checkCollisionLine(fx - 9, fy, __h, 3);
            sensorB = this.checkCollisionLine(fx + 9, fy, __h, 3);

            if ((sensorA == -1 && sensorB == -1)) {

            } else {
                if (sensorA.pos >= 0 && sensorB.pos >= 0) {
                    this.angle = sensorA.angle;
                    if (sensorA.pos < sensorB.pos) {
                        if (this.y + (__h) >= sensorA.pos) {
                            this.angle = sensorA.angle;
                            this.y = fy = sensorA.pos + __h;
                            this.ysp = 0;
                        }
                    } else {
                        if (this.y + (__h) >= sensorB.pos) {
                            this.angle = sensorB.angle;
                            this.y = fy = sensorB.pos + __h;
                            this.ysp = 0;
                        }
                    }
                } else if (sensorA.pos > -1) {
                    if (this.y + (__h) >= sensorA.pos) {
                        this.angle = sensorA.angle;
                        this.y = fy = sensorA.pos + __h;
                        this.ysp = 0;
                    }
                } else if (sensorB.pos > -1) {
                    if (this.y + (__h) >= sensorB.pos) {
                        this.angle = sensorB.angle;
                        this.y = fy = sensorB.pos + __h;
                        this.ysp = 0;
                    }
                }
                this.updateMode();
            }
        }
    };
    this.debug = function () {
        this.debugging = !this.debugging;
        this.xsp = 0;
        this.gsp = 0;
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


        var m = this.checkCollisionLineWrap(x, y, length, direction);

        if (m != -1 && m.angle == null) {
            //alert(_H.stringify(m));
            m = this.checkCollisionLineWrap(x, y, length, direction);

        }

        if (m.angle == 255) {
            if (this.mode == RotationMode.Floor) {

            }
            else if (this.mode == RotationMode.LeftWall) {
                m.angle = Math.floor(256 / 4 * 1);
            }
            else if (this.mode == RotationMode.Ceiling) {
                m.angle = Math.floor(256 / 4 * 2);
            }
            else if (this.mode == RotationMode.RightWall) {
                m.angle = Math.floor(256 / 4 * 3);
            }
        }

        return m;
    };


    this.checkCollisionLineWrap = function (x, y, length, direction) {



        var _x = _H.floor(x / 128);
        var _y = _H.floor(y / 128);
        var tc = sonicManager.SonicLevel.TileChunks[sonicManager.SonicLevel.ChunkMap[_x][_y]];
        var curh = sonicManager.SonicLevel.curHeightMap ? tc.heightBlocks1 : tc.heightBlocks2;
        var cura = sonicManager.SonicLevel.curHeightMap ? tc.angleMap1 : tc.angleMap2;

        var __x = x - _x * 128;
        var __y = y - _y * 128;


         
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
                        tc = sonicManager.SonicLevel.TileChunks[sonicManager.SonicLevel.ChunkMap[_x + 1][_y]];
                        curh = sonicManager.SonicLevel.curHeightMap ? tc.heightBlocks1 : tc.heightBlocks2;
                        cura = sonicManager.SonicLevel.curHeightMap ? tc.angleMap1 : tc.angleMap2;
                        __x -= 128;
                    }

                    if (x + i > this.LevelWidth || curh[(__x + i)][ __y ])
                        return { pos: x + i, angle: cura[_H.floor((__x + i) / 16)][_H.floor((__y) / 16)] };
                }
                break;
            case 1:
                //top to bottom
                if (y + length > sonicManager.SonicLevel.LevelHeight * 128)
                    return { pos: sonicManager.SonicLevel.LevelHeight * 128 - 20, angle: null };
                for (i = 0; i < length; i += 1) {

                    if (__y + curc >= 128) {
                        tc = sonicManager.SonicLevel.TileChunks[sonicManager.SonicLevel.ChunkMap[_x][ (_y + 1)]];
                        curh = sonicManager.SonicLevel.curHeightMap ? tc.heightBlocks1 : tc.heightBlocks2;
                        cura = sonicManager.SonicLevel.curHeightMap ? tc.angleMap1 : tc.angleMap2;

                        __y -= 128;
                    }
                    if (curh[__x][__y+i]) {
                        return { pos: y + i, angle: cura[_H.floor((__x) / 16)][_H.floor((__y + curc) / 16)] };
                    }

                    curc++;
                }
                break;
            case 2:
                //right to left
                if (x - length < 0)
                    return { pos: 0 + 20, angle: null };

                for (i = 0; i < length; i++) {
                    if (__x - i < 0) {
                        tc = sonicManager.SonicLevel.TileChunks[sonicManager.SonicLevel.ChunkMap[(_x - 1), _y]];
                        curh = sonicManager.SonicLevel.curHeightMap ? tc.heightBlocks1 : tc.heightBlocks2;
                        cura = sonicManager.SonicLevel.curHeightMap ? tc.angleMap1 : tc.angleMap2;

                        __x += 128;

                    }


                    if (x - i < 0 || curh[(__x - i)][ __y])
                        return { pos: x - i, angle: cura[_H.floor((__x - i) / 16)][_H.floor((__y) / 16)] };
                }
                break;
            case 3:
                //bottom to top 
                if (y - length < 0)
                    return { pos: 20, angle: null };


                for (i = 0; i < length; i += 1) {
                    if (__y - curc < 0) {
                        tc = sonicManager.SonicLevel.TileChunks[sonicManager.SonicLevel.ChunkMap[_x][ (_y - 1)]];
                        curh = sonicManager.SonicLevel.curHeightMap ? tc.heightBlocks1 : tc.heightBlocks2;
                        cura = sonicManager.SonicLevel.curHeightMap ? tc.angleMap1 : tc.angleMap2;

                        __y += 128;
                    }

                    if (curh[__x ][ __y-i])
                        return { pos: y - i, angle: cura[_H.floor((__x) / 16) ][ _H.floor((__y - curc) / 16)] };

                    curc++;
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
        canvas.fillText("Angle: " + this.angle.toString(16), pos.x + 90, pos.y + 75);
        canvas.fillText("Position: " + _H.floor(this.x) + ", " + _H.floor(this.y), pos.x + 90, pos.y + 105);
        canvas.fillText("Speed: g: " + this.gsp.toFixed(3) + " x:" + this.xsp.toFixed(3) + " y:" + this.ysp.toFixed(3), pos.x + 90, pos.y + 135);
        canvas.fillText("Mode: " + this.mode, pos.x + 90, pos.y + 185);

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
                var yOffset = (40 - (cur.height / scale.y)) / 2;


                canvas.translate(((fx - sonicManager.windowLocation.x) * scale.x), ((fy - sonicManager.windowLocation.y + yOffset) * scale.y));





                if (!this.facing) {
                    //canvas.translate(cur.width, 0);
                    canvas.scale(-1, 1);
                    canvas.rotate(-_H.fixAngle(this.angle));

                    canvas.drawImage(cur, -cur.width / 2, -cur.height / 2);

                    if (this.spinDash) {
                        canvas.drawImage(sonicManager.SpriteCache.sonicSprites[("spinsmoke" + _H.floor((sonicManager.drawTickCount % 14) / 2)) + scale.x + scale.y],
                            (-cur.width / 2) - 25 * scale.x, -cur.height / 2 + (yOffset * scale.y) - 15, cur.width, cur.height);
                    }
                } else {
                    canvas.rotate(_H.fixAngle(this.angle));
                    canvas.drawImage(cur, -cur.width / 2, -cur.height / 2);


                    if (this.spinDash) {
                        canvas.drawImage(sonicManager.SpriteCache.sonicSprites[("spinsmoke" + _H.floor((sonicManager.drawTickCount % 14) / 2)) + scale.x + scale.y],
                           (-cur.width / 2) - 25 * scale.x, -cur.height / 2 + (yOffset * scale.y) - 15, cur.width, cur.height);
                    }

                }
                /*
                canvas.moveTo(-10 * scale.x, 4 * scale.y);
                canvas.lineTo(10 * scale.x, 4 * scale.y);
                canvas.lineWidth = 3;
                canvas.strokeStyle = "#FFF";
                canvas.stroke();

                canvas.moveTo(-9 * scale.x, 0 * scale.y);
                canvas.lineTo(-9 * scale.x, 20 * scale.y);
                canvas.lineWidth = 3;
                canvas.strokeStyle = "#FFF";
                canvas.stroke();

                canvas.moveTo(9 * scale.x, 0 * scale.y);
                canvas.lineTo(9 * scale.x, 20 * scale.y);
                canvas.lineWidth = 3;
                canvas.strokeStyle = "#FFF";
                canvas.stroke();*/


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

    this.kill = function () {

    };
    this.pressJump = function () {

        if (!this.justHit) {
            this.jumping = true;
        }
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
            hb1.length = 128;
            hb2.length = 128;
            for (var _1 = 0; _1 < 128; _1++) {
                hb1[_1] = [];
                hb2[_1] = [];
                hb2[_1].length = hb1[_1].length = 128;
            }


            for (var _y = 0; _y < 8; _y++) {
                for (var _x = 0; _x < 8; _x++) {
                    //  var tp = sonicLevel.TilePieces[chunk.tilesPieces[_y * 8 + _x]];
                    var hd1 = hm1[_x][_y];
                    var hd2 = hm2[_x][_y];
                    if (hd1 == 0) continue;
                    var __x;
                    var __y;

                    if (hd1 == 1) {
                        for (__y = 0; __y < 16; __y++) {
                            for (__x = 0; __x < 16; __x++) { 
                                hb1[(_x * 16 + __x)][(_y * 16 + __y)] = true;
                                hb2[(_x * 16 + __x)][(_y * 16 + __y)] = true;
                            }
                        }
                        continue;
                    }
                    hd1 = hd1.items;
                    hd2 = hd2.items;

                    for (__y = 0; __y < 16; __y++) {
                        for (__x = 0; __x < 16; __x++) {  
                            hb1[(_x * 16 + __x)][(_y * 16 + __y)] = hd1[__x] > 16 - __y;
                            hb2[(_x * 16 + __x)][(_y * 16 + __y)] = hd2[__x] > 16 - __y;

                            //imap[(x * 128 + _x * 16 + __x) + (y * 128 + _y * 16 + __y) * (this.LevelWidth)] = tp.heightMask.angle;
                        }
                    }
                }


            }
        }


    };
    this.updateSprite = function () {
        var absgsp = Math.abs(this.gsp);
        var j = parseInt(this.spriteState.substring(this.spriteState.length - 1, this.spriteState.length));
        if (this.breaking > 0) {
            if (this.gsp > 0 || this.gsp == 0 || this.spriteState == "breaking3") {
                this.facing = false;
                this.breaking = 0;
            }
        } else if (this.breaking < 0) {
            if (this.gsp < 0 || this.gsp == 0 || this.spriteState == "breaking3") {
                this.breaking = 0;
                this.facing = true;
            }
        }


        if (this.justHit) {
            if (this.spriteState.substring(0, this.spriteState.length - 1) != "hit") {
                this.spriteState = "hit0";
                this.runningTick = 1;
            } else if ((this.runningTick++) % (_H.floor(8 - absgsp)) == 0) {
                this.spriteState = "hit1";
            }
        } else if (absgsp == 0 && this.inAir == false) {


            if (this.ducking) {

                if (this.spinDash) {
                    if (this.spriteState.substring(0, this.spriteState.length - 1) != "spindash") {
                        this.spriteState = "spindash0";
                        this.runningTick = 1;
                    } else if ((this.runningTick++) % (_H.floor(2 - absgsp)) == 0) {
                        this.spriteState = "spindash" + ((j + 1) % 6);
                    }
                } else {
                    if (this.spriteState.substring(0, this.spriteState.length - 1) != "duck") {
                        this.spriteState = "duck0";
                        this.runningTick = 1;
                    } else if ((this.runningTick++) % (_H.floor(4 - absgsp)) == 0) {
                        this.spriteState = "duck1";
                    }
                }

            } else {
                this.spriteState = "normal";
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
            } else if ((this.runningTick++) % (_H.floor(8 - absgsp)) == 0) {
                ;
                this.spriteState = "balls" + ((j + 1) % 5);
            }
        } else if (absgsp < 6) {
            if (this.spriteState.substring(0, this.spriteState.length - 1) != "running") {
                this.spriteState = "running0";
                this.runningTick = 1;
            } else if ((this.runningTick++) % (_H.floor(8 - absgsp)) == 0 || (_H.floor(8 - absgsp) == 0)) {
                this.spriteState = "running" + ((j + 1) % 8);
            }

        } else if (absgsp >= 6) {
            if (this.spriteState.substring(0, this.spriteState.length - 1) != "fastrunning") {
                this.spriteState = "fastrunning0";
                this.runningTick = 1;
            } else if (((this.runningTick++) % (Math.ceil(8 - absgsp)) == 0) || (_H.floor(8 - absgsp) == 0)) {
                this.spriteState = "fastrunning" + ((j + 1) % 4);
            }

        }
    };
    this.buildHeightInfo(sonicLevel);
}
