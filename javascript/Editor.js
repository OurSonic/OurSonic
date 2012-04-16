function Editor(assetFrame,showOffset) {
    this.assetFrame = assetFrame;

    this.showHurtMap = false;
    this.showCollideMap = false;
    
    this.lineWidth = 1;
    this.currentColor = 0;
    this.showOutline = true;
    this.draw = function (canvas, pos, size,showCollideMap,showHurtMap) {
        this.assetFrame.drawUI(canvas, pos, size, this.showOutline, showCollideMap, showHurtMap, showOffset);
    };
    this.drawPixel = function (location1) {

        var halfwidth = _H.floor(this.lineWidth / 2);
        var map = !this.showHurtMap && !this.showCollideMap ? this.assetFrame.colorMap : (this.showHurtMap ? this.assetFrame.hurtSonicMap : this.assetFrame.collisionMap);

        

        if (this.lineWidth == 1) {
            map[location1.x][location1.y] = this.currentColor;
        } else {
            var k, c;
            for (k = -halfwidth; k < halfwidth; k++) {
                for (c = -halfwidth; c < halfwidth; c++) {
                    map[Math.min(Math.max(0, location1.x + k), this.assetFrame.width)][Math.min(Math.max(0, location1.y + c), this.assetFrame.height)] = this.currentColor;
                }
            }
        }
        
        this.assetFrame.clearCache();
    };
    this.drawLine = function (location1, location2) {

        location1 = { x: location1.x, y: location1.y };

        var dx = Math.abs((location2.x) - (location1.x));
        var dy = Math.abs((location2.y) - (location1.y));
        var sx = 1, sy = 1, e2;
        var error = dx - dy;
        if (location1.x > location2.x)
            sx = -1;
        if (location1.y > location2.y)
            sy = -1;
        while (true) {
           this. drawPixel(location1);
           
            if (location1.x == location2.x && location1.y == location2.y)
                break;
            e2 = error * 2;
            if (e2 > -dy) {
                error -= dy;
                location1.x += sx;
            }
            if (e2 < dx) {
                error += dx;
                location1.y += sy;
            }
        }
    };
}