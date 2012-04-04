

Sensor = function (x1, x2, y1, y2, manager, color, ignoreSolid, letter) {
    this.x1 = x1;
    this.letter = letter;
    this.y1 = y1;
    this.x2 = x2;
    this.y2 = y2;
    this.color = color;
    this.manager = manager;
    this.check = function (character) {

        var m;
        var x = _H.floor(character.x);
        var y = _H.floor(character.y);
        switch (character.mode) {
            case RotationMode.Floor:
                m = this.checkCollisionLineWrap(x + this.x1, x + this.x2, y + this.y1, y + this.y2, ignoreSolid);
                break;
            case RotationMode.LeftWall:
                m = this.checkCollisionLineWrap(x - this.y1, x - this.y2, y + this.x1, y + this.x2, ignoreSolid);
                break;
            case RotationMode.Ceiling:
                m = this.checkCollisionLineWrap(x - this.x1, x - this.x2, y - this.y1, y - this.y2, ignoreSolid);
                break;
            case RotationMode.RightWall:
                m = this.checkCollisionLineWrap(x + this.y1, x + this.y2, y - this.x1, y - this.x2, ignoreSolid);
                break;
        }

        if (m != -1) {
            m.letter = this.letter;
            if (m.angle == 255 || m.angle == 0 || m.angle == 1) {
                if (character.mode == RotationMode.Floor) {
                    m.angle = 255;
                } if (character.mode == RotationMode.LeftWall) {
                    m.angle = 64;
                } if (character.mode == RotationMode.Ceiling) {
                    m.angle = 128;
                } if (character.mode == RotationMode.RightWall) {
                    m.angle = 192;
                }

            }

        }
        return m;
    };


    this.__currentM = { value: 0, angle: 0 };
    this.checkChunk = function (chunk, isLayerOne) {


        if (isLayerOne) {
            if (chunk.heightBlocks1)
                return;
            var hb1 = chunk.heightBlocks1 = [];
            var ab1 = chunk.angleMap1 = [];
            for (var _1 = 0; _1 < 128; _1++) {
                hb1[_1] = [];
            }
            for (var _1 = 0; _1 < 8; _1++) {
                ab1[_1] = [];
            }


            for (var _y = 0; _y < 8; _y++) {
                for (var _x = 0; _x < 8; _x++) {
                    var tp = chunk.tilePieces[_x][_y];
                    ab1[_x][_y] = sonicManager.SonicLevel.Angles[sonicManager.SonicLevel.CollisionIndexes1[tp.Block]];


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


                    var __x;
                    var __y;


                    var hd1 = sonicManager.SonicLevel.HeightMaps[sonicManager.SonicLevel.CollisionIndexes1[tp.Block]];
                    if (hd1 == undefined) continue;
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
                            
                        }
                    }
                }
            }



        } else {
            if (chunk.heightBlocks2)
                return;


            var hb2 = chunk.heightBlocks2 = [];
            var ab2 = chunk.angleMap2 = [];
            for (var _1 = 0; _1 < 128; _1++) {
                hb2[_1] = [];
            }
            for (var _1 = 0; _1 < 8; _1++) {
                ab2[_1] = [];
            }


            for (var _y = 0; _y < 8; _y++) {
                for (var _x = 0; _x < 8; _x++) {
                    var tp = chunk.tilePieces[_x][_y];
                    ab2[_x][_y] = sonicManager.SonicLevel.Angles[sonicManager.SonicLevel.CollisionIndexes2[tp.Block]];
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
                    var hd2 = sonicManager.SonicLevel.HeightMaps[sonicManager.SonicLevel.CollisionIndexes2[tp.Block]];
                    if (hd2 == undefined) continue;
                    var mj;


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

    this.checkCollisionLineWrap = function (x1, x2, y1, y2, ignoreSolid) {
        var _x = _H.floor(x1 / 128);
        var _y = _H.floor(y1 / 128);
        var tc = sonicManager.SonicLevel.Chunks[sonicManager.SonicLevel.ChunkMap[_x][_y]];
        this.checkChunk(tc, sonicManager.SonicLevel.curHeightMap);
        
        var curh = sonicManager.SonicLevel.curHeightMap ? tc.heightBlocks1 : tc.heightBlocks2;
        var cura = sonicManager.SonicLevel.curHeightMap ? tc.angleMap1 : tc.angleMap2;
        var __x = x1 - _x * 128;
        var __y = y1 - _y * 128;
        var i;
        var curc = 0;
        var length;



        if (y1 == y2) {
            if (Math.max(x1, x2) > sonicManager.SonicLevel.LevelWidth * 128) {
                this.__currentM.value = sonicManager.SonicLevel.LevelWidth * 128 - 20;
                this.__currentM.angle = 0xff;
                return this.__currentM;
            }
            if (x1 < x2) {

                length = x2 - x1;
                if (curh[(__x)][__y] >= 2) {

                    for (i = 0; i < 128 * 10; i++) {
                        if (__x - i < 0) {
                            tc = sonicManager.SonicLevel.Chunks[sonicManager.SonicLevel.ChunkMap[_x - 1][_y]];
                            this.checkChunk(tc, sonicManager.SonicLevel.curHeightMap);
                            
                            curh = sonicManager.SonicLevel.curHeightMap ? tc.heightBlocks1 : tc.heightBlocks2;
                            cura = sonicManager.SonicLevel.curHeightMap ? tc.angleMap1 : tc.angleMap2;
                            __x += 128;
                        }
                        if (x1 - i > this.LevelWidth || curh[(__x - i)][__y] >= 2) {

                            this.__currentM.value = x1 - i;
                            this.__currentM.angle = cura[_H.floor((__x - i) / 16)][_H.floor((__y) / 16)];
                            return this.__currentM;
                        }
                    }
                }


                for (i = 0; i < length; i++) {
                    if (__x + i >= 128) {
                        tc = sonicManager.SonicLevel.Chunks[sonicManager.SonicLevel.ChunkMap[_x + 1][_y]];
                        this.checkChunk(tc, sonicManager.SonicLevel.curHeightMap);
                        
                        curh = sonicManager.SonicLevel.curHeightMap ? tc.heightBlocks1 : tc.heightBlocks2;
                        cura = sonicManager.SonicLevel.curHeightMap ? tc.angleMap1 : tc.angleMap2;
                        __x -= 128;
                    }
                    if (x1 + i > this.LevelWidth || curh[(__x + i)][__y] >= 2) {
                        this.__currentM.value = x1 + i;
                        this.__currentM.angle = cura[_H.floor((__x + i) / 16)][_H.floor((__y) / 16)];
                        return this.__currentM;
                    }
                }
            } else {
                length = x1 - x2;
                if (curh[(__x)][__y] >= 2) {
                    for (i = 0; i < 128 * 10; i++) {
                        if (__x + i >= 128) {
                            tc = sonicManager.SonicLevel.Chunks[sonicManager.SonicLevel.ChunkMap[_x + 1][_y]];
                            this.checkChunk(tc, sonicManager.SonicLevel.curHeightMap);
                            
                            curh = sonicManager.SonicLevel.curHeightMap ? tc.heightBlocks1 : tc.heightBlocks2;
                            cura = sonicManager.SonicLevel.curHeightMap ? tc.angleMap1 : tc.angleMap2;
                            __x -= 128;
                        }
                        if (x1 + i > this.LevelWidth || curh[(__x + i)][__y] >= 2) {
                            this.__currentM.value = x1 + i;
                            this.__currentM.angle = cura[_H.floor((__x + i) / 16)][_H.floor((__y) / 16)];
                            return this.__currentM;
                        }
                    }

                }

                for (i = 0; i < length; i++) {
                    if (__x - i < 0) {
                        tc = sonicManager.SonicLevel.Chunks[sonicManager.SonicLevel.ChunkMap[_x - 1][_y]];
                        this.checkChunk(tc, sonicManager.SonicLevel.curHeightMap);
                        
                        curh = sonicManager.SonicLevel.curHeightMap ? tc.heightBlocks1 : tc.heightBlocks2;
                        cura = sonicManager.SonicLevel.curHeightMap ? tc.angleMap1 : tc.angleMap2;
                        __x += 128;
                    }
                    if (x1 - i > this.LevelWidth || curh[(__x - i)][__y] >= 2) {
                        this.__currentM.value = x1 - i;
                        this.__currentM.angle = cura[_H.floor((__x - i) / 16)][_H.floor((__y) / 16)];
                        return this.__currentM;
                    }
                }
            }

        }
        else {
            //top to bottom
            if (Math.max(y1, y2) > sonicManager.SonicLevel.LevelHeight * 128)
                return { value: sonicManager.SonicLevel.LevelHeight * 128 - 20, angle: 0xff };



            if (y1 < y2) {
                length = y2 - y1;
                if (curh[(__x)][__y] >= 2) {
                    for (i = 0; i < 128 * 10; i++) {
                        if (__y - i < 0) {
                            tc = sonicManager.SonicLevel.Chunks[sonicManager.SonicLevel.ChunkMap[_x][(_y - 1)]];
                            this.checkChunk(tc, sonicManager.SonicLevel.curHeightMap);
                            curh = sonicManager.SonicLevel.curHeightMap ? tc.heightBlocks1 : tc.heightBlocks2;
                            cura = sonicManager.SonicLevel.curHeightMap ? tc.angleMap1 : tc.angleMap2;
                            __y += 128;
                        }
                        if (curh[__x][__y - i] > 1) {
                            this.__currentM.value = y1 - i;
                            this.__currentM.angle = cura[_H.floor((__x) / 16)][_H.floor((__y - i) / 16)];
                            return this.__currentM;
                        }
                    }
                }
                for (i = 0; i < length; i++) {
                    if (__y + i >= 128) {
                        tc = sonicManager.SonicLevel.Chunks[sonicManager.SonicLevel.ChunkMap[_x][(_y + 1)]];
                        this.checkChunk(tc, sonicManager.SonicLevel.curHeightMap);
                        curh = sonicManager.SonicLevel.curHeightMap ? tc.heightBlocks1 : tc.heightBlocks2;
                        cura = sonicManager.SonicLevel.curHeightMap ? tc.angleMap1 : tc.angleMap2;
                        __y -= 128;
                    }
                    if (curh[__x][__y + i] >= 1) {
                        if (curh[__x][__y + i] == 1 && sonicManager.sonicToon.inAir && sonicManager.sonicToon.ysp < 0) continue;

                        this.__currentM.value = y1 + i;
                        this.__currentM.angle = cura[_H.floor((__x) / 16)][_H.floor((__y + i) / 16)];
                        return this.__currentM;
                    }
                }
            } else {
                length = y1 - y2;
                if (curh[(__x)][__y] >= 2) {
                    for (i = 0; i < 128 * 10; i++) {
                        if (__y + i >= 128) {
                            tc = sonicManager.SonicLevel.Chunks[sonicManager.SonicLevel.ChunkMap[_x][(_y + 1)]];
                            this.checkChunk(tc, sonicManager.SonicLevel.curHeightMap);
                            curh = sonicManager.SonicLevel.curHeightMap ? tc.heightBlocks1 : tc.heightBlocks2;
                            cura = sonicManager.SonicLevel.curHeightMap ? tc.angleMap1 : tc.angleMap2;
                            __y -= 128;
                        }
                        if (curh[__x][__y + i] >= 1) {
                            this.__currentM.value = y1 + i;
                            this.__currentM.angle = cura[_H.floor((__x) / 16)][_H.floor((__y + i) / 16)];
                            return this.__currentM;
                        }
                    }
                }

                for (i = 0; i < length; i++) {
                    if (__y - i < 0) {
                        tc = sonicManager.SonicLevel.Chunks[sonicManager.SonicLevel.ChunkMap[_x][(_y - 1)]];
                        this.checkChunk(tc, sonicManager.SonicLevel.curHeightMap);
                        curh = sonicManager.SonicLevel.curHeightMap ? tc.heightBlocks1 : tc.heightBlocks2;
                        cura = sonicManager.SonicLevel.curHeightMap ? tc.angleMap1 : tc.angleMap2;
                        __y += 128;
                    }
                    if (curh[__x][__y - i] > 1) {
                        this.__currentM.value = y1 - i;
                        this.__currentM.angle = cura[_H.floor((__x) / 16)][_H.floor((__y - i) / 16)];
                        return this.__currentM;
                    }
                }
            }
        }
        return -1;
    };
    this.draw = function (canvas, scale, character, sensorResult) {
        var x = _H.floor(character.x) - sonicManager.windowLocation.x;
        var y = _H.floor(character.y) - sonicManager.windowLocation.y;

        canvas.beginPath();
        if (sensorResult && sensorResult.chosen) {
            canvas.strokeStyle = "#FFF76D";
            canvas.lineWidth = 4;
        } else {
            canvas.strokeStyle = this.color;
            canvas.lineWidth = 2;
        }
        switch (character.mode) {
            case RotationMode.Floor:
                canvas.moveTo((x + this.x1) * scale.x, (y + this.y1) * scale.y);
                canvas.lineTo((x + this.x2) * scale.x, (y + this.y2) * scale.y);
                break;
            case RotationMode.LeftWall:
                canvas.moveTo((x - this.y1) * scale.x, (y + this.x1) * scale.y);
                canvas.lineTo((x - this.y2) * scale.x, (y + this.x2) * scale.y);
                break;
            case RotationMode.Ceiling:
                canvas.moveTo((x - this.x1) * scale.x, (y - this.y1) * scale.y);
                canvas.lineTo((x - this.x2) * scale.x, (y - this.y2) * scale.y);
                break;
            case RotationMode.RightWall:
                canvas.moveTo((x + this.y1) * scale.x, (y - this.x1) * scale.y);
                canvas.lineTo((x + this.y2) * scale.x, (y - this.x2) * scale.y);
                break;
        }

        canvas.closePath();
        canvas.stroke();

    };
};
SensorManager = function (sonicManager) {
    this.sonicManager = sonicManager;
    this.sensors = [];
    this.sensorResults = [];
    this.check = function (character) {
        var none = false;
        for (var i in this.sensors) {
            this.sensorResults[i] = this.sensors[i].check(character);
            none = none || (this.sensorResults[i] != -1);
        }
        return none;
    };
    this.draw = function (canvas, scale, character) {
        for (var i in this.sensors) {
            this.sensors[i].draw(canvas, scale, character, this.sensorResults[i]);
        }
    };
    this.getResult = function (letter) {
        return this.sensorResults[letter];
    };
    this.addSensor = function (letter, sensor) {
        this.sensors[letter] = (sensor);
        this.sensorResults[letter] = false;
        return sensor;
    };
    this.createHorizontalSensor = function (letter, y, x1, x2, color, ignoreSolid) {
        return this.addSensor(letter, new Sensor(x1, x2, y, y, this, color, ignoreSolid, letter));
    };
    this.createVerticalSensor = function (letter, x, y1, y2, color, ignoreSolid) {
        return this.addSensor(letter, new Sensor(x, x, y1, y2, this, color, ignoreSolid, letter));
    };

}; 