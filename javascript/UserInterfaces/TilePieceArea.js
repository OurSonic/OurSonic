window._TilePieceArea = function () {

    var modifyTP = sonicManager.uiManager.modifyTP = new TilePieceArea(300, 160, { x: 2 * 3, y: 2 * 3 }, null, 3);

    sonicManager.uiManager.modifyTileChunkArea.addControl(modifyTP);

    sonicManager.uiManager.modifyTileChunkArea.addControl(new Button(300, 100, 25, 22, "<<", sonicManager.uiManager.buttonFont, "rgb(50,150,50)",
        function() {
            if (sonicManager.uiManager.indexes.modifyTPIndex > 0)
                sonicManager.uiManager.modifyTP.tilePiece = modifyTC.setToTile = sonicManager.SonicLevel.Blocks[--sonicManager.uiManager.indexes.modifyTPIndex];
        }));
        sonicManager.uiManager.modifyTileChunkArea.addControl(new Button(330, 100, 25, 22, ">>", sonicManager.uiManager.buttonFont, "rgb(50,150,50)",
        function() {
            if (sonicManager.uiManager.indexes.modifyTPIndex < sonicManager.SonicLevel.Blocks.length)
                sonicManager.uiManager.modifyTP.tilePiece = modifyTC.setToTile = sonicManager.SonicLevel.Blocks[++sonicManager.uiManager.indexes.modifyTPIndex];
        }));
};