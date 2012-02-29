

function UiArea(x, y, w, h, manager, closable) {
    this.x = x;
    this.y = y;
    this.manager = manager;
    this.closable = closable;
    this.width = w;
    this.height = h;
    this.depth = 0;
    this.visible = true;
    this.dragging = false;
    this.controls = [];
    this.addControl = function (control) {
        control.parent = this;
        this.controls.push(control);
        return control;
    };
    var that = this;

    if (closable) {
        this.addControl(new Button(this.width - 30, 4, 26, 23, "X", this.manager.buttonFont, "Green", function () { that.visible = false; }));
    }

    this.click = function (e) {
        if (!this.visible) return;
        for (var ij = 0; ij < this.controls.length; ij++) {
            var control = this.controls[ij];
            if (control.visible && control.y <= e.y && control.y + control.height > e.y && control.x <= e.x && control.x + control.width > e.x) {
                e.x -= control.x;
                e.y -= control.y;
                control.onClick(e);
                return false;

            }
        }
        this.dragging = { x: e.x, y: e.y };


    };

    this.mouseMove = function (e) {
        if (!this.visible) return;
        if (!this.dragging) {
            for (var ij = 0; ij < this.controls.length; ij++) {
                var control = this.controls[ij];
                if (control.visible && control.y <= e.y && control.y + control.height > e.y && control.x <= e.x && control.x + control.width > e.x) {
                    e.x -= control.x;
                    e.y -= control.y;
                    control.onMouseOver(e);
                }
            }

            return;
        }

        this.x += e.x - this.dragging.x;
        this.y += e.y - this.dragging.y;

    };
    this.mouseUp = function (e) {
        if (!this.visible) return;

        for (var ij = 0; ij < this.controls.length; ij++) {
            var control = this.controls[ij];
            control.onMouseUp({ x: e.x - control.x, y: e.y - control.y });
        }
        this.dragging = false;
    };
    this.scroll = function (e) {
        if (!this.visible) return;
        for (var ij = 0; ij < this.controls.length; ij++) {
            var control = this.controls[ij];
            if (control.visible && control.y <= e.y && control.y + control.height > e.y && control.x <= e.x && control.x + control.width > e.x) {
                if (control.onScroll) {
                    e.x -= control.x;
                    e.y -= control.y;
                    control.onScroll(e);
                    return false;
                }
            }
        }
    };
    this.cachedDrawing = null;
    this.draw = function (canv) {
        if (!this.visible) return;
        var good;
        var t;
        var j;
        if (!this.cachedDrawing) {

            var cg = document.createElement("canvas");
            cg.width = this.width + 20;
            cg.height = this.height + 20;

            var cv = cg.getContext('2d');

            var lingrad = cv.createLinearGradient(0, 0, 0, this.height);
            lingrad.addColorStop(0, 'rgba(220,220,220,0.85)');
            lingrad.addColorStop(1, 'rgba(142,142,142,0.85)');


            cv.fillStyle = lingrad;
            cv.strokeStyle = "#333";

            var _x = this.x;
            var _y = this.y;
            this.x = 10;
            this.y = 10;
            var rad = 30;
            roundRect(cv, this.x, this.y, this.width, this.height, rad, true, true);

            cv.beginPath();
            cv.moveTo(this.x, this.y + rad);
            cv.lineTo(this.x + this.width, this.y + rad);
            cv.lineWidth = 2;
            cv.strokeStyle = "#000000";
            cv.stroke();

            for (j = 0; j < this.controls.length; j++) {
                t = this.controls[j];
                good = t.forceDrawing();
                if (good.redraw)
                    t.draw(cv);
            }

            this.x = _x;
            this.y = _y;

            this.cachedDrawing = _H.loadSprite(cg.toDataURL("image/png"));
        }

        if (this.cachedDrawing.loaded) {
            canv.drawImage(this.cachedDrawing, _H.floor(this.x), _H.floor(this.y));
            if (this.cachedDrawing.width != this.width + 20 || this.cachedDrawing.height != this.height + 20)
                this.cachedDrawing = null;

            _H.save(canv);
            canv.translate(10, 10);
            for (j = 0; j < this.controls.length; j++) {
                t = this.controls[j];
                good = t.forceDrawing();
                if (!good.redraw)
                    t.draw(canv);
                if (good.clearCache)
                    this.cachedDrawing = null;
            }
            _H.restore(canv);
        } else {
            cv = canv;
            var lingrad = cv.createLinearGradient(0, 0, 0, this.height);
            lingrad.addColorStop(0, 'rgba(220,220,220,0.85)');
            lingrad.addColorStop(1, 'rgba(142,142,142,0.85)');


            cv.fillStyle = lingrad;
            cv.strokeStyle = "#333";

            var _x = this.x;
            var _y = this.y;
            this.x += 10;
            this.y += 10;
            var rad = 30;
            roundRect(cv, this.x, this.y, this.width, this.height, rad, true, true);

            cv.beginPath();
            cv.moveTo(this.x, this.y + rad);
            cv.lineTo(this.x + this.width, this.y + rad);
            cv.lineWidth = 2;
            cv.strokeStyle = "#000000";
            cv.stroke();

            for (j = 0; j < this.controls.length; j++) {
                t = this.controls[j];
                t.draw(canv);
            }

            this.x = _x;
            this.y = _y;
            _H.restore(canv);

        }

    };

    return this;
}


