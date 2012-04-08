window._H = {
    extend: function (to, from) {
        for (var prop in from) to[prop] = from[prop];
        return to;
    },
    save: function (canvas) {
        if (window.StateCount == undefined) {
            window.StateCount = 0;
        }
        window.StateCount++;
        canvas.save();
    },
    restore: function (canvas) {
        window.StateCount--;
        canvas.restore();
    },
    decodeString: function (lvl) {
        var m = lvl.indexOf('&');
        var mln = lvl.substring(0, m);
        var fcLen = parseInt(mln);
        var items = lvl.substring(m + 1, fcLen + m);
        var d = items.split('&');
        var last = lvl.substring(fcLen + m, lvl.length);
        for (var i = d.length - 1; i >= 0; i--) {
            var l = '&' + i;
            last = last.replaceAll(l, d[i]);
        }

        return last;
    }, 
    mod: function (j,n) {
        return ((j % n) + n) % n;
    },
    floor: function (f) {
        if (f > 0) {
            return ~ ~f;
        }
        return Math.floor(f);
    },
    min: function (f1, f2) {
        return f1 > f2 ? f2 : f1;
    },
    max: function (f1, f2) {
        return f1 < f2 ? f2 : f1;
    },
    xor: function (x1, x2) {
        //        return x1 || x2;
        return (x1 && !x2) || (!x1 && x2);
    },
    loadSprite: function (src, complete) {

        var sprite1 = new Image();

        sprite1.onload = function () {
            sprite1.loaded = true;
            if (complete) complete(sprite1);
        };
        sprite1.src = src;
        return sprite1;
    },
    fixAngle: function (angle) {
        var fixedAng = Math.floor((256 - angle) * 1.4062) % 360;
        var flop = 360 - fixedAng;
        return _H.degtorad(flop);
    },
    degtorad: function (angle) {
        return angle * Math.PI / 180;
    },
    sign: function (m) {
        return m == 0 ? 0 : (m < 0 ? -1 : 1);
    },
    getQueryString: function () {
        var result = {}, queryString = location.search.substring(1),
            re = /([^&=]+)=([^&]*)/g, m;

        while (m = re.exec(queryString)) {
            result[decodeURIComponent(m[1])] = decodeURIComponent(m[2]);
        }

        return result;
    },
    negateColor: function (color) {
        var r = parseInt(color.substring(0, 2), 16);
        var g = parseInt(color.substring(2, 4), 16);
        var b = parseInt(color.substring(4, 6), 16);
        var off = 1;
        r = _H.floor((255 - r) * off);
        g = _H.floor((255 - g) * off);
        b = _H.floor((255 - b) * off);
        return r.toString(16) + g.toString(16) + b.toString(16);
    },
    defaultWindowLocation: function (state, canvas, scale) {

        switch (state) {
            case 0:
                //   return { x: 0, y: 0, width: canvas.canvas.width / scale.x, height: canvas.canvas.height / scale.y, intersects: _H.intersects };
                return { x: 0, y: 0, width: 320, height: 240, intersects: _H.intersects };
            case 1:
                var x = 0;
                var y = 0;
                if (sonicManager.SonicLevel && sonicManager.SonicLevel.StartPositions && sonicManager.SonicLevel.StartPositions[0]) {
                    x = sonicManager.SonicLevel.StartPositions[0].X - 128 * 2;
                    y = sonicManager.SonicLevel.StartPositions[0].Y - 128 * 2;
                }

                return { x: x, y: y, width: canvas.canvas.width, height: canvas.canvas.height, intersects: _H.intersects };
        }
        return null;
    },
    ObjectParse: function (o) {


        switch (o.ID) {
            case 1:
                //monitor
                return new MonitorObject(o);
            case 2:
                //collision switcher
                return new CollisionSwitcherObject(o);
            case 7:
                //spring
                return new SpringObject(o);
        }
        return new LevelObject(o);
    },
    itemsGood: function (items, x, y, jy) {
        if (items[x] < 0) {
            return Math.abs(items[x]) >= y;
        }
        return items[x] >= 16 - y;
    },
    intersects: function (p) {
        if (this.x < p.x && this.x + this.width > p.x && this.y < p.y && this.y + this.height > p.y) {
            return true;
        }
        return false;
    },
    intersects2: function (that, p) {

        if (that.width == undefined || that.height == undefined || that.x == undefined || that.y == undefined || p.Y == undefined || p.X == undefined)
            alert('bad intersects');
        if (that.x < p.X && that.x + that.width > p.X &&
            that.y < p.Y && that.y + that.height > p.Y) {
            return true;
        }
        return false;
    },
    defaultCanvas: function (w, h) {

        var canvas = document.createElement("canvas");

        canvas.width = w;
        canvas.height = h;


        var ctx = canvas.getContext("2d");
        ctx.width = w;
        ctx.height = h;
        return { canvas: canvas, context: ctx };
    },
    intersectRect: function (r1, r2) {
        return !(r2.x > r1.x + r1.width ||
            r2.x + r2.width < r1.x ||
                r2.y > r1.y + r1.height ||
                    r2.y + r2.height < r1.y);
    },
    remove: function (ar, elem) {
        var match;

        while ((match = ar.indexOf(elem)) > -1) {
            ar.splice(match, 1);
        }
    },
    getShortsFromInt: function (ar, elem) {
        var match;

        while ((match = ar.indexOf(elem)) > -1) {
            ar.splice(match, 1);
        }
    },
    scaleSprite: function (sprite, scale, complete) {

        var data = _H.getImageData(sprite);
        var colors = [];
        for (var f = 0; f < data.length; f += 4) {
            colors.push(_H.colorObjectFromData(data, f));
        }
        var d = this.defaultCanvas().context.createImageData(sprite.width * scale.x, sprite.height * scale.y);
        _H.setDataFromColors(d.data, colors, scale, sprite.width, { r: 0, g: 0, b: 0 });
        return _H.loadSprite(_H.getBase64Image(d), complete);
    },
    scaleCSImage: function (image, scale, complete) {

        var df = image.bytes;
        var colors = [];
        for (var f = 0; f < df.length; f += 1) {
            colors.push(image.palette[df[f]]);
        }
        var dc = this.defaultCanvas();
        var d = dc.context.createImageData(image.width * scale.x, image.height * scale.y);
        _H.setDataFromColorsNew(d.data, colors, scale, image.width, { r: 0, g: 0, b: 0 });

        return _H.loadSprite(_H.getBase64Image(d), complete);
    },
    getCursorPosition: function (event) {
        if (event.targetTouches && event.targetTouches.length > 0) event = event.targetTouches[0];

        if (event.pageX != null && event.pageY != null) {

            return { x: event.pageX, y: event.pageY };
        }
        if (event.x != null && event.y != null) return { x: event.x, y: event.y };
        return { x: event.clientX, y: event.clientY };
    },
    colorFromData: function (data, c) {
        var r = data[c];
        var g = data[c + 1];
        var b = data[c + 2];


        var _r = r.toString(16);
        var _g = g.toString(16);
        var _b = b.toString(16);
        return "#" + (_r.length == 1 ? "0" + _r : _r)
            + (_g.length == 1 ? "0" + _g : _g)
                + (_b.length == 1 ? "0" + _b : _b);


    },
    colorObjectFromData: function (data, c) {
        var r = data[c];
        var g = data[c + 1];
        var b = data[c + 2];

        return { r: r, g: g, b: b };


    },
    parseNumber: function (dn) {
        switch (dn) {
            case '0':
                return 0;
            case '1':
                return 1;
            case '2':
                return 2;
            case '3':
                return 3;
            case '4':
                return 4;
            case '5':
                return 5;
            case '6':
                return 6;
            case '7':
                return 7;
            case '8':
                return 8;
            case '9':
                return 9;
            case 'a':
                return 10;
            case 'b':
                return 11;
            case 'c':
                return 12;
            case 'd':
                return 13;
            case 'e':
                return 14;
            case 'f':
                return 15;
            case 'g':
                return 16;
        }
        return -1;
    },
    setDataFromColors: function (data, colors, scale, width, transparent) {

        for (var i = 0; i < colors.length; i++) {
            //            alert((i % 8) * scale.x + (_H.floor(i / 8) * 16) * scale.y);
            var curX = (i % width);
            var curY = _H.floor(i / width);
            var g = colors[i];
            var isTrans = false;
            if (transparent) {
                if (g.r == transparent.r && g.g == transparent.g && g.b == transparent.b) {
                    isTrans = true;
                }
            }

            for (var j = 0; j < scale.x; j++) {
                for (var k = 0; k < scale.y; k++) {
                    var x = (curX * scale.x + j);
                    var y = (curY * scale.y + k);
                    var c = (x + y * (scale.x * width)) * 4;

                    if (isTrans) {
                        data[c + 0] = 0;
                        data[c + 1] = 0;
                        data[c + 2] = 0;
                        data[c + 3] = 0;
                        continue;

                    }


                    data[c] = g.r;
                    data[c + 1] = g.g;
                    data[c + 2] = g.b;
                    data[c + 3] = 255;


                }
            }
        }
        /*        
        var ind = 0;
        for (var c in colors) {
        var col = colors[c];
        data[ind++] = (col.r);
        data[ind++] = (col.g);
        data[ind++] = (col.b);
        data[ind++] = (255);
        return data;
        }*/

    },
    setDataFromColorsNew: function (data, colors, scale, width, transparent) {

        for (var i = 0; i < colors.length; i++) {
            //            alert((i % 8) * scale.x + (_H.floor(i / 8) * 16) * scale.y);
            var curX = (i % width);
            var curY = _H.floor(i / width);
            var g = colors[i];
            var isTrans = false;
            if (transparent) {
                if (g.r == transparent.r && g.g == transparent.g && g.b == transparent.b) {
                    isTrans = true;
                }
            }

            for (var j = 0; j < scale.x; j++) {
                for (var k = 0; k < scale.y; k++) {
                    var x = (curX * scale.x + j);
                    var y = (curY * scale.y + k);
                    var c = (x + y * (scale.x * width)) * 4;

                    if (isTrans) {
                        data[c + 0] = 0;
                        data[c + 1] = 0;
                        data[c + 2] = 0;
                        data[c + 3] = 0;
                        continue;

                    }


                    data[c] = g[0];
                    data[c + 1] = g[1];
                    data[c + 2] = g[2];
                    data[c + 3] = g[3];


                }
            }
        }
        /*        
        var ind = 0;
        for (var c in colors) {
        var col = colors[c];
        data[ind++] = (col.r);
        data[ind++] = (col.g);
        data[ind++] = (col.b);
        data[ind++] = (255);
        return data;
        }*/

    },
    getImageData: function (img) {
        var canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;
        var ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0);
        var data = ctx.getImageData(0, 0, img.width, img.height);
        return data.data;
    },
    getBase64Image: function (data) {
        // Create an empty canvas element
        var canvas = document.createElement("canvas");
        canvas.width = data.width;
        canvas.height = data.height;

        // Copy the image contents to the canvas
        var ctx = canvas.getContext("2d");
        ctx.putImageData(data, 0, 0);
        var dataURL = canvas.toDataURL("image/png");
        return dataURL;
    },
    isFunction: function (functionToCheck) {
        var getType = {};
        return functionToCheck && getType.toString.call(functionToCheck) == '[object Function]';
    },
    detect: function (s, dcs) {
        for (var j in s) {
            if (typeof (s[j]) == "object") {
                if (dcs[s[j]]) {
                    alert("circ");
                }
                dcs[s[j]] = true;
                this.detect(s[j], dcs);
            }

        }
    },
    stringify: function (obj) {


        return JSON.stringify(obj, function (key, value) {

            if (key == "imageData") return undefined;
            if (key == "oldScale") return undefined;
            if (key == "sprite") return undefined;
            if (key == "sprites") return undefined;
            if (key == "index") return undefined;
            if (key == "_style") return undefined;

            else return value;
        }).replaceAll("false", "0").replaceAll("true", "1");
    },
    sin: function (f) {

        return cos_table[(f + 0x40) & 0xFF];
    },
    cos: function (f) {
        return cos_table[(f) & 0xFF];
    },
    getName: function (obj) {
        var funcNameRegex = /function (.{1,})\(/;
        var results = (funcNameRegex).exec((obj).constructor.toString());
        return (results && results.length > 1) ? results[1] : "";
    }
};



