window.LiveObjectsArea = function () {


    var liveObjectsArea = sonicManager.uiManager.liveObjectsArea = new UiArea(947, 95, 770, 700, sonicManager.uiManager, true);
    liveObjectsArea.visible = true;
    sonicManager.uiManager.UIAreas.push(liveObjectsArea);


    liveObjectsArea.addControl(new TextArea(30, 25, "Live Objects", sonicManager.uiManager.textFont, "blue"));
    var scl;
    liveObjectsArea.addControl(scl = new HScrollBox(20, 60, 85, 8, 85, "rgb(50,150,50)"));

    liveObjectsArea.populate = function (liveObjects) {
        for (var i = 0; i < scl.controls.length; i++) {
            scl.controls[i].checked = false;
        }


        for (var lo in liveObjects) {
            var satisfied = false;
            for (var i = 0; i < scl.controls.length; i++) {
                if (liveObjects[lo].index == scl.controls[i].object.index) {
                    scl.controls[i].checked = true;
                    satisfied = true;
                    break;
                }
            }
            if (!satisfied) {
                (function (obj) {
                    var dm;
                    scl.addControl(dm = new ImageButton(0, 0, 0, 0, obj.ObjectData.description + "(" + obj.ObjectData.key + ")", "9pt Arial bold", function (canv, x, y) {
                        obj.draw(canv, x + this.width / 2, y + this.height / 2, { x: 1, y: 1 }, false);
                    }, function () {
                        liveObjectsArea.debugConsole.populate(obj);
                    }));
                    dm.checked = true;
                    dm.object = obj;

                })(liveObjects[lo]);
            }
        }
        for (var i = scl.controls.length - 1; i >= 0; i--) {
            if (!scl.controls[i].checked) {
                _H.removeAt(scl.controls, i);
            }
        }
    };
    liveObjectsArea.addControl(liveObjectsArea.debugConsole = new Panel(20, 200, 730, 450, liveObjectsArea));

    liveObjectsArea.debugConsole.populate = function (obj) {
        liveObjectsArea.debugConsole.empty();
        liveObjectsArea.debugConsole.addControl(liveObjectsArea.debugConsole.watch = new ScrollBox(10, 15, 30, 12, 210, "rgb(50,150,50)"));
        for (var pr in obj) {
            if (!_H.isFunction(obj[pr])) {
                liveObjectsArea.debugConsole.watch.addControl(new Button(0, 0, 0, 0,
                    (function (_obj, _pr) {
                        return function () {
                            return _pr + ": " + _obj[_pr];
                        };
                    })(obj, pr),
                    "8pt Arial",
                    "rgb(50,190,90)",
                    function () {

                    }
                ));
            }
        }


        for (var l = 0; l < sonicManager.SonicLevel.Objects.length; l++) {
            sonicManager.SonicLevel.Objects[l].consoleLog = null;
        }

        obj.consoleLog = function (txt) {
            liveObjectsArea.debugConsole.element.innerHTML = txt.lines.join('\n');
            liveObjectsArea.debugConsole.element.scrollTop = liveObjectsArea.debugConsole.element.scrollHeight;
        };


        liveObjectsArea.debugConsole.addControl(new HtmlBox(270, 15, 445, 430, function () {

            var gm = liveObjectsArea.debugConsole.element;
            if (gm)
                gm.parentNode.removeChild(gm);

            $(document.body).append('<textarea id="console" name="console" style="position:absolute;width:445px;height:430px;"></textarea>');
            liveObjectsArea.debugConsole.element = document.getElementById('console');

        }, function (x, y) {

            var scroller = liveObjectsArea.debugConsole.element;
            if (scroller.style.left == x + "px" && scroller.style.top == y + "px")
                return;
            scroller.style.left = x + "px";
            scroller.style.top = y + "px";
        }, function () {
            var sc = liveObjectsArea.debugConsole.element;
            if (sc) {
                sc.style.visibility = "visible";
            }
        }, function () {
            var sc = liveObjectsArea.debugConsole.element;
            sc.blur();
            //            Engine.uiCanvasItem.focus();
            //            document.body.focus();

            //            editor.onBlur();

            if (sc) {
                sc.style.left = "-100px";
                sc.style.top = "-100px";
                sc.style.visibility = "hidden";
            }
        }));

    };

}