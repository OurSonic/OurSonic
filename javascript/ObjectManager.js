﻿

function ObjectManager(sonicManager) {

    this.sonicManager = sonicManager;
    window.objectManager = this;
    this.metaObjectFrameworks = [];
    this.objectFrameworks = [];

    this.init = function () {

    };

    this.extendObject = function (d) {
        d.oldKey = name;
        for (var asset in d.assets) {
            d.assets[asset] = _H.extend(new LevelObjectAsset(""), d.assets[asset]);
            for (var frame in d.assets[asset].frames) {
                d.assets[asset].frames[frame] = _H.extend(new LevelObjectAssetFrame(0), d.assets[asset].frames[frame]);
            }
        }
        for (var piece in d.pieces) {
            d.pieces[piece] = _H.extend(new LevelObjectPiece(""), d.pieces[piece]);
        }
        for (var pieceLayout in d.pieceLayouts) {
            d.pieceLayouts[pieceLayout] = _H.extend(new LevelObjectPieceLayout(""), d.pieceLayouts[pieceLayout]);
            for (var piece in d.pieceLayouts[pieceLayout].pieces) {
                d.pieceLayouts[pieceLayout].pieces[piece] = _H.extend(new LevelObjectPieceLayoutPiece(0), d.pieceLayouts[pieceLayout].pieces[piece]);
            }
        }
        for (var projectile in d.projectiles) {
            d.projectiles[projectile] = _H.extend(new LevelObjectProjectile(""), d.projectiles[projectile]);
        }
        return d;
    };
}

function LevelObject(key) {
    this.assets = [];
    this.key = key ? key : "";
    this.pieces = [];
    this.pieceLayouts = [];
    this.projectiles = [];
    this.initScript = "this.state = {\r\n\txsp: 0.0,\r\n\tysp: 0.0,\r\n\tfacing: false,\r\n};";
    this.tickScript = "";
    this.collideScript = "";
    this.hurtScript = "";


    this.die = function () {

        alert('todo death');
    };

    this.evalMe = function (js) {
        if (!this[js + "_last"]) {
            this[js + "_last"] = "";
        }
        if (this[js + "_last"] != this[js]) {
            this[js + "Compiled"] = undefined;
        }

        this[js + "_last"] = this[js];


        if (!this[js + "Compiled"]) {
            this[js + "Compiled"] = eval("(function(object,level,sonic,sensor,piece){" + this[js] + "});");

        }
        return this[js + "Compiled"];
    };


    this.init = function (object, level, sonic) {
        object.reset();

        this.evalMe("initScript").apply(object, [object, level, sonic]);

    };


    this.tick = function (object, level, sonic) {
        if (object.lastDrawTick != sonicManager.tickCount - 1)
            this.init(object, level, sonic);

        object.lastDrawTick = sonicManager.tickCount;

        this.evalMe("tickScript").apply(object, [object, level, sonic]);

        if (object.state) {
            object.xsp = object.state.xsp;
            object.ysp = object.state.ysp;
        }
        object.x += object.xsp;
        object.y += object.ysp;

    };
    this.onCollide = function (object, level, sonic, sensor, piece) {

        return this.evalMe("collideScript").apply(object, [object, level, sonic, sensor, piece]);

    };
    this.onHurtSonic = function (object, level, sonic, sensor, piece) {

        return this.evalMe("hurtScript").apply(object, [object, level, sonic, sensor, piece]);

    };

}

function LevelObjectAsset(name) {
    this.frames = [];
    this.name = name ? name : "";
}

