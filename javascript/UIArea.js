﻿
var WireColor = "rgb(255,255,255)";


function UIArea(x, y, w, h) {
    this.x = x;
    this.y = y;
    this.width = w;
    this.height = h;
    this.depth = 0;
    this.visible = true;
    this.dragging = false;
    this.controls = [];
    this.addControl = function(control) {
        control.parent = this;
        this.controls.push(control);
        return control;
    };
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
        for (var ij = 0; ij < this.controls.length; ij++) {
            var control = this.controls[ij];
            if (control.visible && control.y <= e.y && control.y + control.height > e.y && control.x <= e.x && control.x + control.width > e.x) {
                e.x -= control.x;
                e.y -= control.y;
                control.onMouseOver(e);
            }
        }
        
        
        if (!this.dragging) return;
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
                    return  false;
                }
            }
        }
    };
    this.draw = function (canv) {
        if (!this.visible) return;
        canv.fillStyle = WireColor;
        canv.lineWidth = 2;
        canv.strokeStyle = "#333";
        roundRect(canv, this.x, this.y, this.width, this.height, 5, true, true);

    


         for (var j = 0; j < this.controls.length; j++) {
             var t = this.controls[j];
             t.draw(canv);

         }
    };

    return this;
}


function TextArea(x, y, text, font, color) {
    this.x = x;
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
        canv.fillStyle = this.color;
        if (canv.font != this.font)
            canv.font = this.font;
        canv.fillText(this.text, this.parent.x + this.x, this.parent.y + this.y);
    };
    return this;
};
function Button(x, y, width, height, text, font, color, click, mouseUp, mouseOver) {
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
if(this.clicking) {
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
        roundRect(canv, this.parent.x + this.x, this.parent.y + this.y, this.width, this.height, 5, true, true);
        canv.fillStyle = this.clicking ? "#FCA" : "#334";
        if (canv.font != this.font)
            canv.font = this.font;

        canv.fillText(this.text, this.parent.x + this.x + ((this.width / 2) - (canv.measureText(this.text).width / 2)), this.parent.y + this.y + (this.height / 3) * 2);
    };
    return this;
}

function TilePieceArea(x, y, scale, tilePiece) {
    this.x = x;
    this.y = y;
    this.visible = true;
    this.scale = scale;
    this.width = scale.x * 16;
    this.height = scale.y * 16;
    this.clicking = false;
    this.tilePiece = tilePiece;
    this.parent = null;
    this.state = 0;
    this.onClick = function (e) {
        if (!this.visible) return;
        this.clicking = true;
        this.clickHandled = false;
    };
    this.onMouseUp = function (e) {
        if (!this.visible) return;

        if (this.clicking && !this.clickHandled) {
            this.tilePiece.click(Math.floor(e.x / scale.x), Math.floor(e.y / scale.y), this.state);
        }
        this.clickHandled = false;
        this.clicking = false;
    };
    this.clickHandled = false;
    this.onMouseOver = function (e) {
        
        if (this.clicking) {
            this.clickHandled = true;
            this.tilePiece.click(Math.floor(e.x / scale.x), Math.floor(e.y / scale.y), this.state);
        }
        else
            this.tilePiece.mouseOver(Math.floor(e.x / scale.x), Math.floor(e.y / scale.y));
    };
    this.draw = function (canv) {
        if (!this.visible) return;
        
        this.tilePiece.draw(canv, { x: this.parent.x + this.x, y: this.parent.y + this.y }, this.scale, true);
    };
    return this;
};
function ScrollBox(x, y, itemHeight,visibleItems,itemWidth, backColor, controls) {
    this.x = x;
    this.y = y;
    this.itemWidth = itemWidth;
    this.visible = true;
    var scrollWidth = 14;
    this.width = itemWidth+scrollWidth;
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
                return false;

            }
        }
        if(this.dragging && e.x>this.itemWidth && e.x<this.itemWidth+scrollWidth) {
            if(this.scrollPosition>e.y) {
                if (this.scrollOffset > 0) {
                    this.scrollOffset--;
                }
            }else {
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