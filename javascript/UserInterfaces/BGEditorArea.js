window.BGEditorArea = function() {
    var bgEditor = sonicManager.uiManager.bgEditor = new UiArea(100, 440, 420, 360, sonicManager.uiManager, true);
    bgEditor.visible = false;
    sonicManager.uiManager.UIAreas.push(bgEditor);
    bgEditor.addControl(new TextArea(30, 25, "BG Editor", sonicManager.uiManager.textFont, "blue"));
    bgEditor.addControl(new TileBGEditArea(60, 35));
};