function TextArea(x, y, text, font, color) {
    this.forceDrawing = function () {
        if ((_H.isFunction(this.text) ? this.text() : this.text) == this.oldText) {
            return { redraw: true, clearCache: false };
        }
        this.oldText = _H.isFunction(this.text) ? this.text() : this.text;
        return { redraw: true, clearCache: true };
    };
    this.x = x;
    this.oldText = "";
    this.y = y;
    this.visible = true;
    this.text = text;
    this.font = font;
    this.color = color;
    this.parent = null;

    this.onClick = function (e) {
        return false;
    };
    this.onMouseUp = function (e) {
        if (this.mouseUp) this.mouseUp();
    };
    this.onMouseOver = function (e) {
        if (this.mouseOver) this.mouseOver();
    };

    this.draw = function (canv) {
        if (!this.visible) return;
        var text = _H.isFunction(this.text) ? this.text() : this.text;
        if (canv.font != this.font)
            canv.font = this.font;

        var w = canv.measureText(text).width;
        var h = parseInt(canv.font.split('pt')[0]);

        //   canv.fillStyle = "rgba(255,255,255,0.78)";
        var pad = 3;
        //     canv.fillRect(this.parent.x + this.x - pad, this.parent.y + this.y - h - pad, w + (pad * 2), h + (pad * 2));

        canv.fillStyle = this.color;

        canv.fillText(text, this.parent.x + this.x, this.parent.y + this.y);


    };


    return this;
};