function LevelObjectAssetFrame(name) {
    this.offsetX = 0;
    this.width = 0;
    this.height = 0;
    this.offsetY = 0;
    this.hurtSonicMap = [];
    this.collisionMap = [];
    for (var i = 0; i < 100; i++) {
        this.collisionMap[i] = [];
        this.hurtSonicMap[i] = [];

    }

    this.setWidth = function (w) {
        this.width = w;
        this.collisionMap = this.collisionMap.slice(0, w);
        this.clearCache();


    };
    this.setHeight = function (h) {
        this.height = h;
        for (var j = 0; j < this.width; j++) {
            this.collisionMap[j] = this.collisionMap[j].slice(0, h);
        }
        this.clearCache();
    };
    this.setOffset = function (ex, ey) {

        this.offsetX = ex;
        this.offsetY = ey;

        this.clearCache();
    };

    this.uploadImage = function (sprite) {
        this.width = sprite.width;
        this.height = sprite.height;
        this.offsetX = _H.floor(sprite.width / 2);
        this.offsetY = _H.floor(sprite.height / 2);

        var ca = _H.defaultCanvas(this.width, this.height);

        ca.context.drawImage(sprite, 0, 0);
        var imgd = ca.context.getImageData(0, 0, this.width, this.height);
        var pix = imgd.data;

        var palette = {};
        var paletteLength = 0;

        for (var x = 0; x < this.width; x++) {
            this.colorMap[x] = [];
            for (var y = 0; y < this.height; y++) {
                var pl = _H.colorFromData(pix, (x * 4) + y * this.width * 4);
                var ind = 0;
                if (palette[pl] != undefined) {
                    ind = palette[pl];
                } else {
                    ind = paletteLength;
                    palette[pl] = paletteLength;
                    paletteLength++;
                }
                this.colorMap[x][y] = ind;
            }
        }
        this.palette = [];
        var ind = 0;
        for (var p in palette) {
            this.palette[ind++] = p.replace("#", "");
        }

    };


    this.colorMap = [];
    this.palette = [];
    this.name = name ? name : "";

    this.drawSimple = function (canvas, pos, width, height, xflip, yflip) {

        canvas.save();
        canvas.translate(pos.x, pos.y);


        if (xflip) {
            if (yflip) {
                canvas.translate(width, height);
                canvas.scale(-1, -1);
            } else {
                canvas.translate(width, 0);
                canvas.scale(-1, 1);
            }
        } else {
            if (yflip) {
                canvas.translate(0, height);
                canvas.scale(1, -1);
            } else {

            }
        }

        canvas.scale((width / this.width), (height / this.height));


        for (var x = 0; x < this.width; x++) {
            for (var y = 0; y < this.height; y++) {
                var ex = x;
                var ey = y;
                var color = this.palette[this.colorMap[ex][ey]];
                if (canvas.fillStyle != "#" + color)
                    canvas.fillStyle = "#" + color;

                canvas.fillRect(ex, ey, 1, 1);

            }
        }
        canvas.restore();

    };

    this.image = [];
    this.getCache = function (size, xflip, yflip, showOutline, showCollideMap, showHurtMap) {

        //return false;
        return this.image[((xflip + 2) * 13) ^ (size.width * 47) ^ ((yflip + 2) * 71) ^ ((showOutline + 2) * 7) ^ ((showCollideMap + 2) * 89) ^ ((showHurtMap + 2) * 79)];
    };
    this.clearCache = function () {
        this.image = [];
    };
    this.setCache = function (image, size, xflip, yflip, showOutline, showCollideMap, showHurtMap) {
        //   return;
        this.image[((xflip + 2) * 13) ^ (size.width * 47) ^ ((yflip + 2) * 71) ^ ((showOutline + 2) * 7) ^ ((showCollideMap + 2) * 89) ^ ((showHurtMap + 2) * 79)] = image;
    };

    this.drawUI = function (_canvas, pos, size, showOutline, showCollideMap, showHurtMap, showOffset, xflip, yflip) {


        var fd = this.getCache(size, xflip, yflip, showOutline, showCollideMap, showHurtMap);

        if (!fd) {


            var mj = _H.defaultCanvas(size.width, size.height);
            var canvas = mj.context;

            canvas.save();

            canvas.strokeStyle = "#000000";
            canvas.lineWidth = 1;


            if (xflip) {
                if (yflip) {
                    canvas.translate(size.width, size.height);
                    canvas.scale(-1, -1);
                } else {
                    canvas.translate(size.width, 0);
                    canvas.scale(-1, 1);
                }
            } else {
                if (yflip) {
                    canvas.translate(0, size.height);
                    canvas.scale(1, -1);
                } else {

                }
            }

            var transparent = -200; //this.colorMap[0][0]

            canvas.scale(size.width / this.width, size.height / this.height);
            for (var x = 0; x < this.width; x++) {
                for (var y = 0; y < this.height; y++) {
                    var ex = x;
                    var ey = y;
                    var d = this.colorMap[ex][ey];
                    if (transparent == d) {
                        if (canvas.fillStyle != "rgba(0,0,0,0)")
                            canvas.fillStyle = "rgba(0,0,0,0)";
                    } else {
                        var color = this.palette[d];
                        //  var negative = _H.negateColor(color);
                        if (canvas.fillStyle != "#" + color)
                            canvas.fillStyle = "#" + color;

                    }
                    //if (canvas.strokeStyle != "#" + negative)
                    //    canvas.strokeStyle = "#" + negative; 


                    canvas.fillRect(ex, ey, 1, 1);
                    //  if (showOutline)
                    //    canvas.strokeRect(ex, ey, 1, 1);

                    if (showCollideMap) {
                        if (this.collisionMap[ex][ey]) {
                            canvas.fillStyle = "rgba(30,34,255,0.6)";
                            canvas.fillRect(ex, ey, 1, 1);
                        }
                    }

                    if (showHurtMap) {
                        if (this.hurtSonicMap[ex][ey]) {
                            canvas.fillStyle = "rgba(211,12,55,0.6)";
                            canvas.fillRect(ex, ey, 1, 1);
                        }

                    }
                }
            }
            if (showOffset) {

                canvas.beginPath();
                canvas.moveTo(this.offsetX, 0);
                canvas.lineTo(this.offsetX, this.height);
                canvas.lineWidth = 1;
                canvas.strokeStyle = "#000000";
                canvas.stroke();

                canvas.beginPath();
                canvas.moveTo(0, this.offsetY);
                canvas.lineTo(this.width, this.offsetY);
                canvas.lineWidth = 1;
                canvas.strokeStyle = "#000000";
                canvas.stroke();
            }
            canvas.restore();
            fd = mj.canvas;
            this.setCache(mj.canvas, size, xflip, yflip, showOutline, showCollideMap, showHurtMap);
        }

        _canvas.drawImage(fd, pos.x, pos.y);

    };
    this.draw = function (canvas, pos, scale) {

    };
}

