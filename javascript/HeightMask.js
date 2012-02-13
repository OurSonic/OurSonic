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

        this.items[jx] = 16-jy;

    };

    this.colors = ["rgba(24,98,235,0.6)", "rgba(255,98,235,0.6)", "rgba(24,218,235,0.6)", "rgba(24,98,235,0.6)"];

    HeightMask.prototype.draw = function (canvas, pos, scale, state, xFlip,yFlip,solid) {


        var fd;
        if ((fd = sonicManager.SpriteCache.heightMaps[this.index + " " + scale.y + " " + scale.x])) {
            if (fd.loaded) {
                canvas.drawImage(fd, pos.x, pos.y);
            }
        } else {

            for (var x = 0; x < 16; x++) {
                for (var y = 0; y < 16; y++) {
                    var jx = 0, jy = 0;
                    if (xFlip) {
                        if (yFlip) {
                            jx = 15 - x;
                            jy = 15 - y;
                        } else {
                            jx = 15 - x;
                            jy = y;
                        }
                    } else {
                        if (yFlip) {
                            jx = x;
                            jy = 15 - y;
                        } else {
                            jx = x;
                            jy = y;
                        }
                    }

                    var _x = pos.x + (jx * scale.x);
                    var _y = pos.y + (jy * scale.y);


                   

                    canvas.lineWidth = 1;
                    if (state <= 0 && this.items[x] >= 16 - y && solid>0) {
                        canvas.fillStyle = this.colors[solid];
                        canvas.fillRect(_x, _y, scale.x, scale.y);
                    } else {
                        if (state != -1) {
                            canvas.lineWidth = 1;
                            canvas.strokeStyle = "#0C3146";
                            canvas.strokeRect(_x, _y, scale.x, scale.y);
                        }
                    }


                }
            }


            if (state == 1) {

                canvas.strokeStyle = "#DC4146";
                canvas.lineWidth = 4;
                canvas.moveTo(pos.x + 8 * scale.x, pos.y + 8 * scale.y);
                canvas.lineTo(pos.x + 8 * scale.x + _H.sin((this.angle)) * 6 * scale.x, pos.y + 8 * scale.y + _H.cos((this.angle)) * 6 * scale.y);
                canvas.stroke();
            }
        }
        
    };
}
