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


function SonicEngine(canvasName) {
    var that = this;

    this.canvas = $("#" + canvasName);
    this.canvasItem = document.getElementById(canvasName).getContext("2d");

    this.canvasWidth = 0;
    this.canvasHeight = 0;

    var element = document.getElementById(canvasName);

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

    function canvasMouseMove(e) {
        e.preventDefault();
        document.body.style.cursor = "default";

        if (sonicManager.uiManager.onMouseMove(e)) return false;

        return false;
    }

    function canvasMouseUp(e) {
        e.preventDefault();
        sonicManager.uiManager.onMouseUp(e);
        return false;
    }


    function handleScroll(evt) {
        evt.preventDefault();

        if (sonicManager.uiManager.onMouseScroll(evt)) return false;

        return evt.preventDefault() && false;
    };



    KeyboardJS.bind.key("o", function () {
        if (sonicManager.sonicToon)
            sonicManager.inHaltMode = !sonicManager.inHaltMode;
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
        window.sonicManager.windowLocation = _H.defaultWindowLocation(window.sonicManager.sonicToon ? 0 : 1, that.canvasItem, window.sonicManager.scale)
        that.canvas.attr("width", that.canvasWidth);
        that.canvas.attr("height", that.canvasHeight);
    };

    function clear(ctx) {
        ctx.clearRect(0, 0, that.canvasWidth, that.canvasHeight);
    }

    that.draw = function () {
        //   requestAnimFrame(that.draw);
        //window.setTimeout(that.draw, 1000 / 30);

        if (!sonicManager.inHaltMode)
            clear(that.canvasItem);

        sonicManager.draw(that.canvasItem);

        sonicManager.uiManager.draw(that.canvasItem);
    };


    $(window).resize(this.resizeCanvas);

    var sonicManager = window.sonicManager = new SonicManager(this.canvasItem, this.resizeCanvas);
    this.resizeCanvas();



    //requestAnimFrame(that.draw);
    window.setInterval(that.draw, 1000 / 60);

    window.setInterval(function () {
        //sonicManager.tick(); 
        sonicManager.tick(); }, 1000 / 60, sonicManager);

};



 