window._H = {
    loadSprite: function (name, complete) {

        var sprite1 = new Image();

        sprite1.onload = function () {
            sprite1.loaded = true;
            if (complete) complete(sprite1);
        };
        sprite1.src = name;
        return sprite1;
    },
    defaultCanvas: function () {

        var canvas = document.createElement("canvas");
        var ctx = canvas.getContext("2d");
        return { canvas: canvas, context: ctx };
    },
    scaleSprite: function ( sprite, scale,complete) {

        var data = _H.getImageData(sprite);
        var colors = [];
        for (var f = 0; f < data.length; f += 4) {
            colors.push(new Color(data[f], data[f + 1], data[f + 2]));
        }

        var d = this.defaultCanvas().context.createImageData(sprite.width * scale.x, sprite.height * scale.y);
        _H.setDataFromColors(d.data, colors, scale, sprite.width, new Color(0, 0, 0));
        return _H.loadSprite(_H.getBase64Image(d), complete);
    },
    getCursorPosition: function (event, print) {
        if (event.targetTouches && event.targetTouches.length > 0) event = event.targetTouches[0];

        if (event.pageX != null && event.pageY != null) {

            return { x: event.pageX, y: event.pageY };
        }
        if (event.x != null && event.y != null) return { x: event.x, y: event.y };
        return { x: event.clientX, y: event.clientY };
    },
    setDataFromColors: function (data, colors, scale, width, transparent) {

        for (var i = 0; i < colors.length; i++) {
            //            alert((i % 8) * scale.x + (Math.floor(i / 8) * 16) * scale.y);
            var curX = (i % width);
            var curY = Math.floor(i / width);

            for (var j = 0; j < scale.x; j++) {
                for (var k = 0; k < scale.y; k++) {
                    var x = (curX * scale.x + j);
                    var y = (curY * scale.y + k);
                    var c = (x + y * (scale.x * width)) * 4;
                    colors[i].setData(data, c);
                    if (transparent) {
                        //alert(_H.stringify(colors[i]) + " " + _H.stringify(transparent) + " " + colors[i].equals(transparent));
                        if (colors[i].equals(transparent)) {
                            data[c + 3] = 0;
                        }
                    }
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
    stringify: function (obj, cc) {


        return JSON.stringify(obj, function (key, value) {

            if (key == "imageData") return undefined;
            if (key == "oldScale") return undefined;
            if (key == "sprite") return undefined;
            if (key == "sprites") return undefined;
            else return value;
        });

        if (cc > 0) return "";
        if (!cc) cc = 0;
        var t = typeof (obj);
        if (t != "object" || obj === null) {
            // simple data type
            if (t == "string") obj = '"' + obj + '"';
            return String(obj);
        } else {
            // recurse array or object
            var n, v, json = [], arr = (obj && obj.constructor == Array);
            for (n in obj) {
                v = obj[n];
                t = typeof (v);
                if (t == "string") v = '"' + v + '"';
                else if (t == "object" && v !== null) v = stringify(v, cc + 1);
                json.push((arr ? "" : '"' + n + '":') + String(v));
            }
            return (arr ? "[" :  "{") + String(json) + (arr ? "]" : "}");
        }
    },
    compareTiles: function (tiles, tiles2, colors) {
        var i;
        for (i = 0; i < tiles.length; i++) {
            if (tiles[i].equals(colors)) {
                return i;
            }
        }
        for (i = 0; i < tiles2.length; i++) {
            if (tiles2[i].equals(colors)) {
                return tiles.length + i;
            }
        }
        return -1;
    },

    compareTilePieces: function (tilePieces, tilePieces2, tp) {
        var i;
        for (i = 0; i < tilePieces.length; i++) {
            if (tilePieces[i].equals(tp)) {
                return i;
            }
        }
        for (i = 0; i < tilePieces2.length; i++) {
            if (tilePieces2[i].equals(tp)) {
                return tilePieces.length + i;
            }
        }
        return -1;
    }

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
            }
            else if ((c > 127) && (c < 2048)) {
                utftext += String.fromCharCode((c >> 6) | 192);
                utftext += String.fromCharCode((c & 63) | 128);
            }
            else {
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
        var c = c1 = c2 = 0;

        while (i < utftext.length) {

            c = utftext.charCodeAt(i);

            if (c < 128) {
                string += String.fromCharCode(c);
                i++;
            }
            else if ((c > 191) && (c < 224)) {
                c2 = utftext.charCodeAt(i + 1);
                string += String.fromCharCode(((c & 31) << 6) | (c2 & 63));
                i += 2;
            }
            else {
                c2 = utftext.charCodeAt(i + 1);
                c3 = utftext.charCodeAt(i + 2);
                string += String.fromCharCode(((c & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63));
                i += 3;
            }

        }

        return string;
    }}