function Ring(active) {
    this.active = active;
    this.animationIndex = 0;
    this.x = 0;
    this.y = 0;
    this.xsp = 0;
    this.ysp = 0;
    this.tickCount = 0;

    this.draw = function (canvas, pos, scale) {
        if (active) {
            this.ysp += 0.09375;
            this.x += this.xsp;
            this.y += this.ysp;

            if (this.x < sonicManager.windowLocation.x || this.y < sonicManager.windowLocation.y || this.x > sonicManager.windowLocation.x + sonicManager.windowLocation.width || this.y > sonicManager.windowLocation.y + sonicManager.windowLocation.height) {
                this.tickCount = 0xffffffff;
                return false;
            }
/*            if (sonicManager.sonicToon.checkCollisionLine(_H.floor(this.x) + 8, _H.floor(this.y) + 8, 16, 1) != -1) {
                this.ysp *= -0.75;
            }

            if (sonicManager.sonicToon.checkCollisionLine(_H.floor(this.x) - 8, _H.floor(this.y) + 8, 26, 0) != -1) {
                this.xsp *= -0.75;
            }*/

            if (sonicManager.drawTickCount > sonicManager.sonicToon.sonicLastHitTick + 64 && 
                _H.intersectRect(sonicManager.sonicToon.myRec, { x: this.x - 8 * scale.x, width:  8 *2* scale.x, y: this.y - 8 * scale.y, height: 2* 8 * scale.y })) {
                this.tickCount = 0xffffffff;
                sonicManager.sonicToon.rings++;
                return false;
            }

            this.tickCount++;
        }

        if (sonicManager.sonicToon)
            this.animationIndex = _H.floor((sonicManager.drawTickCount % ((active ? 4 : 8) * 4)) / (active ? 4 : 8));
        else this.animationIndex = 0;
        var sprites;
        if (sonicManager.SpriteCache.rings)
            sprites = sonicManager.SpriteCache.rings;
        else {
         //   alert("sprite fial");
            return;
        }
        var sps = sprites[this.animationIndex * 200 + scale.y * 100 + scale.x];
        if (!sps) {
         //   alert("sprite fail");
            return;
        }
        if (sps.loaded) {
            canvas.drawImage(sps, _H.floor((pos.x - 8) * scale.x), _H.floor((pos.y - 8) * scale.y));
        }
        else return false;

    };
}