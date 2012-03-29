window.LevelManagerArea = function() {


    var levelManagerArea = sonicManager.uiManager.levelManagerArea = new UiArea(500, 25, 400, 400, sonicManager.uiManager);
    levelManagerArea.visible = false;
    sonicManager.uiManager.UIAreas.push(levelManagerArea);
    levelManagerArea.addControl(new TextArea(30, 25, "Level Manager", sonicManager.uiManager.textFont, "blue"));
    var loadingText;
    levelManagerArea.addControl(loadingText = new TextArea(270, 25, "Loading", sonicManager.uiManager.textFont, "green"));
    loadingText.visible = false;

    levelManagerArea.addControl(new Button(35, 100, 160, 22, "Show Height Map", sonicManager.uiManager.buttonFont, "rgb(50,150,50)", function () {
        if (this.text == "Show Height Map") {
            sonicManager.showHeightMap = true;
            this.text = "Hide Height Map";
        } else {
            sonicManager.showHeightMap = false;
            this.text = "Show Height Map";
        }
    }
    ));

    levelManagerArea.addControl(new Button(200, 150, 160, 22, "Dragging", sonicManager.uiManager.buttonFont, "rgb(50,150,50)",
        function() {

            sonicManager.clickState = (sonicManager.clickState + 1) % 4;
            switch (sonicManager.clickState) {
            case ClickState.PlaceChunk:
                this.text = "Modify Chunks";
                break;
            case ClickState.Dragging:
                this.text = "Dragging";
                break;
            case ClickState.PlaceRing:
                this.text = "Place Rings";
                break;
            case ClickState.PlaceObject:
                this.text = "Place Object";
                break;
            }

        }));

    levelManagerArea.addControl(new Button(200, 180, 160, 22, "Switch Height Map", sonicManager.uiManager.buttonFont, "rgb(50,150,50)", function() {
        sonicManager.SonicLevel.curHeightMap = !sonicManager.SonicLevel.curHeightMap;
    }
    ));

    levelManagerArea.addControl(new Button(35, 150, 160, 22, "Modify Chunks", sonicManager.uiManager.buttonFont, "rgb(50,150,50)",
        function() {
            sonicManager.uiManager. modifyTileChunkArea.visible = true;

        }));

    levelManagerArea.addControl(new Button(35, 150, 160, 22, "Modify Chunks", sonicManager.uiManager.buttonFont, "rgb(50,150,50)",
        function() {
            sonicManager.uiManager.modifyTileChunkArea.visible = true;

        }));
    levelManagerArea.addControl(new Button(35, 175, 160, 22, "Modify Tile Pieces", sonicManager.uiManager.buttonFont, "rgb(50,150,50)",
        function() {
          sonicManager.uiManager.  solidTileArea.visible = true;

        }));
    levelManagerArea.addControl(new Button(35, 200, 160, 22, "Modify Tiles", sonicManager.uiManager.buttonFont, "rgb(50,150,50)",
        function() {
            sonicManager.uiManager.modifyTileArea.visible = true;

        }));
    levelManagerArea.addControl(new Button(35, 240, 160, 22, "Modify Background", sonicManager.uiManager.buttonFont, "rgb(50,150,50)",
        function() {
            sonicManager.uiManager.bgEditor.visible = true;
        }));


    levelManagerArea.addControl(new Button(200, 35, 60, 22, "Run", sonicManager.uiManager.buttonFont, "rgb(50,150,50)",sonicManager.uiManager.runSonic));

};