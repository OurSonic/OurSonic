window.LevelInformationArea = function () {

    sonicManager.uiManager.curLevelName = "Level Not Saved";


    var levelInformation = sonicManager.uiManager.levelInformation = new UiArea(70, 70, 460, 420, sonicManager.uiManager);
    levelInformation.visible = true;
    sonicManager.uiManager.UIAreas.push(levelInformation);
    levelInformation.addControl(new TextArea(30, 25, "Level Selector", sonicManager.uiManager.textFont, "blue"));
    levelInformation.addControl(new TextArea(30, 52, function () { return sonicManager.uiManager.curLevelName; }, sonicManager.uiManager.textFont, "black"));
   /* levelInformation.addControl(new Button(320, 70, 100, 22, "Save Level", sonicManager.uiManager.buttonFont, "rgb(50,150,50)",
        function () {
            if (sonicManager.uiManager.curLevelName) {
                OurSonic.SonicLevels.SaveLevelInformation(sonicManager.uiManager.curLevelName, Base64.encode(_H.stringify(sonicManager.SonicLevel)), function (c) {
                }, function (c) { alert("Failure: " + _H.stringify(c)); });
            } else {
                OurSonic.SonicLevels.saveLevel(Base64.encode(_H.stringify(sonicManager.SonicLevel)), function (j) {
                    addLevelToList(sonicManager.uiManager.curLevelName);
                });

            }
        }));*/

    var tb;
    levelInformation.addControl(tb = new Button(320, 105, 160, 22, "Load Empty Level", sonicManager.uiManager.buttonFont, "rgb(50,150,50)",
        function () {

            levelManagerArea.visible = true;
            loadingText.visible = true;
            var index = 0;
            var tim = function () {
                var max = 188;
                if (index == max) {
                    setTimeout(function () {
                        alert(_H.stringify(sonicManager.SonicLevel));
                        sonicManager.uiManager.loadGame(_H.stringify(sonicManager.SonicLevel), sonicManager.mainCanvas);
                        loadingText.visible = false;
                    }, 500);
                    return;
                }
                setTimeout(tim, 100);

                _H.loadSprite("assets/Chunks/Tile" + index++ + ".png", function (image) {
                    loadingText.text = "Loading " + index + "/" + max;
                    sonicManager.importChunkFromImage(image);
                    if (index == max) {
                        sonicManager.inds = { done: true };
                    }
                });

            };
            setTimeout(tim, 100);


        }));
    tb.visible = false;

    var ctls;
    levelInformation.addControl(ctls = new ScrollBox(30, 70, 25, 11, 250, "rgb(50,60,127)"));

    var curLevelName;
    OurSonic.SonicLevels.getLevels(function (lvls) {
        for (var i = 0; i < lvls.length; i++) {
            var lvlName = lvls[i];
            addLevelToList(lvlName);
        }

        var dl = _H.getQueryString();
        if (dl["level"]) {
            loadLevel(dl["level"]);
        }
    });


    function addLevelToList(name) {
        var btn;
        ctls.addControl(new Button(0, 0, 0, 0, name, "10pt Arial", "rgb(50,190,90)", function () {

            loadLevel(name);
        }));
    }

    function loadLevel(name) {
        sonicManager.uiManager.updateTitle("Downloading " + name);
        OurSonic.SonicLevels.getLevel(name, function (lvl) {
            sonicManager.uiManager.updateTitle("Loading: " + name);

            sonicManager.uiManager.loadGame(lvl, sonicManager.mainCanvas);
        });
    }
};