function Button(x, y, width, height, text, font, color, click, mouseUp, mouseOver) {
    this.forceDrawing = function () {
        return { redraw: false, clearCache: false };
    };
    this.x = x;
    this.y = y;
    this.visible = true;
    this.width = width;
    this.height = height;
    this.text = text;
    this.font = font;
    this.clicking = false;
    this.click = click;
    this.mouseUp = mouseUp;
    this.mouseOver = mouseOver;
    this.color = color;
    this.parent = null;

    var created = false;

    this.button1Grad = null;
    this.button2Grad = null;
    this.buttonBorderGrad = null;

    this.onClick = function (e) {
        if (!this.visible) return;
        this.clicking = true;
    };
    this.onMouseUp = function (e) {
        if (!this.visible) return;
        if (this.clicking) {
            if (this.click) this.click();
        }
        this.clicking = false;
        if (this.mouseUp) this.mouseUp();
    };
    this.onMouseOver = function (e) {
        if (!this.visible) return;
        if (this.mouseOver) this.mouseOver();
    };
    this.draw = function (canv) {
        if (!this.visible) return;

        if (!created) {
            created = true;
            this.button1Grad = canv.createLinearGradient(0, 0, 0, 1);
            this.button1Grad.addColorStop(0, '#FFFFFF');
            this.button1Grad.addColorStop(1, '#dedede');

            this.button2Grad = canv.createLinearGradient(0, 0, 0, 1);
            this.button2Grad.addColorStop(0, '#dedede');
            this.button2Grad.addColorStop(1, '#FFFFFF');


            this.buttonBorderGrad = canv.createLinearGradient(0, 0, 0, 1);
            this.buttonBorderGrad.addColorStop(0, '#AFAFAF');
            this.buttonBorderGrad.addColorStop(1, '#7a7a7a');

        }

        canv.strokeStyle = this.buttonBorderGrad;
        canv.fillStyle = this.clicking ? this.button1Grad : this.button2Grad;
        canv.lineWidth = 2;
        roundRect(canv, this.parent.x + this.x, this.parent.y + this.y, this.width, this.height, 2, true, true);
        if (canv.font != this.font)
            canv.font = this.font;
        canv.fillStyle = "#000000";

        canv.fillText(this.text, this.parent.x + this.x + ((this.width / 2) - (canv.measureText(this.text).width / 2)), this.parent.y + this.y + (this.height / 3) * 2);
    };
    return this;
}
function ColorEditingArea(x, y, scale) {
    this.forceDrawing = function () {
        return { redraw: false, clearCache: false };
    };
    this.imageSize = { x: 64, y: 64 };
    this.lastPosition = null;
    this.x = x;
    this.y = y;
    this.visible = true;
    this.scale = scale;
    this.width = scale.x * this.imageSize.x;
    this.height = scale.y * this.imageSize.y;
    this.clicking = false;
    this.editor = new Editor(this.imageSize);
    this.parent = null;
    this.onClick = function (e) {
        if (!this.visible) return;
        this.clicking = true;
        this.clickHandled = false;
        this.lastPosition = { x: e.x, y: e.y };
        this.editor.drawPixel({ x: e.x, y: e.y }, this.scale);

    };
    this.onMouseUp = function (e) {
        if (!this.visible) return;

        if (this.tilePiece && this.clicking && !this.clickHandled) {
            this.tilePiece.click(_H.floor(e.x / scale.x), _H.floor(e.y / scale.y), this.state);
        }
        this.lastPosition = null;
        this.clickHandled = false;
        this.clicking = false;
    };
    this.clickHandled = false;
    this.onMouseOver = function (e) {
        if (!this.editor) return;  
        if (this.clicking) {
            this.clickHandled = true;
            this.editor.drawLine({ x: e.x, y: e.y }, this.lastPosition, this.scale);
            this.lastPosition = { x: e.x, y: e.y };
            
        } 
    };
    this.draw = function (canv) {
        if (!this.visible) return;
        if (!this.editor) return; 
        var pos = { x: this.parent.x + this.x, y: this.parent.y + this.y };
        
        this.editor.draw(canv, pos, this.scale);

    };
    return this;
}