function LevelObjectPiece(name) {
    this.assetIndex = 0;
    this.frameIndex = 0;
    this.collided = false;
    this.xflip = false;
    this.yflip = false;
    this.visible = true;
    this.name = name ? name : "";

}

function LevelObjectPieceLayout(name) {
    this.width = 350;
    this.height = 280;
    this.pieces = [];

    this.name = name ? name : "";

    this.update = function () {

        for (l = 0; l < sonicManager.SonicLevel.Objects.length; l++) {
            sonicManager.SonicLevel.Objects[l].reset();
        }

    };

    this.drawUI = function (canvas, pos, scale, showOutline, showImages, selectedPieceIndex, zeroPosition) {
        canvas.save();
        canvas.strokeStyle = "#000000";
        canvas.lineWidth = 2;

        canvas.fillStyle = "#FFFFFF";
        canvas.fillRect(pos.x, pos.y, this.width, this.height);

        canvas.beginPath();
        canvas.rect(pos.x, pos.y, this.width, this.height);
        canvas.clip();
        canvas.closePath();

        canvas.translate(zeroPosition.x, zeroPosition.y);
        //        canvas.scale(3, 3);

        canvas.beginPath();
        canvas.moveTo(pos.x + -250, pos.y + 0);
        canvas.lineTo(pos.x + 250, pos.y + 0);
        canvas.closePath();
        canvas.stroke();

        canvas.beginPath();
        canvas.moveTo(pos.x + 0, pos.y + -250);
        canvas.lineTo(pos.x + 0, pos.y + 250);
        canvas.closePath();
        canvas.stroke();


        for (var i = 1; i < this.pieces.length; i++) {
            var j = this.pieces[i];

            canvas.beginPath();
            canvas.moveTo(pos.x + j.x, pos.y + j.y);
            canvas.lineTo(pos.x + this.pieces[i - 1].x, pos.y + this.pieces[i - 1].y);
            canvas.stroke();

        }


        var drawRadial;
        for (var i = 0; i < this.pieces.length; i++) {
            var j = this.pieces[i];
            if (showImages) {
                var piece = sonicManager.uiManager.objectFrameworkArea.objectFramework.pieces[j.pieceIndex];
                var asset = sonicManager.uiManager.objectFrameworkArea.objectFramework.assets[piece.assetIndex];
                if (asset.frames.length > 0) {
                    var frm = asset.frames[j.frameIndex];
                    drawRadial = sonicManager.mainCanvas.createRadialGradient(0, 0, 0, 10, 10, 50);
                    drawRadial.addColorStop(0, 'white');
                    if (selectedPieceIndex == i) {
                        drawRadial.addColorStop(1, 'yellow');
                    } else {
                        drawRadial.addColorStop(1, 'red');
                    }
                    var borderSize = 3;
                    canvas.fillStyle = drawRadial;
                    //   canvas.fillRect(pos.x + j.x - frm.offsetX - borderSize, pos.y + j.y - frm.offsetY - borderSize, frm.width + borderSize * 2, frm.height + borderSize*2);
                    frm.drawUI(canvas, { x: pos.x + j.x - frm.offsetX, y: pos.y + j.y - frm.offsetY }, { width: frm.width, height: frm.height }, false, true, true, false, piece.xflip, piece.yflip);
                }
            } else {
                drawRadial = sonicManager.mainCanvas.createRadialGradient(0, 0, 0, 10, 10, 50);
                drawRadial.addColorStop(0, 'white');
                if (selectedPieceIndex == i) {
                    drawRadial.addColorStop(1, 'yellow');
                } else {
                    drawRadial.addColorStop(1, 'red');
                }

                canvas.fillStyle = drawRadial;
                canvas.beginPath();
                canvas.arc(pos.x + j.x, pos.y + j.y, 10, 0, Math.PI * 2, true);
                canvas.closePath();
                canvas.fill();

            }
        }
        canvas.restore();
    };



    this.draw = function (canvas, x, y, scale, framework, instance, showHeightMap) {
        for (var i = 0; i < instance.pieces.length; i++) {
            var j = instance.pieces[i];
            if (!j.visible) continue;
            var piece = framework.pieces[j.pieceIndex];
            var asset = framework.assets[piece.assetIndex];
            if (asset.frames.length > 0) {
                var frm = asset.frames[j.frameIndex];
                frm.drawUI(canvas, { x: (x + j.x * scale.x) - (frm.offsetX * scale.x), y: (y + j.y * scale.y) - (frm.offsetY * scale.y) }, { width: frm.width * scale.x, height: frm.height * scale.y }, false, showHeightMap, showHeightMap, false, piece.xflip, piece.yflip);
            }

        }

    };
}

