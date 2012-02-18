function HeightMask(angle, items) {
    this.width = 16;
    this.height = 16;
    this.angle = angle;
    this.items = items ? items : [];


    HeightMask.prototype.setItem = function (x, y, rotationMode) {

        var jx = 0, jy = 0;
        switch (rotationMode) {
            case RotationMode.Floor:
                jx = x;
                jy = y;
                break;
            case RotationMode.RightWall:
                jx = y;
                jy = x;
                break;
            case RotationMode.Ceiling:
                jx = x;
                jy = 15 - y;
                break;
            case RotationMode.LeftWall:
                jx = y;
                jy = 15 - x;
                break;
            default:
        }

        this.items[jx] = 16 - jy;

    };



    HeightMask.prototype.draw = function (canvas, pos, scale, state, xflip, yflip, solid) {
        _H.save(canvas);
        var oPos = { x: pos.x, y: pos.y };
        /*if (xflip) {
            pos.x = -pos.x - 16 * scale.x;
            canvas.scale(-1, 1);
        }
        if (yflip) {
            pos.y = -pos.y - 16 * scale.y;
            canvas.scale(1, -1);
        }*/

        var fd;
        if ((fd = sonicManager.SpriteCache.heightMaps[this.index])) {
            if (fd.loaded) {
                canvas.drawImage(fd, pos.x, pos.y);
            }
        } else {

            if (solid > 0) {
                for (var x = 0; x < 16; x++) {
                    var jx = 0, jy = 0;
                    var y = 16 - this.items[x];

                    jx = x;
                    jy = y;
                    var _x = pos.x + (jx * scale.x);
                    var _y = pos.y + (jy * scale.y);


                    canvas.lineWidth = 1;
                    canvas.fillStyle = HeightMask.colors[solid];
                    canvas.fillRect(_x, _y, scale.x, scale.y * this.items[x]);
                }
            }
        }


        _H.restore(canvas);
        pos.x = oPos.x;
        pos.y = oPos.y;
    };
}

HeightMask.colors = ["rgba(24,98,235,0.6)", "rgba(255,98,235,0.6)", "rgba(24,218,235,0.6)", "rgba(24,98,235,0.6)"];