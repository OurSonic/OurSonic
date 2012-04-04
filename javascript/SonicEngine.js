DEBUGs = true;


window.requestAnimFrame = (function (ff) {
    if (window.requestAnimationFrame)
        return window.requestAnimationFrame(ff);
    if (window.webkitRequestAnimationFrame)
        return window.webkitRequestAnimationFrame(ff);
    if (window.mozRequestAnimationFrame)
        return window.mozRequestAnimationFrame(ff);
    if (window.oRequestAnimationFrame)
        return window.oRequestAnimationFrame(ff);
    if (window.msRequestAnimationFrame)
        return window.msRequestAnimationFrame(ff);
    return window.setTimeout(ff, 1000 / 60);
});


function SonicEngine(gameLayer, uiLayer) {
    var that = this;
    window.Engine = this;

    this.gameCanvasItem = $("#" + gameLayer);
    this.gameCanvas = document.getElementById(gameLayer).getContext("2d");

    this.uiCanvasItem = $("#" + uiLayer);
    this.uiCanvas = document.getElementById(uiLayer).getContext("2d");

    this.canvasWidth = 0;
    this.canvasHeight = 0;

    var element = document.getElementById(uiLayer); //top layerS

    element.addEventListener('DOMMouseScroll', handleScroll, false);
    element.addEventListener('mousewheel', handleScroll, false);

    element.addEventListener('touchmove', canvasMouseMove);
    element.addEventListener('touchstart', canvasOnClick);
    element.addEventListener('touchend', canvasMouseUp);

    element.addEventListener('mousedown', canvasOnClick);
    element.addEventListener('mouseup', canvasMouseUp);
    element.addEventListener('mousemove', canvasMouseMove);

    element.addEventListener('contextmenu', function (evt) {
        evt.preventDefault();
    }, false);


    function canvasOnClick(e) {
        e.preventDefault();
        if (sonicManager.uiManager.onClick(e)) return false;

        if (sonicManager.onClick(e)) return false;

        sonicManager.uiManager.dragger.click(e);
        return false;
    }

    var lastMouseMove;
    function canvasMouseMove(e) {
        e.preventDefault();
        document.body.style.cursor = "default";
        lastMouseMove = e;
        if (sonicManager.uiManager.onMouseMove(e)) return false;

        return false;
    }

    function canvasMouseUp(e) {
        e.preventDefault();
        sonicManager.uiManager.onMouseUp(lastMouseMove);
        return false;
    }


    function handleScroll(evt) {
        evt.preventDefault();

        if (sonicManager.uiManager.onMouseScroll(evt)) return false;

        return evt.preventDefault() && false;
    };

    $(document).keypress(function (e) {
        if (!sonicManager.sonicToon) {
            sonicManager.uiManager.onKeyDown(e);
        }
    });


    KeyboardJS.bind.key("o", function () {
        if (sonicManager.sonicToon)
            sonicManager.inHaltMode = !sonicManager.inHaltMode;
    }, function () { });

    KeyboardJS.bind.key("2", function () {
        sonicManager.indexedPalette++;
        for (var block in sonicManager.SonicLevel.Blocks) {
            sonicManager.SonicLevel.Blocks[block].image = [];
        }

    }, function () { });


    KeyboardJS.bind.key("p", function () {
        if (sonicManager.sonicToon)
            if (sonicManager.inHaltMode) {
                sonicManager.waitingForTickContinue = false;
            }
    }, function () { });


    KeyboardJS.bind.key("h", function () {
        if (sonicManager.sonicToon)
            sonicManager.sonicToon.hit();
    }, function () { });


 
    KeyboardJS.bind.key("c", function () {
        if (sonicManager.sonicToon)
            sonicManager.sonicToon.debug();
    }, function () { });

    KeyboardJS.bind.key("e", function () {
        sonicManager.SonicLevel.curHeightMap = !sonicManager.SonicLevel.curHeightMap;
    }, function () { });

    KeyboardJS.bind.key("f", function () {
        sonicManager.showHeightMap = !sonicManager.showHeightMap;
    }, function () { });

    KeyboardJS.bind.key("up", function () {
        if (sonicManager.sonicToon)
            sonicManager.sonicToon.pressUp();
        else {
            sonicManager.windowLocation.y -= 128;
        }

    }, function () {
        if (sonicManager.sonicToon)
            sonicManager.sonicToon.releaseUp();
    });

    KeyboardJS.bind.key("down", function () {
        if (sonicManager.sonicToon)
            sonicManager.sonicToon.pressCrouch();
        else {
            sonicManager.windowLocation.y += 128;
        }
    }, function () {
        if (sonicManager.sonicToon)
            sonicManager.sonicToon.releaseCrouch();
    });

    KeyboardJS.bind.key("left", function () {
        if (sonicManager.sonicToon) {
            sonicManager.sonicToon.pressLeft();
        } else {
            sonicManager.windowLocation.x -= 128;
        }
    }, function () {
        if (sonicManager.sonicToon)
            sonicManager.sonicToon.releaseLeft();
    });

    KeyboardJS.bind.key("right", function () {

        if (sonicManager.sonicToon) {
            sonicManager.sonicToon.pressRight();
        } else {
            sonicManager.windowLocation.x += 128;
        }
    }, function () {
        if (sonicManager.sonicToon)
            sonicManager.sonicToon.releaseRight();
    });

    KeyboardJS.bind.key("space", function () {
        if (sonicManager.sonicToon)
            sonicManager.sonicToon.pressJump();
    }, function () {
        if (sonicManager.sonicToon)
            sonicManager.sonicToon.releaseJump();
    });

    that.resizeCanvas = function () {
        that.canvasWidth = $(window).width();
        that.canvasHeight = $(window).height();
        window.sonicManager.windowLocation = _H.defaultWindowLocation(window.sonicManager.sonicToon ? 0 : 1, that.uiCanvas, window.sonicManager.scale);

        that.gameCanvasItem.attr("width", (window.sonicManager.windowLocation.width * (window.sonicManager.sonicToon ? window.sonicManager.scale.x * window.sonicManager.realScale.x : 1)));
        that.gameCanvasItem.attr("height", (window.sonicManager.windowLocation.height * (window.sonicManager.sonicToon ? window.sonicManager.scale.y * window.sonicManager.realScale.y : 1)));
        that.uiCanvasItem.attr("width", that.canvasWidth);
        that.uiCanvasItem.attr("height", that.canvasHeight);

        that.uiCanvas.goodWidth = that.canvasWidth;
        that.gameCanvas.goodWidth = (window.sonicManager.windowLocation.width * (window.sonicManager.sonicToon ? window.sonicManager.scale.x * window.sonicManager.realScale.x : 1));

        var screenOffset = window.sonicManager.sonicToon ?
            { x: _H.floor(that.canvasWidth / 2 - window.sonicManager.windowLocation.width * window.sonicManager.scale.x * window.sonicManager.realScale.x / 2), y: _H.floor(that.canvasHeight / 2 - window.sonicManager.windowLocation.height * window.sonicManager.realScale.y * window.sonicManager.scale.y / 2)} :
            { x: 0, y: 0 };

        that.gameCanvasItem.css("left", screenOffset.x + "px");
        that.gameCanvasItem.css("top", screenOffset.y + "px");
    };

    function clear(ctx) {
        ctx.canvas.width = ctx.goodWidth;
    }

    that.gameDraw = function () {
        //   requestAnimFrame(that.draw);
        //window.setTimeout(that.draw, 1000 / 30);

        if (!sonicManager.inHaltMode) {
            clear(that.gameCanvas);
        }
        sonicManager.draw(that.gameCanvas);
    };
    that.uiDraw = function () {
        //   requestAnimFrame(that.draw);
        //window.setTimeout(that.draw, 1000 / 30);

        if (!sonicManager.inHaltMode) {
            clear(that.uiCanvas);
        }

        sonicManager.uiManager.draw(that.uiCanvas);
    };


    $(window).resize(this.resizeCanvas);

    var sonicManager = window.sonicManager = new SonicManager(that.gameCanvas, this.resizeCanvas);
    sonicManager.indexedPalette = 0;
    
    this.resizeCanvas();



    //requestAnimFrame(that.draw);
    window.setInterval(function () {
     
        that.gameDraw();
    }, 1000 / 60);
    window.setInterval(function () {

        sonicManager.tick(); 
    }, 1000 / 60);

    window.setInterval(that.uiDraw, 1000 / 20);

};



 