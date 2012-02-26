﻿function Sonic(sonicLevel, scale) {
    this.x = sonicLevel.StartPositions[0].X;
    this.y = sonicLevel.StartPositions[0].Y;
    this.obtainedRing = [];
    this.rings = 0;
    this.debugging = false;
    this.jumping = false;
    this.crouching = false;
    this.holdingLeft = false;
    this.holdingRight = false;
    this.holdingUp = false;
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
    this.sensorManager = new SensorManager(sonicManager);
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

    this.sensorManager.createVerticalSensor('a', -9, 0, 36, '#F202F2');
    this.sensorManager.createVerticalSensor('b', 9, 0, 36, '#02C2F2');
    this.sensorManager.createVerticalSensor('c', -9, 0, -20, '#2D2C21');
    this.sensorManager.createVerticalSensor('d', 9, 0, -20, '#C242822');
    this.sensorManager.createHorizontalSensor('m1', 4, 0, -12, '#212C2E');
    this.sensorManager.createHorizontalSensor('m2', 4, 0, 12, '#22Ffc1');
    this.watcher = new Watcher();



    this.updateMode = function () {

        //if (this.angle == 0xF0) this.angle = 15;
        if (this.angle <= 0x20 || this.angle > 0xDE) {
            this.mode = RotationMode.Floor;
        } else if (this.angle > 0x20 && this.angle < 0x56) {
            this.mode = RotationMode.LeftWall;
        } else if (this.angle >= 0x56 && this.angle < 0xA1) {
            this.mode = RotationMode.Ceiling;
        } else if (this.angle > 0xA1 && this.angle < 0xDE) {
            this.mode = RotationMode.RightWall;
        }
        /* 
        if (this.angle <= 0xff && this.angle > 0xC8) {
        this.mode = RotationMode.Floor;
        } else if (this.angle <= 0xc8 && this.angle > 0x80) {
        this.mode = RotationMode.RightWall;
        } else if (this.angle <= 0x80 && this.angle > 0x40) {
        this.mode = RotationMode.Ceiling;
        } else if (this.angle <= 0x40 && this.angle > 0x0) {
        this.mode = RotationMode.LeftWall;
        } */
        /*
        if (this.angle <= 0x20 || this.angle > 0xd6) {
        this.mode = RotationMode.Floor;
        } else if (this.angle <= 0xd6 && this.angle > 0xa2) {
        this.mode = RotationMode.RightWall;
        } else if (this.angle <= 0xa2 && this.angle > 0x5e) {
        this.mode = RotationMode.Ceiling;
        } else if (this.angle <= 0x5e && this.angle > 0x20) {
        this.mode = RotationMode.LeftWall;
        }  */
        this.myRec = { x: this.x - 5, width: 5 * 2, y: this.y - 20, height: 20 * 2 };
    };
    this.effectPhysics = function () {

        this.watcher.tick();

        var max = 6;
        if (!this.jumping) {
            if (!this.inAir && this.wasJumping) {
                this.wasJumping = false;
            }
        }
        if (this.inAir && !this.wasInAir) {
            this.wasInAir = true;
            if ((this.angle >= 0x70 && this.angle <= 0x90)) {
                this.xsp = (this.gsp);
            }
        }
        if (!this.inAir && this.wasInAir) {
            this.wasInAir = false;
            if ((this.angle >= 0xF0 || this.angle <= 0x0F)) {
                this.gsp = (this.xsp);
            } else if ((this.angle >= 0xE0 && this.angle <= 0xEF) ||
                (this.angle >= 0x10 && this.angle <= 0x1F)) {
                this.gsp = (this.ysp);
            } else if ((this.angle >= 0xC0 && this.angle <= 0xDF)) {
                this.gsp = (-this.ysp);
            } else if ((this.angle >= 0x20 && this.angle <= 0x3F)) {
                this.gsp = (this.ysp);
            }
            this.xsp = 0;
            this.ysp = 0;
        }


        if (!this.inAir && !this.rolling) {
            if (!this.holdingLeft && !this.holdingRight) {
                //friction
                this.gsp -= (Math.min(Math.abs(this.gsp), this.watcher.multiply(this.frc)) * (this.gsp > 0 ? 1 : -1));
            }
            oldSign = _H.sign(this.gsp);
            //slope
            this.gsp += this.watcher.multiply(this.slp) * -_H.sin(this.angle);
            if (oldSign != _H.sign(this.gsp) && oldSign != 0) {
                this.hlock = 30;
            }

            if (this.holdingRight && !this.holdingLeft) {
                this.facing = true;
                if (this.gsp >= 0) {
                    //accelerate 
                    this.gsp += this.watcher.multiply(this.acc);
                    if (this.gsp > max) this.gsp = max;
                } else {
                    //decelerate 
                    this.gsp += this.watcher.multiply(this.dec);
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
                    this.gsp -= this.watcher.multiply(this.acc);
                    if (this.gsp < -max) this.gsp = -max;
                } else {
                    //decelerate 
                    this.gsp -= this.watcher.multiply(this.dec);
                    if (Math.abs(this.gsp) > 4.5) {
                        this.facing = true;
                        this.breaking = -1;
                        this.runningTick = 0;
                    }
                }
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

        if (!this.inAir && this.rolling) {
            //dec  
            if (this.holdingLeft) {
                if (this.gsp > 0) {
                    if (this.rolling) {
                        this.gsp = (_H.max(0, this.gsp - this.watcher.multiply(this.rdec)));
                    }
                }
            }
            if (this.holdingRight) {
                if (this.gsp < 0) {
                    if (this.rolling) {
                        this.gsp = (_H.min(0, this.gsp + this.watcher.multiply(this.rdec)));
                    }
                }
            }
            //friction
            this.gsp -= (Math.min(Math.abs(this.gsp), this.watcher.multiply(this.rfrc)) * (this.gsp > 0 ? 1 : -1));
            oldSign = _H.sign(this.gsp);
            //slope
            var ang = _H.sin(this.angle);
            if ((ang > 0) == (this.gsp > 0))
                this.gsp += this.watcher.multiply(-this.slpRollingUp) * ang;
            else
                this.gsp += this.watcher.multiply(-this.slpRollingDown) * ang;

            if (oldSign != _H.sign(this.gsp) && oldSign != 0) {
                this.hlock = 30;
            }
            if (Math.abs(this.gsp) < 0.53125) {
                this.rolling = false;
                this.currentlyBall = false;
            }
        }


        if (this.inAir) {
            if (this.holdingRight && !this.holdingLeft) {
                this.facing = true;

                if (this.xsp >= 0) {
                    //accelerate 
                    this.xsp += this.watcher.multiply(this.air);
                    if (this.xsp > max) this.xsp = max;
                } else {
                    //decelerate 
                    this.xsp += this.watcher.multiply(this.air);
                }
            }
            if (this.holdingLeft && !this.holdingRight) {
                this.facing = false;
                if (this.xsp <= 0) {
                    //accelerate 
                    this.xsp -= this.watcher.multiply(this.air);
                    if (this.xsp < -max) this.xsp = -max;
                } else {
                    //decelerate 
                    this.xsp -= this.watcher.multiply(this.air);
                }
            }
            if (this.wasInAir) {
                if (this.jumping) {

                } else {

                }
            }
            //gravity
            this.ysp += this.watcher.multiply(this.justHit ? 0.1875 : this.grv);
            //drag
            if (this.ysp < 0 && this.ysp > -4) {
                if (Math.abs(this.xsp) > 0.125) {
                    this.xsp *= 0.96875;
                }
            }
            if (this.ysp > 16) this.ysp = 16;
        }
        if (this.wasInAir && this.jumping) {

        } else if (this.jumping && !this.wasJumping) {
            this.wasJumping = true;
            if (this.ducking) {
                this.spinDash = true;
                this.spinDashSpeed += 2;
                if (this.spinDashSpeed > 8)
                    this.spinDashSpeed = 8;

                this.spriteState = "spindash0";
            } else {
                this.inAir = true;
                this.currentlyBall = true;
                this.xsp = this.jmp * _H.sin(this.angle) + this.gsp * _H.cos(this.angle);
                this.ysp = this.jmp * _H.cos(this.angle);
            }
        }

        this.checkCollisionWithRing();
        this.checkCollisionWithObjects();

        if (!this.inAir) {
            if (this.spinDash) {
                this.gsp = 0;
            }
            this.xsp = this.gsp * _H.cos(this.angle);
            this.ysp = this.gsp * -_H.sin(this.angle);

            if (Math.abs(this.gsp) < 2.5 && this.mode != RotationMode.Floor) {
                if (this.mode == RotationMode.RightWall) this.x -= 0;
                else if (this.mode == RotationMode.LeftWall) this.x += 0;
                else if (this.mode == RotationMode.Ceiling) this.y += 0;
                this.mode = RotationMode.Floor;
                this.angle = 0xFF;
                this.updateMode();
                this.hlock = 30;
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

         
        this.x = ((sonicManager.SonicLevel.LevelWidth * 128) + (this.x + this.xsp)) % (sonicManager.SonicLevel.LevelWidth * 128);
        this.y = ((sonicManager.SonicLevel.LevelHeight * 128) + (this.y + this.ysp)) % (sonicManager.SonicLevel.LevelHeight * 128);
    };

    this.tick = function () {
        if (this.debugging) {
            var debugSpeed = this.watcher.multiply(15);

            if (this.holdingRight) {
                this.x += debugSpeed;
            } if (this.holdingLeft) {
                this.x -= debugSpeed;
            } if (this.crouching) {
                this.y += debugSpeed;
            }
            if (this.holdingUp) {
                this.y -= debugSpeed;
            }

            this.x = ((sonicManager.SonicLevel.LevelWidth * 128) + (this.x )) % (sonicManager.SonicLevel.LevelWidth * 128);
            this.y = ((sonicManager.SonicLevel.LevelHeight * 128) + (this.y )) % (sonicManager.SonicLevel.LevelHeight * 128);
            return;
        }

        this.updateMode();

        if (this.hlock > 0) {
            this.hlock--;
            this.holdingRight = false;
            this.holdingLeft = false;
        }


        if (this.inAir) {
            this.angle = 0xff;
            this.mode = RotationMode.Floor;
        }

        this.effectPhysics();
        this.updateSprite();

        var fx = _H.floor(this.x);
        var fy = _H.floor(this.y);

        this.sensorManager.check(this);

        var sensorM1 = this.sensorManager.getResult('m1');
        var sensorM2 = this.sensorManager.getResult('m2');


        switch (this.mode) {
            case RotationMode.Floor:
                if (sensorM1 != -1) {
                    this.x = fx = sensorM1.value + 12;
                    this.gsp = 0;
                    if (this.inAir) this.xsp = 0;
                }
                if (sensorM2 != -1) {
                    this.x = fx = sensorM2.value - 12;
                    this.gsp = 0;
                    if (this.inAir) this.xsp = 0;
                }
                break;
            case RotationMode.LeftWall:
                if (sensorM1 != -1) {
                    this.y = fy = sensorM1.value - 12;
                    if (this.inAir) this.xsp = 0;
                }
                if (sensorM2 != -1) {
                    this.y = fy = sensorM2.value + 12;
                    this.gsp = 0;
                    if (this.inAir) this.xsp = 0;
                }
                break;
            case RotationMode.Ceiling:
                if (sensorM1 != -1) {
                    this.x = fx = sensorM1.value + 12;
                    this.gsp = 0;
                    if (this.inAir) this.xsp = 0;
                }
                if (sensorM2 != -1) {
                    this.x = fx = sensorM2.value - 12;
                    this.gsp = 0;
                    if (this.inAir) this.xsp = 0;
                }
                break;
            case RotationMode.RightWall:
                if (sensorM1 != -1) {
                    this.y = fy = sensorM1.value - 12;
                    this.gsp = 0;
                    if (this.inAir) this.xsp = 0;
                }
                if (sensorM2 != -1) {
                    this.y = fy = sensorM2.value + 12;
                    this.gsp = 0;
                    if (this.inAir) this.xsp = 0;
                }
                break;
        }
        this.sensorManager.check(this);

        var sensorA = this.sensorManager.getResult('a');
        var sensorB = this.sensorManager.getResult('b');
         
        if (!this.inAir) {
            if (sensorA == -1 && sensorB == -1) {
                this.inAir = true;
            } else {
                this.justHit = false;
                switch (this.mode) {
                    case RotationMode.Floor:
                        if (sensorA.value >= 0 && sensorB.value >= 0) {
                            if (sensorA.value < sensorB.value) {
                                sensorA.chosen = true;
                                this.angle = sensorA.angle;
                                this.y = fy = sensorA.value - 20;
                            } else {
                                sensorB.chosen = true;
                                this.angle = sensorB.angle;
                                this.y = fy = sensorB.value - 20;
                            }
                        } else if (sensorA.value > -1) {
                            sensorA.chosen = true;
                            this.angle = sensorA.angle;
                            this.y = fy = sensorA.value - 20;
                        } else if (sensorB.value > -1) {
                            sensorB.chosen = true;
                            this.angle = sensorB.angle;
                            this.y = fy = sensorB.value - 20;
                        }

                        break;
                    case RotationMode.LeftWall:
                        if (sensorA.value >= 0 && sensorB.value >= 0) {
                            if (sensorA.value > sensorB.value) {
                                sensorA.chosen = true;
                                this.angle = sensorA.angle;
                                this.x = fx = sensorA.value + 20;
                            } else {
                                sensorB.chosen = true;
                                this.angle = sensorB.angle;
                                this.x = fx = sensorB.value + 20;
                            }
                        } else if (sensorA.value > -1) {
                            sensorA.chosen = true;
                            this.angle = sensorA.angle;
                            this.x = fx = sensorA.value + 20;
                        } else if (sensorB.value > -1) {
                            sensorB.chosen = true;
                            this.angle = sensorB.angle;
                            this.x = fx = sensorB.value + 20;
                        }
                        break;
                    case RotationMode.Ceiling:
                        if (sensorA.value >= 0 && sensorB.value >= 0) {
                            if (sensorA.value > sensorB.value) {
                                sensorA.chosen = true;
                                this.angle = sensorA.angle;
                                this.y = fy = sensorA.value + 20;
                            } else {
                                sensorB.chosen = true;
                                this.angle = sensorB.angle;
                                this.y = fy = sensorB.value + 20;
                            }
                        } else if (sensorA.value > -1) {
                            sensorA.chosen = true;
                            this.angle = sensorA.angle;
                            this.y = fy = sensorA.value + 20;
                        } else if (sensorB.value > -1) {
                            sensorB.chosen = true;
                            this.angle = sensorB.angle;
                            this.y = fy = sensorB.value + 20;
                        }
                        break;
                    case RotationMode.RightWall:
                        if (sensorA.value >= 0 && sensorB.value >= 0) {
                            if (sensorA.value < sensorB.value) {
                                sensorA.chosen = true;
                                this.angle = sensorA.angle;
                                this.x = fx = sensorA.value - 20;
                            } else {
                                sensorB.chosen = true;
                                this.angle = sensorB.angle;
                                this.x = fx = sensorB.value - 20;
                            }
                        } else if (sensorA.value > -1) {
                            sensorA.chosen = true;
                            this.angle = sensorA.angle;
                            this.x = fx = sensorA.value - 20;
                        } else if (sensorB.value > -1) {
                            sensorB.chosen = true;
                            this.angle = sensorB.angle;
                            this.x = fx = sensorB.value - 20;
                        }
                        break;
                }

            }

            this.updateMode();


        } else {
            if (sensorA == -1 && sensorB == -1) {
                this.inAir = true;
            } else {

                if (sensorA.value >= 0 && sensorB.value >= 0) {
                    if (sensorA.value < sensorB.value) {
                        if (this.y + (20) >= sensorA.value) {
                            this.angle = sensorA.angle;
                            this.y = fy = sensorA.value - 20;
                            this.rolling = this.currentlyBall = false;
                            this.inAir = false;
                        }
                    } else {
                        if (sensorB.value > -1) {
                            if (this.y + (20) >= sensorB.value) {
                                this.angle = sensorB.angle;
                                this.y = fy = sensorB.value - 20;
                                this.rolling = this.currentlyBall = false;
                                this.inAir = false;
                            }
                        }
                    }
                } else if (sensorA.value > -1) {
                    if (this.y + (20) >= sensorA.value) {
                        this.angle = sensorA.angle;
                        this.y = fy = sensorA.value - 20;
                        this.rolling = this.currentlyBall = false;
                        this.inAir = false;
                    }
                } else if (sensorB.value > -1) {
                    if (this.y + (20) >= sensorB.value) {
                        this.angle = sensorB.angle;
                        this.y = fy = sensorB.value - 20;
                        this.rolling = this.currentlyBall = false;
                        this.inAir = false;
                    }
                }
            }
            this.updateMode();

            var cur = sonicManager.SpriteCache.sonicSprites[this.spriteState + scale.x + scale.y];
            var __h = cur.height / scale.y / 2;

            this.sensorManager.check(this);
            var sensorC = this.sensorManager.getResult('c');
            var sensorD = this.sensorManager.getResult('d');

            if ((sensorC == -1 && sensorD == -1)) {

            } else {
                if (sensorC.value >= 0 && sensorD.value >= 0) {
                    this.angle = sensorC.angle;
                    if (sensorC.value < sensorD.value) {
                        if (this.y + (__h) >= sensorC.value) {
                            if (this.ysp < 0) {
                                this.angle = sensorC.angle;
                                this.y = fy = sensorC.value + __h;
                                if (sensorC.angle == 0xff) {
                                    this.ysp = 0;
                                } else {
                                    this.gsp = -this.ysp;
                                    this.inAir = false;
                                    this.wasInAir = false;
                                }
                            }
                        }
                    } else {
                        if (this.y + (__h) >= sensorD.value) {
                            if (this.ysp < 0) {
                                this.angle = sensorD.angle;
                                this.y = fy = sensorD.value + __h;
                                if (sensorC.angle == 0xff) {
                                    this.ysp = 0;
                                } else {
                                    this.gsp = -this.ysp;

                                    this.inAir = false;
                                    this.wasInAir = false;
                                }
                            }
                        }
                    }
                } else if (sensorC.value > -1) {
                    if (this.y + (__h) >= sensorC.value) {
                        if (this.ysp < 0) {
                            this.angle = sensorC.angle;
                            this.y = fy = sensorC.value + __h;
                            if (sensorC.angle == 0xff) {
                                this.ysp = 0;
                            } else {
                                this.gsp = -this.ysp;

                                this.inAir = false;
                                this.wasInAir = false;
                            }
                        }
                    }
                } else if (sensorD.value > -1) {
                    if (this.y + (__h) >= sensorD.value) {
                        if (this.ysp < 0) {
                            this.angle = sensorD.angle;
                            this.y = fy = sensorD.value + __h;
                            if (sensorC.angle == 0xff) {
                                this.ysp = 0;
                            } else {
                                this.gsp = -this.ysp;

                                this.inAir = false;
                                this.wasInAir = false;
                            }

                        }
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
            var _x = pos.X;
            var _y = pos.Y;
            if (_H.intersectRect(me, { x: _x - 8, width: 8 * 2, y: _y - 8, height: 8 * 2 })) {
                this.rings++;
                this.obtainedRing[ring] = true;
            }
        }
    };
    this.checkCollisionWithObjects = function () {
        var me = this.myRec;
        for (var obj in sonicManager.SonicLevel.Objects) {
            var ob = sonicManager.SonicLevel.Objects[obj];
            var _x = ob.X;
            var _y = ob.Y;
            if (_H.intersectRect(me, ob.getRect())) {
                ob.collide();
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
                //   m.angle = Math.floor(256 / 4 * 1);
            }
            else if (this.mode == RotationMode.Ceiling) {
                //   m.angle = Math.floor(256 / 4 * 2);
            }
            else if (this.mode == RotationMode.RightWall) {
                //     m.angle = Math.floor(256 / 4 * 3);
            }
        }

        return m;
    };


    this.checkCollisionLineWrap = function (x, y, length, direction) {



        var _x = _H.floor(x / 128);
        var _y = _H.floor(y / 128);
        var tc = sonicManager.SonicLevel.Chunks[sonicManager.SonicLevel.ChunkMap[_x][_y]];
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
                        tc = sonicManager.SonicLevel.Chunks[sonicManager.SonicLevel.ChunkMap[_x + 1][_y]];
                        curh = sonicManager.SonicLevel.curHeightMap ? tc.heightBlocks1 : tc.heightBlocks2;
                        cura = sonicManager.SonicLevel.curHeightMap ? tc.angleMap1 : tc.angleMap2;
                        __x -= 128;
                    }

                    if (x + i > this.LevelWidth || curh[(__x + i)][__y] >= 2)
                        return { pos: x + i, angle: cura[_H.floor((__x + i) / 16)][_H.floor((__y) / 16)] };
                }
                break;
            case 1:
                //top to bottom
                if (y + length > sonicManager.SonicLevel.LevelHeight * 128)
                    return { pos: sonicManager.SonicLevel.LevelHeight * 128 - 20, angle: null };
                for (i = 0; i < length; i += 1) {

                    if (__y + curc >= 128) {
                        tc = sonicManager.SonicLevel.Chunks[sonicManager.SonicLevel.ChunkMap[_x][(_y + 1)]];
                        curh = sonicManager.SonicLevel.curHeightMap ? tc.heightBlocks1 : tc.heightBlocks2;
                        cura = sonicManager.SonicLevel.curHeightMap ? tc.angleMap1 : tc.angleMap2;

                        __y -= 128;
                    }
                    if (curh[__x][__y + i] >= 1) {
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
                        tc = sonicManager.SonicLevel.Chunks[sonicManager.SonicLevel.ChunkMap[(_x - 1), _y]];
                        curh = sonicManager.SonicLevel.curHeightMap ? tc.heightBlocks1 : tc.heightBlocks2;
                        cura = sonicManager.SonicLevel.curHeightMap ? tc.angleMap1 : tc.angleMap2;

                        __x += 128;

                    }


                    if (x - i < 0 || curh[(__x - i)][__y] >= 2)
                        return { pos: x - i, angle: cura[_H.floor((__x - i) / 16)][_H.floor((__y) / 16)] };
                }
                break;
            case 3:
                //bottom to top 
                if (y - length < 0)
                    return { pos: 20, angle: null };


                for (i = 0; i < length; i += 1) {
                    if (__y - curc < 0) {
                        tc = sonicManager.SonicLevel.Chunks[sonicManager.SonicLevel.ChunkMap[_x][(_y - 1)]];
                        curh = sonicManager.SonicLevel.curHeightMap ? tc.heightBlocks1 : tc.heightBlocks2;
                        cura = sonicManager.SonicLevel.curHeightMap ? tc.angleMap1 : tc.angleMap2;

                        __y += 128;
                    }

                    if (curh[__x][__y - i] >= 2)
                        return { pos: y - i, angle: cura[_H.floor((__x) / 16)][_H.floor((__y - curc) / 16)] };

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
        canvas.fillText("Mode: " + modeString(this.mode), pos.x + 90, pos.y + 165);
        if (this.inAir)
            canvas.fillText("Air ", pos.x + 220, pos.y + 45);
        if (this.hlock > 0) {
            canvas.fillText("HLock: " + this.hlock, pos.x + 90, pos.y + 195);
        }

    };
    function modeString(st) {
        switch (st) {
            case RotationMode.Floor:
                return "Floor";
            case RotationMode.Ceiling:
                return "Ceiling";
            case RotationMode.RightWall:
                return "Right Wall";
            case RotationMode.LeftWall:
                return "Left Wall";
        }
    }

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
                _H.save(canvas);
                var xOffset = 0;
                var yOffset = 0;
                if (cur.height != 40 * scale.x) {
                    switch (this.mode) {
                        case RotationMode.Floor:

                            var n = 0;
                            yOffset = (40 - ((cur.height + n) / scale.y)) / 2;
                            break;
                        case RotationMode.LeftWall:
                            var n = 15;
                            xOffset = -(40 - ((cur.height + n) / scale.x)) / 2;
                            break;
                        case RotationMode.Ceiling:
                            var n = 8;
                            yOffset = -(40 - ((cur.height + n) / scale.y)) / 2;
                            break;
                        case RotationMode.RightWall:
                            var n = 20;
                            xOffset = -(40 - ((cur.height + n) / scale.x)) / 2;
                            break;
                    }
                } 
                
                canvas.translate((fx - sonicManager.windowLocation.x + xOffset + xOffset) * scale.x, ((fy - sonicManager.windowLocation.y + yOffset) * scale.y));





                if (!this.facing) {
                    //canvas.translate(cur.width, 0);
                    canvas.scale(-1, 1);
                    if (!this.currentlyBall && !this.spinDash)
                        canvas.rotate(-_H.fixAngle(this.angle));

                    canvas.drawImage(cur, -cur.width / 2, -cur.height / 2);

                    if (this.spinDash) {
                        canvas.drawImage(sonicManager.SpriteCache.sonicSprites[("spinsmoke" + _H.floor((sonicManager.drawTickCount % 14) / 2)) + scale.x + scale.y],
                            (-cur.width / 2) - 25 * scale.x, -cur.height / 2 + (yOffset * scale.y) - 14, cur.width, cur.height);
                    }
                } else {
                    if (!this.currentlyBall && !this.spinDash)
                        canvas.rotate(_H.fixAngle(this.angle));
                    canvas.drawImage(cur, -cur.width / 2, -cur.height / 2);


                    if (this.spinDash) {
                        canvas.drawImage(sonicManager.SpriteCache.sonicSprites[("spinsmoke" + _H.floor((sonicManager.drawTickCount % 14) / 2)) + scale.x + scale.y],
                           (-cur.width / 2) - 25 * scale.x, -cur.height / 2 + (yOffset * scale.y) - 14, cur.width, cur.height);
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
                _H.restore(canvas);
                if (sonicManager.showHeightMap)
                    this.sensorManager.draw(canvas, scale, this);
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

        if (this.debugging || !this.justHit) {
            this.jumping = true;
        }
    };
    this.pressUp = function () {

        if (this.debugging || !this.justHit) {
            this.holdingUp = true;
        }
    };

    this.pressCrouch = function () {


        if (this.debugging || !this.justHit)
            this.crouching = true;

    };
    this.pressLeft = function () {


        if (this.debugging || !this.justHit)
            this.holdingLeft = true;

    };
    this.pressRight = function () {


        if (this.debugging || !this.justHit)
            this.holdingRight = true;

    };

    this.releaseJump = function () {
        this.jumping = false;

    };

    this.releaseUp = function () {
        this.holdingUp = false;

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
        for (var mc = 0; mc < sonicLevel.Chunks.length; mc++) {
            var chunk = sonicLevel.Chunks[mc];

            var dd;
            var hb1 = chunk.heightBlocks1 = [];
            var hb2 = chunk.heightBlocks2 = [];
            var ab1 = chunk.angleMap1 = [];
            var ab2 = chunk.angleMap2 = [];
            for (var _1 = 0; _1 < 128; _1++) {
                hb1[_1] = [];
                hb2[_1] = [];
                ab1[_1] = [];
                ab2[_1] = [];
            }


            for (var _y = 0; _y < 8; _y++) {
                for (var _x = 0; _x < 8; _x++) {
                    var tp = chunk.tilePieces[_x][_y];
                    ab1[_x][_y] = sonicManager.SonicLevel.Angles[sonicManager.SonicLevel.CollisionIndexes1[tp.Block]];
                    ab2[_x][_y] = sonicManager.SonicLevel.Angles[sonicManager.SonicLevel.CollisionIndexes2[tp.Block]];


                    if (!(ab1[_x][_y] == 0 || ab1[_x][_y] == 255 || ab1[_x][_y] == 1)) {
                        if (tp.XFlip) {
                            if (tp.YFlip) {
                                ab1[_x][_y] = 192 - ab1[_x][_y] + 192;

                                ab1[_x][_y] = 128 - ab1[_x][_y] + 128;

                            } else {
                                ab1[_x][_y] = 128 - ab1[_x][_y] + 128;
                            }
                        } else {
                            if (tp.YFlip) {
                                ab1[_x][_y] = 192 - ab1[_x][_y] + 192;
                            } else {
                                ab1[_x][_y] = (ab1[_x][_y]);
                            }
                        }
                    }

                    if (!(ab2[_x][_y] == 0 || ab2[_x][_y] == 255 || ab2[_x][_y] == 1)) {
                        if (tp.XFlip) {
                            if (tp.YFlip) {
                                ab2[_x][_y] = 192 - ab2[_x][_y] + 192;

                                ab2[_x][_y] = 128 - ab2[_x][_y] + 128;

                            } else {
                                ab2[_x][_y] = 128 - ab2[_x][_y] + 128;
                            }
                        } else {
                            if (tp.YFlip) {
                                ab2[_x][_y] = 192 - ab2[_x][_y] + 192;
                            } else {
                                ab2[_x][_y] = (ab2[_x][_y]);
                            }
                        }
                    }


                    var __x;
                    var __y;


                    var hd1 = sonicManager.SonicLevel.HeightMaps[sonicManager.SonicLevel.CollisionIndexes1[tp.Block]];
                    var hd2 = sonicManager.SonicLevel.HeightMaps[sonicManager.SonicLevel.CollisionIndexes2[tp.Block]];
                    var mj;
                    if (hd1 == 0 || hd1 == 1) {
                        mj = hd1 == 0 ? 0 : tp.Solid1;
                        for (__y = 0; __y < 16; __y++) {
                            for (__x = 0; __x < 16; __x++) {
                                hb1[(_x * 16 + __x)][(_y * 16 + __y)] = mj;
                            }
                        }
                    } else
                        hd1 = hd1.items;

                    if (hd2 == 0 || hd2 == 1) {
                        mj = hd2 == 0 ? 0 : tp.Solid2;
                        for (__y = 0; __y < 16; __y++) {
                            for (__x = 0; __x < 16; __x++) {
                                hb2[(_x * 16 + __x)][(_y * 16 + __y)] = mj;
                            }
                        }
                    } else
                        hd2 = hd2.items;


                    for (__y = 0; __y < 16; __y++) {
                        for (__x = 0; __x < 16; __x++) {

                            var jx = 0, jy = 0;
                            if (tp.XFlip) {
                                if (tp.YFlip) {
                                    jx = 15 - __x;
                                    jy = 15 - __y;
                                } else {
                                    jx = 15 - __x;
                                    jy = __y;
                                }
                            } else {
                                if (tp.YFlip) {
                                    jx = __x;
                                    jy = 15 - __y;
                                } else {
                                    jx = __x;
                                    jy = __y;
                                }
                            }


                            if (!(hd1 == 0 || hd1 == 1))
                                switch (tp.Solid1) {
                                case 0:
                                    hb1[(_x * 16 + jx)][(_y * 16 + jy)] = false;
                                    break;
                                case 1:
                                case 2:
                                case 3:
                                    hb1[(_x * 16 + jx)][(_y * 16 + jy)] = _H.itemsGood(hd1, __x, __y, jy) ? tp.Solid1 : 0;
                                    break;
                            }

                            if (!(hd2 == 0 || hd2 == 1))
                                switch (tp.Solid2) {
                                case 0:
                                    hb2[(_x * 16 + jx)][(_y * 16 + jy)] = false;
                                    break;
                                case 1:
                                case 2:
                                case 3:
                                    hb2[(_x * 16 + jx)][(_y * 16 + jy)] = _H.itemsGood(hd2, __x, __y, jy) ? tp.Solid2 : 0;
                                    break;
                            }


                            //imap[(x * 128 + _x * 16 + __x) + (y * 128 + _y * 16 + __y) * (this.LevelWidth)] = tp.heightMask.angle;
                        }
                    }
                }


            }
        }


    };
    this.empty = function () {
        for (var mc = 0; mc < sonicLevel.Chunks.length; mc++) {
            var chunk = sonicLevel.Chunks[mc];
            chunk.heightBlocks1 = null;
            chunk.heightBlocks2 = null;
            chunk.angleMap1 = null;
            chunk.angleMap2 = null;
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
        } else if (this.spinDash) {
            if (this.spriteState.substring(0, this.spriteState.length - 1) != "spindash") {
                this.spriteState = "spindash0";
                this.runningTick = 1;
            } else if ((this.runningTick++) % (_H.floor(2 - absgsp)) == 0) {
                this.spriteState = "spindash" + ((j + 1) % 6);
            }
        } else if (absgsp == 0 && this.inAir == false) {
            if (this.ducking) {
                if (this.spriteState.substring(0, this.spriteState.length - 1) != "duck") {
                    this.spriteState = "duck0";
                    this.runningTick = 1;
                } else if ((this.runningTick++) % (_H.floor(4 - absgsp)) == 0) {
                    this.spriteState = "duck1";
                }

            } else if (this.holdingUp) {
                if (this.spriteState.substring(0, this.spriteState.length - 1) != "lookingup") {
                    this.spriteState = "lookingup0";
                    this.runningTick = 1;
                } else if ((this.runningTick++) % (_H.floor(4 - absgsp)) == 0) {
                    this.spriteState = "lookingup1";
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
            } else if (((this.runningTick++) % (_H.floor(8 - absgsp)) == 0) || (8 - absgsp < 1)) {
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


function Watcher() {
    var lastTick = 0;
    this.mult = 1;
    this.tick = function () {

        if (sonicManager.inHaltMode) {
            this.mult = 1;
            return;
        }
        var ticks = new Date().getTime();
        var offset = 0;
        if (lastTick == 0)
            offset = 16.6;
        else
            offset = ticks - lastTick;

        lastTick = ticks;

        this.mult = offset / 16.6;
    };
    this.multiply = function(val) {
        return this.mult * val;
    };
}