window.ModifyTileChunkArea = function () {

    var modifyTileChunkArea = sonicManager.uiManager.modifyTileChunkArea = new UiArea(900, 450, 400, 400, sonicManager.uiManager, true);
    modifyTileChunkArea.visible = false;
    sonicManager.uiManager.UIAreas.push(modifyTileChunkArea);
    modifyTileChunkArea.addControl(new TextArea(30, 25, "Modify Tile Chunk", sonicManager.uiManager.textFont, "blue"));

}