function LevelObjectPieceLayoutPiece(pieceIndex) {
    this.pieceIndex = pieceIndex;
    this.assetIndex = 0;
    this.frameIndex = 0;
    this.priority = false;
    this.x = 0;
    this.y = 0;
    this.visible = true;
}
var broken = _H.loadSprite("assets/Sprites/broken.png");


function LevelObjectInfo(o) {
    this.o = o;
    this.x = o.X;
    this.y = o.Y;
    this.xsp = 0;
    this.ysp = 0;
    this.xflip = o.XFlip;
    this.yflip = o.YFlip;
    this.subdata = o.SubType;
    this.key = o.ID;
    this.ObjectData = null;
    this.upperNibble = this.subdata >> 4;
    this.lowerNibble = this.subdata & 0xf;
    this.pieceIndex = 0;
    this.pieces = [];
    this.dead = false;
    this.debug = { lines: [] };

    this.log = function (txt, level) {
        if (level === undefined) level = 100;

        if (level == 0) {
            this.debug.lines.push(" -- " + txt + " -- ");
        } else {
            this.debug.lines.push(txt);
        }

        if (this.consoleLog) {
            this.consoleLog(this.debug);
        }
    };


    this.setPieceLayoutIndex = function (ind) {
        this.pieceIndex = ind;
        var pcs = this.ObjectData.pieceLayouts[this.pieceIndex].pieces;

        this.pieces = [];
        for (var i = 0; i < pcs.length; i++) {
            this.pieces.push(_H.clone(pcs[i]));
        }

    };
    this.setObjectData = function (obj) {
        this.ObjectData = obj;

        if (this.ObjectData.pieceLayouts.length > this.pieceIndex &&
            this.ObjectData.pieceLayouts[this.pieceIndex].pieces.length > 0) {
            this.setPieceLayoutIndex(this.pieceIndex);
        }


    };
    this.tick = function (object, level, sonic) {
        if (this.dead || !this.ObjectData) return false;

        try {
            return this.ObjectData.tick(object, level, sonic);
        } catch (EJ) {
            this.log(EJ.name + " " + EJ.message, 0);

            return false;
        }

    };

    this.mainPieceLayout = function () {
        return this.ObjectData.pieceLayouts[this.pieceIndex];
    };

    this._rect = { x: 0, y: 0, width: 0, height: 0 };
    this.getRect = function (scale) {

        if (this.ObjectData.pieceLayouts.length == 0) {
            this._rect.x = this.x;
            this._rect.y = this.y;
            this._rect.width = broken.width;
            this._rect.height = broken.height;
            return this._rect;
        }

        var pcs = this.pieces;

        this._rect.x = 0;
        this._rect.y = 0;
        this._rect.width = 0;
        this._rect.height = 0;

        for (var pieceIndex = 0; pieceIndex < pcs.length; pieceIndex++) {
            var j = pcs[pieceIndex];
            var piece = this.ObjectData.pieces[j.pieceIndex];
            var asset = this.ObjectData.assets[piece.assetIndex];
            if (asset.frames.length > 0) {
                var frm = asset.frames[j.frameIndex];
                _H.mergeRect(this._rect, { x: frm.offsetX + j.x, y: frm.offsetY + j.y, width: frm.width * scale.x, height: frm.height * scale.y });
            }
        }
        this._rect.x = this._rect.x * scale.x;
        this._rect.y = this._rect.y * scale.y;
        this._rect.width -= this._rect.x;
        this._rect.height -= this._rect.y;

        this._rect.x += this.x;
        this._rect.y += this.y;
        return this._rect;
    };
    this.draw = function (canvas, x, y, scale, showHeightMap) {
        if (this.dead || !this.ObjectData) return;

        if (this.ObjectData.pieceLayouts.length == 0) {
            canvas.drawImage(broken, _H.floor((x - broken.width / 2)), _H.floor((y - broken.height / 2)), broken.width * scale.x, broken.height * scale.y);
            return;
        }

        this.mainPieceLayout().draw(canvas, x, y, scale, this.ObjectData, this, showHeightMap);
        if (this.consoleLog) {

            var gr = this.getRect(scale);
            canvas.save();
            canvas.fillStyle = "rgba(228,228,12,0.4)";
            var wd = 1;
            canvas.fillRect(gr.x - this.x + x - (gr.width / 2) - wd, gr.y - this.y + y - (gr.height / 2) - wd, gr.width - (gr.x - this.x) + wd * 2, gr.height - (gr.y - this.y) + wd * 2);
            canvas.restore();

        }



    };
    this.reset = function () {
        this.x = this.o.X;
        this.y = this.o.Y;
        this.xsp = 0;
        this.ysp = 0;
        this.state = undefined;
        this.xflip = this.o.XFlip;
        this.yflip = this.o.YFlip;
        this.dead = false;
        this.pieceIndex = 0; //maybe
        this.subdata = this.o.SubType;
        this.upperNibble = this.subdata >> 4;
        this.lowerNibble = this.subdata & 0xf;
        if (this.ObjectData.pieceLayouts.length > this.pieceIndex &&
            this.ObjectData.pieceLayouts[this.pieceIndex].pieces.length > 0) {
            this.setPieceLayoutIndex(this.pieceIndex);
        }


    };


    this.collides = function (sonic) {
        return this.collision(sonic, false);
    };

    this.hurtsSonic = function (sonic) {
        return this.collision(sonic, true);
    };
    this.kill = function () {
        this.dead = true;
    };

    this.collision = function (sonic, isHurtMap) {

        if (this.dead || !this.ObjectData || this.ObjectData.pieceLayouts.length == 0) return false;
        var pcs = this.pieces;
        for (var pieceIndex = 0; pieceIndex < pcs.length; pieceIndex++) {
            var j = pcs[pieceIndex];
            var piece = this.ObjectData.pieces[j.pieceIndex];
            var asset = this.ObjectData.assets[piece.assetIndex];
            if (asset.frames.length > 0) {
                var frm = asset.frames[j.frameIndex];
                var map = isHurtMap ? frm.hurtSonicMap : frm.collisionMap;
                if (twoDArray(map, (sonic.x - this.x + frm.offsetX + j.x), (sonic.y - this.y + frm.offsetY + j.y)) == true) {
                    return j;
                }
            }
        }

        return false;
    };

    function twoDArray(map, x, y) {
        if (!map || x < 0 || y < 0 || x > map.length)
            return false;
        var d = map[x];
        if (!d || y > d.length)
            return false;
        return d[y];
    }

    this.collide = function (sonic, sensor, piece) {
        try {
            return this.ObjectData.onCollide(this, sonicManager.SonicLevel, sonicManager.sonicToon, sensor, piece);
        } catch (EJ) {
            this.log(EJ.name + " " + EJ.message + " " + EJ.stack, 0);
            return false;
        }
    };
    this.hurtSonic = function (sonic, sensor, piece) {
        try {
            return this.ObjectData.onHurtSonic(this, sonicManager.SonicLevel, sonicManager.sonicToon, sensor, piece);
        } catch (EJ) {
            this.log(EJ.name + " " + EJ.message + " " + EJ.stack, 0);

            return false;
        }
    };

}

function LevelObjectProjectile(name) {
    this.x = 0;
    this.y = 0;
    this.xsp = 0;
    this.ysp = 0;
    this.xflip = 0;
    this.yflip = 0;
    this.assetIndex = 0;
    this.frameIndex = 0;
    this.name = name ? name : "";
    this.init = function (level, sonic) {
    };
    this.tick = function (level, sonic) {
    };
    this.onCollide = function (level, sonic) {
    };
    this.onHurtSonic = function (level, sonic, sensor) {
    };
}

function LevelEvent() {
    this.triggered = false;
    this.state = {};
    this.tick = function (level, sonic) {
    };
    this.trigger = function (state) {
        this.state = state;
    };
}
