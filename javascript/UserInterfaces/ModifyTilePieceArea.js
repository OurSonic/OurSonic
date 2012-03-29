window.ModifyTilePieceArea = function() {
    var modifyTilePieceArea = sonicManager.uiManager.modifyTilePieceArea = new TilePieceArea(30, 70, { x: 4 * 5, y: 4 * 5 }, null, 0);
    sonicManager.uiManager.solidTileArea.addControl(modifyTilePieceArea);
};