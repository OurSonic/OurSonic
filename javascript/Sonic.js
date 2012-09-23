function Sonic(sonicLevel, scale) {
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
    this.gsp = 0;
    this.ysp = 0;
    this.sonicLastHitTick = 0;
    this.acc = 0.046875;
    this.dec = 0.5;
    this.frc = 0.046875;
    this.rdec = 0.125;
    this.rfrc = 0.0234375;
    this.slp = 0.125;
    this.slpRollingUp = 0.078125;
    this.slpRollingDown = 0.3125;
    this.jmp = -6.5;
    this.grv = 0.21875;
    this.air = 0.09375;
    this.topSpeed = 6;
    this.rolling = false;
    this.runningTick = 0;
    this.sonicLevel = sonicLevel;
    this.inAir = false;
    this.releaseJmp = 0;
    this.wasInAir = false;
    this.holdingJump = false;
    this.justHit = false;
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
    this.setVariables = function (water) {
        if (water) {
            this.acc = 0.0234375;
            this.rdec = 0.125;
            this.dec = 0.25;
            this.rfrc = 0.01171875;
            this.frc = 0.0234375;
            this.slp = 0.125;

            this.slpRollingUp = 0.078125;
            this.slpRollingDown = 0.3125;
            this.jmp = -3.5;
            this.releaseJmp = -2;
            this.grv = 0.0625;
            this.topSpeed = 3;
            this.air = 0.046875;
        }
        else {
            this.acc = 0.046875;
            this.dec = 0.5;
            this.frc = 0.046875;
            this.rdec = 0.125;
            this.rfrc = 0.0234375;
            this.slp = 0.125;
            this.slpRollingUp = 0.078125;
            this.slpRollingDown = 0.3125;
            this.releaseJmp = 0;
            this.jmp = -6.5;
            this.grv = 0.21875;
            this.topSpeed = 6;
            this.air = 0.09375;
        }
    };
    this.setVariables(false);
    this.sensorManager.createVerticalSensor('a', -9, 0, 36, '#F202F2');
    this.sensorManager.createVerticalSensor('b', 9, 0, 36, '#02C2F2');
    this.sensorManager.createVerticalSensor('c', -9, 0, -20, '#2D2C21');
    this.sensorManager.createVerticalSensor('d', 9, 0, -20, '#C24222');
    this.sensorManager.createHorizontalSensor('m1', 4, 0, -12, '#212C2E');
    this.sensorManager.createHorizontalSensor('m2', 4, 0, 12, '#22Ffc1');
    this.watcher = new Watcher();

    this.updateMode = function () {



        if (this.angle <= 0x22 || this.angle >= 0xDE) {
            this.mode = RotationMode.Floor;
        } else if (this.angle > 0x22 && this.angle < 0x56) {
            this.mode = RotationMode.LeftWall;
        } else if (this.angle >= 0x56 && this.angle < 0xA1) {
            this.mode = RotationMode.Ceiling;
        } else if (this.angle > 0xA1 && this.angle < 0xDE) {
            this.mode = RotationMode.RightWall;
        }
        //        this.x = _H.floor(this.x);
        //        this.y = _H.floor(this.y);
        this.myRec = { x: this.x - 5, width: 5 * 2, y: this.y - 20, height: 20 * 2 };
        if (this.inAir)
            this.mode = RotationMode.Floor;
    };
    this.effectPhysics = function () {

        this.watcher.tick();

        var max = this.topSpeed;
        if (!this.jumping) {
            if (!this.inAir && this.wasJumping) {
                this.wasJumping = false;
            }
        }
        if (this.inAir && !this.wasInAir) {
            this.wasInAir = true;

            var offset = this.getOffsetFromImage();
            this.x += offset.x;
            this.y += offset.y;

            /*if ((this.angle >= 0x70 && this.angle <= 0x90)) {
            this.xsp = (this.gsp);
            }*/
        }
        if (!this.inAir && this.wasInAir) {
            this.wasInAir = false;
            if ((this.angle >= 0xF0 || this.angle <= 0x0F)) {
                this.gsp = (this.xsp);
            } else if ((this.angle > 0xE2 && this.angle <= 0xEF) ||
                (this.angle >= 0x10 && this.angle <= 0x1F)) {
                this.gsp = (this.ysp);
            } else if ((this.angle >= 0xC0 && this.angle <= 0xE2)) {
                this.gsp = (-this.ysp);
            } else if ((this.angle >= 0x20 && this.angle <= 0x3F)) {
                this.gsp = (this.ysp);
            }
            this.xsp = 0;
            this.ysp = 0;
        }


        if (!this.inAir && !this.rolling) {
            if (!this.holdingLeft && !this.holdingRight && !this.justHit) {
                //friction
                this.gsp -= (Math.min(Math.abs(this.gsp), this.watcher.multiply(this.frc)) * (this.gsp > 0 ? 1 : -1));
            }
            oldSign = _H.sign(this.gsp);
            //slope
            this.gsp += this.watcher.multiply(this.slp) * -_H.sin(this.angle);
            if (oldSign != _H.sign(this.gsp) && oldSign != 0) {
                this.hlock = 30;
            }

            if (this.holdingRight && !this.holdingLeft && !this.justHit) {
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
            if (this.holdingLeft && !this.holdingRight && !this.justHit) {
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
            if (this.holdingLeft && !this.justHit) {
                if (this.gsp > 0) {
                    if (this.rolling) {
                        this.gsp = (_H.max(0, this.gsp - this.watcher.multiply(this.rdec)));
                    }
                }
            }
            if (this.holdingRight && !this.justHit) {
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

            if (this.gsp > max * 2.5) this.gsp = max * 2.5;
            if (this.gsp < -max * 2.5) this.gsp = -max * 2.5;

            if (oldSign != _H.sign(this.gsp) && oldSign != 0) {
                this.hlock = 30;
            }
            if (Math.abs(this.gsp) < 0.53125) {
                this.rolling = false;
                this.currentlyBall = false;
            }
        }

        this.checkCollisionWithRing();


        if (this.inAir) {
            if (this.holdingRight && !this.holdingLeft && !this.justHit) {
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
            if (this.holdingLeft && !this.holdingRight && !this.justHit) {
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

                if (Math.abs(this.xsp) < .17)
                    this.xsp = 0;
            }
        }


        if (!this.inAir) {
            if (this.spinDash) {
                this.gsp = 0;
            }
            this.xsp = this.gsp * _H.cos(this.angle);
            this.ysp = this.gsp * -_H.sin(this.angle);

            if (Math.abs(this.gsp) < 2.5 && this.mode != RotationMode.Floor) {
                if (this.mode == RotationMode.RightWall) this.x += 0;
                else if (this.mode == RotationMode.LeftWall) this.x += 0;
                else if (this.mode == RotationMode.Ceiling) this.y += 0;
                var oldMode = this.mode;
                this.updateMode();
                this.gsp = 0;
                this.mode = RotationMode.Floor;
                this.hlock = 30;
                this.inAir = true;
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
    this.getBestSensor = function (sensor1, sensor2) {
        if (sensor1 == -1 && sensor2 == -1) return false;

        if (sensor1 == -1) return sensor2;
        if (sensor2 == -1) return sensor1;

        switch (this.mode) {
            case RotationMode.Floor:
                return sensor1.value < sensor2.value ? sensor1 : sensor2;
            case RotationMode.LeftWall:
                return sensor1.value > sensor2.value ? sensor1 : sensor2;
            case RotationMode.Ceiling:
                return sensor1.value > sensor2.value ? sensor1 : sensor2;
            case RotationMode.RightWall:
                return sensor1.value < sensor2.value ? sensor1 : sensor2;
        }
        return null;
    };
    this.collisionMap = undefined;
    this.getCollisionMap = function () {
        if (!this.collisionMap) {
            var cur = sonicManager.SpriteCache.sonicSprites[this.spriteState + scale.x + scale.y];
            var curb = [];
            for (var j = 0; j < cur.width / scale.x; j++) {
                curb[j] = [];
                for (var k = 0; k < cur.height / scale.y; k++) {
                    curb[j][k] = true;
                }
            }
            this.collisionMap = curb;
        }
        return this.collisionMap;

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
            var offset = { x: 0, y: 0 }; // this.getOffsetFromImage();
            this.x = ((sonicManager.SonicLevel.LevelWidth * 128) + (this.x)) % (sonicManager.SonicLevel.LevelWidth * 128) + offset.x;
            this.y = ((sonicManager.SonicLevel.LevelHeight * 128) + (this.y)) % (sonicManager.SonicLevel.LevelHeight * 128) + offset.y;
            return;
        }

        this.updateMode();

        if (this.hlock > 0) {
            this.hlock--;
            this.holdingRight = false;
            this.holdingLeft = false;
        }


        if (this.inAir) {
            if (this.angle != 0xff) {
                this.angle = (0xff + (this.angle + ((this.angle > 0xff / 2) ? 2 : -2))) % 0xff;
                if (this.angle >= 0xfd || this.angle <= 0x01) {
                    this.angle = 0xff;
                }
            }
        }

        this.effectPhysics();
        this.updateSprite();


        this.sensorManager.check(this);

        var sensorM1 = this.sensorManager.getResult('m1');
        var sensorM2 = this.sensorManager.getResult('m2');

        var best = this.getBestSensor(sensorM1, sensorM2, this.mode);
        if (best) {
            switch (this.mode) {
                case RotationMode.Floor:
                    this.x = (best.value + (sensorM1.value == sensorM2.value ? 12 : (best.letter == "m1" ? 12 : -12)));
                    this.gsp = 0;
                    if (this.inAir) this.xsp = 0;
                    break;
                case RotationMode.LeftWall:
                    this.y = (best.value + (sensorM1.value == sensorM2.value ? 12 : (best.letter == "m1" ? 12 : -12)));
                    if (this.inAir) this.xsp = 0;

                    break;
                case RotationMode.Ceiling:
                    this.x = (best.value + (sensorM1.value == sensorM2.value ? 12 : (best.letter == "m1" ? -12 : 12)));
                    this.gsp = 0;
                    if (this.inAir) this.xsp = 0;

                    break;
                case RotationMode.RightWall:
                    this.y = (best.value + (sensorM1.value == sensorM2.value ? 12 : (best.letter == "m1" ? -12 : 12)));
                    this.gsp = 0;
                    if (this.inAir) this.xsp = 0;

                    break;
            }
        }
        this.sensorManager.check(this);

        var sensorA = this.sensorManager.getResult('a');
        var sensorB = this.sensorManager.getResult('b');


        var hSize = this.getHalfImageSize();
        if (!this.inAir) {

            best = this.getBestSensor(sensorA, sensorB, this.mode);
            if (!best) {
                this.inAir = true;

            } else {
                this.justHit = false;
                switch (this.mode) {
                    case RotationMode.Floor:

                        best.chosen = true;
                        this.angle = best.angle;
                        this.y = fy = best.value - hSize.y;


                        break;
                    case RotationMode.LeftWall:
                        best.chosen = true;
                        this.angle = best.angle;
                        this.x = fx = best.value + hSize.x;

                        break;
                    case RotationMode.Ceiling:

                        best.chosen = true;
                        this.angle = best.angle;
                        this.y = fy = best.value + hSize.y;

                        break;
                    case RotationMode.RightWall:

                        best.chosen = true;
                        this.angle = best.angle;
                        this.x = fx = best.value - hSize.x;

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
                            this.y = fy = sensorA.value - hSize.y;
                            this.rolling = this.currentlyBall = false;
                            this.inAir = false;
                        }
                    } else {
                        if (sensorB.value > -1) {
                            if (this.y + (20) >= sensorB.value) {
                                this.angle = sensorB.angle;
                                this.y = fy = sensorB.value - hSize.y;
                                this.rolling = this.currentlyBall = false;
                                this.inAir = false;
                            }
                        }
                    }
                } else if (sensorA.value > -1) {
                    if (this.y + (20) >= sensorA.value) {
                        this.angle = sensorA.angle;
                        this.y = fy = sensorA.value - hSize.y;
                        this.rolling = this.currentlyBall = false;
                        this.inAir = false;
                    }
                } else if (sensorB.value > -1) {
                    if (this.y + (20) >= sensorB.value) {
                        this.angle = sensorB.angle;
                        this.y = fy = sensorB.value - hSize.y;
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
                    if (sensorC.value < sensorD.value) {
                        if (this.y + (__h) >= sensorC.value) {
                            if (this.ysp < 0) {
                                if (sensorC.angle > 0x40 && sensorC.angle < 0xC0) {
                                    this.angle = sensorC.angle;

                                    this.gsp = this.ysp;
                                    this.inAir = false;
                                    this.wasInAir = false;
                                } else {
                                    this.ysp = 0;
                                }

                                this.y = fy = sensorC.value + __h;
                            }
                        }
                    } else {
                        if (this.y + (__h) >= sensorD.value) {
                            if (this.ysp < 0) {
                                if (sensorD.angle > 0x40 && sensorD.angle < 0xC0) {
                                    this.angle = sensorD.angle;

                                    this.gsp = -this.ysp;
                                    this.inAir = false;
                                    this.wasInAir = false;
                                }
                                else {
                                    this.ysp = 0;
                                }
                                this.y = fy = sensorD.value + __h;
                            }
                        }
                    }
                } else if (sensorC.value > -1) {
                    if (this.y + (__h) >= sensorC.value) {
                        if (this.ysp < 0) {
                            if (sensorC.angle > 0x40 && sensorC.angle < 0xC0) {
                                this.angle = sensorC.angle;
                                this.gsp = this.ysp;

                                this.inAir = false;
                                this.wasInAir = false;
                            }
                            else {
                                this.ysp = 0;
                            }
                            this.y = fy = sensorC.value + __h;
                        }
                    }
                } else if (sensorD.value > -1) {
                    if (this.y + (__h) >= sensorD.value) {
                        if (this.ysp < 0) {
                            if (sensorD.angle > 0x40 && sensorD.angle < 0xC0) {
                                this.angle = sensorD.angle;
                                this.gsp = -this.ysp;
                                this.inAir = false;
                                this.wasInAir = false;
                            }
                            else {
                                this.ysp = 0;
                            }
                            this.y = fy = sensorD.value + __h;

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
    this.hit = function (_x, _y) {
        if (sonicManager.drawTickCount - this.sonicLastHitTick < 120)
            return;
        this.justHit = true;
        this.ysp = -4;
        this.xsp = 2 * ((this.x - _x) < 0 ? -1 : 1);
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
        var rectangle = { x: 0, width: 8 * 2, y: 0, height: 8 * 2 };
        for (var ring in sonicManager.SonicLevel.Rings) {
            var pos = sonicManager.SonicLevel.Rings[ring];
            if (this.obtainedRing[ring]) continue;
            rectangle.x = pos.x - 8;
            rectangle.y = pos.y - 8;
            if (_H.intersectRect(me, rectangle)) {
                this.rings++;
                this.obtainedRing[ring] = true;
            }
        }
    };
    this.checkCollisionWithObjects = function (x, y, sensor) {
        var me = { x: x, y: y };
        for (var obj in sonicManager.inFocusObjects) {
            var ob = sonicManager.inFocusObjects[obj];
            var dj = ob.collides(me);
            var dj2 = ob.hurtsSonic(me);

            if (dj) {
                return ob.collide(this, sensor, dj);
            }
            if (dj2) {
                return ob.hurtSonic(this, sensor, dj2);
            }

        }
    };




    this.spriteState = "normal";
    this.isLoading = function () {
        return this.imageLoaded[0] < this.imageLength;
    };
    this.drawUI = function (canvas, pos, scale) {
        if (canvas.font != "13pt Arial bold")
            canvas.font = "13pt Arial bold";
        canvas.fillStyle = "White";
        canvas.fillText("Rings: " + this.rings, pos.x + 90, pos.y + 45);
        canvas.fillText("Angle: " + this.angle.toString(16), pos.x + 90, pos.y + 75);
        canvas.fillText("Position: " + (this.x) + ", " + (this.y), pos.x + 90, pos.y + 105);
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

    var __imageOffset = { x: 0, y: 0 };
    this.getOffsetFromImage = function () {
        var cur = sonicManager.SpriteCache.sonicSprites[this.spriteState + scale.x + scale.y];
        var xOffset = 0;
        var yOffset = 0;
        if (cur.height != 40 * scale.x) {
            switch (this.mode) {
                case RotationMode.Floor:

                    var n = 0;
                    yOffset = _H.floor((40 - ((cur.height + n) / scale.y)) / 2);
                    break;
                case RotationMode.LeftWall:
                    var n = 15;
                    xOffset = _H.floor(-(40 - ((cur.height + n) / scale.x)) / 2);
                    break;
                case RotationMode.Ceiling:
                    var n = 8;
                    yOffset = _H.floor(-(40 - ((cur.height + n) / scale.y)) / 2);
                    break;
                case RotationMode.RightWall:
                    var n = 9;
                    xOffset = _H.floor((40 - ((cur.height + n) / scale.x)) / 2);
                    break;
            }
        }

        __imageOffset.x = xOffset;
        __imageOffset.y = yOffset;
        return __imageOffset;

    };
    this.getHalfImageSize = function () {

        return { x: 20, y: 20 };
        var cur = sonicManager.SpriteCache.sonicSprites[this.spriteState + scale.x + scale.y];
        var xSize = 0;
        var ySize = 0;
        switch (this.mode) {
            case RotationMode.Floor:
                ySize = _H.floor(cur.height / scale.y / 2);
                break;
            case RotationMode.LeftWall:
                xSize = _H.floor(cur.width / scale.x / 2);

                break;
            case RotationMode.Ceiling:
                ySize = _H.floor(cur.height / scale.y / 2);

                break;
            case RotationMode.RightWall:

                xSize = _H.floor(cur.width / scale.x / 2);
                break;
        }

        __imageOffset.x = xSize;
        __imageOffset.y = ySize;
        return __imageOffset;

    };


    this.invulnerable = function () {
        var mc = sonicManager.drawTickCount - this.sonicLastHitTick;
        if (mc < 120) {
            if (mc % 8 < 4) {
                return true;
            }
        }
        return false;
    };

    this.draw = function (canvas, scale) {
        var fx = _H.floor(this.x);
        var fy = _H.floor(this.y);
        fx = (this.x);
        fy = (this.y);


        if (this.invulnerable()) return;
        var cur = sonicManager.SpriteCache.sonicSprites[this.spriteState + scale.x + scale.y];
        if (!cur) {

        }

        if (cur.loaded) {
            _H.save(canvas);
            var offset = this.getOffsetFromImage();
            canvas.translate((fx - sonicManager.windowLocation.x + offset.x) * scale.x, ((fy - sonicManager.windowLocation.y + offset.y) * scale.y));
            if (true || sonicManager.showHeightMap) {
                canvas.save();
                var mul = 6;
                var xj = this.xsp * scale.x * mul;
                var yj = this.ysp * scale.y * mul;
                canvas.beginPath();
                canvas.moveTo(0, 0);
                canvas.lineTo(xj, yj);
                canvas.fillStyle = "rgba(163,241,255,0.8)";
                canvas.arc(xj, yj, 5, 0, 2 * Math.PI, true);
                canvas.closePath();

                canvas.lineWidth = 6;
                canvas.strokeStyle = "white"; //6C6CFC
                canvas.stroke();
                canvas.lineWidth = 3;
                canvas.strokeStyle = "#2448D8"; //6C6CFC
                canvas.fill();
                canvas.stroke();
                canvas.restore();
            }

            if (!this.facing) {
                //canvas.translate(cur.width, 0);
                canvas.scale(-1, 1);
                if (!this.currentlyBall && !this.spinDash)
                    canvas.rotate(-_H.fixAngle(this.angle));

                canvas.drawImage(cur, -cur.width / 2, -cur.height / 2);

                if (this.spinDash) {
                    canvas.drawImage(sonicManager.SpriteCache.sonicSprites[("spinsmoke" + _H.floor((sonicManager.drawTickCount % 14) / 2)) + scale.x + scale.y],
                            _H.floor((-cur.width / 2) - 25 * scale.x), _H.floor(-cur.height / 2 + (offset.y * scale.y) - 14), cur.width, cur.height);
                }
            } else {
                if (!this.currentlyBall && !this.spinDash)
                    canvas.rotate(_H.fixAngle(this.angle));
                canvas.drawImage(cur, -cur.width / 2, -cur.height / 2);


                if (this.spinDash) {
                    canvas.drawImage(sonicManager.SpriteCache.sonicSprites[("spinsmoke" + _H.floor((sonicManager.drawTickCount % 14) / 2)) + scale.x + scale.y],
                           (-cur.width / 2) - 25 * scale.x, -cur.height / 2 + (offset.y * scale.y) - 14, cur.width, cur.height);
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
                            ((lo.x - sonicManager.windowLocation.x - 25) * scale.x), ((lo.y + 12 - sonicManager.windowLocation.y + offset.y) * scale.y));
                if (_H.floor(((sonicManager.drawTickCount + 6) % (4 * 6)) / 6) == 0) {
                    this.haltSmoke.splice(i, 1);
                }
            }

        }

    };

    this.kill = function () {

    };
    this.pressJump = function () {
        this.jumping = true;
    };
    this.pressUp = function () {
        this.holdingUp = true;
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
        var word = this.spriteState.substring(0, this.spriteState.length - 1);
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
            if (word != "hit") {
                this.spriteState = "hit0";
                this.runningTick = 1;
            } else if ((this.runningTick++) % (_H.floor(8 - absgsp)) == 0) {
                this.spriteState = "hit1";
            }
        } else if (this.spinDash) {
            if (word != "spindash") {
                this.spriteState = "spindash0";
                this.runningTick = 1;
            } else if ((this.runningTick++) % (_H.floor(2 - absgsp)) == 0) {
                this.spriteState = "spindash" + ((j + 1) % 6);
            }
        } else if (absgsp == 0 && this.inAir == false) {
            if (this.ducking) {
                if (word != "duck") {
                    this.spriteState = "duck0";
                    this.runningTick = 1;
                } else if ((this.runningTick++) % (_H.floor(4 - absgsp)) == 0) {
                    this.spriteState = "duck1";
                }

            } else if (this.holdingUp) {
                if (word != "lookingup") {
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
            if (word != "breaking") {
                this.spriteState = "breaking0";
                this.runningTick = 1;
            } else if ((this.runningTick++) % (7) == 0) {
                this.spriteState = "breaking" + ((j + 1) % 4);
                if (j == 0) {
                    this.haltSmoke.push({ x: _H.floor(this.x), y: _H.floor(this.y) });
                }
            }

        } else if (this.currentlyBall) {

            if (word != "balls") {
                this.spriteState = "balls0";
                this.runningTick = 1;
            } else if (((this.runningTick++) % (_H.floor(8 - absgsp)) == 0) || (8 - absgsp < 1)) {
                this.spriteState = "balls" + ((j + 1) % 5);
            }
        } else if (absgsp < 6) {
            if (word != "running") {
                this.spriteState = "running0";
                this.runningTick = 1;
            } else if (((this.runningTick++) % (_H.floor(8 - absgsp)) == 0) || (8 - absgsp < 1)) {
                this.spriteState = "running" + ((j + 1) % 8);
            }

        } else if (absgsp >= 6) {
            if (word != "fastrunning") {
                this.spriteState = "fastrunning0";
                this.runningTick = 1;
            } else if (((this.runningTick++) % (Math.floor(8 - absgsp)) == 0) || (8 - absgsp < 1)) {
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
        if (true || sonicManager.inHaltMode) {
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
    this.multiply = function (val) {
        return this.mult * val;
    };
}