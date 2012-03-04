

function ObjectManager(sonicManager) {

    this.sonicManager = sonicManager;
    window.objectManager = this;
    this.metaObjectFrameworks = [];
    this.objectFrameworks = [];

    this.init = function () {

    };
}

function LevelObject(key) {
    this.assets = [];
    this.key = key ? key : "";
    this.pieces = [];
    this.pieceLayouts = [];
    this.projectiles = [];
    this.initScript = "this.state = {\r\n\txsp: 0.0,\r\n\tysp: 0.0,\r\n\tfacing: false,\r\n};";
    this.tickScript = "if(this.state.facing){\r\n\tthis.state.facing=false;\r\n\tthis.state.xsp=10;\r\n|";
    this.collideScript = "this.die();";
    this.hurtScript = "sonic.hit();";

    this.init = function (level, sonic) {
    };
    this.tick = function (level, sonic) {
    };
    this.onCollide = function (level, sonic) {
    };
    this.onHurtSonic = function (level, sonic, sensor) {
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
        for (var a = 0; a < 100; a++) {
            this.collisionMap[i][a] = Math.random() * 100 < 50;
            this.hurtSonicMap[i][a] = Math.random() * 100 < 50;
        }
    }

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

        canvas.scale(width / this.width, height / this.height);


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

    this.drawUI = function (canvas, pos, scale, showOutline, showCollideMap, showHurtMap) {
        canvas.strokeStyle = "#000000";
        canvas.lineWidth = 1;

        scale.x = _H.floor(scale.x);
        scale.y = _H.floor(scale.y);
        for (var x = 0; x < this.width; x++) {
            for (var y = 0; y < this.height; y++) {
                var ex = x;
                var ey = y;
                var color = this.palette[this.colorMap[ex][ey]];
                //  var negative = _H.negateColor(color);
                if (canvas.fillStyle != "#" + color)
                    canvas.fillStyle = "#" + color;

                //if (canvas.strokeStyle != "#" + negative)
                //    canvas.strokeStyle = "#" + negative; 


                canvas.fillRect(pos.x + ex * scale.x, pos.y + ey * scale.y, scale.x, scale.y);
                if (showOutline)
                    canvas.strokeRect(pos.x + ex * scale.x, pos.y + ey * scale.y, scale.x, scale.y);

                if (showCollideMap) {
                    if (this.collisionMap[ex][ey]) {
                        canvas.fillStyle = "rgba(30,34,255,0.6)";
                        canvas.fillRect(pos.x + ex * scale.x, pos.y + ey * scale.y, scale.x, scale.y);
                    }
                }

                if (showHurtMap) {
                    if (this.hurtSonicMap[ex][ey]) {
                        canvas.fillStyle = "rgba(211,12,55,0.6)";
                        canvas.fillRect(pos.x + ex * scale.x, pos.y + ey * scale.y, scale.x, scale.y);
                    }

                }
            }
        }
        canvas.beginPath();
        canvas.moveTo(pos.x + this.offsetX * scale.x, pos.y + 0);
        canvas.lineTo(pos.x + this.offsetX * scale.x, pos.y + this.height * scale.y);
        canvas.lineWidth = 3;
        canvas.strokeStyle = "#000000";
        canvas.stroke();

        canvas.beginPath();
        canvas.moveTo(pos.x + 0, pos.y + this.offsetY * scale.y);
        canvas.lineTo(pos.x + this.width * scale.x, pos.y + this.offsetY * scale.y);
        canvas.lineWidth = 3;
        canvas.strokeStyle = "#000000";
        canvas.stroke();

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
    this.name = name ? name : "";
}
function LevelObjectPieceLayout(name) {
    this.width = 350;
    this.height = 350;
    this.pieces = [];
   
    this.name = name ? name : "";
  




    this.drawUI = function (canvas, pos, scale, showOutline, showImages) {
        canvas.strokeStyle = "#000000";
        canvas.lineWidth = 2;


        canvas.fillStyle = "#FFFFFF";
        canvas.fillRect(pos.x, pos.y, this.width, this.height);
        for (var i = 1; i < this.pieces.length; i++) {
            var j = this.pieces[i];
         
                canvas.beginPath();
                canvas.moveTo(pos.x + j.x, pos.y + j.y);
                canvas.lineTo(pos.x + this.pieces[i - 1].x, pos.y + this.pieces[i - 1].y);
                canvas.stroke();
       
        }
        for (var i = 0; i < this.pieces.length; i++) {
            var j = this.pieces[i];
            var drawRadial = sonicManager.mainCanvas.createRadialGradient(0, 0, 0, 10, 10, 50);
            drawRadial.addColorStop(0, 'white');
            drawRadial.addColorStop(1, 'red');


            canvas.fillStyle = drawRadial;
            canvas.beginPath();
            canvas.arc(pos.x + j.x, pos.y + j.y, 10, 0, Math.PI * 2, true);
            canvas.closePath();
            canvas.fill();

        }

    };
}
function LevelObjectPieceLayoutPiece(pieceIndex) {
    this.pieceIndex = pieceIndex;
    this.assetIndex = 0;
    this.x = 0;
    this.y = 0;
}
function LevelObjectInfo() {
    this.x = 0;
    this.y = 0;
    this.xsp = 0;
    this.ysp = 0;
    this.xflip = 0;
    this.yflip = 0;
    this.subdata = undefined;
    this.key = undefined;
}
function LevelProjectile(name) {
    this.x = 0;
    this.y = 0;
    this.xsp = 0;
    this.ysp = 0;
    this.xflip = 0;
    this.yflip = 0;
    this.subdata = undefined;
    this.assets = [];
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
