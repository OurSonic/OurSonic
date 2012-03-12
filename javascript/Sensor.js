

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






    this.checkCollisionLineWrap = function (x1, x2, y1, y2, ignoreSolid) {
        var _x = _H.floor(x1 / 128);
        var _y = _H.floor(y1 / 128);
        var tc = sonicManager.SonicLevel.Chunks[sonicManager.SonicLevel.ChunkMap[_x][_y]];
        var curh = sonicManager.SonicLevel.curHeightMap ? tc.heightBlocks1 : tc.heightBlocks2;
        var cura = sonicManager.SonicLevel.curHeightMap ? tc.angleMap1 : tc.angleMap2;
        var __x = x1 - _x * 128;
        var __y = y1 - _y * 128;
        var i;
        var curc = 0;
        var length;

        if (y1 == y2) {
            if (Math.max(x1, x2) > sonicManager.SonicLevel.LevelWidth * 128)
                return { value: sonicManager.SonicLevel.LevelWidth * 128 - 20, angle: 0xff };

            if (x1 < x2) {

                length = x2 - x1;
                if (curh[(__x)][__y] >= 2) {

                    for (i = 0; i < 128 * 10; i++) {
                        if (__x - i < 0) {
                            tc = sonicManager.SonicLevel.Chunks[sonicManager.SonicLevel.ChunkMap[_x - 1][_y]];
                            curh = sonicManager.SonicLevel.curHeightMap ? tc.heightBlocks1 : tc.heightBlocks2;
                            cura = sonicManager.SonicLevel.curHeightMap ? tc.angleMap1 : tc.angleMap2;
                            __x += 128;
                        }
                        if (x1 - i > this.LevelWidth || curh[(__x - i)][__y] >= 2)
                            return { value: x1 - i, angle: cura[_H.floor((__x - i) / 16)][_H.floor((__y) / 16)] };
                    }
                }


                for (i = 0; i < length; i++) {
                    if (__x + i >= 128) {
                        tc = sonicManager.SonicLevel.Chunks[sonicManager.SonicLevel.ChunkMap[_x + 1][_y]];
                        curh = sonicManager.SonicLevel.curHeightMap ? tc.heightBlocks1 : tc.heightBlocks2;
                        cura = sonicManager.SonicLevel.curHeightMap ? tc.angleMap1 : tc.angleMap2;
                        __x -= 128;
                    }
                    if (x1 + i > this.LevelWidth || curh[(__x + i)][__y] >= 2)
                        return { value: x1 + i, angle: cura[_H.floor((__x + i) / 16)][_H.floor((__y) / 16)] };
                }
            } else {
                length = x1 - x2;
                if (curh[(__x)][__y] >= 2) {
                    for (i = 0; i < 128 * 10; i++) {
                        if (__x + i >= 128) {
                            tc = sonicManager.SonicLevel.Chunks[sonicManager.SonicLevel.ChunkMap[_x + 1][_y]];
                            curh = sonicManager.SonicLevel.curHeightMap ? tc.heightBlocks1 : tc.heightBlocks2;
                            cura = sonicManager.SonicLevel.curHeightMap ? tc.angleMap1 : tc.angleMap2;
                            __x -= 128;
                        }
                        if (x1 + i > this.LevelWidth || curh[(__x + i)][__y] >= 2)
                            return { value: x1 + i, angle: cura[_H.floor((__x + i) / 16)][_H.floor((__y) / 16)] };
                    }

                }

                for (i = 0; i < length; i++) {
                    if (__x - i < 0) {
                        tc = sonicManager.SonicLevel.Chunks[sonicManager.SonicLevel.ChunkMap[_x - 1][_y]];
                        curh = sonicManager.SonicLevel.curHeightMap ? tc.heightBlocks1 : tc.heightBlocks2;
                        cura = sonicManager.SonicLevel.curHeightMap ? tc.angleMap1 : tc.angleMap2;
                        __x += 128;
                    }
                    if (x1 - i > this.LevelWidth || curh[(__x - i)][__y] >= 2)
                        return { value: x1 - i, angle: cura[_H.floor((__x - i) / 16)][_H.floor((__y) / 16)] };
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
                            curh = sonicManager.SonicLevel.curHeightMap ? tc.heightBlocks1 : tc.heightBlocks2;
                            cura = sonicManager.SonicLevel.curHeightMap ? tc.angleMap1 : tc.angleMap2;
                            __y += 128;
                        }
                        if (curh[__x][__y - i] > 1) {
                            return { value: y1 - i, angle: cura[_H.floor((__x) / 16)][_H.floor((__y - i) / 16)] };
                        }
                    }
                }
                for (i = 0; i < length; i++) {
                    if (__y + i >= 128) {
                        tc = sonicManager.SonicLevel.Chunks[sonicManager.SonicLevel.ChunkMap[_x][(_y + 1)]];
                        curh = sonicManager.SonicLevel.curHeightMap ? tc.heightBlocks1 : tc.heightBlocks2;
                        cura = sonicManager.SonicLevel.curHeightMap ? tc.angleMap1 : tc.angleMap2;
                        __y -= 128;
                    }
                    if (curh[__x][__y + i] >= 1) {
                        if (curh[__x][__y + i] == 1 && sonicManager.sonicToon.inAir && sonicManager.sonicToon.ysp < 0) continue;
                        return { value: y1 + i, angle: cura[_H.floor((__x) / 16)][_H.floor((__y + i) / 16)] };
                    }
                }
            } else {
                length = y1 - y2;
                if (curh[(__x)][__y] >= 2) {
                    for (i = 0; i < 128 * 10; i++) {
                        if (__y + i >= 128) {
                            tc = sonicManager.SonicLevel.Chunks[sonicManager.SonicLevel.ChunkMap[_x][(_y + 1)]];
                            curh = sonicManager.SonicLevel.curHeightMap ? tc.heightBlocks1 : tc.heightBlocks2;
                            cura = sonicManager.SonicLevel.curHeightMap ? tc.angleMap1 : tc.angleMap2;
                            __y -= 128;
                        }
                        if (curh[__x][__y + i] >= 1) {
                            return { value: y1 + i, angle: cura[_H.floor((__x) / 16)][_H.floor((__y + i) / 16)] };
                        }
                    }
                }

                for (i = 0; i < length; i++) {
                    if (__y - i < 0) {
                        tc = sonicManager.SonicLevel.Chunks[sonicManager.SonicLevel.ChunkMap[_x][(_y - 1)]];
                        curh = sonicManager.SonicLevel.curHeightMap ? tc.heightBlocks1 : tc.heightBlocks2;
                        cura = sonicManager.SonicLevel.curHeightMap ? tc.angleMap1 : tc.angleMap2;
                        __y += 128;
                    }
                    if (curh[__x][__y - i] > 1) {
                        return { value: y1 - i, angle: cura[_H.floor((__x) / 16)][_H.floor((__y - i) / 16)] };
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