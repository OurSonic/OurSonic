window.ColorEditorArea = function() {
    var colorEditorArea = sonicManager.uiManager.colorEditorArea = new UiArea(650, 30, 960, 800, sonicManager.uiManager, true);
    colorEditorArea.visible = false;
    sonicManager.uiManager.UIAreas.push(colorEditorArea);


    colorEditorArea.addControl(colorEditorArea.colorEditor = new ColorEditingArea(30, 45, { width: 680, height: 680 }));
    colorEditorArea.addControl(new Button(770, 70, 150, 22, "Show Outline", sonicManager.uiManager.buttonFont, "rgb(50,150,50)", function() {
        colorEditorArea.colorEditor.editor.showOutline = !colorEditorArea.colorEditor.editor.showOutline;
    }
    ));

    colorEditorArea.addControl(new TextArea(750, 150, function () { return "Line Width:" + colorEditorArea.colorEditor.editor.lineWidth; }, sonicManager.uiManager.textFont, "Black"));

    colorEditorArea.addControl(new Button(900, 120, 14, 20, "^", sonicManager.uiManager.buttonFont, "rgb(50,150,50)", function() {
        colorEditorArea.colorEditor.editor.lineWidth = Math.max(colorEditorArea.colorEditor.editor.lineWidth + 1, 1);
    }
    ));
    colorEditorArea.addControl(new Button(900, 145, 14, 20, "v", sonicManager.uiManager.buttonFont, "rgb(50,150,50)", function() {
        colorEditorArea.colorEditor.editor.lineWidth = Math.min(colorEditorArea.colorEditor.editor.lineWidth - 1, 10);
    }
    ));
    colorEditorArea.addControl(colorEditorArea.paletteArea = new PaletteArea(770, 250, { x: 45, y: 45 }, true));
    colorEditorArea.colorEditor.paletteEditor = colorEditorArea.paletteArea;
    colorEditorArea.init = function(frame) {
        colorEditorArea.colorEditor.scale = { x: 700 / frame.width, y: 700 / frame.height };
        colorEditorArea.colorEditor.init(frame);
        colorEditorArea.paletteArea.init(frame.palette, false);
    };

};