window.cos_table = [
     1.00000, 0.99970, 0.99880, 0.99729, 0.99518, 0.99248, 0.98918, 0.98528,
     0.98079, 0.97570, 0.97003, 0.96378, 0.95694, 0.94953, 0.94154, 0.93299,
     0.92388, 0.91421, 0.90399, 0.89322, 0.88192, 0.87009, 0.85773, 0.84485,
     0.83147, 0.81758, 0.80321, 0.78835, 0.77301, 0.75721, 0.74095, 0.72425,
     0.70711, 0.68954, 0.67156, 0.65317, 0.63439, 0.61523, 0.59570, 0.57581,
     0.55557, 0.53500, 0.51410, 0.49290, 0.47140, 0.44961, 0.42755, 0.40524,
     0.38268, 0.35990, 0.33689, 0.31368, 0.29028, 0.26671, 0.24298, 0.21910,
     0.19509, 0.17096, 0.14673, 0.12241, 0.09802, 0.07356, 0.04907, 0.02454,
     0.00000, -0.02454, -0.04907, -0.07356, -0.09802, -0.12241, -0.14673, -0.17096,
    -0.19509, -0.21910, -0.24298, -0.26671, -0.29028, -0.31368, -0.33689, -0.35990,
    -0.38268, -0.40524, -0.42755, -0.44961, -0.47140, -0.49290, -0.51410, -0.53500,
    -0.55557, -0.57581, -0.59570, -0.61523, -0.63439, -0.65317, -0.67156, -0.68954,
    -0.70711, -0.72425, -0.74095, -0.75721, -0.77301, -0.78835, -0.80321, -0.81758,
    -0.83147, -0.84485, -0.85773, -0.87009, -0.88192, -0.89322, -0.90399, -0.91421,
    -0.92388, -0.93299, -0.94154, -0.94953, -0.95694, -0.96378, -0.97003, -0.97570,
    -0.98079, -0.98528, -0.98918, -0.99248, -0.99518, -0.99729, -0.99880, -0.99970,
    -1.00000, -0.99970, -0.99880, -0.99729, -0.99518, -0.99248, -0.98918, -0.98528,
    -0.98079, -0.97570, -0.97003, -0.96378, -0.95694, -0.94953, -0.94154, -0.93299,
    -0.92388, -0.91421, -0.90399, -0.89322, -0.88192, -0.87009, -0.85773, -0.84485,
    -0.83147, -0.81758, -0.80321, -0.78835, -0.77301, -0.75721, -0.74095, -0.72425,
    -0.70711, -0.68954, -0.67156, -0.65317, -0.63439, -0.61523, -0.59570, -0.57581,
    -0.55557, -0.53500, -0.51410, -0.49290, -0.47140, -0.44961, -0.42756, -0.40524,
    -0.38268, -0.35990, -0.33689, -0.31368, -0.29028, -0.26671, -0.24298, -0.21910,
    -0.19509, -0.17096, -0.14673, -0.12241, -0.09802, -0.07356, -0.04907, -0.02454,
    -0.00000, 0.02454, 0.04907, 0.07356, 0.09802, 0.12241, 0.14673, 0.17096,
     0.19509, 0.21910, 0.24298, 0.26671, 0.29028, 0.31368, 0.33689, 0.35990,
     0.38268, 0.40524, 0.42756, 0.44961, 0.47140, 0.49290, 0.51410, 0.53500,
     0.55557, 0.57581, 0.59570, 0.61523, 0.63439, 0.65317, 0.67156, 0.68954,
     0.70711, 0.72425, 0.74095, 0.75721, 0.77301, 0.78835, 0.80321, 0.81758,
     0.83147, 0.84485, 0.85773, 0.87009, 0.88192, 0.89322, 0.90399, 0.91421,
     0.92388, 0.93299, 0.94154, 0.94953, 0.95694, 0.96378, 0.97003, 0.97570,
     0.98079, 0.98528, 0.98918, 0.99248, 0.99518, 0.99729, 0.99880, 0.99970];



