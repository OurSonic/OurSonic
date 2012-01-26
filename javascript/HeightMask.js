function HeightMask() {
    this.width = 16;
    this.height = 16;
    this.items = [];
    this.init = function () {
        this.items = [];
        for (var x = 0; x < 16; x++) {
            this.items[x] = Math.floor(Math.random() * 16);
        }

    };
    this.draw = function (canvas, pos, scale) {
        for (var x = 0; x < 16; x++) {
            for (var y = 0; y < 16; y++) {
                if (this.items[x]<=y) {
                    canvas.fillRect(pos.x + (x * scale.x), pos.y + (y * scale.y), scale.x, scale.y);
                } else {
                    canvas.strokeRect(pos.x + (x * scale.x), pos.y + (y * scale.y), scale.x, scale.y);
                }
            }
        }
    };
}
