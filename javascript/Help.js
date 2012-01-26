window._H = {
    setDataFromColors: function (data, colors, scale) {

        for (var i = 0; i < colors.length; i++) {
            //            alert((i % 8) * scale.x + (Math.floor(i / 8) * 16) * scale.y);
            var curX = (i % 8);
            var curY = Math.floor(i / 8);

            for (var j = 0; j < scale.x; j++) {
                for (var k = 0; k < scale.y; k++) {
                    var x = (curX * scale.x + j);
                    var y = (curY * scale.y + k);
                    colors[i].setData(data, (x + y * (scale.x*8)) * 4);
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
    stringify: function (obj, cc) {
        return JSON.stringify(obj);

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
            return (arr ? "[" : "{") + String(json) + (arr ? "]" : "}");
        }
    }
};
