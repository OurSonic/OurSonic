window.DebuggerArea = function() {


    var debuggerArea = sonicManager.uiManager.debuggerArea = new UiArea(1347, 95, 250, 240, sonicManager.uiManager, true);
    debuggerArea.visible = false;
    sonicManager.uiManager.UIAreas.push(debuggerArea);
    debuggerArea.addControl(new TextArea(30, 25, "Debugger", sonicManager.uiManager.textFont, "blue"));
    debuggerArea.addControl(new Button(40, 60, 60, 22, "Stop", sonicManager.uiManager.buttonFont, "rgb(50,150,50)", function () {
        sonicManager.windowLocation = _H.defaultWindowLocation(1, sonicManager.mainCanvas, sonicManager.scale);

        sonicManager.uiManager.debuggerArea.visible = false;
        sonicManager.uiManager.solidTileArea.visible = false;
        sonicManager.uiManager.levelInformation.visible = true;
        sonicManager.uiManager.levelManagerArea.visible = true;
        sonicManager.sonicToon.empty();
        sonicManager.sonicToon = null;
    }
    ));


    debuggerArea.addControl(new Button(40, 95, 90, 22, "Hit Sonic", sonicManager.uiManager.buttonFont, "rgb(50,150,50)", function () {
        sonicManager.sonicToon.hit();
    }
    ));

    debuggerArea.addControl(new Button(40, 130, 160, 22, "Show Height Map", sonicManager.uiManager.buttonFont, "rgb(50,150,50)", function () {
        if (this.text == "Show Height Map") {
            sonicManager.showHeightMap = true;
            this.text = "Hide Height Map";
        } else {
            sonicManager.showHeightMap = false;
            this.text = "Show Height Map";
        }
    }
    ));
    debuggerArea.addControl(new Button(40, 160, 160, 22, "Switch Height Map", sonicManager.uiManager.buttonFont, "rgb(50,150,50)", function () {
        sonicManager.SonicLevel.curHeightMap = !sonicManager.SonicLevel.curHeightMap;
    }
    ));
    debuggerArea.addControl(new Button(40, 190, 160, 22, "Debug Sonic", sonicManager.uiManager.buttonFont, "rgb(50,150,50)", function() {
        if (this.text == "Debug Sonic") {
            sonicManager.sonicToon.debugging = true;
            this.text = "Normal Sonic";
        } else {
            sonicManager.sonicToon.debugging = false;
            this.text = "Debug Sonic";
        }

    }
    ));
};