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


    HeightMask.prototype.drawUI = function (canvas, pos, scale, state, xflip, yflip, solid) {

        if (solid > 0) {
            for (var x = 0; x < 16; x++) {
                for (var y = 0; y < 16; y++) {
                    var jx = 0, jy = 0;
                    if (xflip) {
                        if (yflip) {
                            jx = 15 - x;
                            jy = 15 - y;
                        } else {
                            jx = 15 - x;
                            jy = y;
                        }
                    } else {
                        if (yflip) {
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
                    if (state <= 0 && _H.itemsGood(this.items,x,y,jy) && solid > 0) {
                        canvas.fillStyle = HeightMask.colors[solid];
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

        }
    };

    HeightMask.prototype.draw = function (canvas, pos, scale, state, xflip, yflip, solid) {
        _H.save(canvas);
        var oPos = { x: pos.x, y: pos.y };
        if (xflip) {
            pos.x = -pos.x - 16 * scale.x;
            canvas.scale(-1, 1);
        }
        if (yflip) {
            pos.y = -pos.y - 16 * scale.y;
            canvas.scale(1, -1);
        }

        var fd;
        if ((fd = sonicManager.SpriteCache.heightMaps[this.index])) {
            if (fd.loaded) {
                canvas.drawImage(fd, pos.x, pos.y);
            }
        } else {

            if (solid > 0) {
                for (var x = 0; x < 16; x++) {
                    var jx = 0, jy = 0;
                    var y = 16 + (this.items[x] > 0 ? -this.items[x] : this.items[x]);

                    jx = x;
                    jy = y;
                    var _x = pos.x + (jx * scale.x);
                    var _y = pos.y + (jy * scale.y);


                    canvas.lineWidth = 1;
                    canvas.fillStyle = HeightMask.colors[solid];
                    canvas.fillRect(_x, _y, scale.x, scale.y * Math.abs(this.items[x]));
                }
            }
        }


        _H.restore(canvas);
        pos.x = oPos.x;
        pos.y = oPos.y;
    };
}

HeightMask.colors = ["rgba(24,98,235,0.6)", "rgba(255,98,235,0.6)", "rgba(24,218,235,0.6)", "rgba(24,98,235,0.6)"];