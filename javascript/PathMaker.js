function PathMaker(path) {
    this.path = path;

    this.lineWidth = 1;
    this.currentColor = 0;
    this.showOutline = true;
    this.showImages = false;

    this.draw = function (canvas, pos, scale) {
        this.path.drawUI(canvas, pos, scale, this.showOutline, this.showImages);
    };
    this.placeItem = function (position, lastPosition) {

        if (!lastPosition) {
            for (var i = 0; i < this.path.pieces.length; i++) {
                if (position.x > this.path.pieces[i].x - 10 &&
                    position.x < this.path.pieces[i].x + 10 &&
                    position.y > this.path.pieces[i].y - 10 &&
                    position.y < this.path.pieces[i].y + 10) {
                    this.path.pieces[i].x = position.x;
                    this.path.pieces[i].y = position.y;
                    break;
                }
            }
        } else {
            for (var i = 0; i < this.path.pieces.length; i++) {
                if (lastPosition.x > this.path.pieces[i].x - 10 &&
                    lastPosition.x < this.path.pieces[i].x + 10 &&
                    lastPosition.y > this.path.pieces[i].y - 10 &&
                    lastPosition.y < this.path.pieces[i].y + 10) {
                    this.path.pieces[i].x = position.x;
                    this.path.pieces[i].y = position.y;
                    break;
                }
            }
        }

    };
}