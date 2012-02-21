

function UiArea(x, y, w, h,manager,closable) {
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
        this.addControl(new Button(this.width - 30, 4, 26, 26, "X", this.manager.buttonFont, "Green", function () { that.visible = false; }));
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


            cv.fillStyle = "rgba(133,133,133,0.6)";
            cv.lineWidth = 9;
            cv.strokeStyle = "#333";

            var _x = this.x;
            var _y = this.y;
            this.x = 10;
            this.y = 10;
            roundRect(cv, this.x, this.y, this.width, this.height, 5, true, true);
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
            canv.fillStyle = "rgba(133,133,133,0.6)";
            canv.lineWidth = 9;
            canv.strokeStyle = "#333";
            _H.save(canv);
            canv.translate(10, 10);
            roundRect(canv, this.x, this.y, this.width, this.height, 5, true, true);

            for (j = 0; j < this.controls.length; j++) {
                t = this.controls[j];
                t.draw(canv);
            }
            _H.restore(canv);

        }

    };

    return this;
}


function TextArea(x, y, text, font, color) {
    this.forceDrawing = function () {
        if ((_H.isFunction(this.text) ? this.text() : this.text )== this.oldText) {
            return {redraw:true,clearCache:false};
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

        canv.strokeStyle = this.color;
        canv.shadowColor = "#FFF";
        canv.shadowBlur = 20;
        canv.lineWidth = 1.5;
        
        canv.strokeText(text, this.parent.x + this.x, this.parent.y + this.y);
        canv.strokeText(text, this.parent.x + this.x, this.parent.y + this.y);
        canv.strokeText(text, this.parent.x + this.x, this.parent.y + this.y);
        canv.strokeText(text, this.parent.x + this.x, this.parent.y + this.y);
        canv.strokeText(text, this.parent.x + this.x, this.parent.y + this.y);
        canv.shadowBlur = 0;

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
        canv.fillStyle = this.color;
        canv.strokeStyle = "#DAC333";
        canv.lineWidth = 2;
        roundRect(canv, this.parent.x + this.x, this.parent.y + this.y, this.width, this.height, 5, true, true);
        canv.fillStyle = this.clicking ? "#FCA" : "#334";
        if (canv.font != this.font)
            canv.font = this.font;

        canv.fillText(this.text, this.parent.x + this.x + ((this.width / 2) - (canv.measureText(this.text).width / 2)), this.parent.y + this.y + (this.height / 3) * 2);
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
        var pos = { x: this.parent.x + this.x, y: this.parent.y + this.y };
        this.tilePiece.drawUI(canv, pos, this.scale, this.tpc.XFlip, this.tpc.YFlip);
        if (sonicManager.showHeightMap) {

            var jc = (this.SonicLevel.curHeightMap ? sonicManager.SonicLevel.CollisionIndexes1 : sonicManager.SonicLevel.CollisionIndexes2);
            var hm = sonicManager.SonicLevel.HeightMaps[jc[this.tpc.Block]]; 
            if (hm != 0 && hm != 1) {
                hm.drawUI(canv, pos, this.scale, 0, this.tpc.XFlip, this.tpc.YFlip, this.tpc.Solid1);
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

function TileChunkArea(x, y, scale, tileChunk,state) {
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

    this.height = visibleItems * itemHeight;
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
            if (this.scrollPosition > e.y) {
                if (this.scrollOffset > 0) {
                    this.scrollOffset--;
                }
            } else {
                if (this.scrollOffset < this.controls.length - this.visibleItems) {
                    this.scrollOffset++;
                }
            }
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
            if (this.scrollPosition > e.y) {
                if (this.scrollOffset > 0) {
                    this.scrollOffset--;
                }
            } else {
                if (this.scrollOffset < this.controls.length - this.visibleItems) {
                    this.scrollOffset++;
                }
            }
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


        canv.fillStyle = this.backColor;
        canv.lineWidth = 1;
        canv.strokeStyle = "#333";
        roundRect(canv, this.parent.x + this.x, this.parent.y + this.y, this.itemWidth + scrollWidth + 6, this.visibleItems * this.itemHeight, 3, true, true);

        canv.fillStyle = "grey";
        canv.lineWidth = 1;
        canv.strokeStyle = "#444";
        canv.fillRect(this.parent.x + this.x + this.itemWidth + 2 + 2, this.parent.y + this.y + 2, scrollWidth, this.visibleItems * this.itemHeight - 2);

        canv.fillStyle = "red";
        canv.lineWidth = 1;
        canv.strokeStyle = "#444";
        this.scrollPosition = (this.visibleItems * this.itemHeight - 2) * this.scrollOffset / this.controls.length;

        canv.fillRect(this.parent.x + this.x + this.itemWidth + 2 + 2 + 2, this.parent.y + this.y + 2 + (this.scrollPosition), scrollWidth - 2, 5);




        var curY = 1;
        for (i = this.scrollOffset; i < Math.min(this.controls.length, this.scrollOffset + this.visibleItems); i++) {
            this.controls[i].parent = { x: this.parent.x + this.x, y: this.parent.y + this.y };
            this.controls[i].x = 2;
            this.controls[i].y = curY;
            this.controls[i].height = this.itemHeight;
            this.controls[i].width = this.itemWidth;

            curY += this.itemHeight;
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
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.lineTo(x + width - radius, y);
    ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
    ctx.lineTo(x + width, y + height - radius);
    ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
    ctx.lineTo(x + radius, y + height);
    ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
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