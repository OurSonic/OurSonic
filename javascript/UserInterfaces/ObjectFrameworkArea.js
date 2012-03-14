window.ObjectFrameworkArea = function () {
    var size = 40 * 4;

    var objectFrameworkArea = sonicManager.uiManager.objectFrameworkArea = new UiArea(540, 75, 850, 690, sonicManager.uiManager, true);
    objectFrameworkArea.visible = false;
    sonicManager.uiManager.UIAreas.push(objectFrameworkArea);
    objectFrameworkArea.addControl(new TextArea(30, 25, "Object Framework", sonicManager.uiManager.textFont, "blue"));

    objectFrameworkArea.addControl(new TextArea(16, 60, "Assets", sonicManager.uiManager.textFont, "black"));
    objectFrameworkArea.addControl(new Button(160, 38, 140, 25, "Add Asset", sonicManager.uiManager.buttonFont, "rgb(50,150,50)", function () {
        objectFrameworkArea.objectFramework.assets.push(new LevelObjectAsset("Asset " + (objectFrameworkArea.objectFramework.assets.length + 1)));
        objectFrameworkArea.populate(objectFrameworkArea.objectFramework);
    }));
    objectFrameworkArea.addControl(objectFrameworkArea.assets = new ScrollBox(30, 60 + 10, 25, 4, 250, "rgb(50,60,127)"));


    objectFrameworkArea.addControl(new TextArea(16, 60 + (size * 1), "Pieces", sonicManager.uiManager.textFont, "black"));
    objectFrameworkArea.addControl(new Button(160, 38 + (size * 1), 140, 25, "Add Piece", sonicManager.uiManager.buttonFont, "rgb(50,150,50)", function () {
        objectFrameworkArea.objectFramework.pieces.push(new LevelObjectPiece("Piece " + (objectFrameworkArea.objectFramework.pieces.length + 1)));
        objectFrameworkArea.populate(objectFrameworkArea.objectFramework);
    }));
    objectFrameworkArea.addControl(objectFrameworkArea.pieces = new ScrollBox(30, 60 + (size * 1) + 10, 25, 4, 250, "rgb(50,60,127)"));

    objectFrameworkArea.addControl(new TextArea(16, 60 + (size * 2), "Piece Layouts", sonicManager.uiManager.textFont, "black"));
    objectFrameworkArea.addControl(new Button(160, 38 + (size * 2), 140, 25, "Add Piece Layout", sonicManager.uiManager.buttonFont, "rgb(50,150,50)", function () {
        var pth;
        objectFrameworkArea.objectFramework.pieceLayouts.push(pth = new LevelObjectPieceLayout("Piece Layout " + (objectFrameworkArea.objectFramework.pieceLayouts.length + 1)));


        objectFrameworkArea.populate(objectFrameworkArea.objectFramework);
    }));
    objectFrameworkArea.addControl(objectFrameworkArea.pieceLayouts = new ScrollBox(30, 60 + (size * 2) + 10, 25, 4, 250, "rgb(50,60,127)"));


    objectFrameworkArea.addControl(new TextArea(16, 60 + (size * 3), "Projectiles", sonicManager.uiManager.textFont, "black"));
    objectFrameworkArea.addControl(new Button(160, 38 + (size * 3), 140, 25, "Add Projectile", sonicManager.uiManager.buttonFont, "rgb(50,150,50)", function () {
        objectFrameworkArea.objectFramework.projectiles.push(new LevelObjectProjectile("Projectile " + (objectFrameworkArea.objectFramework.projectiles.length + 1)));
        objectFrameworkArea.populate(objectFrameworkArea.objectFramework);
    }));
    objectFrameworkArea.addControl(objectFrameworkArea.projectiles = new ScrollBox(30, 60 + (size * 3) + 10, 25, 4, 250, "rgb(50,60,127)"));


    var codeMirror;
    var editor;

    objectFrameworkArea.addControl(new TextArea(320, 80 - 20, "Key: ", sonicManager.uiManager.textFont, "black"));
    objectFrameworkArea.addControl(objectFrameworkArea.key = new TextBox(370, 60 - 20, 459, 25, "", sonicManager.uiManager.buttonFont, "rgb(50,150,50)", function () { objectFrameworkArea.objectFramework.key = this.text; }));


    var addCodeWindow = function (value, change) {
        objectFrameworkArea.clearMainArea();
        objectFrameworkArea.mainPanel.addControl(new HtmlBox(15, -35, 485, 485, function () {
            $(document.body).append('<textarea id="code" name="code" style="position:absolute;width:485px;height:485px;"></textarea>');
            codeMirror = document.getElementById("code");
            codeMirror.value = value;
            editor = CodeMirror.fromTextArea(codeMirror, {
                lineNumbers: true,
                matchBrackets: true,
                onChange: change,
                extraKeys: { "Ctrl-Space": function (cm) { CodeMirror.simpleHint(cm, CodeMirror.javascriptHint); } },
                onCursorActivity: function () {
                    editor.setLineClass(hlLine, null);
                    hlLine = editor.setLineClass(editor.getCursor().line, "activeline");
                }
            });
            editor.setOption("theme", "night");

            var hlLine = editor.setLineClass(0, "activeline");

            var scroller = editor.getScrollerElement();
            scroller.style.height = "485px";
            scroller.style.width = "485px";
            editor.refresh();
        }, function (x, y) {

            var scroller = editor.getScrollerElement();
            if (scroller.style.left == x + "px" && scroller.style.top == y + "px")
                return;
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
        var sc = document.getElementById("picFieldUploader");
        sc.style.visibility = "hidden";
    };
    var b1, b2, b3, b4;
    objectFrameworkArea.addControl(b1 = new Button(320, 95 - 20, 250, 25, "onInit", sonicManager.uiManager.buttonFont, "rgb(50,150,50)", function () {
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

    objectFrameworkArea.addControl(b2 = new Button(580, 95 - 20, 250, 25, "onTick", sonicManager.uiManager.buttonFont, "rgb(50,150,50)", function () {
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

    objectFrameworkArea.addControl(b3 = new Button(320, 130 - 20, 250, 25, "onCollide", sonicManager.uiManager.buttonFont, "rgb(50,150,50)", function () {
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

    objectFrameworkArea.addControl(b4 = new Button(580, 130 - 20, 250, 25, "onHurtSonic", sonicManager.uiManager.buttonFont, "rgb(50,150,50)", function () {
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


    objectFrameworkArea.loadPiece = function (piece) {

        objectFrameworkArea.clearMainArea();


        objectFrameworkArea.mainPanel.addControl(new TextArea(25, 25, "Name: ", sonicManager.uiManager.textFont, "black"));
        objectFrameworkArea.mainPanel.addControl(new TextBox(100, 5, 290, 25, piece.name, sonicManager.uiManager.buttonFont, "rgb(50,150,50)", function () { piece.name = this.text; }));
        var b;
        objectFrameworkArea.mainPanel.addControl(b = new Button(40, 160, 70, 25, "XFlip", sonicManager.uiManager.buttonFont, "rgb(50,150,50)", function () {
            piece.xflip = b.toggled;
        }));
        b.toggle = true;
        b.toggled = piece.xflip;

        var c;
        objectFrameworkArea.mainPanel.addControl(c = new Button(115, 160, 70, 25, "YFlip", sonicManager.uiManager.buttonFont, "rgb(50,150,50)", function () {
            piece.yflip = c.toggled;
        }));
        c.toggle = true;
        c.toggled = piece.yflip;


        var jd;
        objectFrameworkArea.mainPanel.addControl(jd = new HScrollBox(20, 35, 70, 4, 112, "rgb(50,60,127)"));
        var bd;
        jd.controls = [];
        for (var i = 0; i < objectFrameworkArea.objectFramework.assets.length; i++) {
            jd.addControl(bd = new ImageButton(0, 0, 0, 0, function () { return this.state.name; }, "10pt Arial", function (canvas, x, y) {
                if (this.state.frames.length == 0) return;
                this.state.frames[0].drawSimple(canvas, { x: x, y: y }, this.width, this.height - 15, piece.xflip, piece.yflip);
            }, function () {


                for (var j = 0; j < jd.controls.length; j++) {
                    if (jd.controls[j] == this) {
                        if (piece.assetIndex == j)
                            this.toggled = true;

                        piece.assetIndex = j;
                        continue;
                    }
                    jd.controls[j].toggled = false;
                }

            }));
            bd.toggle = true;
            bd.state = objectFrameworkArea.objectFramework.assets[i];
            if (piece.assetIndex == i) {
                bd.toggled = true;
            }
        }


    };

    objectFrameworkArea.loadPieceLayout = function (pieceLayout) {

        objectFrameworkArea.clearMainArea();


        objectFrameworkArea.mainPanel.addControl(new TextArea(25, 25, "Name: ", sonicManager.uiManager.textFont, "black"));
        objectFrameworkArea.mainPanel.addControl(new TextBox(100, 5, 390, 25, pieceLayout.name, sonicManager.uiManager.buttonFont, "rgb(50,150,50)", function () { pieceLayout.name = this.text; }));


        objectFrameworkArea.mainPanel.addControl(pe = new PieceLayoutEditor(145, 105, { width: 350, height: 280 }));
        pe.init(pieceLayout);

        var listOfPieces;
        objectFrameworkArea.mainPanel.addControl(listOfPieces = new ScrollBox(10, 105, 70, 5, 112, "rgb(50,60,127)"));


        var selectPieceScroll;
        objectFrameworkArea.mainPanel.addControl(objectFrameworkArea.mainPanel.selectPieceScroll = selectPieceScroll = new HScrollBox(145, 390, 70, 3, 112, "rgb(50,60,127)"));
        var bdc;
        selectPieceScroll.controls = [];
        for (var i = 0; i < objectFrameworkArea.objectFramework.pieces.length; i++) {

            selectPieceScroll.addControl(bdc = new ImageButton(0, 0, 0, 0,
                function () {
                    return objectFrameworkArea.objectFramework.pieces[this.state.index].name;
                }, "10pt Arial",
                function (canvas, x, y) {
                    var d = objectFrameworkArea.objectFramework.pieces[this.state.index];
                    var ast = objectFrameworkArea.objectFramework.assets[d.assetIndex];
                    if (ast.frames.length == 0) return;
                    ast.frames[0].drawSimple(canvas, { x: x, y: y }, this.width, this.height - 15, d.xflip, d.yflip);
                }, function () {
                    listOfPieces.controls[pe.pieceLayoutMaker.selectedPieceIndex].state.pieceIndex = this.state.index;

                    for (var i = 0; i < selectPieceScroll.controls.length; i++) {
                        if (selectPieceScroll.controls[i] == this)
                            selectPieceScroll.controls[i].toggled = true;
                        else
                            selectPieceScroll.controls[i].toggled = false;
                    }
                }));

            bdc.state = {
                piece: pieceLayout.pieces[0],
                index: i
            };
            bdc.toggle = true;
            if (pieceLayout.pieces[0])
                bdc.toggled = pieceLayout.pieces[0].pieceIndex == i;
        }

        var pe;
        var showB;
        objectFrameworkArea.mainPanel.addControl(showB = new Button(348, 38, 140, 25, "Show Images", sonicManager.uiManager.buttonFont, "rgb(50,150,50)", function () {
            pe.pieceLayoutMaker.showImages = this.toggled;
        }));
        showB.toggle = true;

        objectFrameworkArea.mainPanel.addControl(new Button(348, 68, 140, 25, "Add Branch", sonicManager.uiManager.buttonFont, "rgb(50,150,50)", function () {
            var pc;
            pe.pieceLayoutMaker.pieceLayout.pieces.push(pc = new LevelObjectPieceLayoutPiece(_H.floor(objectFrameworkArea.objectFramework.pieces.length * Math.random())));
            pc.x = _H.floor(Math.random() * pe.pieceLayoutMaker.pieceLayout.width);
            pc.y = _H.floor(Math.random() * pe.pieceLayoutMaker.pieceLayout.height);

            pe.pieceLayoutMaker.selectedPieceIndex = pe.pieceLayoutMaker.pieceLayout.pieces.length - 1;

            buildleftScroll();
        }));

        function buildleftScroll() {
            var bd;

            listOfPieces.controls = [];
            for (var i = 0; i < pieceLayout.pieces.length; i++) {

                listOfPieces.addControl(bd = new ImageButton(0, 0, 0, 0, function () {
                    return objectFrameworkArea.objectFramework.pieces[this.state.pieceIndex].name;
                }, "10pt Arial", function (canvas, x, y) {
                    var pc = objectFrameworkArea.objectFramework.pieces[this.state.pieceIndex];
                    var ast = objectFrameworkArea.objectFramework.assets[pc.assetIndex];
                    if (ast.frames.length == 0) return;
                    ast.frames[0].drawSimple(canvas, { x: x, y: y }, this.width, this.height - 15, pc.xflip, pc.yflip);
                }, function () {

                    for (var j = 0; j < listOfPieces.controls.length; j++) {
                        if (this == listOfPieces.controls[j]) {
                            listOfPieces.controls[j].toggled = true;
                            pe.pieceLayoutMaker.selectedPieceIndex = j;
                        } else {
                            listOfPieces.controls[j].toggled = false;
                        }
                    }

                    for (var j = 0; j < selectPieceScroll.controls.length; j++) {

                        selectPieceScroll.controls[j].state.piece = this.state;
                        selectPieceScroll.controls[j].toggled = (j == pieceLayout.pieces[pe.pieceLayoutMaker.selectedPieceIndex].pieceIndex);

                    }

                }));
                bd.toggle = true; 
                bd.state = pieceLayout.pieces[i];
                if (i == pe.pieceLayoutMaker.selectedPieceIndex) bd.toggled = true;
            }
        }

        buildleftScroll();

        objectFrameworkArea.mainPanel.updatePieces = function () {
            var df;
            for (var j = 0; j < listOfPieces.controls.length; j++) {
                if (j == pe.pieceLayoutMaker.selectedPieceIndex) {
                    listOfPieces.controls[j].toggled = true;
                    df = listOfPieces.controls[j];
                }
                else {
                    listOfPieces.controls[j].toggled = false;
                }
            }

            for (var j = 0; j < objectFrameworkArea.mainPanel.selectPieceScroll.controls.length; j++) {
                df.piece = this;
                if (df.piece.pieceIndex == j)
                    objectFrameworkArea.mainPanel.selectPieceScroll.controls[j].toggled = true;
                else
                    objectFrameworkArea.mainPanel.selectPieceScroll.controls[j].toggled = false;
            }


        };





    };

    objectFrameworkArea.loadProjectile = function (projectile) {

        objectFrameworkArea.clearMainArea();


        objectFrameworkArea.mainPanel.addControl(new TextArea(25, 25, "Name: ", sonicManager.uiManager.textFont, "black"));
        objectFrameworkArea.mainPanel.addControl(new TextBox(100, 5, 290, 25, projectile.name, sonicManager.uiManager.buttonFont, "rgb(50,150,50)", function () { projectile.name = this.text; }));
        var b;
        objectFrameworkArea.mainPanel.addControl(b = new Button(40, 160, 70, 25, "XFlip", sonicManager.uiManager.buttonFont, "rgb(50,150,50)", function () {
            projectile.xflip = b.toggled;
        }));
        b.toggle = true;
        b.toggled = projectile.xflip;

        var c;
        objectFrameworkArea.mainPanel.addControl(c = new Button(115, 160, 70, 25, "YFlip", sonicManager.uiManager.buttonFont, "rgb(50,150,50)", function () {
            projectile.yflip = c.toggled;
        }));
        c.toggle = true;
        c.toggled = projectile.yflip;


        var jd;
        objectFrameworkArea.mainPanel.addControl(jd = new HScrollBox(20, 35, 70, 4, 112, "rgb(50,60,127)"));
        var bd;
        jd.controls = [];
        for (var i = 0; i < objectFrameworkArea.objectFramework.assets.length; i++) {
            jd.addControl(bd = new ImageButton(0, 0, 0, 0, function () { return this.state.name; }, "10pt Arial", function (canvas, x, y) {
                if (this.state.frames.length == 0) return;
                this.state.frames[0].drawSimple(canvas, { x: x, y: y }, this.width, this.height - 15, projectile.xflip, projectile.yflip);
            }, function () {


                for (var j = 0; j < jd.controls.length; j++) {
                    if (jd.controls[j] == this) {
                        if (projectile.assetIndex == j)
                            this.toggled = true;

                        projectile.assetIndex = j;
                        continue;
                    }
                    jd.controls[j].toggled = false;
                }

            }));
            bd.toggle = true;
            bd.state = objectFrameworkArea.objectFramework.assets[i];
            if (projectile.assetIndex == i) {
                bd.toggled = true;
            }
        }


    };
    window.imageUploaded = function (img) {
        _H.loadSprite(img, function (image) {
            objectFrameworkArea.mainPanel.frameArea.currentFrame.uploadImage(image);
            var ce = objectFrameworkArea.mainPanel.frameArea.colorEditor;
            ce.init(objectFrameworkArea.mainPanel.frameArea.currentFrame);
            ce.editor.showOutline = false;
            ce.editable = false;
            ce.click = function (e) {
                if (objectFrameworkArea.mainPanel.frameArea.currentFrame) {
                    objectFrameworkArea.mainPanel.frameArea.currentFrame.offsetX = e.x;
                    objectFrameworkArea.mainPanel.frameArea.currentFrame.offsetY = e.y;
                }
            };

            objectFrameworkArea.mainPanel.frameArea.palatteArea.init(objectFrameworkArea.mainPanel.frameArea.currentFrame.palette, true);
        });
    };

    objectFrameworkArea.loadAsset = function (asset) {

        objectFrameworkArea.clearMainArea();


        objectFrameworkArea.mainPanel.addControl(new TextArea(25, 25, "Name: ", sonicManager.uiManager.textFont, "black"));
        objectFrameworkArea.mainPanel.addControl(new TextBox(100, 5, 290, 25, asset.name, sonicManager.uiManager.buttonFont, "rgb(50,150,50)", function () { asset.name = this.text; }));
        objectFrameworkArea.mainPanel.addControl(new Button(400, 5, 100, 25, "Add Frame", sonicManager.uiManager.buttonFont, "rgb(50,150,50)", function () {

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

            objectFrameworkArea.mainPanel.populate(asset);
        }));

        var jd;
        objectFrameworkArea.mainPanel.addControl(jd = new HScrollBox(20, 35, 70, 4, 112, "rgb(50,60,127)"));
        objectFrameworkArea.mainPanel.populate = function (ast) {
            var bd;
            jd.controls = [];
            for (var i = 0; i < ast.frames.length; i++) {
                jd.addControl(bd = new ImageButton(0, 0, 0, 0, function () { return this.state.name; }, "10pt Arial", function (canvas, x, y) {
                    this.state.drawSimple(canvas, { x: x, y: y }, this.width, this.height - 15);
                }, function () {
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
            objectFrameworkArea.mainPanel.frameArea.currentFrame = frame;
            var ce;
            objectFrameworkArea.mainPanel.frameArea.addControl(new TextArea(15, 21, "Name: ", sonicManager.uiManager.textFont, "black"));
            objectFrameworkArea.mainPanel.frameArea.addControl(new TextBox(90, 0, 395, 25, frame.name, sonicManager.uiManager.buttonFont, "rgb(50,150,50)", function () { frame.name = this.text; }));


            objectFrameworkArea.mainPanel.frameArea.addControl(new TextArea(0, 275, function () { return "Width:  " + frame.width; }, sonicManager.uiManager.smallTextFont, "Black"));

            objectFrameworkArea.mainPanel.frameArea.addControl(new Button(75, 275 - 25, 14, 17, "^", sonicManager.uiManager.buttonFont, "rgb(50,150,50)", function () {
                frame.width = Math.min(frame.width + 1, 100);
            }));
            objectFrameworkArea.mainPanel.frameArea.addControl(new Button(75, 275 - 5, 14, 20, "v", sonicManager.uiManager.buttonFont, "rgb(50,150,50)", function () {
                frame.width = Math.max(frame.width - 1, 1);
            }));

            objectFrameworkArea.mainPanel.frameArea.addControl(new TextArea(0, 320, function () { return "Height: " + frame.height; }, sonicManager.uiManager.smallTextFont, "Black"));

            objectFrameworkArea.mainPanel.frameArea.addControl(new Button(75, 320 - 25, 14, 17, "^", sonicManager.uiManager.buttonFont, "rgb(50,150,50)", function () {
                frame.height = Math.min(frame.height + 1, 100);
            }));
            objectFrameworkArea.mainPanel.frameArea.addControl(new Button(75, 320 - 5, 14, 20, "v", sonicManager.uiManager.buttonFont, "rgb(50,150,50)", function () {
                frame.height = Math.max(frame.height - 1, 1);
            }));

            var bt;
            objectFrameworkArea.mainPanel.frameArea.addControl(bt = new Button(230 - 55, 35, 150, 25, "Collide Map", sonicManager.uiManager.buttonFont, "rgb(50,150,50)", function () {
                ce.showCollideMap = this.toggled;
            }));
            bt.toggle = true;
            objectFrameworkArea.mainPanel.frameArea.addControl(bt = new Button(390 - 55, 35, 150, 25, "Hurt Map", sonicManager.uiManager.buttonFont, "rgb(50,150,50)", function () {
                ce.showHurtMap = this.toggled;
            }));
            bt.toggle = true;

            objectFrameworkArea.mainPanel.frameArea.addControl(objectFrameworkArea.mainPanel.frameArea.colorEditor = new ColorEditingArea(230 - 55, 65, { width: 310, height: 225 }, true));
            var ce = objectFrameworkArea.mainPanel.frameArea.colorEditor;
            ce.init(frame);
            ce.editor.showOutline = false;
            ce.editable = false;
            ce.click = function (e) {
                frame.offsetX = e.x;
                frame.offsetY = e.y;
            };
            objectFrameworkArea.mainPanel.frameArea.addControl(new HtmlBox(19, 64, 120, 31, function () {
                var sc = document.getElementById("picFieldUploader");

                sc.style.left = (objectFrameworkArea.x + 320 + 7 + 19) + "px";
                sc.style.top = (objectFrameworkArea.y + 150 + 155 + 64) + "px";
                sc.style.position = "absolute";
                sc.style.visibility = "visible";
            }, function (x, y) {
                var sc = document.getElementById("picFieldUploader");
                if (sc) {
                    if (sc.style.left == x + "px" && sc.style.top == y + "px")
                        return;
                    sc.style.left = x + "px";
                    sc.style.top = y + "px";
                }
            }, function () {
                var sc = document.getElementById("picFieldUploader");
                if (sc) {
                    sc.style.visibility = "visible";
                }
            }, function () {
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

            objectFrameworkArea.mainPanel.frameArea.addControl(new Button(230 - 55, 305 + 11 * 2, 310, 25, "Edit Map", sonicManager.uiManager.buttonFont, "rgb(50,150,50)", function () {
                sonicManager.uiManager.colorEditorArea.init(frame);
                sonicManager.uiManager.colorEditorArea.visible = true;
                sonicManager.uiManager.colorEditorArea.depth = objectFrameworkArea.depth + 1;
                objectFrameworkArea.loseFocus();

            }));

        };


    };

    objectFrameworkArea.populate = function (object) {
        objectFrameworkArea.clearMainArea();
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
        this.pieceLayouts.controls = [];
        for (i = 0; i < object.pieceLayouts.length; i++) {
            this.pieceLayouts.addControl(b = new Button(0, 0, 0, 0, function () { return this.state.name; }, "10pt Arial", "rgb(50,190,90)", function () {
                b1.toggled = false;
                b2.toggled = false;
                b3.toggled = false;
                b4.toggled = false;
                objectFrameworkArea.loadPieceLayout(this.state);
            }));
            b.state = object.pieceLayouts[i];
        }
        this.projectiles.controls = [];
        for (i = 0; i < object.projectiles.length; i++) {
            this.projectiles.addControl(b = new Button(0, 0, 0, 0, function () { return this.state.name; }, "10pt Arial", "rgb(50,190,90)", function () {
                b1.toggled = false;
                b2.toggled = false;
                b3.toggled = false;
                b4.toggled = false;
                objectFrameworkArea.loadProjectile(this.state);
            }));
            b.state = object.projectiles[i];
        }
    };


};