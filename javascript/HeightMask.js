function HeightMask(rotationMode, angle, items) {
    this.width = 16;
    this.height = 16;
    this.angle = angle;
    this.items = items ? items : [];
    this.rotationMode = rotationMode;
    for (var _x = 0; _x < 16; _x++) {
        this.items[_x] = 0;
    }

    HeightMask.prototype.setItem = function (x, y) {

        var jx = 0, jy = 0;
        switch (this.rotationMode) {
        case RotationMode.Ground:
            jx = x;
            jy = y;
            break;
        case RotationMode.Right:
            jx = y;
            jy = x;
            break;
        case RotationMode.Ceiling:
            jx = x;
            jy = 15 - y;
            break;
        case RotationMode.Left:
            jx = y;
            jy = 15 - x;
            break;
        default:
        }
        this.items[jx] = 16-jy;

    };



    HeightMask.prototype.draw = function (canvas, pos, scale) {

        for (var x = 0; x < 16; x++) {
            for (var y = 0; y < 16; y++) {
                var jx = 0, jy = 0;
                switch (this.rotationMode) {
                    case RotationMode.Ground:
                        jx = x;
                        jy = y;
                        break;
                    case RotationMode.Right:
                        jx = y;
                        jy = x;
                        break;
                    case RotationMode.Ceiling:
                        jx = x;
                        jy = 15 - y;
                        break;
                    case RotationMode.Left:
                        jx = 15 - y;
                        jy = x;
                        break;
                    default:
                }

                var _x = pos.x + (jx * scale.x);
                var _y = pos.y + (jy * scale.y);

                
                canvas.lineWidth = 1;
                if (this.items[x] >= 16 - y) {
                    canvas.fillStyle = "rgba(24,98,235,0.6)";
                    canvas.fillRect(_x, _y, scale.x, scale.y);
                } else {
                    canvas.strokeStyle = "#0C3146";
                    canvas.strokeRect(_x, _y, scale.x, scale.y);
                }
            }
        }
    };
}
