function UIManager(sonicManager, mainCanvas, scale) {
    this.UIAreas = [];
    this.messages = [];

    function runSonic() {
        levelManagerArea.visible = false;
        solidTileArea.visible = false;
        levelInformation.visible = false;
        modifyTileArea.visible = false;
        modifyTileChunkArea.visible = false;
        solidTileArea.visible = false;
        debuggerArea.visible = true;
        if (sonicManager.background)
            sonicManager.background.cache(sonicManager.scale);
        sonicManager.windowLocation = _H.defaultWindowLocation(0, mainCanvas, scale);
        sonicManager.sonicToon = new Sonic(sonicManager.SonicLevel, sonicManager.scale);
        sonicManager.sonicToon.obtainedRing = [];
    }

    var textFont = this.textFont = "18pt Calibri ";
    var smallTextFont = this.smallTextFont = "12pt Calibri ";
    var buttonFont = this.buttonFont = "13pt Arial bold";
    var smallButtonFont = this.smallButtonFont = "11pt Arial bold";
    mainCanvas.font = textFont;
    var indexes = this.indexes = { tpIndex: 0, modifyIndex: 0, modifyTPIndex: 0 };
    this.dragger = new Dragger(function (xsp, ysp) {
        sonicManager.windowLocation.x += xsp;
        sonicManager.windowLocation.y += ysp;
    });
    this.draw = function (canvas) {
        this.dragger.tick();

        _H.save(canvas);

        var cl = JSLINQ(this.UIAreas).OrderBy(function (f) {
            return f.depth;
        });

        for (var ij = 0; ij < cl.items.length; ij++) {
            var are = cl.items[ij];
            are.draw(canvas);
        }

        if (DEBUGs) {
            for (var i = 0; i < this.messages.length; i++) {
                canvas.fillText(this.messages[i], 10, 25 + i * 30);
            }
        }
        _H.restore(canvas);

    };

    this.onMouseScroll = function (evt) {
        var delta = evt.wheelDelta ? evt.wheelDelta / 40 : evt.detail ? -evt.detail : 0;


        for (var ij = 0; ij < this.UIAreas.length; ij++) {
            var are = this.UIAreas[ij];
            if (are.visible && are.y <= evt.y && are.y + are.height > evt.y && are.x <= evt.x && are.x + are.width > evt.x) {
                evt = {
                    x: evt.x - are.x - 10,
                    y: evt.y - are.y - 10,
                    delta: delta
                };
                return are.scroll(evt);
            }
        }
        return false;
    };
    this.onClick = function (e) {
        var cell = _H.getCursorPosition(e);
        cell.x -= 10;
        cell.y -= 10;
        var goodArea = null;
        var are;
        var ij;
        var cl = JSLINQ(this.UIAreas).OrderBy(function (f) {
            return -f.depth;
        });
        for (var ij = 0; ij < cl.items.length; ij++) {
            are = cl.items[ij];
            if (are.visible && are.y <= cell.y && are.y + are.height > cell.y && are.x <= cell.x && are.x + are.width > cell.x) {
                goodArea = are;
                var ec = { x: cell.x - are.x, y: cell.y - are.y };
                are.click(ec);
                break;
            }
        }

        if (goodArea) {
            for (ij = 0; ij < this.UIAreas.length; ij++) {
                are = this.UIAreas[ij];
                if (goodArea == are) {
                    are.depth = 1;
                    are.focus();
                } else {
                    if (are.visible) {
                        are.depth = 0;
                        are.loseFocus();
                    }
                }
            }

            return true;
        }
        return false;
    };

    this.onMouseMove = function (e) {
        if (this.dragger.isDragging()) {
            this.dragger.mouseMove(e);
            return false;
        }
        var cell = _H.getCursorPosition(e);
        cell.x -= 10;
        cell.y -= 10;

        var cl = JSLINQ(this.UIAreas).OrderBy(function (f) {
            return -f.depth;
        });

        for (var ij = 0; ij < cl.items.length; ij++) {
            var are = cl.items[ij];
            if (are.dragging || (are.visible && are.y <= cell.y &&
                are.y + are.height > cell.y &&
                    are.x <= cell.x &&
                        are.x + are.width > cell.x)) {
                cell = { x: cell.x - are.x, y: cell.y - are.y };
                return are.mouseMove(cell);

            }
        }
        this.dragger.mouseMove(e);
        return false;

    };
    this.onMouseUp = function (e) {
        var cell = _H.getCursorPosition(e, true);
        cell.x -= 10;
        cell.y -= 10;

        for (var ij = 0; ij < this.UIAreas.length; ij++) {
            var are = this.UIAreas[ij];
            var ec = { x: cell.x - are.x, y: cell.y - are.y };
            are.mouseUp(ec);
        }
        this.dragger.mouseUp(e);
    };
    this.onKeyDown = function (e) {

        for (var ij = 0; ij < this.UIAreas.length; ij++) {
            var are = this.UIAreas[ij];
            are.onKeyDown(e);
        }
    };


    var updateTitle = function (str) {
        document.title = str + " | Our Sonic";
        curLevelName = str;
    };

    var size = 40 * 4;

    var objectFrameworkArea = this.objectFrameworkArea = new UiArea(540, 75, 850, 690, this, true);
    objectFrameworkArea.visible = true;
    this.UIAreas.push(objectFrameworkArea);
    objectFrameworkArea.addControl(new TextArea(30, 25, "Object Framework", textFont, "blue"));

    objectFrameworkArea.addControl(new TextArea(45, 60, "Assets", textFont, "black"));
    objectFrameworkArea.addControl(new Button(160, 38, 140, 25, "Add Asset", buttonFont, "rgb(50,150,50)", function () {
        objectFrameworkArea.objectFramework.assets.push(new LevelObjectAsset("Asset " + (objectFrameworkArea.objectFramework.assets.length + 1)));
        objectFrameworkArea.populate(objectFrameworkArea.objectFramework);
    }));
    objectFrameworkArea.addControl(objectFrameworkArea.assets = new ScrollBox(30, 60 + 10, 25, 4, 250, "rgb(50,60,127)"));


    objectFrameworkArea.addControl(new TextArea(45, 60 + (size * 1), "Pieces", textFont, "black"));
    objectFrameworkArea.addControl(new Button(160, 38 + (size * 1), 140, 25, "Add Piece", buttonFont, "rgb(50,150,50)", function () {
        objectFrameworkArea.objectFramework.pieces.push(new LevelObjectPiece("Piece " + (objectFrameworkArea.objectFramework.pieces.length + 1)));
        objectFrameworkArea.populate(objectFrameworkArea.objectFramework);
    }));
    objectFrameworkArea.addControl(objectFrameworkArea.pieces = new ScrollBox(30, 60 + (size * 1) + 10, 25, 4, 250, "rgb(50,60,127)"));

    objectFrameworkArea.addControl(new TextArea(45, 60 + (size * 2), "Paths", textFont, "black"));
    objectFrameworkArea.addControl(new Button(160, 38 + (size * 2), 140, 25, "Add Path", buttonFont, "rgb(50,150,50)", function () {
        objectFrameworkArea.objectFramework.paths.push(new LevelObjectPath("Path " + (objectFrameworkArea.objectFramework.paths.length + 1)));
        objectFrameworkArea.populate(objectFrameworkArea.objectFramework);
    }));
    objectFrameworkArea.addControl(objectFrameworkArea.paths = new ScrollBox(30, 60 + (size * 2) + 10, 25, 4, 250, "rgb(50,60,127)"));


    objectFrameworkArea.addControl(new TextArea(45, 60 + (size * 3), "Projectiles", textFont, "black"));
    objectFrameworkArea.addControl(new Button(160, 38 + (size * 3), 140, 25, "Add Projectile", buttonFont, "rgb(50,150,50)", function () {
        objectFrameworkArea.objectFramework.projectiles.push(new LevelProjectile("Projectile " + (objectFrameworkArea.objectFramework.projectiles.length + 1)));
        objectFrameworkArea.populate(objectFrameworkArea.objectFramework);
    }));
    objectFrameworkArea.addControl(objectFrameworkArea.projectiles = new ScrollBox(30, 60 + (size * 3) + 10, 25, 4, 250, "rgb(50,60,127)"));



    var codeMirror;
    var editor;

    objectFrameworkArea.addControl(new TextArea(320, 80 - 20, "Key: ", textFont, "black"));
    objectFrameworkArea.addControl(objectFrameworkArea.key = new TextBox(370, 60 - 20, 459, 25, "", buttonFont, "rgb(50,150,50)", function () { objectFrameworkArea.objectFramework.key = this.text; }));


    var addCodeWindow = function (value, change) {
        objectFrameworkArea.clearMainArea();
        objectFrameworkArea.mainPanel.addControl(new HtmlBox(15, -35, 485, 485, function () {
            $(document.body).append('<textarea id="code" name="code" style="position:absolute;width:485px;height:485px;"></textarea>');
            codeMirror = document.getElementById("code");
            codeMirror.value = value;
            editor = CodeMirror.fromTextArea(codeMirror, {
                lineNumbers: true,
                matchBrackets: true,
                onChange: change
            });
            var scroller = editor.getScrollerElement();
            scroller.style.height = "485px";
            scroller.style.width = "485px";
            editor.refresh();
        }, function (x, y) {

            var scroller = editor.getScrollerElement();

            scroller.style.left = x + "px";
            scroller.style.top = y + "px";
            editor.refresh();

        }, function () {
            var sc = editor.getScrollerElement();
            if (sc) {
                sc.style.visibility = "visible";
            }
        }, function () {
            var sc = editor.getScrollerElement();
            if (sc) {
                sc.style.left = "-100px";
                sc.style.top = "-100px";
                sc.style.visibility = "hidden";
            }
        }));
    };


    objectFrameworkArea.clearMainArea = function () {

        objectFrameworkArea.mainPanel.controls = [];
        codeMirror = document.getElementById("code");
        $('.CodeMirror').remove();
        if (codeMirror) {
            codeMirror.parentNode.removeChild(codeMirror);
        }
        var sc = document.getElementById("picFieldUploader"); sc.style.visibility = "hidden";
    };
    var b1, b2, b3, b4;
    objectFrameworkArea.addControl(b1 = new Button(320, 95 - 20, 250, 25, "onInit", buttonFont, "rgb(50,150,50)", function () {
        b2.toggled = false;
        b3.toggled = false;
        b4.toggled = false;
        if (this.toggled) {
            addCodeWindow(objectFrameworkArea.objectFramework.initScript, function () {
                objectFrameworkArea.objectFramework.initScript = editor.getValue();
            });
        } else {
            objectFrameworkArea.clearMainArea();
        }
    }));
    b1.toggle = true;

    objectFrameworkArea.addControl(b2 = new Button(580, 95 - 20, 250, 25, "onTick", buttonFont, "rgb(50,150,50)", function () {
        b1.toggled = false;
        b3.toggled = false;
        b4.toggled = false;
        if (this.toggled) {
            addCodeWindow(objectFrameworkArea.objectFramework.tickScript, function () {
                objectFrameworkArea.objectFramework.tickScript = editor.getValue();
            });
        } else {
            objectFrameworkArea.clearMainArea();
        }
    }));
    b2.toggle = true;

    objectFrameworkArea.addControl(b3 = new Button(320, 130 - 20, 250, 25, "onCollide", buttonFont, "rgb(50,150,50)", function () {
        b2.toggled = false;
        b1.toggled = false;
        b4.toggled = false;
        if (this.toggled) {
            addCodeWindow(objectFrameworkArea.objectFramework.collideScript, function () {
                objectFrameworkArea.objectFramework.collideScript = editor.getValue();
            });
        } else {
            objectFrameworkArea.clearMainArea();
        }
    }));
    b3.toggle = true;

    objectFrameworkArea.addControl(b4 = new Button(580, 130 - 20, 250, 25, "onHurtSonic", buttonFont, "rgb(50,150,50)", function () {
        b2.toggled = false;
        b3.toggled = false;
        b1.toggled = false;
        if (this.toggled) {
            addCodeWindow(objectFrameworkArea.objectFramework.hurtScript, function () {
                objectFrameworkArea.objectFramework.hurtScript = editor.getValue();
            });
        } else {
            objectFrameworkArea.clearMainArea();
        }
    }));
    b4.toggle = true;


    objectFrameworkArea.addControl(objectFrameworkArea.mainPanel = new Panel(320, 150, 510, 510, objectFrameworkArea));
    setTimeout('        var sc = document.getElementById("picFieldUploader");sc.style.visibility = "hidden";sc.style.position="absolute";', 300);

    objectFrameworkArea.loadAsset = function (asset) {

        objectFrameworkArea.clearMainArea();


        objectFrameworkArea.mainPanel.addControl(new TextArea(25, 25, "Name: ", textFont, "black"));
        objectFrameworkArea.mainPanel.addControl(new TextBox(100, 5, 290, 25, asset.name, buttonFont, "rgb(50,150,50)", function () { asset.name = this.text; }));
        objectFrameworkArea.mainPanel.addControl(new Button(400, 5, 100, 25, "Add Frame", buttonFont, "rgb(50,150,50)", function () {

            var vs;
            asset.frames.push(vs = new LevelObjectAssetFrame("Frame " + (asset.frames.length + 1)));
            vs.palette = ["000", "111", "222", "333", "444", "555", "666", "777", "888", "999", "AAA", "BBB", "CCC", "DDD", "EEE", "FFF"];
            vs.width = Math.floor(Math.random() * 40) + 20;
            vs.height = Math.floor(Math.random() * 40) + 20;
            for (var i = 0; i < vs.width; i++) {
                vs.colorMap[i] = [];
                for (var j = 0; j < vs.height; j++) {
                    vs.colorMap[i][j] = Math.floor(Math.random() * vs.palette.length);
                }
            }
            window.imageUploaded = function (img) {
                _H.loadSprite(img, function (image) {
                    vs.uploadImage(image);
                    var ce = objectFrameworkArea.mainPanel.frameArea.colorEditor;
                    ce.init(vs);
                    ce.editor.showOutline = false;
                    ce.editable = false;
                    ce.click = function (e) {
                        frame.offsetX = e.x;
                        frame.offsetY = e.y;
                    };

                    objectFrameworkArea.mainPanel.frameArea.palatteArea.init(vs.palette, true);
                });
            };

            objectFrameworkArea.mainPanel.populate(asset);
        }));

        var jd;
        objectFrameworkArea.mainPanel.addControl(jd = new ScrollBox(20, 35, 25, 3, 460, "rgb(50,60,127)"));
        objectFrameworkArea.mainPanel.populate = function (ast) {
            var bd;
            jd.controls = [];
            for (var i = 0; i < ast.frames.length; i++) {
                jd.addControl(bd = new Button(0, 0, 0, 0, function () { return this.state.name; }, "10pt Arial", "rgb(50,190,90)", function () {
                    objectFrameworkArea.mainPanel.loadFrame(this.state);
                }));
                bd.state = ast.frames[i];
            }
        };


        objectFrameworkArea.mainPanel.populate(asset);

        objectFrameworkArea.mainPanel.addControl(objectFrameworkArea.mainPanel.frameArea = new Panel(7, 155, 480, 350, objectFrameworkArea));
        objectFrameworkArea.mainPanel.frameArea.outline = false;


        objectFrameworkArea.mainPanel.loadFrame = function (frame) {
            objectFrameworkArea.mainPanel.frameArea.controls = [];

            var ce;
            objectFrameworkArea.mainPanel.frameArea.addControl(new TextArea(15, 21, "Name: ", textFont, "black"));
            objectFrameworkArea.mainPanel.frameArea.addControl(new TextBox(90, 0, 395, 25, frame.name, buttonFont, "rgb(50,150,50)", function () { frame.name = this.text; }));


            objectFrameworkArea.mainPanel.frameArea.addControl(new TextArea(0, 275, function () { return "Width:  " + frame.width; }, smallTextFont, "Black"));

            objectFrameworkArea.mainPanel.frameArea.addControl(new Button(75, 275 - 25, 14, 17, "^", buttonFont, "rgb(50,150,50)", function () {
                frame.width = Math.min(frame.width + 1, 100);
            }));
            objectFrameworkArea.mainPanel.frameArea.addControl(new Button(75, 275 - 5, 14, 20, "v", buttonFont, "rgb(50,150,50)", function () {
                frame.width = Math.max(frame.width - 1, 1);
            }));

            objectFrameworkArea.mainPanel.frameArea.addControl(new TextArea(0, 320, function () { return "Height: " + frame.height; }, smallTextFont, "Black"));

            objectFrameworkArea.mainPanel.frameArea.addControl(new Button(75, 320 - 25, 14, 17, "^", buttonFont, "rgb(50,150,50)", function () {
                frame.height = Math.min(frame.height + 1, 100);
            }));
            objectFrameworkArea.mainPanel.frameArea.addControl(new Button(75, 320 - 5, 14, 20, "v", buttonFont, "rgb(50,150,50)", function () {
                frame.height = Math.max(frame.height - 1, 1);
            }));

            var bt;
            objectFrameworkArea.mainPanel.frameArea.addControl(bt = new Button(230 - 55, 35, 150, 25, "Collide Map", buttonFont, "rgb(50,150,50)", function () {
                ce.showCollideMap = this.toggled;
            }));
            bt.toggle = true;
            objectFrameworkArea.mainPanel.frameArea.addControl(bt = new Button(390 - 55, 35, 150, 25, "Hurt Map", buttonFont, "rgb(50,150,50)", function () {
                ce.showHurtMap = this.toggled;
            }));
            bt.toggle = true;

            objectFrameworkArea.mainPanel.frameArea.addControl(objectFrameworkArea.mainPanel.frameArea.colorEditor = new ColorEditingArea(230 - 55, 65, { x: (310 / frame.width), y: (225 / frame.height) }));
            var ce = objectFrameworkArea.mainPanel.frameArea.colorEditor;
            ce.init(frame);
            ce.editor.showOutline = false;
            ce.editable = false;
            ce.click = function (e) {
                frame.offsetX = e.x;
                frame.offsetY = e.y;
            };
            objectFrameworkArea.mainPanel.frameArea.addControl(new HtmlBox(19, 64, 120, 31, function() {
                var sc = document.getElementById("picFieldUploader");

                sc.style.left = (objectFrameworkArea.x + 320 + 7 + 19) + "px";
                sc.style.top = (objectFrameworkArea.y + 150 + 155 + 64) + "px";
                sc.style.position = "absolute";
                sc.style.visibility = "visible";
            }, function(x, y) {
                var sc = document.getElementById("picFieldUploader");
                if (sc) {
                    sc.style.left = x + "px";
                    sc.style.top = y + "px";
                }
            }, function() {
                var sc = document.getElementById("picFieldUploader");
                if (sc) { 
                    sc.style.visibility = "visible";
                }
            }, function() {
                var sc = document.getElementById("picFieldUploader");
                if (sc) {
                    sc.style.left = "-100px";
                    sc.style.top = "-100px";
                    sc.style.visibility = "hidden";
                }
            }));


            var pa;
            objectFrameworkArea.mainPanel.frameArea.addControl(objectFrameworkArea.mainPanel.frameArea.palatteArea = new PaletteArea(230 - 55, 300, { x: 39, y: 11 }, false));
            objectFrameworkArea.mainPanel.frameArea.palatteArea.init(frame.palette, true);

            objectFrameworkArea.mainPanel.frameArea.addControl(new Button(230 - 55, 305 + 11 * 2, 310, 25, "Edit Map", buttonFont, "rgb(50,150,50)", function () {
                colorEditorArea.init(frame);
                colorEditorArea.visible = true;
                colorEditorArea.depth = objectFrameworkArea.depth + 1;
            }));

        };


    };

    objectFrameworkArea.populate = function (object) {
        this.objectFramework = object;
        this.key.text = object.key;
        this.assets.controls = [];
        var b;
        var i;
        for (i = 0; i < object.assets.length; i++) {
            this.assets.addControl(b = new Button(0, 0, 0, 0, function () { return this.state.name; }, "10pt Arial", "rgb(50,190,90)", function () {
                b1.toggled = false;
                b2.toggled = false;
                b3.toggled = false;
                b4.toggled = false;
                objectFrameworkArea.loadAsset(this.state);
            }));
            b.state = object.assets[i];
        }
        this.pieces.controls = [];
        for (i = 0; i < object.pieces.length; i++) {
            this.pieces.addControl(b = new Button(0, 0, 0, 0, function () { return this.state.name; }, "10pt Arial", "rgb(50,190,90)", function () {
                b1.toggled = false;
                b2.toggled = false;
                b3.toggled = false;
                b4.toggled = false;
                objectFrameworkArea.loadPiece(this.state);
            }));
            b.state = object.pieces[i];
        }
        this.paths.controls = [];
        for (i = 0; i < object.paths.length; i++) {
            this.paths.addControl(b = new Button(0, 0, 0, 0, function () { return this.state.name; }, "10pt Arial", "rgb(50,190,90)", function () {
                b1.toggled = false;
                b2.toggled = false;
                b3.toggled = false;
                b4.toggled = false;
                objectFrameworkArea.loadPath(this.state);
            }));
            b.state = object.paths[i];
        }
        this.projectiles.controls = [];
        for (i = 0; i < object.projectiles.length; i++) {
            this.projectiles.addControl(b = new Button(0, 0, 0, 0, function () { return this.state.name; }, "10pt Arial", "rgb(50,190,90)", function () {
                b1.toggled = false;
                b2.toggled = false;
                b3.toggled = false;
                b4.toggled = false;
                objectFrameworkArea.loadPiece(this.state);
            }));
            b.state = object.projectiles[i];
        }
    };





    var colorEditorArea = this.colorEditorArea = new UiArea(650, 30, 960, 800, this, true);
    colorEditorArea.visible = false;
    this.UIAreas.push(colorEditorArea);


    colorEditorArea.addControl(colorEditorArea.colorEditor = new ColorEditingArea(30, 45, { x: 11, y: 11 }));
    colorEditorArea.addControl(new Button(770, 70, 150, 22, "Show Outline", buttonFont, "rgb(50,150,50)", function () {
        colorEditorArea.colorEditor.editor.showOutline = !colorEditorArea.colorEditor.editor.showOutline;
    }
    ));

    colorEditorArea.addControl(new TextArea(750, 150, function () { return "Line Width:" + colorEditorArea.colorEditor.editor.lineWidth; }, textFont, "Black"));

    colorEditorArea.addControl(new Button(900, 120, 14, 20, "^", buttonFont, "rgb(50,150,50)", function () {
        colorEditorArea.colorEditor.editor.lineWidth = Math.max(colorEditorArea.colorEditor.editor.lineWidth + 1, 1);
    }
    ));
    colorEditorArea.addControl(new Button(900, 145, 14, 20, "v", buttonFont, "rgb(50,150,50)", function () {
        colorEditorArea.colorEditor.editor.lineWidth = Math.min(colorEditorArea.colorEditor.editor.lineWidth - 1, 10);
    }
    ));
    colorEditorArea.addControl(colorEditorArea.paletteArea = new PaletteArea(770, 250, { x: 45, y: 45 }, true));
    colorEditorArea.colorEditor.paletteEditor = colorEditorArea.paletteArea;
    colorEditorArea.init = function (frame) {
        colorEditorArea.colorEditor.scale = { x: 700 / frame.width, y: 700 / frame.height };
        colorEditorArea.colorEditor.init(frame);
        colorEditorArea.paletteArea.init(frame.palette, false);
    };




    var objectInfoArea = this.objectInfoArea = new UiArea(1347, 95, 250, 240, this, true);
    objectInfoArea.visible = false;
    this.UIAreas.push(objectInfoArea);
    objectInfoArea.addControl(new TextArea(30, 25, "Object Information", textFont, "blue"));
    objectInfoArea.addControl(new Button(40, 190, 60, 22, "Framework", buttonFont, "rgb(50,150,50)", function () {
        objectFrameworkArea.visible = true;
        objectFrameworkArea.objectFramework = objectFrameworkArea.object.Framwork;
    }
    ));




    var debuggerArea = this.debuggerArea = new UiArea(1347, 95, 250, 240, this, true);
    debuggerArea.visible = false;
    this.UIAreas.push(debuggerArea);
    debuggerArea.addControl(new TextArea(30, 25, "Debugger", textFont, "blue"));
    debuggerArea.addControl(new Button(40, 60, 60, 22, "Stop", buttonFont, "rgb(50,150,50)", function () {
        sonicManager.windowLocation = _H.defaultWindowLocation(1, mainCanvas, scale);

        debuggerArea.visible = false;
        solidTileArea.visible = false;
        levelInformation.visible = true;
        levelManagerArea.visible = true;
        sonicManager.sonicToon.empty();
        sonicManager.sonicToon = null;
    }
    ));



    debuggerArea.addControl(new Button(40, 95, 90, 22, "Hit Sonic", buttonFont, "rgb(50,150,50)", function () {
        sonicManager.sonicToon.hit();
    }
    ));

    debuggerArea.addControl(new Button(40, 130, 160, 22, "Show Height Map", buttonFont, "rgb(50,150,50)", function () {
        if (this.text == "Show Height Map") {
            sonicManager.showHeightMap = true;
            this.text = "Hide Height Map";
        } else {
            sonicManager.showHeightMap = false;
            this.text = "Show Height Map";
        }
    }
    ));
    debuggerArea.addControl(new Button(40, 160, 160, 22, "Switch Height Map", buttonFont, "rgb(50,150,50)", function () {
        sonicManager.SonicLevel.curHeightMap = !sonicManager.SonicLevel.curHeightMap;
    }
    ));
    debuggerArea.addControl(new Button(40, 190, 160, 22, "Debug Sonic", buttonFont, "rgb(50,150,50)", function () {
        if (this.text == "Debug Sonic") {
            sonicManager.sonicToon.debugging = true;
            this.text = "Normal Sonic";
        } else {
            sonicManager.sonicToon.debugging = false;
            this.text = "Debug Sonic";
        }

    }
    ));


    var solidTileArea = this.solidTileArea = new UiArea(40, 450, 430, 400, this, true);
    solidTileArea.visible = false;
    this.UIAreas.push(solidTileArea);
    solidTileArea.addControl(new TextArea(30, 25, "Modify Solid Tile", textFont, "blue"));



    solidTileArea.addControl(new Button(50, 35, 25, 22, "<<", buttonFont, "rgb(50,150,50)",
        function () {
            if (indexes.tpIndex > 0)
                modifyTilePieceArea.tilePiece = sonicManager.SonicLevel.Blocks[--indexes.tpIndex];
        }));

    solidTileArea.addControl(new Button(75, 35, 25, 22, ">>", buttonFont, "rgb(50,150,50)",
        function () {
            if (indexes.tpIndex < sonicManager.SonicLevel.Blocks.length)
                modifyTilePieceArea.tilePiece = sonicManager.SonicLevel.Blocks[++indexes.tpIndex];
        }));
    solidTileArea.addControl(new Button(360, 80, 45, 22, "Full", buttonFont, "rgb(50,150,50)",
        function () {
            for (var i = 0; i < 16; i++) {
                modifyTilePieceArea.tilePiece.heightMask.items[i] = 16;

            }
            this.sprites = [];
        }));

    solidTileArea.addControl(new Button(360, 130, 45, 22, "XFlip", buttonFont, function () {
        if (modifyTilePieceArea.tpc.XFlip) {
            return "rgb(190,120,65)";
        } else {
            return "rgb(50,150,50)";
        }
    },
        function () {
            modifyTilePieceArea.tpc.XFlip = !modifyTilePieceArea.tpc.XFlip;
        }));
    solidTileArea.addControl(new Button(360, 160, 45, 22, "YFlip", buttonFont, function () {
        if (modifyTilePieceArea.tpc.YFlip) {
            return "rgb(190,120,65)";
        } else {
            return "rgb(50,150,50)";
        }
    },
        function () {
            modifyTilePieceArea.tpc.YFlip = !modifyTilePieceArea.tpc.YFlip;
        }));

    solidTileArea.addControl(new Button(200, 35, 180, 22, "Modify Height Map", buttonFont, "rgb(50,150,50)",
    function () {
        modifyTilePieceArea.state = (modifyTilePieceArea.state + 1) % 3;
        switch (modifyTilePieceArea.state) {
            case 0:
                this.text = "Modify Height Map";
                break;
            case 1:
                this.text = "Modify Tile Direction";
                break;
            case 2:
                this.text = "Modify Tile Colors";
                break;
        }
    }));
    var modifyTilePieceArea = this.modifyTilePieceArea = new TilePieceArea(30, 70, { x: 4 * 5, y: 4 * 5 }, null, 0);
    solidTileArea.addControl(modifyTilePieceArea);


    var bgEditor = this.bgEditor = new UiArea(100, 440, 420, 360, this, true);
    bgEditor.visible = false;
    this.UIAreas.push(bgEditor);
    bgEditor.addControl(new TextArea(30, 25, "BG Editor", textFont, "blue"));
    bgEditor.addControl(new TileBGEditArea(60, 35));




    var levelInformation = this.levelInformation = new UiArea(70, 70, 460, 420, this);
    levelInformation.visible = true;
    this.UIAreas.push(levelInformation);
    levelInformation.addControl(new TextArea(30, 25, "Level Selector", textFont, "blue"));
    levelInformation.addControl(new TextArea(30, 52, function () {
        return !curLevelName ? "Level Not Saved" : (curLevelName);
    }, textFont, "black"));
    levelInformation.addControl(new Button(320, 70, 100, 22, "Save Level", buttonFont, "rgb(50,150,50)",
    function () {
        if (curLevelName) {
            OurSonic.SonicLevels.SaveLevelInformation(curLevelName, Base64.encode(_H.stringify(sonicManager.SonicLevel)), function (c) { }, function (c) { alert("Failure: " + _H.stringify(c)); });
        } else {
            OurSonic.SonicLevels.saveLevel(Base64.encode(_H.stringify(sonicManager.SonicLevel)), function (j) {
                addLevelToList(curLevelName);
            });

        }
    }));

    var tb;
    levelInformation.addControl(tb = new Button(320, 105, 160, 22, "Load Empty Level", buttonFont, "rgb(50,150,50)",
    function () {

        levelManagerArea.visible = true;
        loadingText.visible = true;
        var index = 0;
        var tim = function () {
            var max = 188;
            if (index == max) {
                setTimeout(function () {
                    alert(_H.stringify(sonicManager.SonicLevel));
                    loadGame(_H.stringify(sonicManager.SonicLevel), mainCanvas);
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
        updateTitle("Downloading " + name);
        OurSonic.SonicLevels.getLevel(name, function (lvl) {
            updateTitle("Loading: " + name);

            loadGame(lvl, mainCanvas);
        });
    }







    var levelManagerArea = this.levelManagerArea = new UiArea(500, 25, 400, 400, this);
    levelManagerArea.visible = false;
    this.UIAreas.push(levelManagerArea);
    levelManagerArea.addControl(new TextArea(30, 25, "Level Manager", textFont, "blue"));
    var loadingText;
    levelManagerArea.addControl(loadingText = new TextArea(270, 25, "Loading", textFont, "green"));
    loadingText.visible = false;

    levelManagerArea.addControl(new Button(35, 100, 160, 22, "Show Height Map", buttonFont, "rgb(50,150,50)", function () {
        if (this.text == "Show Height Map") {
            sonicManager.showHeightMap = true;
            this.text = "Hide Height Map";
        } else {
            sonicManager.showHeightMap = false;
            this.text = "Show Height Map";
        }
    }
    ));

    levelManagerArea.addControl(new Button(200, 150, 160, 22, "Dragging", buttonFont, "rgb(50,150,50)",
        function () {

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

    levelManagerArea.addControl(new Button(200, 180, 160, 22, "Switch Height Map", buttonFont, "rgb(50,150,50)", function () {
        sonicManager.SonicLevel.curHeightMap = !sonicManager.SonicLevel.curHeightMap;
    }
    ));

    levelManagerArea.addControl(new Button(35, 150, 160, 22, "Modify Chunks", buttonFont, "rgb(50,150,50)",
        function () {
            modifyTileChunkArea.visible = true;

        }));

    levelManagerArea.addControl(new Button(35, 150, 160, 22, "Modify Chunks", buttonFont, "rgb(50,150,50)",
        function () {
            modifyTileChunkArea.visible = true;

        }));
    levelManagerArea.addControl(new Button(35, 175, 160, 22, "Modify Tile Pieces", buttonFont, "rgb(50,150,50)",
        function () {
            solidTileArea.visible = true;

        }));
    levelManagerArea.addControl(new Button(35, 200, 160, 22, "Modify Tiles", buttonFont, "rgb(50,150,50)",
        function () {
            modifyTileArea.visible = true;

        }));
    levelManagerArea.addControl(new Button(35, 240, 160, 22, "Modify Background", buttonFont, "rgb(50,150,50)",
        function () {
            bgEditor.visible = true;
        }));


    levelManagerArea.addControl(new Button(200, 35, 60, 22, "Run", buttonFont, "rgb(50,150,50)", runSonic));




    var modifyTileChunkArea = this.modifyTileChunkArea = new UiArea(900, 450, 400, 400, this, true);
    modifyTileChunkArea.visible = false;
    this.UIAreas.push(modifyTileChunkArea);
    modifyTileChunkArea.addControl(new TextArea(30, 25, "Modify Tile Chunk", textFont, "blue"));



    var modifyTC = this.modifyTC = new TileChunkArea(30, 70, { x: 2, y: 2 }, null, 1);

    modifyTileChunkArea.addControl(modifyTC);

    modifyTileChunkArea.addControl(new Button(50, 35, 25, 22, "<<", buttonFont, "rgb(50,150,50)",
        function () {
            if (indexes.modifyIndex > 0)
                modifyTC.tileChunk = sonicManager.SonicLevel.Chunks[--indexes.modifyIndex];
        }));
    modifyTileChunkArea.addControl(new Button(80, 35, 25, 22, ">>", buttonFont, "rgb(50,150,50)",
        function () {
            if (indexes.modifyIndex < sonicManager.SonicLevel.Chunks.length)
                modifyTC.tileChunk = sonicManager.SonicLevel.Chunks[++indexes.modifyIndex];
        }));


    var modifyTP = this.modifyTP = new TilePieceArea(300, 160, { x: 2 * 3, y: 2 * 3 }, null, 3);

    modifyTileChunkArea.addControl(modifyTP);

    modifyTileChunkArea.addControl(new Button(300, 100, 25, 22, "<<", buttonFont, "rgb(50,150,50)",
        function () {
            if (indexes.modifyTPIndex > 0)
                modifyTP.tilePiece = modifyTC.setToTile = sonicManager.SonicLevel.Blocks[--indexes.modifyTPIndex];
        }));
    modifyTileChunkArea.addControl(new Button(330, 100, 25, 22, ">>", buttonFont, "rgb(50,150,50)",
        function () {
            if (indexes.modifyTPIndex < sonicManager.SonicLevel.Blocks.length)
                modifyTP.tilePiece = modifyTC.setToTile = sonicManager.SonicLevel.Blocks[++indexes.modifyTPIndex];
        }));






    var modifyTileArea = this.modifyTileArea = new UiArea(900, 25, 400, 400, this, true);
    modifyTileArea.visible = false;
    this.UIAreas.push(modifyTileArea);
    modifyTileArea.addControl(new TextArea(30, 25, "Modify Tile", textFont, "blue"));

    function loadGame(lvl, mainCanvas) {
        sonicManager.loading = true;
        updateTitle("Decoding");
        sonicManager.SonicLevel = jQuery.parseJSON(_H.decodeString(lvl));
        updateTitle("Determining Level Information");
        var fc;
        var j;
        if (!sonicManager.SonicLevel.Chunks)
            sonicManager.SonicLevel.Chunks = [];
        if (!sonicManager.SonicLevel.Blocks)
            sonicManager.SonicLevel.Blocks = [];
        if (!sonicManager.SonicLevel.Tiles)
            sonicManager.SonicLevel.Tiles = [];
        if (!sonicManager.SonicLevel.Rings)
            sonicManager.SonicLevel.Rings = [];


        sonicManager.SonicLevel.LevelWidth = sonicManager.SonicLevel.ForegroundWidth;
        sonicManager.SonicLevel.LevelHeight = sonicManager.SonicLevel.ForegroundHeight;


        var q, r, l, o;
        var mf = decodeNumeric(sonicManager.SonicLevel.Foreground);
        sonicManager.SonicLevel.ChunkMap = [];
        for (q = 0; q < sonicManager.SonicLevel.ForegroundWidth; q++) {
            sonicManager.SonicLevel.ChunkMap[q] = [];
            for (r = 0; r < sonicManager.SonicLevel.ForegroundHeight; r++) {
                sonicManager.SonicLevel.ChunkMap[q][r] = mf[q + r * sonicManager.SonicLevel.ForegroundWidth];
            }
        }
        var mf = decodeNumeric(sonicManager.SonicLevel.Background);
        sonicManager.SonicLevel.BGChunkMap = [];
        for (q = 0; q < sonicManager.SonicLevel.BackgroundWidth; q++) {
            sonicManager.SonicLevel.BGChunkMap[q] = [];
            for (r = 0; r < sonicManager.SonicLevel.BackgroundHeight; r++) {
                sonicManager.SonicLevel.BGChunkMap[q][r] = mf[q + r * sonicManager.SonicLevel.BackgroundWidth];
            }
        }
        sonicManager.SonicLevel.Objects = [];
        for (l = 0; l < sonicManager.SonicLevel.Objects.length; l++) {
            o = sonicManager.SonicLevel.Objects[l];
            sonicManager.SonicLevel.Objects[l] = _H.ObjectParse(o);
        }

        /*
        var jm = [];
        jm[0] = [];
        jm[1] = [];
        jm[2] = [];
        jm[3] = [];
        for (var qc = 0; qc < sonicManager.SonicLevel.Palette.length;qc++ ) {
        jm[_H.floor(qc / 16)][qc % 16] = sonicManager.SonicLevel.Palette[qc];
        }
        sonicManager.SonicLevel.Palette=jm;*/

        var value, td;
        sonicManager.SonicLevel.curHeightMap = true;
        for (j = 0; j < sonicManager.SonicLevel.Tiles.length; j++) {
            fc = sonicManager.SonicLevel.Tiles[j];
            sonicManager.SonicLevel.Tiles[j] = decodeNumeric(fc);

            mj = [];
            for (l = 0; l < sonicManager.SonicLevel.Tiles[j].length; l++) {
                value = sonicManager.SonicLevel.Tiles[j][l];
                mj.push(value >> 4);
                mj.push(value & 0xF);
            }
            sonicManager.SonicLevel.Tiles[j] = { colors: mj };
            td = sonicManager.SonicLevel.Tiles[j];
            mf = [];
            for (o = 0; o < 8; o++) {
                mf[o] = [];
            }
            for (n = 0; n < td.colors.length; n++) {
                mf[n % 8][_H.floor(n / 8)] = td.colors[n];
            }
            td.colors = mf;
            td.index = j;
            sonicManager.SonicLevel.Tiles[j] = _H.extend(new Tile(), td);
        }


        var acs = sonicManager.SonicLevel.AnimatedChunks = [];
        if (sonicManager.SonicLevel.AnimatedFiles) {
            for (jc = 0; jc < sonicManager.SonicLevel.AnimatedFiles.length; jc++) {
                var fcc = sonicManager.SonicLevel.AnimatedFiles[jc];
                for (j = 0; j < fcc.length; j++) {
                    fc = fcc[j];
                    fcc[j] = decodeNumeric(fc);

                    mj = [];
                    for (l = 0; l < fcc[j].length; l++) {
                        value = fcc[j][l];
                        mj.push(value >> 4);
                        mj.push(value & 0xF);
                    }
                    fcc[j] = { colors: mj };
                    td = fcc[j];
                    mf = [];
                    for (o = 0; o < 8; o++) {
                        mf[o] = [];
                    }
                    for (n = 0; n < td.colors.length; n++) {
                        mf[n % 8][_H.floor(n / 8)] = td.colors[n];
                    }
                    td.colors = mf;
                    td.index = "A" + j + "_" + jc;
                    fcc[j] = _H.extend(new Tile(), td);

                }
            }
        }


        for (j = 0; j < sonicManager.SonicLevel.Blocks.length; j++) {
            fc = sonicManager.SonicLevel.Blocks[j];
            mj = new TilePiece();
            mj.index = j;
            mj.tiles = [];
            for (p = 0; p < fc.length; p++) {
                mj.tiles.push(fc[p]);

            }
            sonicManager.SonicLevel.Blocks[j] = mj;
        }



        var m;

        sonicManager.SonicLevel.Angles = decodeNumeric(sonicManager.SonicLevel.Angles);
        sonicManager.SonicLevel.CollisionIndexes1 = decodeNumeric(sonicManager.SonicLevel.CollisionIndexes1);
        sonicManager.SonicLevel.CollisionIndexes2 = decodeNumeric(sonicManager.SonicLevel.CollisionIndexes2);

        for (i = 0; i < sonicManager.SonicLevel.HeightMaps.length; i++) {

            var b1 = true;
            var b2 = true;
            for (m = 0; m < sonicManager.SonicLevel.HeightMaps[i].length; m++) {
                if (b1 && sonicManager.SonicLevel.HeightMaps[i][m] != 0) {
                    b1 = false;
                }
                if (b2 && sonicManager.SonicLevel.HeightMaps[i][m] != 16) {
                    b2 = false;
                }
            }

            if (b1) {
                sonicManager.SonicLevel.HeightMaps[i] = 0;
            } else if (b2) {
                sonicManager.SonicLevel.HeightMaps[i] = 1;
            } else
                sonicManager.SonicLevel.HeightMaps[i] = new HeightMask(sonicManager.SonicLevel.HeightMaps[i]);
        }

        var jc;
        for (j = 0; j < sonicManager.SonicLevel.Chunks.length; j++) {
            fc = sonicManager.SonicLevel.Chunks[j];

            var mj = new TileChunk();
            mj.index = j;
            mj.tilePieces = [];
            for (var i = 0; i < 8; i++) {
                mj.tilePieces[i] = [];
            }
            for (var p = 0; p < fc.length; p++) {
                mj.tilePieces[p % 8][_H.floor(p / 8)] = (fc[p]);

            }
            sonicManager.SonicLevel.Chunks[j] = mj;
            mj.animated = undefined;
            for (var ic = 0; ic < mj.tilePieces.length; ic++) {
                for (var jc = 0; jc < mj.tilePieces[ic].length; jc++) {
                    var r = mj.tilePieces[ic][jc];
                    var pm = sonicManager.SonicLevel.Blocks[r.Block];
                    if (pm) {
                        for (var ci = 0; ci < pm.tiles.length; ci++) {
                            var mjc = pm.tiles[ci];
                            if (sonicManager.SonicLevel.Tiles[mjc.Tile]) {
                                var fa = sonicManager.containsAnimatedTile(mjc.Tile);
                                if (fa != undefined) {
                                    mj.animated = fa;
                                    acs.push(mj);
                                    break;
                                }
                            }
                        }
                        if (mj.animated) break;
                    }
                    if (mj.animated) break;

                }
            }

            /*for (je = 0; je < fc.angleMap1.length; je++) {
            for (jc = 0; jc < fc.angleMap1[je].length; jc++) {
            fc.angleMap1[je][jc] = parseInt(fc.angleMap1[je][jc], 16);
            }
            }
            for (je = 0; je < fc.angleMap2.length; je++) {
            for (jc = 0; jc < fc.angleMap2[je].length; jc++) {
            fc.angleMap2[je][jc] = parseInt(fc.angleMap2[je][jc], 16);
            }
            }


            for (je = 0; je < fc.heightMap1.length; je++) {
            for (jc = 0; jc < fc.heightMap1[je].length; jc++) {
            fc.heightMap1[je][jc] = sonicManager.SonicLevel.HeightMaps[fc.heightMap1[je][jc]];
            }
            }

            for (je = 0; je < fc.heightMap2.length; je++) {
            for (jc = 0; jc < fc.heightMap2[je].length; jc++) {
            fc.heightMap2[je][jc] = sonicManager.SonicLevel.HeightMaps[fc.heightMap2[je][jc]];
            }
            }*/

        }



        var finished = function () {
            levelManagerArea.visible = true;
            sonicManager.loading = false;
            modifyTC.tileChunk = sonicManager.SonicLevel.Chunks[0];
            modifyTilePieceArea.tilePiece = modifyTP.tilePiece = sonicManager.SonicLevel.Blocks[0];

        };

        //        var inds = sonicManager.inds = { r:0,t: 0, tp: 0, tc: 0, total: (sonicManager.SonicLevel.Chunks.length * 2 + sonicManager.SonicLevel.Blocks.length * 5 + sonicManager.SonicLevel.Tiles.length), done: false };

        updateTitle("preloading sprites");
        sonicManager.CACHING = true;
        sonicManager.preLoadSprites(scale, function () {
            //          inds.r = 1;
            sonicManager.CACHING = false;
            finished();

            updateTitle("Level Loaded");
            sonicManager.forceResize();


            var dl = _H.getQueryString();
            if (dl["run"]) {
                setTimeout(runSonic, 1000);
            }

        }, updateTitle);


        /*
        var scal = scale;
        for (j = 0; j < sonicManager.SonicLevel.Tiles.length; j++) {
        fc = sonicManager.SonicLevel.Tiles[j];
        fc.cacheImage(mainCanvas, scal, function (j) {
        inds.t++;
        var done1 = function (c) {
        inds.tp++;
        if (inds.tp == sonicManager.SonicLevel.Blocks.length * 5) {

        var done2 = function (c2) {
        inds.tc++;

        finished();
        };

        for (j = 0; j < sonicManager.SonicLevel.Chunks.length; j++) {
        fc = sonicManager.SonicLevel.Chunks[j];
        fc.cacheImage(mainCanvas, scal, 1, done2);
        fc.cacheImage(mainCanvas, scal, 2, done2);
        }
        }
        };
        if (inds.t == sonicManager.SonicLevel.Tiles.length) {
        for (j = 0; j < sonicManager.SonicLevel.Blocks.length; j++) {
        fc = sonicManager.SonicLevel.Blocks[j];
        fc.cacheImage(mainCanvas, scal, 0, done1);
        fc.cacheImage(mainCanvas, scal, 1, done1);
        fc.cacheImage(mainCanvas, scal, 2, done1);
        fc.cacheImage(mainCanvas, scal, 3, done1);
        fc.cacheImage(mainCanvas, scal, 4, done1);
        }
        }
        });
        }*/


    }

}




function Dragger(onFling) {
    this.lastPos = null;
    this.xsp = 0;
    this.ysp = 0;
    this.lag = 0.925;
    this.click = function (e) {
        this.lastPos = { x: e.x, y: e.y };

    };
    this.isDragging = function (e) {
        return this.lastPos;
    };
    this.mouseUp = function (e) {
        this.lastPos = null;
    };
    this.mouseMove = function (e) {
        if (!this.lastPos) {
            return;
        }

        this.xsp += (this.lastPos.x - e.x) * 2.7;
        this.ysp += (this.lastPos.y - e.y) * 2.7;
        this.xsp = (this.xsp > 0 ? 1 : -1) * Math.min(Math.abs(this.xsp), 60);
        this.ysp = (this.ysp > 0 ? 1 : -1) * Math.min(Math.abs(this.ysp), 60);
        this.lastPos = { x: e.x, y: e.y };
    };
    this.tick = function () {

        onFling(this.xsp, this.ysp);
        if (this.xsp > 0)
            this.xsp *= this.lag;
        else
            this.xsp *= this.lag;

        if (this.ysp > 0)
            this.ysp *= this.lag;
        else
            this.ysp *= this.lag;

        if (Math.abs(this.xsp) <= 2)
            this.xsp = 0;
        if (Math.abs(this.ysp) <= 2)
            this.ysp = 0;

    };
}