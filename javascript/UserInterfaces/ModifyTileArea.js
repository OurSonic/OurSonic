window.ModifyTileArea = function() {

    var modifyTileArea = sonicManager.uiManager.modifyTileArea = new UiArea(900, 25, 400, 400, sonicManager.uiManager, true);
    modifyTileArea.visible = false;
    sonicManager.uiManager.UIAreas.push(modifyTileArea);
    modifyTileArea.addControl(new TextArea(30, 25, "Modify Tile", sonicManager.uiManager.textFont, "blue"));

};