var base64chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'.split("");
var base64inv = {};
for (var i = 0; i < base64chars.length; i++) {
    base64inv[base64chars[i]] = i;
}
window.decodeNumeric = function (s) {
    s = s.replace(new RegExp('[^' + base64chars.join("") + '=]', 'g'), "");

    var p = (s.charAt(s.length - 1) == '=' ?
        (s.charAt(s.length - 2) == '=' ? 'AA' : 'A') : "");
    var r = [];
    s = s.substr(0, s.length - p.length) + p;

    for (var c = 0; c < s.length; c += 4) {
        var n = (base64inv[s.charAt(c)] << 18) + (base64inv[s.charAt(c + 1)] << 12) +
            (base64inv[s.charAt(c + 2)] << 6) + base64inv[s.charAt(c + 3)];

        r.push((n >>> 16) & 255);
        r.push((n >>> 8) & 255);
        r.push(n & 255);
    }
    return r.slice(0, r.length - 1);
};


window.Base64 = {
    // private property
    _keyStr: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",

    // public method for encoding
    encode: function (input) {
        var output = "";
        var chr1, chr2, chr3, enc1, enc2, enc3, enc4;
        var i = 0;

        input = Base64._utf8_encode(input);

        while (i < input.length) {

            chr1 = input.charCodeAt(i++);
            chr2 = input.charCodeAt(i++);
            chr3 = input.charCodeAt(i++);

            enc1 = chr1 >> 2;
            enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
            enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
            enc4 = chr3 & 63;

            if (isNaN(chr2)) {
                enc3 = enc4 = 64;
            } else if (isNaN(chr3)) {
                enc4 = 64;
            }

            output = output +
                this._keyStr.charAt(enc1) + this._keyStr.charAt(enc2) +
                    this._keyStr.charAt(enc3) + this._keyStr.charAt(enc4);

        }

        return output;
    },

    // public method for decoding
    decode: function (input) {
        var output = "";
        var chr1, chr2, chr3;
        var enc1, enc2, enc3, enc4;
        var i = 0;

        input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");

        while (i < input.length) {

            enc1 = this._keyStr.indexOf(input.charAt(i++));
            enc2 = this._keyStr.indexOf(input.charAt(i++));
            enc3 = this._keyStr.indexOf(input.charAt(i++));
            enc4 = this._keyStr.indexOf(input.charAt(i++));

            chr1 = (enc1 << 2) | (enc2 >> 4);
            chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
            chr3 = ((enc3 & 3) << 6) | enc4;

            output = output + String.fromCharCode(chr1);

            if (enc3 != 64) {
                output = output + String.fromCharCode(chr2);
            }
            if (enc4 != 64) {
                output = output + String.fromCharCode(chr3);
            }

        }

        output = Base64._utf8_decode(output);

        return output;

    },

    // private method for UTF-8 encoding
    _utf8_encode: function (string) {
        string = string.replace(/\r\n/g, "\n");
        var utftext = "";

        for (var n = 0; n < string.length; n++) {

            var c = string.charCodeAt(n);

            if (c < 128) {
                utftext += String.fromCharCode(c);
            } else if ((c > 127) && (c < 2048)) {
                utftext += String.fromCharCode((c >> 6) | 192);
                utftext += String.fromCharCode((c & 63) | 128);
            } else {
                utftext += String.fromCharCode((c >> 12) | 224);
                utftext += String.fromCharCode(((c >> 6) & 63) | 128);
                utftext += String.fromCharCode((c & 63) | 128);
            }

        }

        return utftext;
    },

    _utf8_decode: function (utftext) {
        var string = "";
        var i = 0;
        var c, c2, c3;

        while (i < utftext.length) {

            c = utftext.charCodeAt(i);

            if (c < 128) {
                string += String.fromCharCode(c);
                i++;
            } else if ((c > 191) && (c < 224)) {
                c2 = utftext.charCodeAt(i + 1);
                string += String.fromCharCode(((c & 31) << 6) | (c2 & 63));
                i += 2;
            } else {
                c2 = utftext.charCodeAt(i + 1);
                c3 = utftext.charCodeAt(i + 2);
                string += String.fromCharCode(((c & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63));
                i += 3;
            }

        }

        return string;
    }
};


String.prototype.replaceAll = function (str1, str2, ignore) {
    return this.replace(new RegExp(str1.replace(/([\/\,\!\\\^\$\{\}\[\]\(\)\.\*\+\?\|\<\>\-\&])/g, "\\$&"), (ignore ? "gi" : "g")), (typeof (str2) == "string") ? str2.replace(/\$/g, "$$$$") : str2);
};



function make(canvas, img, smallSize, largeSize) {
    for (var x = 0; x < largeSize; x += smallSize) {
        for (var y = 0; y < largeSize; y += smallSize) {
            canvas.drawImage(img, x, y);
        }
    }
}


window.primeList = [211, 283, 293, 307, 311, 313, 317, 331, 337, 347, 349, 353, 419, 421, 431, 433, 439, 443, 449, 457, 461, 523, 541, 547, 557, 563, 569, 659, 661, 673, 677, 683, 691, 701, 709, 859, 863, 877, 881, 883, 887, 907, 911, 919, 929, 937, 941, 947, 953, 967, 971, 977, 983, 991, 997];

 