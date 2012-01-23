var DEBUGs = false;


window.requestAnimFrame = (function (ff) {
    /*
    if (window.requestAnimationFrame)
    return window.requestAnimationFrame(ff);
    if (window.webkitRequestAnimationFrame)
    return window.webkitRequestAnimationFrame(ff);
    if (window.mozRequestAnimationFrame)
    return window.mozRequestAnimationFrame(ff);
    if (window.oRequestAnimationFrame)
    return window.oRequestAnimationFrame(ff);
    if (window.msRequestAnimationFrame)
    return window.msRequestAnimationFrame(ff);*/
    window.setTimeout(ff, 1000 / 60);
});



function randColor() {
    return "rgb(" + Math.floor(Math.random() * 255) + "," + Math.floor(Math.random() * 255) + "," + Math.floor(Math.random() * 255) + ")";
}

function SonicEngine(canvasName) {
    var that = this; 
    that.UIAreas = [];
    that.messages = [];
    this.canvas = $("#" + canvasName);
    this.canvasItem = document.getElementById(canvasName).getContext("2d");
     

    this.canvasWidth = 0;
    this.canvasHeight = 0;
     

   /* var area = new UIArea(40, 40, 250, 220);
    that.UIAreas.push(area);
    area.addControl(new TextArea(25, 50, "Hi", "15pt Arial bold", "blue"));
    area.addControl(new Button(50, 50, 120, 22, "New Wire", "13pt Arial bold", "rgb(50,150,50)",
        function () {
            addEmptyWire("rgb(" + Math.floor(Math.random() * 255) + "," + Math.floor(Math.random() * 255) + "," + Math.floor(Math.random() * 255) + ")");
        }));
           var intv;
 
    area.addControl(new Button(30, 75, 180, 22, "Start Random", "13pt Arial bold", "rgb(50,150,50)",
        function () {
            if (this.text == "Start Random") {
                this.text = "Stop Random";
                intv = setInterval(tick3, 10);
            } else {
                this.text = "Start Random";
                clearInterval(intv);
            }
        }));
    var ctls;
    
    area.addControl(ctls = new ScrollBox(30, 100, 25, 4, 100, "rgb(50,60,127)"));
        */
     
   


    function getCursorPosition(event, print) {
        if (event.targetTouches && event.targetTouches.length > 0) event = event.targetTouches[0];

        if (event.pageX != null && event.pageY != null) {

            return { x: event.pageX, y: event.pageY };
        }
        if (print) alert(stringify(event));
        if (event.x != null && event.y != null) return { x: event.x, y: event.y };
        if (print) alert(stringify(event));
        return { x: event.clientX, y: event.clientY };
    }
        

    function canvasOnClick(e) {
        e.preventDefault(); 
        var cell = getCursorPosition(e); 
        var goodArea = null;
        var are;
        var ij;
        for (ij = 0; ij < that.UIAreas.length; ij++) {
            are = that.UIAreas[ij];
            if (are.visible && are.y <= cell.y && are.y + are.height > cell.y && are.x <= cell.x && are.x + are.width > cell.x) {
                goodArea = are;
                var ec = { x: cell.x - are.x, y: cell.y - are.y };
                are.click(ec);
            }
        }

        if (goodArea) {
            for (ij = 0; ij < that.UIAreas.length; ij++) {
                are = that.UIAreas[ij];
                if (goodArea == are) {
                    are.depth = 1;
                } else are.depth = 0;
            }

            return false;

        }



        if (e.shiftKey) {
         

        } else {
            if (!e.button || e.button == 0) { 
            }
        }

        return false;
    }

    function stringify(obj, cc) {
        if (cc > 0) return "";
        if (!cc) cc = 0;
        var t = typeof (obj);
        if (t != "object" || obj === null) {
            // simple data type
            if (t == "string") obj = '"' + obj + '"';
            return String(obj);
        }
        else {
            // recurse array or object
            var n, v, json = [], arr = (obj && obj.constructor == Array);
            for (n in obj) {
                v = obj[n]; t = typeof (v);
                if (t == "string") v = '"' + v + '"';
                else if (t == "object" && v !== null) v = stringify(v, cc + 1);
                json.push((arr ? "" : '"' + n + '":') + String(v));
            }
            return (arr ? "[" : "{") + String(json) + (arr ? "]" : "}");
        }
    };
     
    function canvasMouseMove(e) {
        e.preventDefault();
        var cell = getCursorPosition(e);

        for (var ij = 0; ij < that.UIAreas.length; ij++) {
            var are = that.UIAreas[ij];
            if (are.visible && are.y <= cell.y &&
                    are.y + are.height > cell.y &&
                        are.x <= cell.x &&
                            are.x + are.width > cell.x) {
                cell = { x: cell.x - are.x, y: cell.y - are.y };

                return are.mouseMove(cell);
            }
        }

         
        return false;

    }
    function canvasMouseUp(e) {
        e.preventDefault(); 

        var cell = getCursorPosition(e, true);


        for (var j = 0; j < that.Wires.length; j++) {
            var g = that.Wires[j].Lights;
            for (var i = 0; i < g.length; i++) {
                g[i].moving = false;

            }
        }



        for (var ij = 0; ij < that.UIAreas.length; ij++) {
            var are = that.UIAreas[ij];
            var ec = { x: cell.x - are.x, y: cell.y - are.y };
            are.mouseUp(ec);
        }

    }


    var handleScroll = function (evt) {
        evt.preventDefault();
        var delta = evt.wheelDelta ? evt.wheelDelta / 40 : evt.detail ? -evt.detail : 0;


        for (var ij = 0; ij < that.UIAreas.length; ij++) {
            var are = that.UIAreas[ij];
            if (are.visible && are.y <= evt.y && are.y + are.height > evt.y && are.x <= evt.x && are.x + are.width > evt.x) {
                evt = { x: evt.x - are.x, y: evt.y - are.y, delta: delta };
                return are.scroll(evt);
            }
        }


        for (var j = 0; j < that.Wires.length; j++) {
            for (var k = 0; k < that.Wires[j].Lights.length; k++) {
                for (var l = 0; l < that.Wires[j].Lights[k].RopeSimulations.length; l++) {
                    var fc = that.Wires[j].Lights[k].RopeSimulations[l];
                    if (fc) {
                        fc.springOffset += delta > 0 ? 0.003 : -0.003;
                        if (fc.springOffset >= 0) {
                            for (var i = 0; i < fc.masses.length; i++) {
                                fc.getMass(i).applyForce({ x: 0, y: 50 });
                            }
                            fc.skipping = true;
                        } else fc.springOffset = 0;
                    }
                }
            }
        }

        return evt.preventDefault() && false;
    };


    document.getElementById(canvasName).addEventListener('DOMMouseScroll', handleScroll, false);
    document.getElementById(canvasName).addEventListener('mousewheel', handleScroll, false);

    document.getElementById(canvasName).addEventListener('touchmove', canvasMouseMove);
    document.getElementById(canvasName).addEventListener('touchstart', canvasOnClick);
    document.getElementById(canvasName).addEventListener('touchend', canvasMouseUp);

    document.getElementById(canvasName).addEventListener('mousedown', canvasOnClick);
    document.getElementById(canvasName).addEventListener('mouseup', canvasMouseUp);
    document.getElementById(canvasName).addEventListener('mousemove', canvasMouseMove);



    that.resizeCanvas = function () {
        that.canvasWidth = $(window).width();
        that.canvasHeight = $(window).height();

        that.canvas.attr("width", that.canvasWidth);
        that.canvas.attr("height", that.canvasHeight);
    };

    var Grey = "rgb(199,199,199)"; 
    
    /*var img = new Image();
    img.src = 'http://dested.com/spoke/assets/images/Brick.jpg';
    img.onload = function () { img.loaded = true; };*/
     

    var fps = 0, now, lastUpdate = (new Date) * 1 - 1; var fpsFilter = 60;
    var jcs = 0;

    that.draw = function () {
        requestAnimFrame(that.draw);  
        if (img.loaded) {
            for (var j = 0; j < that.canvasWidth / img.width; j++) {
                for (var k = 0; k < that.canvasHeight / img.height; k++) {
                    that.canvasItem.drawImage(img, j * img.width, k * img.height, img.width, img.height);
                }
            }
        }  

        var cl = JSLINQ(that.UIAreas).OrderBy(function (f) {
            return f.depth;
        });

        for (ij = 0; ij < cl.items.length; ij++) {
            var are = cl.items[ij];
            are.draw(that.canvasItem);
        }
        if (DEBUGs) {
            for (var i = 0; i < that.messages.length; i++) {
                that.canvasItem.fillText(that.messages[i], 10, 25 + i * 30);
            }


            var fcs = 1000 / ((now = new Date) - lastUpdate);
            fps += (fcs - fps) / fpsFilter;
            lastUpdate = now;
            jcs++;

            that.canvasItem.font = 'bold 10px sans-serif';
            that.canvasItem.fillText('FPS: ' + fps.toFixed(1), 4, that.canvasHeight - 4);
            that.canvasItem.fillText('ss: ' + jcs, 4, that.canvasHeight - 25); 
        } 
    };

     
    $(window).resize(this.resizeCanvas);
    this.resizeCanvas();

    requestAnimFrame(that.draw);  
      

};
 