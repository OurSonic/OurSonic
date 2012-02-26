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
    window.setTimeout(ff, 1000 / 60);
});


function SonicEngine(canvasName) {
    var that = this;

    this.canvas = $("#" + canvasName);
    this.canvasItem = document.getElementById(canvasName).getContext("2d");

    this.canvasWidth = 0;
    this.canvasHeight = 0;



    document.getElementById(canvasName).addEventListener('DOMMouseScroll', handleScroll, false);
    document.getElementById(canvasName).addEventListener('mousewheel', handleScroll, false);

    document.getElementById(canvasName).addEventListener('touchmove', canvasMouseMove);
    document.getElementById(canvasName).addEventListener('touchstart', canvasOnClick);
    document.getElementById(canvasName).addEventListener('touchend', canvasMouseUp);

    document.getElementById(canvasName).addEventListener('mousedown', canvasOnClick);
    document.getElementById(canvasName).addEventListener('mouseup', canvasMouseUp);
    document.getElementById(canvasName).addEventListener('mousemove', canvasMouseMove);

    $(document).keydown(doKeyDown);
    $(document).keyup(doKeyUp);


    function canvasOnClick(e) {
        e.preventDefault();
        if (sonicManager.uiManager.onClick(e)) return false;

        if (sonicManager.onClick(e)) return false;

        sonicManager.uiManager.dragger.click(e);
        return false;
    }

    function canvasMouseMove(e) {
        e.preventDefault();

        if (sonicManager.uiManager.onMouseMove(e)) return false;

        return false;
    }

    function canvasMouseUp(e) {
        e.preventDefault();
        sonicManager.uiManager.onMouseUp(e);

    }


    function handleScroll(evt) {
        evt.preventDefault();

        if (sonicManager.uiManager.onMouseScroll(evt)) return false;

        return evt.preventDefault() && false;
    };







    function doKeyDown(evt) {
        switch (evt.keyCode) {
            case 79:
                sonicManager.inHaltMode = !sonicManager.inHaltMode;
                break;
            case 80:
                if (sonicManager.inHaltMode) {
                    sonicManager.waitingForTickContinue = false; 
                }

                break;
        
            case 66:
                if (sonicManager.sonicToon)
                    sonicManager.sonicToon.hit();
                break;
            case 67:
                if (sonicManager.sonicToon)
                    sonicManager.sonicToon.debug();
                break;
            case 69:
                sonicManager.SonicLevel.curHeightMap = !sonicManager.SonicLevel.curHeightMap;
                break;
            case 70:
                sonicManager.showHeightMap = !sonicManager.showHeightMap;
                break;
            case 38:  /* Up arrow was pressed */
            case 87:  /* Up arrow was pressed */
                if (sonicManager.sonicToon)
                    sonicManager.sonicToon.pressUp();
                else {
                    sonicManager.windowLocation.y -= 128;
                }

                break;
            case 32: //space
                if (sonicManager.sonicToon)
                    sonicManager.sonicToon.pressJump();
                break;
            case 40:  /* Down arrow was pressed */
            case 83:  /* Down arrow was pressed */
                if (sonicManager.sonicToon)
                    sonicManager.sonicToon.pressCrouch();
                else {
                    sonicManager.windowLocation.y += 128;
                }
                break;
            case 37:  /* Left arrow was pressed */
            case 65:  /* Left arrow was pressed */
                sonicManager.windowLocation.x -= 128;

                if (sonicManager.sonicToon)
                    sonicManager.sonicToon.pressLeft(); else {
                    sonicManager.windowLocation.x -= 128;
                }
                break;
            case 39:  /* Right arrow was pressed */
            case 68:  /* Right arrow was pressed */
                sonicManager.windowLocation.x += 128;

                if (sonicManager.sonicToon)
                    sonicManager.sonicToon.pressRight(); else {
                    sonicManager.windowLocation.x += 128;
                }
                break;
        }
    }
    function doKeyUp(evt) {
        switch (evt.keyCode) {
            case 38:  /* Up arrow was pressed */
            case 87:  /* Up arrow was pressed */
                if (sonicManager.sonicToon)
                    sonicManager.sonicToon.releaseUp();
                break;
            case 32: //space
                if (sonicManager.sonicToon)
                    sonicManager.sonicToon.releaseJump();
                break;
            case 40:  /* Down arrow was pressed */
            case 83:  /* Down arrow was pressed */
                if (sonicManager.sonicToon)
                    sonicManager.sonicToon.releaseCrouch();

                break;
            case 37:  /* Left arrow was pressed */
            case 65:  /* Left arrow was pressed */
                if (sonicManager.sonicToon)
                    sonicManager.sonicToon.releaseLeft();
                break;
            case 39:  /* Right arrow was pressed */
            case 68:  /* Right arrow was pressed */
                if (sonicManager.sonicToon)
                    sonicManager.sonicToon.releaseRight();
                break;
        }
    }

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
        requestAnimFrame(that.draw);
        if (!sonicManager.inHaltMode)
        clear(that.canvasItem);

        sonicManager.draw(that.canvasItem);

        sonicManager.uiManager.draw(that.canvasItem);
    };


    $(window).resize(this.resizeCanvas);

    var sonicManager = window.sonicManager = new SonicManager(this.canvasItem, this.resizeCanvas);
    this.resizeCanvas();



    requestAnimFrame(that.draw);
    window.setInterval(sonicManager.tick, 1000 / 60, sonicManager);

};


