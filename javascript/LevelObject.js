﻿var broken = _H.loadSprite("assets/Sprites/broken.png");

function LevelObject(o) {
    this.ObjectData = o;
    this.sprites = [];
    this.Width = 30;
    this.Height = 30;
    LevelObject.prototype.getRect = function () {

        var x = this.ObjectData.X - monitor.width / 2;
        var y = this.ObjectData.Y - monitor.height / 2;
        var w = this.Width;
        var h = this.Height;

        return { x: x, y: y, width: w, height: h };
    };
    LevelObject.prototype.collide = function () {

    };
    LevelObject.prototype.draw = function (canvas, pos, scale) {
        if (this.sprites[0] && this.sprites[0].loaded) {
            canvas.drawImage(this.sprites[0], (pos.x - this.sprites[0].width / 2) * scale.x, (pos.y - this.sprites[0].height / 2) * scale.y, this.sprites[0].width * scale.x, this.sprites[0].height * scale.y);
        } else {
            canvas.drawImage(broken, (pos.x - broken.width / 2) * scale.x, (pos.y - broken.height / 2) * scale.y, broken.width * scale.x, broken.height * scale.y);
        }
    };

}

var monitor = _H.loadSprite("assets/Sprites/monitorEmpty.png");
var monitorBroken = _H.loadSprite("assets/Sprites/monitorBroken.png");

function CollisionSwitcherObject(o) {
    this.ObjectData = o;
    this.sprites = [];
    this.Width = 10;
    this.Height = 70;

    CollisionSwitcherObject.prototype.getRect = function () {
        var x = this.ObjectData.X - this.Width/2;
        var y = this.ObjectData.Y - this.Height/2;
        return { x: x, y: y, width: this.Width, height: this.Height };
    };
    CollisionSwitcherObject.prototype.collide = function () {
        if (sonicManager.sonicToon.xsp>0) {
            sonicManager.SonicLevel.curHeightMap = true;
        } else {
            sonicManager.SonicLevel.curHeightMap = false;
        }
    };


    CollisionSwitcherObject.prototype.draw = function (canvas, pos, scale) {
      //  canvas.fillStyle = "#FFFFFF";
      //  canvas.fillRect((this.ObjectData.X - 5 - sonicManager.windowLocation.x) * scale.x, (this.ObjectData.Y - 50 - sonicManager.windowLocation.y) * scale.y, 10 * scale.x, 100 * scale.y);
    };

}

function MonitorObject(o) {
    this.ObjectData = o;
    this.sprites = [];

    var mStart = 'assets/Sprites/monitor';
    switch (this.ObjectData.SubType) {
        case 1: //one up
            this.sprites.push(_H.loadSprite(mStart + "SonicOneUp.png"));
            break;
        case 2: //robotnic
            this.sprites.push(_H.loadSprite(mStart + "Death.png"));
            break;
        case 3: //ring
            this.sprites.push(_H.loadSprite(mStart + "Ring.png"));
            break;
        case 4: //shoe
            this.sprites.push(_H.loadSprite(mStart + "SpeedShoe.png"));
            break;
        case 5: //flame
            this.sprites.push(_H.loadSprite(mStart + "Flame.png"));
            break;
        case 6: //electric
            this.sprites.push(_H.loadSprite(mStart + "Electric.png"));
            break;
        case 7: //bubble
            this.sprites.push(_H.loadSprite(mStart + "Bubble.png"));
            break;
        case 8: //stars
            this.sprites.push(_H.loadSprite(mStart + "Stars.png"));
            break;

    }

    MonitorObject.prototype.getRect = function () {
        var x = this.ObjectData.X - monitor.width / 2;
        var y = this.ObjectData.Y - monitor.height / 2;
        return { x: x, y: y, width: monitor.width, height: monitor.height };
    };
    MonitorObject.prototype.collide = function () {
        if (sonicManager.sonicToon.ysp == 0) {
            sonicManager.sonicToon.gsp = 0;
            sonicManager.sonicToon.xsp = 0;
            return;
        }
        if (this.ObjectData.SubType == 10) {
            return;
        }
        switch (this.ObjectData.SubType) {
            case 1:
                sonicManager.sonicToon.Lives = 1;
                break;
            case 2:
                sonicManager.sonicToon.hit();
                break;
            case 3: //ring
                sonicManager.sonicToon.rings += 10;
                break;
            case 4: //shoe
                sonicManager.sonicToon.rings += 20;
                break;
            case 5: //flame
                sonicManager.sonicToon.rings += 30;
                break;
            case 6: //electric
                sonicManager.sonicToon.rings += 40;
                break;
            case 7: //bubble
                sonicManager.sonicToon.rings += 50;
                break;
            case 8: //stars
                sonicManager.sonicToon.rings += 60;
                break;
        }
        if (sonicManager.sonicToon.ysp > 0) {
            sonicManager.sonicToon.ysp *= -1;
        } else {
            sonicManager.sonicToon.ysp *= 1;
        }
        this.ObjectData.SubType = 10;
    };


    MonitorObject.prototype.draw = function (canvas, pos, scale) {
        if (this.sprites[0] && this.sprites[0].loaded) {

            if (this.ObjectData.SubType == 10) {
                canvas.drawImage(monitorBroken, (pos.x - monitorBroken.width / 2) * scale.x, (pos.y) * scale.y, monitorBroken.width * scale.x, monitorBroken.height * scale.y);
            }
            else {
                canvas.drawImage(monitor, (pos.x - monitor.width / 2) * scale.x, (pos.y - monitor.height / 2) * scale.y, monitor.width * scale.x, monitor.height * scale.y);
                if (sonicManager.sonicToon) {
                    if (!(sonicManager.drawTickCount % 6 == 0 || sonicManager.drawTickCount % 6 == 1))
                        canvas.drawImage(this.sprites[0], ((pos.x - monitor.width / 2) + 6) * scale.x, ((pos.y - monitor.height / 2) + 3) * scale.y, this.sprites[0].width * scale.x, this.sprites[0].height * scale.y);
                }
                else {
                    canvas.drawImage(this.sprites[0], ((pos.x - monitor.width / 2) + 6) * scale.x, ((pos.y - monitor.height / 2) + 3) * scale.y, this.sprites[0].width * scale.x, this.sprites[0].height * scale.y);
                }
            }
        }
    };

}




