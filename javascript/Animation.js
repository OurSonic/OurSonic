function Animation(name, images) {
    this.images = images;
    this.name = name;
    this.draw = function (canvas, x, y, scale, animationIndex) {
        canvas.save(); 
        var jv = (function (ind, imgs) {
            var dj = 0;
            for (var vm in imgs) {
                if (dj == ind)
                    return vm;
                dj++;

            }
            return null;
        })(animationIndex, this.images);
        
        canvas.drawImage(sonicManager.SpriteCache.animationSprites[animationIndex + " " + name + scale.x + scale.y],
            (x - this.images[jv].width / 2) * scale.x, (y - this.images[jv].height / 2) * scale.y);
        canvas.restore();
    };
}



function AnimationInstance(animation, x, y, tick) {
    this.x = x;
    this.y = y;
    this.xsp = 0;
    this.ysp = 0;
    this.animation = animation;
    this.animationIndex = 0;

    this.draw = function (canvas, _x, _y, scale) {
        this.animation.draw(canvas, _x + x, _y + y, scale, this.animationIndex);
    };

    this.tick = tick || function () {

    };
}