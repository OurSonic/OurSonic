function PieceLayoutMaker(pieceLayout) {
    this.pieceLayout = pieceLayout;

    this.lineWidth = 1;
    this.currentColor = 0;
    this.showOutline = true;
    this.showImages = false;
    this.selectedPieceIndex = 0;

    this.draw = function (canvas, pos, scale) {
        this.pieceLayout.drawUI(canvas, pos, scale, this.showOutline, this.showImages, this.selectedPieceIndex);
    };
    this.placeItem = function (position, lastPosition) {

        if (!lastPosition) {
            for (var i = 0; i < this.pieceLayout.pieces.length; i++) {
                if (position.x > this.pieceLayout.pieces[i].x - 10 &&
                    position.x < this.pieceLayout.pieces[i].x + 10 &&
                    position.y > this.pieceLayout.pieces[i].y - 10 &&
                    position.y < this.pieceLayout.pieces[i].y + 10) {
                    this.pieceLayout.pieces[i].x = position.x;
                    this.pieceLayout.pieces[i].y = position.y;
                    this.selectedPieceIndex = i;
                    break;
                }
            }
        } else {
            for (var i = 0; i < this.pieceLayout.pieces.length; i++) {
                if (lastPosition.x > this.pieceLayout.pieces[i].x - 10 &&
                    lastPosition.x < this.pieceLayout.pieces[i].x + 10 &&
                    lastPosition.y > this.pieceLayout.pieces[i].y - 10 &&
                    lastPosition.y < this.pieceLayout.pieces[i].y + 10) {
                    this.pieceLayout.pieces[i].x = position.x;
                    this.pieceLayout.pieces[i].y = position.y;
                    this.selectedPieceIndex = i;
                    break;
                }
            }
        }
        sonicManager.uiManager.objectFrameworkArea.mainPanel.updatePieces();

    };
}