function TilePieceArea(x, y, scale, tilePiece, state) {
    this.forceDrawing = function () {
        return { redraw: false, clearCache: false };
    };
    this.x = x;
    this.y = y;
    this.visible = true;
    this.scale = scale;
    this.width = scale.x * 16;
    this.height = scale.y * 17;
    this.clicking = false;
    this.tilePiece = tilePiece;
    this.parent = null;
    this.state = state;
    this.onClick = function (e) {
        if (!this.visible) return;
        this.clicking = true;
        this.clickHandled = false;
    };
    this.onMouseUp = function (e) {
        if (!this.visible) return;

        if (this.tilePiece && this.clicking && !this.clickHandled) {
            this.tilePiece.click(_H.floor(e.x / scale.x), _H.floor(e.y / scale.y), this.state);
        }
        this.clickHandled = false;
        this.clicking = false;
    };
    this.clickHandled = false;
    this.onMouseOver = function (e) {
        if (!this.tilePiece) return;
        if (this.clicking) {
            this.clickHandled = true;
            this.tilePiece.click(_H.floor(e.x / scale.x), _H.floor(e.y / scale.y), this.state);
        }
        else
            this.tilePiece.mouseOver(_H.floor(e.x / scale.x), _H.floor(e.y / scale.y));
    };
    this.draw = function (canv) {
        if (!this.visible) return;
        if (!this.tilePiece) return;
        this.tilePiece.tag = true;
        if (!this.tpc) return;
        var pos = { x: this.parent.x + this.x, y: this.parent.y + this.y };
        this.tilePiece.drawUI(canv, pos, this.scale, this.tpc.XFlip, this.tpc.YFlip);
        if (sonicManager.showHeightMap) {

            var jc = (sonicManager.SonicLevel.curHeightMap ? sonicManager.SonicLevel.CollisionIndexes1 : sonicManager.SonicLevel.CollisionIndexes2);
            var hm = sonicManager.SonicLevel.HeightMaps[jc[this.tpc.Block]];
            if (hm != 0 && hm != 1) {
                hm.drawUI(canv, pos, this.scale, 0, this.tpc.XFlip, this.tpc.YFlip, sonicManager.SonicLevel.curHeightMap ? this.tpc.Solid1 : this.tpc.Solid2, sonicManager.SonicLevel.Angles[jc[this.tpc.Block]]);
            }
        }
        this.tilePiece.tag = false;

    };
    return this;
}
function TileBGEditArea(x, y, parallaxBG) {
    this.forceDrawing = function () {
        return { redraw: false, clearCache: false };
    };
    this.x = x;
    this.y = y;
    this.visible = true;
    this.clicking = false;
    this.parallaxBG = parallaxBG;
    this.parent = null;
    this.lowestClickedY = -1;
    this.highestClickedY = -1;
    this.onClick = function (e) {
        if (!this.visible) return;
        this.clicking = true;
        this.parallaxBG = sonicManager.background;

        if (e.x > 0 && e.y > 0 && e.y < this.parallaxBG.height && e.x < this.parallaxBG.width) {
            var bar;
            if ((bar = this.parallaxBG.onBar(e.x, e.y))) {
                this.lowestClickedY = bar.top;
                this.highestClickedY = bar.bottom;
            } else {
                this.lowestClickedY = e.y;
                this.highestClickedY = e.y;
            }

        }
        this.clickHandled = false;
    };
    this.onMouseUp = function (e) {
        if (!this.visible) return;

        this.parallaxBG = sonicManager.background;
        this.highestClickedY = -1;
        this.lowestClickedY = -1;

        this.clickHandled = false;
        this.clicking = false;
    };
    this.clickHandled = false;
    this.onMouseOver = function (e) {
        if (!this.clicking) return;
        this.parallaxBG = sonicManager.background;
        if (e.x > 0 && e.y > 0 && e.y < this.parallaxBG.height && e.x < this.parallaxBG.width) {
            if (e.y > this.highestClickedY) this.highestClickedY = e.y;
            if (e.y < this.lowestClickedY) this.lowestClickedY = e.y;
            for (var i = this.lowestClickedY; i < this.highestClickedY; i++) {
                this.parallaxBG.click(e.x, i);
            }
        }
        return false;
    };
    this.draw = function (canv) {
        if (!this.visible) return;

        this.parallaxBG = sonicManager.background;
        if (!this.parallaxBG) return;

        this.width = this.parallaxBG.width;
        this.height = this.parallaxBG.height;
        this.parent.width = this.width + 70;
        this.parent.height = this.height + 50;

        var scale = { x: 1, y: 1 };
        this.parallaxBG.drawUI(canv, { x: this.parent.x + this.x, y: this.parent.y + this.y }, scale);


    };
    return this;
}