function SpringObject(o) {
    this.ObjectData = o;
    this.sprites = [];

    var mStart = 'assets/Sprites/monitor';
    switch (this.ObjectData.SubType) {
        case 1: //one up
            this.sprites.push(_H.loadSprite(mStart + "SonicOneUp.png"));
            break;
        case 2: //robotnic
            this.sprites.push(_H.loadSprite(mStart + "Death.png"));
            break;
        case 3: //ring
            this.sprites.push(_H.loadSprite(mStart + "Ring.png"));
            break;
        case 4: //shoe
            this.sprites.push(_H.loadSprite(mStart + "SpeedShoe.png"));
            break;
        case 5: //flame
            this.sprites.push(_H.loadSprite(mStart + "Flame.png"));
            break;
        case 6: //electric
            this.sprites.push(_H.loadSprite(mStart + "Electric.png"));
            break;
        case 7: //bubble
            this.sprites.push(_H.loadSprite(mStart + "Bubble.png"));
            break;
        case 8: //stars
            this.sprites.push(_H.loadSprite(mStart + "Stars.png"));
            break;

    }

    SpringObject.prototype.getRect = function () {
        var x = this.ObjectData.X - monitor.width / 2;
        var y = this.ObjectData.Y - monitor.height / 2;
        return { x: x, y: y, width: monitor.width, height: monitor.height };
    };
    SpringObject.prototype.collide = function () {
        if (sonicManager.sonicToon.ysp == 0) {
            sonicManager.sonicToon.gsp = 0;
            sonicManager.sonicToon.xsp = 0;
            return;
        }
        if (this.ObjectData.SubType == 10) {
            return;
        }
        switch (this.ObjectData.SubType) {
            case 1:
                sonicManager.sonicToon.Lives = 1;
                break;
            case 2:
                sonicManager.sonicToon.hit();
                break;
            case 3: //ring
                sonicManager.sonicToon.rings += 10;
                break;
            case 4: //shoe
                sonicManager.sonicToon.rings += 20;
                break;
            case 5: //flame
                sonicManager.sonicToon.rings += 30;
                break;
            case 6: //electric
                sonicManager.sonicToon.rings += 40;
                break;
            case 7: //bubble
                sonicManager.sonicToon.rings += 50;
                break;
            case 8: //stars
                sonicManager.sonicToon.rings += 60;
                break;
        }
        if (sonicManager.sonicToon.ysp > 0) {
            sonicManager.sonicToon.ysp *= -1;
        } else {
            sonicManager.sonicToon.ysp *= 1;
        }
        this.ObjectData.SubType = 10;
    };


    SpringObject.prototype.draw = function (canvas, pos, scale) {
        if (this.sprites[0] && this.sprites[0].loaded) {

            if (this.ObjectData.SubType == 10) {
                canvas.drawImage(monitorBroken, (pos.x - monitorBroken.width / 2) * scale.x, (pos.y) * scale.y, monitorBroken.width * scale.x, monitorBroken.height * scale.y);
            }
            else {
                canvas.drawImage(monitor, (pos.x - monitor.width / 2) * scale.x, (pos.y - monitor.height / 2) * scale.y, monitor.width * scale.x, monitor.height * scale.y);
                if (sonicManager.sonicToon) {
                    if (!(sonicManager.drawTickCount % 6 == 0 || sonicManager.drawTickCount % 6 == 1))
                        canvas.drawImage(this.sprites[0], ((pos.x - monitor.width / 2) + 6) * scale.x, ((pos.y - monitor.height / 2) + 3) * scale.y, this.sprites[0].width * scale.x, this.sprites[0].height * scale.y);
                }
                else {
                    canvas.drawImage(this.sprites[0], ((pos.x - monitor.width / 2) + 6) * scale.x, ((pos.y - monitor.height / 2) + 3) * scale.y, this.sprites[0].width * scale.x, this.sprites[0].height * scale.y);
                }
            }
        }
    };

}

