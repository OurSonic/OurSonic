function ParallaxBG(bgLocation, scl) {
    var that = this;
    var img = bgLocation;



    this.click = function (x, y) {
        this.slots[y].rotateSpeed = x / this.width * 2;
    };


    this.onBar = function (x, y) {
        var w = 3 * scl.x;
        var cur = this.slots[y].rotateSpeed;
        if (x > ((this.width * cur / 2) - w) && x < ((this.width * cur / 2) + w)) {
            var t = { top: 0, bottom: 0 };
            for (var i = y - 1; i >= 0; i--) {
                if (this.slots[i].rotateSpeed != cur) {
                    t.top = i;
                    break;
                }
            }
            for (var i = y + 1; i < this.height; i++) {
                if (this.slots[i].rotateSpeed != cur) {
                    t.bottom = i;
                    break;
                }
            }
            return t;
        }
        return null;
    };

    this.cache = function (scale) {
        var w = (this.width * scale.x);
        var h = sonicManager.windowLocation.height * scale.y;
        var sprites = [];
        var cur = _H.defaultCanvas();
        var lastRotateSpeed = this.slots[0].rotateSpeed;
        var lastI = 0;
        var pos = { x: 0, y: 0 };
        for (var i = 0; i < this.slots.length; i++) {
            if (lastRotateSpeed != this.slots[i].rotateSpeed) {
                lastRotateSpeed = this.slots[i].rotateSpeed;
                sprites[lastI] = (_H.loadSprite(cur.canvas.toDataURL("image/png")));
                cur = _H.defaultCanvas();
                lastI = i;
            }

            var pm = { x: pos.x, y: pos.y + (i - lastI) * scale.y };
            this.slots[i].draw(cur.context, pm, scale);

        }
        sprites[lastI] = (_H.loadSprite(cur.canvas.toDataURL("image/png")));
        this.sprites = sprites;
    };

    this.init = function (scale) {

        var w = this.width;
        var h = this.height;

        this.slots = []; 
        for (var y = 0; y < h; y++) {
            this.slots[y] = new ParallaxBGSlot();
        }
        var mj = _H.defaultCanvas(w, h);

        var mh = _H.defaultCanvas(w, 1);
        mj.context.drawImage(this.sprite, 0, 0);
        for (var j = 0; j < h; j++) {
            //mh.context.clearRect(0, 0, w, 1);
            
            var pm = mj.context.getImageData(0, j, w, 1);
            mh.context.putImageData(pm, 0, 0);


            this.slots[j].sprite = (_H.loadSprite(mh.canvas.toDataURL("image/png")));
        }

        for (var y = 0; y < h; y++) {
            this.slots[y].load(scale);
        }


    };


    this.drawUI = function (canvas, pos, scale) {
        if (this.sprite && this.sprite.loaded)

            canvas.drawImage(this.sprite, pos.x, pos.y);
        if (this.slots) {
            var lastSpeed = this.slots[0].rotateSpeed;
            var lastY = 0;
            for (var i = 0; i < this.slots.length; i++) {
                if (lastSpeed == this.slots[i].rotateSpeed)
                    continue;
                var r = Math.floor(255 / 2 / lastSpeed);
                canvas.fillStyle = "rgba(" + r + ",57,43,0.4)";
                canvas.fillRect(pos.x, pos.y + lastY * scale.y, this.width * scale.x, scale.y * (i - lastY));
                canvas.strokeStyle = "rgba(" + r + ",57,43,1)";
                canvas.lineWidth = 3;
                //canvas.strokeRect(pos.x, pos.y + lastY * scale.y, this.width * scale.x, scale.y * (i - lastY));

                var w = 3 * scale.x;
                canvas.fillRect(pos.x + (this.width * lastSpeed / 2) - w, pos.y + lastY * scale.y, w * 2, scale.y * (i - lastY));
                lastY = i;
                lastSpeed = this.slots[i].rotateSpeed;

            }
            var r = Math.floor(255 / 2 / lastSpeed);
            canvas.fillStyle = "rgba(" + r + ",57,43,0.4)";
            canvas.fillRect(pos.x, pos.y + lastY * scale.y, this.width * scale.x, scale.y * (i - lastY));
            canvas.strokeStyle = "rgba(" + r + ",57,43,1)";
            canvas.lineWidth = 3;
           // canvas.strokeRect(pos.x, pos.y + lastY * scale.y, this.width * scale.x, scale.y * (i - lastY));

            var w = 3 * scale.x;
            canvas.fillStyle = "rgba(" + r + ",57,43,1)";

            canvas.fillRect(pos.x + (this.width * lastSpeed / 2) - w, pos.y + lastY * scale.y, w * 2, scale.y * (i - lastY));

        }

    };
    this.draw = function (canvas, pos, scale, offsetX) {
        var w = (this.width * scale.x);
        var h = sonicManager.windowLocation.height * scale.y;
        for (var ind in this.sprites) {
            var pm = { x: pos.x + (Math.floor(offsetX * this.slots[ind].rotateSpeed)), y: pos.y + ind * scale.y };

            if (pm.y > sonicManager.windowLocation.y * scale.y || pm.y < h + sonicManager.windowLocation.y * scale.y) {
                if (pm.x > sonicManager.windowLocation.width || pm.x + w < 0)
                    continue;
                if (this.sprite && this.sprite.loaded)
                    canvas.drawImage(this.sprite, pm.x, pm.y, this.sprite.width, this.sprite.height);
            }
        }



        /*        for (var i = 0; i < this.slots.length; i++) {
        var pm = { x: pos.x + (Math.floor(offsetX * this.slots[i].rotateSpeed)), y: pos.y + i * scale.y }; 

        if (pm.y < 0 || pm.y > h)
        continue;
        if (pm.x > sonicManager.windowLocation.width || pm.x + w < 0)
        continue;

        this.slots[i].draw(canvas, pm, scale);
        }*/


    };



    that.width = img.width;
    that.height = img.height;
/*    var data = _H.getImageData(img);
    var colors = [];
    for (var i = 0; i < img.height; i++) {
        colors[i] = [];
        colors[i].length = img.width;
    }

    for (var f = 0; f < data.length; f += 4) {
        colors[_H.floor(f / 4 / img.width)][f / 4 % img.width] = (_H.colorFromData(data, f));
    }
    that.colors = colors;
  */
    that.sprite = img;
    that.sprite.loaded = true;
    that.init(scl);
}


