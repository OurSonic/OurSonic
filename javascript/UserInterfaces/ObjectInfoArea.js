window.ObjectInfoArea = function() {


    var objectInfoArea = sonicManager.uiManager.objectInfoArea = new UiArea(1347, 95, 250, 240, sonicManager.uiManager, true);
    objectInfoArea.visible = false;
    sonicManager.uiManager.UIAreas.push(objectInfoArea);
    objectInfoArea.addControl(new TextArea(30, 25, "Object Information", sonicManager.uiManager.textFont, "blue"));
    objectInfoArea.addControl(new Button(40, 190, 60, 22, "Framework", sonicManager.uiManager.buttonFont, "rgb(50,150,50)", function() {
        objectFrameworkArea.visible = true;
        objectFrameworkArea.objectFramework = objectFrameworkArea.object.Framwork;
    }
    ));

};