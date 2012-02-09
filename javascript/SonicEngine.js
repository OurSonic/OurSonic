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



    var sonicManager = window.sonicManager = new SonicManager(this.canvasItem);

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
            case 66:
                if (sonicManager.sonicToon)
                    sonicManager.sonicToon.hit();
                break;
            case 67:
                if (sonicManager.sonicToon)
                    sonicManager.sonicToon.debug();
                break;
            case 68:
                sonicManager.SonicLevel.curHeightMap = !sonicManager.SonicLevel.curHeightMap;
                break;
            case 38:  /* Up arrow was pressed */
            case 87:  /* Up arrow was pressed */
                if (sonicManager.sonicToon)
                    sonicManager.sonicToon.pressJump();
                else {
                    sonicManager.windowLocation.y -= 128;
                }

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

        that.canvas.attr("width", that.canvasWidth);
        that.canvas.attr("height", that.canvasHeight);
    };

    function clear(ctx) {
        ctx.clearRect(0, 0, that.canvasWidth, that.canvasHeight);
    }

    that.draw = function () {
        requestAnimFrame(that.draw);
        clear(that.canvasItem);

        sonicManager.draw(that.canvasItem);

        sonicManager.uiManager.draw(that.canvasItem);
    };


    $(window).resize(this.resizeCanvas);
    this.resizeCanvas();

    requestAnimFrame(that.draw);
    window.setInterval(sonicManager.tick, 1000 / 60, sonicManager);

};


