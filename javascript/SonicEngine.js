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

function Lights(canvasName) {
    var that = this;
    that.Wires = [];
    that.UIAreas = [];
    that.messages = [];
    this.canvas = $("#" + canvasName);
    this.canvasItem = document.getElementById(canvasName).getContext("2d");




    this.canvasWidth = 0;
    this.canvasHeight = 0;


    var infoArea = new UIArea(350, 60, 200, 150);
    infoArea.visible = false;
    that.UIAreas.push(infoArea);




    var area = new UIArea(40, 40, 250, 220);
    that.UIAreas.push(area);
    area.addControl(new TextArea(25, 50, "Hi", "15pt Arial bold", "blue"));
    area.addControl(new Button(50, 50, 120, 22, "New Wire", "13pt Arial bold", "rgb(50,150,50)",
        function () {
            addEmptyWire("rgb(" + Math.floor(Math.random() * 255) + "," + Math.floor(Math.random() * 255) + "," + Math.floor(Math.random() * 255) + ")");
        }));

    var intv;
    var setInfoUI = function (wire1) {
        infoArea.controls = [];
        infoArea.addControl(new TextArea(25, 50, "This wire has " + wire1.Lights.length + " lights.", "10pt Arial bold", "blue"));
        infoArea.addControl(new TextArea(25, 75, "Its color is " + wire1.color + ".", "10pt Arial bold", "blue"));

    };

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


    function addEmptyWire(color) {
        var wire;
        that.Wires.push(wire = { Lights: [], State: true, color: color });
        var btn;

        ctls.addControl(btn = new Button(0, 0, 0, 0, "Wire " + (that.Wires.length - 1), "10pt Arial", "rgb(50,190,90)", function () {
            if (infoArea.tag != wire) {
                infoArea.visible = true;
            } else
                infoArea.visible = !infoArea.visible;

            setInfoUI(wire);
            infoArea.tag = wire;


        }));
        btn.tag = wire;
    }
    addEmptyWire(randColor());


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

    function addLight(x, y, skip) {

        for (var j = 0; j < that.Wires.length; j++) {
            var g = that.Wires[j].Lights;
            for (var i = 0; i < g.length; i++) {
                if (inBounds(x, y, g[i].x, g[i].y)) {
                    if (skip) {
                        return;
                    }
                    mouseOffset = { x: x - g[i].x, y: y - g[i].y };
                    g[i].moving = true;
                    return;
                }
            }
        }

        var fc = that.Wires[that.Wires.length - 1].Lights;
        ctls.controls[ctls.controls.length - 1].text = "Wire " + that.Wires.length + " " + fc.length;
        var light;
        fc.push(light = { x: x, y: y, RopeSimulations: [] });
        if (!that.messages[0]) that.messages[0] = 0;
        that.messages[0] = that.messages[0] + 1;
        if (fc.length > 1) {
            light.RopeSimulations.push(addRopeSim({ x: fc[fc.length - 1].x, y: fc[fc.length - 1].y }, { x: fc[fc.length - 2].x, y: fc[fc.length - 2].y }, false));
            fc[fc.length - 2].RopeSimulations.push(addRopeSim({ x: fc[fc.length - 2].x, y: fc[fc.length - 2].y }, { x: fc[fc.length - 1].x, y: fc[fc.length - 1].y }, true));
        }
        else {
            light.RopeSimulations.push(null);
        }

    }
    function inBounds(x1, y1, x2, y2) {

        if (x1 > x2 - Light.W && x1 < x2 + Light.W &&
            y1 > y2 - 5 && y1 < y2 + Light.H)
            return true;
        return false;
    }
    function removeLight(x, y) {

        for (var j = 0; j < that.Wires.length; j++) {
            var nI = 0;
            var g = that.Wires[j].Lights;
            var removed = false;
            for (var i = 0; i < g.length; i++) {
                if (inBounds(x, y, g[i].x, g[i].y)) {
                    for (var k = 0; k < g[i - 1].RopeSimulations.length; k++) {
                        if (g[i].RopeSimulations[k])
                            g[i].RopeSimulations[k].remove = true;
                    }
                    if (i > 0) {
                        if (i == that.Wires[j].Lights.length - 1) {
                            g[i - 1].RopeSimulations[1].remove = true;
                            g[i - 1].RopeSimulations.splice(1, 1);
                            that.Wires[j].Lights.splice(i, 1);

                            return;
                        } else {

                            g[i - 1].RopeSimulations[1].remove = true;
                            g[i + 1].RopeSimulations[0].remove = true;


                            g[i - 1].RopeSimulations.splice(1, 1);
                            g[i].RopeSimulations.splice(0, 1);
                            nI = i;
                            removed = true;
                        }
                    } else {
                        g[i + 1].RopeSimulations[0].remove = true;
                        g[i].RopeSimulations.splice(0, 1);
                        that.Wires[j].Lights.splice(i, 1);
                        return;
                    }

                }
            }


            if (removed) {
                g[nI - 1].RopeSimulations.push(addRopeSim({ x: g[nI - 1].x, y: g[nI - 1].y }, { x: g[nI + 1].x, y: g[nI + 1].y }, true));
                g[nI + 1].RopeSimulations[0] = addRopeSim({ x: g[nI + 1].x, y: g[nI + 1].y }, { x: g[nI - 1].x, y: g[nI - 1].y }, false);

                that.Wires[j].Lights.splice(nI, 1);
                return;
            }
        }


    }

    function addRopeSim(startPos, endPos, render) {
        return new Simulation(
                15, // 80 Particles (Masses)
                0.19, // Each Particle Has A Weight Of 50 Grams
                10000.0, // springConstant In The Rope 
                1.7, // Spring Inner Friction Constant
                {x: 0, y: 9.81 * 1799 * 1 }, // Gravitational Acceleration
                0.9, // Air Friction Constant
                startPos, endPos, render);
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
            removeLight(cell.x, cell.y);

        } else {
            if (!e.button || e.button == 0) {
                addLight(cell.x, cell.y);
            }
        }

        return e.preventDefault() && false;
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
    var mouseOffset = { x: 0, y: 0 };
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


        cell.x -= mouseOffset.x;
        cell.y -= mouseOffset.y;
        for (var j = 0; j < that.Wires.length; j++) {
            var g = that.Wires[j].Lights;
            for (var i = 0; i < g.length; i++) {
                if (g[i].moving) {
                    if (i == 0) {
                        if (g[i].RopeSimulations.length > 1) {
                            g[i].RopeSimulations[1].startPos = { x: cell.x, y: cell.y };
                        }
                    } else if (i == g.length - 1) {
                        g[i].RopeSimulations[0].startPos = { x: cell.x, y: cell.y };
                        g[i - 1].RopeSimulations[1].endPos = { x: cell.x, y: cell.y };
                    }
                    else {
                        if (g[i].RopeSimulations.length > 1) {
                            g[i].RopeSimulations[1].startPos = { x: cell.x, y: cell.y };
                        }
                        g[i].RopeSimulations[0].endPos = { x: cell.x, y: cell.y };


                        g[i - 1].RopeSimulations[1].endPos = { x: cell.x, y: cell.y };
                        g[i + 1].RopeSimulations[0].startPos = { x: cell.x, y: cell.y };


                    }
                    g[i].x = cell.x;
                    g[i].y = cell.y;

                    return false;
                }
            }
        }
        return false;

    }
    function canvasMouseUp(e) {
        e.preventDefault();
        mouseOffset = { x: 0, y: 0 };

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
    var Light = { W: 17, H: 45 };

    var img = new Image();
    img.src = 'http://dested.com/spoke/assets/images/Brick.jpg';
    img.onload = function () { img.loaded = true; };



    var fps = 0, now, lastUpdate = (new Date) * 1 - 1; var fpsFilter = 50;
    var jcs = 0;

    that.draw = function () {
        requestAnimFrame(that.draw);


        //alert(stringify(img));
        if (img.loaded) {
            for (var j = 0; j < that.canvasWidth / img.width; j++) {
                for (var k = 0; k < that.canvasHeight / img.height; k++) {
                    that.canvasItem.drawImage(img, j * img.width, k * img.height, img.width, img.height);
                }
            }
        }
        //that.canvasItem.fillStyle = "lightgrey";
        //that.canvasItem.fillRect(0, 0, that.canvasWidth, that.canvasHeight);

        var ij;
        for (ij = 0; ij < that.Wires.length; ij++) {
            var wire = that.Wires[ij];
            var ic;

            for (ic = 0; ic < wire.Lights.length; ic++) {
                var light = wire.Lights[ic];

                if (light.RopeSimulations.length > 1) {
                    light.RopeSimulations[1].draw(that.canvasItem);
                }


                that.canvasItem.fillStyle = (light.moving ? "rgb(17,95,200)" : (wire.State ? wire.color : Grey));
                that.canvasItem.strokeStyle = "#FF0";


                that.canvasItem.beginPath();
                that.canvasItem.moveTo(light.x, light.y);
                that.canvasItem.bezierCurveTo(light.x - Light.W, light.y + Light.H, light.x + Light.W, light.y + Light.H, light.x + 1, light.y + 1);
                that.canvasItem.fill();
                that.canvasItem.stroke();
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
    setTimeout(that.draw, 10);


    function tick2() {

        for (var ij = 0; ij < that.Wires.length; ij++) {
            var wire = that.Wires[ij];
            wire.State = !wire.State;
        }
    }
    function tick3() {

        addLight(50 + (Math.random() * (that.canvasWidth - 100)), 50 + (Math.random() * (that.canvasHeight - 100)), true);
        if (Math.random() * 30 < 5) {
            addEmptyWire(randColor());
        }
    }
    setInterval(tick2, 1000);


};
 