function ParallaxBGSlot() {
    
    this.sprite = null;
    this.rotateSpeed = 1;
    this.draw = function (canvas, pos, scale) {
        if (this.sprite && this.sprite.loaded)
            canvas.drawImage(this.sprite, pos.x, pos.y, this.sprite.width, this.sprite.height);

    };

    this.drawUI = function (canvas, pos, scale) {
        if (this.sprite && this.sprite.loaded)
            canvas.drawImage(this.sprite, pos.x, pos.y, this.sprite.width, this.sprite.height);

      /*  for (var i = 0; i < this.colors.length; i++) {
            var m = this.colors[i];
            if (m == "#000000") continue;
            canvas.fillStyle = m;
            canvas.fillRect(pos.x + (i) * scale.x, pos.y, scale.x, scale.y);
        }*/

    };
    this.load = function (scale) {/*
        var pos = { x: 0, y: 0 };
        var v = _H.defaultCanvas(scale.x * this.colors.length, scale.y);
        var canvas = v.context;
        for (var i = 0; i < this.colors.length; i++) {
            var m = this.colors[i];
            canvas.fillStyle = m;
            canvas.fillRect(pos.x + i * scale.x, pos.y, scale.x, scale.y);
        }
        var m = v.canvas.toDataURL("image/png");
        this.sprite = _H.loadSprite(m);*/
    };

}
