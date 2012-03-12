window.ObjectFrameworkListArea = function () {
    var size = 40 * 4;

    var objectFrameworkListArea = sonicManager.uiManager.objectFrameworkListArea = new UiArea(90, 500, 390, 300, sonicManager.uiManager, true);
    objectFrameworkListArea.visible = true;
    sonicManager.uiManager.UIAreas.push(objectFrameworkListArea);
    objectFrameworkListArea.addControl(new TextArea(30, 25, "Object Frameworks", sonicManager.uiManager.textFont, "blue"));
    var fList;
    objectFrameworkListArea.addControl(fList = new ScrollBox(30, 90, 25, 6, 315, "rgb(50,60,127)"));
    objectFrameworkListArea.addControl(new Button(35, 50, 160, 25, "Create Framework", sonicManager.uiManager.buttonFont, "rgb(50,150,50)", function () {


        sonicManager.uiManager.objectFrameworkArea.populate(new LevelObject('SomeKey'));
        sonicManager.uiManager.objectFrameworkArea.visible = true;


    }));
    getObjects = function () {
        OurSonic.SonicLevels.getObjects(function (obj) {

            fList.controls = [];
            for (var itm in obj) {
                var name = obj[itm];
                var d;
                fList.addControl(d = new Button(0, 0, 0, 0, name, "10pt Arial", "rgb(50,190,90)", function () {

                    loadObject(this.key);
                }));
                d.key = name;

            }

        });
    };

    objectFrameworkListArea.addControl(new Button(200, 50, 160, 25, "Save Framework", sonicManager.uiManager.buttonFont, "rgb(50,150,50)", function () {

        var oldTitle = sonicManager.uiManager.curLevelName;
        sonicManager.uiManager.updateTitle("Saving Object");

        var k = sonicManager.uiManager.objectFrameworkArea.objectFramework.key;
        var o = sonicManager.uiManager.objectFrameworkArea.objectFramework.oldKey ? sonicManager.uiManager.objectFrameworkArea.objectFramework.oldKey : sonicManager.uiManager.objectFrameworkArea.objectFramework.key;
        var v = _H.stringify(sonicManager.uiManager.objectFrameworkArea.objectFramework);

        OurSonic.SonicLevels.saveObject(k, o, v, function () {
            sonicManager.uiManager.updateTitle(oldTitle);
        });

        getObjects();

    }));



    getObjects();
    var loadObject = function (name) {
        var oldTitle = sonicManager.uiManager.curLevelName;

        sonicManager.uiManager.updateTitle("Downloading Object:" + name);
        OurSonic.SonicLevels.getObject(name, function (lvl) {
            sonicManager.uiManager.updateTitle(oldTitle);
            var d = _H.extend(new LevelObject(""), jQuery.parseJSON(lvl));
            d.oldKey = name;
            for (var asset in d.assets) {
                d.assets[asset] = _H.extend(new LevelObjectAsset(""), d.assets[asset]);
                for (var frame in d.assets[asset].frames) {
                    d.assets[asset].frames[frame] = _H.extend(new LevelObjectAssetFrame(0), d.assets[asset].frames[frame]);
                }
            }
            for (var piece in d.pieces) {
                d.pieces[piece] = _H.extend(new LevelObjectPiece(""), d.pieces[piece]);
            }
            for (var pieceLayout in d.pieceLayouts) {
                d.pieceLayouts[pieceLayout] = _H.extend(new LevelObjectPieceLayout(""), d.pieceLayouts[pieceLayout]);
                for (var piece in d.pieceLayouts[pieceLayout].pieces) {
                    d.pieceLayouts[pieceLayout].pieces[piece] = _H.extend(new LevelObjectPieceLayoutPiece(0), d.pieceLayouts[pieceLayout].pieces[piece]);
                }
            }
            for (var projectile in d.projectiles) {
                d.projectiles[projectile] = _H.extend(new LevelObjectProjectile(""), d.projectiles[projectile]);
            }
            sonicManager.uiManager.objectFrameworkArea.populate(d);
            sonicManager.uiManager.objectFrameworkArea.visible = true;

        });
    };
};