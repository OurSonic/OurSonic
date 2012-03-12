var broken = _H.loadSprite("assets/Sprites/broken.png");

function LevelObject(o) {
    this.ObjectData = o;
    this.sprites = [];
    this.Width = 30;
    this.Height = 30;

    this.getRect = function () {

        var x = this.ObjectData.X - monitor.width / 2;
        var y = this.ObjectData.Y - monitor.height / 2;
        var w = this.Width;
        var h = this.Height;

        return { x: x, y: y, width: w, height: h };
    };
    this.collide = function () {

    };
    this.draw = function (canvas, pos, scale) {
        if (this.sprites[0] && this.sprites[0].loaded) {
            canvas.drawImage(this.sprites[0], _H.floor((pos.x - this.sprites[0].width / 2) * scale.x), _H.floor((pos.y - this.sprites[0].height / 2) * scale.y), this.sprites[0].width * scale.x, this.sprites[0].height * scale.y);
        } else {
            canvas.drawImage(broken, _H.floor((pos.x - broken.width / 2) * scale.x), _H.floor((pos.y - broken.height / 2) * scale.y), broken.width * scale.x, broken.height * scale.y);
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

    this.getRect = function () {
        var x = this.ObjectData.X - this.Width / 2;
        var y = this.ObjectData.Y - this.Height / 2;
        return { x: x, y: y, width: this.Width, height: this.Height };
    };
    this.collide = function () {
        if (sonicManager.sonicToon.xsp > 0) {
            sonicManager.SonicLevel.curHeightMap = true;
        } else {
            sonicManager.SonicLevel.curHeightMap = false;
        }
    };


    this.draw = function (canvas, pos, scale) {
        if (sonicManager.showHeightMap) {
              canvas.fillStyle = "#FFFFFF";
              canvas.fillRect((this.ObjectData.X - 5 - sonicManager.windowLocation.x) * scale.x, (this.ObjectData.Y - 50 - sonicManager.windowLocation.y) * scale.y, 10 * scale.x, 100 * scale.y);
        }
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

    this.getRect = function () {
        var x = this.ObjectData.X - monitor.width / 2;
        var y = this.ObjectData.Y - monitor.height / 2;
        return { x: x, y: y, width: monitor.width, height: monitor.height };
    };
    this.collide = function () {
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


    this.draw = function (canvas, pos, scale) {
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


SpringType = { Yellow: 0, Red: 1 };
FacingType = { Yellow: 0, Red: 1 };
function SpringObject(o) {
    this.ObjectData = o;
    this.sprites = [];
    this.facing = 0;
    this.xflip = false;
    this.yflip = false;
    //alert('upper: ' + this.ObjectData.upperNibble() + ' lower: ' + this.ObjectData.lowerNibble())
    this.type = SpringType.Yellow;
    var mStart = 'assets/Sprites/spring';
    
    switch (this.ObjectData.lowerNibble()) {
        case 0:
            this.type = SpringType.Yellow;
            mStart += "yellow";
            break;
        case 2:
            this.type = SpringType.Red;
            mStart += "red";
            break;
        default:
            this.type = SpringType.Red;
            mStart += "red";
            break;
    }
    switch (this.ObjectData.upperNibble()) {
        case 0:
            break;
        case 1:
            this.sideways = true;
            break;
        case 2:
            this.yflip = true;
            break;
        case 3:
            break;
        case 4:
            break;

    }

    var md;
    this.sprites.push(md=_H.loadSprite(mStart + "closed.png"));

    this.getRect = function () {
        var x = this.ObjectData.X - md.width / 2;
        var y = this.ObjectData.Y - md.height / 2;
        return { x: x, y: y, width: md.width, height: md.height };
    };
    this.collide = function () {
        var spd;
        switch (this.type) {
            case SpringType.Red:
                spd = 16;
                break;
            case SpringType.Yellow:
                spd = 10;
                break;
        }

        if (this.sideways) {
            if (this.xflip) {
                sonicManager.sonicToon.xsp = spd;
            } else {
                sonicManager.sonicToon.xsp = -spd;
            }
        }
        else {
            if (this.yflip) {
                sonicManager.sonicToon.ysp = spd;
            } else {
                sonicManager.sonicToon.ysp = -spd;
            }

        }
    };


    this.draw = function (canvas, pos, scale) {
        if (this.sprites[0] && this.sprites[0].loaded) {
            canvas.drawImage(this.sprites[0], (pos.x - this.sprites[0].width / 2) * scale.x, (pos.y) * scale.y, this.sprites[0].width * scale.x, this.sprites[0].height * scale.y);
        }
    };

}