function TileChunkArea(x, y, scale, tileChunk, state) {
    this.forceDrawing = function () {
        return { redraw: false, clearCache: false };
    };
    this.x = x;
    this.y = y;
    this.visible = true;
    this.scale = scale;
    this.width = scale.x * 128;
    this.height = scale.y * 128;
    this.clicking = false;
    this.tileChunk = tileChunk;
    this.parent = null;
    this.state = state;
    this.setToTile = null;
    this.onClick = function (e) {
        if (!this.visible) return;
        this.clicking = true;
    };
    this.onMouseUp = function (e) {
        if (!this.visible) return;

        if (this.clicking) {
            if (this.setToTile != null) {
                this.tileChunk.tilePieces[((_H.floor(e.x / this.scale.x / 16)))][(_H.floor(e.y / this.scale.y / 16))] = sonicManager.SonicLevel.Blocks.indexOf(this.setToTile);
                this.tileChunk.sprites = [];
            }
        }
        this.clickHandled = false;
        this.clicking = false;
    };
    this.clickHandled = false;
    this.onMouseOver = function (e) {
        if (this.clicking) {

        }
    };
    this.draw = function (canv) {
        if (!this.visible) return;
        if (!this.tileChunk) return;
        this.tileChunk.draw(canv, { x: this.parent.x + this.x, y: this.parent.y + this.y }, this.scale, true);
    };
    return this;
};
function ScrollBox(x, y, itemHeight, visibleItems, itemWidth, backColor, controls) {
    this.forceDrawing = function () {
        return { redraw: false, clearCache: false };
    };
    this.x = x;
    this.y = y;
    this.itemWidth = itemWidth;
    this.visible = true;
    var scrollWidth = 14;
    this.width = itemWidth + scrollWidth;
    this.visibleItems = visibleItems;
    this.itemHeight = itemHeight;
    this.backColor = backColor;

    var jHeight = 5;
    this.height = visibleItems * (itemHeight + jHeight);
    this.parent = null;
    this.scrollOffset = 0;
    this.scrollPosition = 0;
    this.dragging = false;

    if (controls)
        this.controls = controls;
    else
        this.controls = [];

    this.scrolling = false;
    this.addControl = function (control) {
        control.parent = this;
        this.controls.push(control);
        return control;
    };



    this.onClick = function (e) {
        if (!this.visible) return;
        for (var ij = this.scrollOffset; ij < this.controls.length; ij++) {
            var control = this.controls[ij];
            if (control.y <= e.y && control.y + control.height > e.y && control.x <= e.x && control.x + control.width > e.x) {
                e.x -= control.x;
                e.y -= control.y;
                control.onClick(e);
                return false;

            }
        }


        if (e.x > this.itemWidth && e.x < this.itemWidth + scrollWidth) {

            var height = this.visibleItems * (this.itemHeight + jHeight) - 2;
            this.scrollOffset = _H.floor((e.y / height) * (this.controls.length - this.visibleItems));

/*            if (this.scrollPosition > e.y) {
                if (this.scrollOffset > 0) {
                    this.scrollOffset--;
                }
            } else {
                if (this.scrollOffset < this.controls.length - this.visibleItems) {
                    this.scrollOffset++;
                }
            }*/
        }
        this.dragging = true;

        return false;
    };
    this.onMouseUp = function (e) {
        if (!this.visible) return;
        this.dragging = false;

        for (var ij = this.scrollOffset; ij < this.controls.length; ij++) {
            var control = this.controls[ij];
            if (control.y <= e.y && control.y + control.height > e.y && control.x <= e.x && control.x + control.width > e.x) {
                e.x -= control.x;
                e.y -= control.y;
                control.onMouseUp(e);
                return false;

            }
        }

        if (this.mouseUp) this.mouseUp();
    };
    this.onMouseOver = function (e) {
        if (!this.visible) return;
        for (var ij = 0; ij < this.controls.length; ij++) {
            var control = this.controls[ij];
            if (control.y <= e.y && control.y + control.height > e.y && control.x <= e.x && control.x + control.width > e.x) {
                e.x -= control.x;
                e.y -= control.y;
                control.onMouseOver(e);
                break;

            }
        }
        if (this.dragging && e.x > this.itemWidth && e.x < this.itemWidth + scrollWidth) {
            var height = this.visibleItems * (this.itemHeight + jHeight) - 2;
            this.scrollOffset = _H.floor((e.y / height) * (this.controls.length-this.visibleItems));

            /*            if (this.scrollPosition > e.y) {
            if (this.scrollOffset > 0) {
            this.scrollOffset--;
            }
            } else {
            if (this.scrollOffset < this.controls.length - this.visibleItems) {
            this.scrollOffset++;
            }
            }*/
        }
        if (this.mouseOver) this.mouseOver();
    };
    this.onScroll = function (e) {
        if (!this.visible) return;
        if (e.delta > 0) {
            if (this.scrollOffset > 0) {
                this.scrollOffset--;
            }
        } else {
            if (this.scrollOffset < this.controls.length - this.visibleItems) {
                this.scrollOffset++;
            }
        }
        for (var ij = 0; ij < this.controls.length; ij++) {
            var control = this.controls[ij];
            if (control.y <= e.y && control.y + control.height > e.y && control.x <= e.x && control.x + control.width > e.x) {
                e.x -= control.x;
                e.y -= control.y;
                if (control.onScroll)
                    control.onScroll(e);
                return false;

            }
        }
        if (this.scroll) this.scroll();
    };

    this.draw = function (canv) {
        if (!this.visible) return;
        canv.fillStyle = this.backColor;

        var i;
        var height = this.visibleItems * (this.itemHeight + jHeight) - 2;

        canv.fillStyle = this.backColor;
        canv.lineWidth = 1;
        canv.strokeStyle = "#333";
        roundRect(canv, this.parent.x + this.x, this.parent.y + this.y, this.itemWidth + scrollWidth + 6, this.visibleItems * (this.itemHeight + jHeight), 3, true, true);

        canv.fillStyle = "grey";
        canv.lineWidth = 1;
        canv.strokeStyle = "#444";
        canv.fillRect(this.parent.x + this.x + this.itemWidth + 2 + 2, this.parent.y + this.y + 2, scrollWidth, height);

        canv.fillStyle = "FFDDFF";
        canv.lineWidth = 1;
        canv.strokeStyle = "#FFDDFF";
        this.scrollPosition = height * this.scrollOffset / (this.controls.length - this.visibleItems);

        canv.fillRect(this.parent.x + this.x + this.itemWidth + 2 + 2 + 2, this.parent.y + this.y + 2 + (this.scrollPosition)-3, scrollWidth - 2, 5);




        var curY = 1;
        for (i = this.scrollOffset; i < Math.min(this.controls.length, this.scrollOffset + this.visibleItems); i++) {
            this.controls[i].parent = { x: this.parent.x + this.x, y: this.parent.y + this.y };
            this.controls[i].x = 2;
            this.controls[i].y = curY;
            this.controls[i].height = this.itemHeight;
            this.controls[i].width = this.itemWidth;

            curY += this.itemHeight + jHeight;
            this.controls[i].draw(canv);
        }



    };
    return this;
};




function roundRect(ctx, x, y, width, height, radius, fill, stroke) {
    if (typeof stroke == "undefined") {
        stroke = true;
    }
    if (typeof radius === "undefined") {
        radius = 5;
    }
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.lineTo(x + width , y);
    //ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
    ctx.lineTo(x + width, y + height);
    // ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
    ctx.lineTo(x, y + height);
    // ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
    ctx.lineTo(x, y + radius);
    ctx.quadraticCurveTo(x, y, x + radius, y);
    ctx.closePath();
    if (stroke) {
        ctx.stroke();
    }
    if (fill) {
        ctx.fill();
    }
}