function PieceLayoutMaker(pieceLayout) {
    this.pieceLayout = pieceLayout;

    this.lineWidth = 1;
    this.currentColor = 0;
    this.showOutline = true;
    this.showImages = false;
    this.selectedPieceIndex = 0;
    this.draggingIndex = -1;
    this.zeroPosition = { x: 0, y: 0 };
    this.draw = function (canvas, pos, scale) {
        this.pieceLayout.drawUI(canvas, pos, scale, this.showOutline, this.showImages, this.selectedPieceIndex, this.zeroPosition);
    };
    this.mouseUp = function () {
        this.draggingIndex = -1;
    };
    this.setPriority = function (val) {
        this.pieceLayout.pieces[this.selectedPieceIndex].priority = val;
    };
    this.placeItem = function (position, lastPosition) {

        var goodPosition = position;
        if (lastPosition) {
            goodPosition = position;
            position = lastPosition;
        }

        for (var i = 0; i < this.pieceLayout.pieces.length; i++) {

            var j = this.pieceLayout.pieces[i];
            var piece = sonicManager.uiManager.objectFrameworkArea.objectFramework.pieces[j.pieceIndex];
            var asset = sonicManager.uiManager.objectFrameworkArea.objectFramework.assets[piece.assetIndex];
            var size = { x: 10, y: 10 };
            if (asset.frames.length > 0) {
                var frm = asset.frames[0];
                size.x = frm.width / 2 + 10;
                size.y = frm.height / 2 + 10;
            }


            if (position.x - this.zeroPosition.x > j.x - size.x &&
                    position.x - this.zeroPosition.x < j.x + size.x &&
                    position.y - this.zeroPosition.y > j.y - size.y &&
                    position.y - this.zeroPosition.y < j.y + size.y) {

                if (!(this.draggingIndex == -1 || this.draggingIndex == i))
                    continue;

                j.x = goodPosition.x - this.zeroPosition.x;
                j.y = goodPosition.y - this.zeroPosition.y;
                this.selectedPieceIndex = i;
                this.draggingIndex = i;

                var cj = sonicManager.uiManager.objectFrameworkArea.mainPanel.selectPieceScroll.controls;

                for (var ci = 0; ci < cj.length; ci++) {
                    if (ci == j.pieceIndex)
                        cj[ci].toggled = true;
                    else
                        cj[ci].toggled = false;
                }
                this.pieceLayout.update();
                return;
            }
        }

        if (lastPosition) {
            this.zeroPosition.x += goodPosition.x - lastPosition.x;
            this.zeroPosition.y += goodPosition.y - lastPosition.y;
        }

        //sonicManager.uiManager.objectFrameworkArea.mainPanel.updatePieces();

    };
}