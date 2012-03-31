<%@ Page Language="C#" AutoEventWireup="true" CodeFile="Game.aspx.cs" Inherits="Game" %>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head id="Head1" runat="server">
    <meta name="viewport" content="width = device-width, initial-scale = 1, minimum-scale = 1, maximum-scale = 1, user-scalable = no" />
    <title>Our Sonic</title>
    <script src="lib/jquery.js" type="text/javascript">
    </script>
    <link rel="stylesheet" href="lib/codemirror.css">
    <script src="lib/codemirror.js"></script>
    <script src="lib/mode/javascript/javascript.js"></script>
    <script src="lib/util/simple-hint.js"></script>
    <link rel="stylesheet" href="lib/util/simple-hint.css">
    <script src="lib/util/javascript-hint.js"></script>
    <link rel="stylesheet" href="lib/theme/night.css">
    <script src="javascript/linq.js?1" type="text/javascript"> 
    </script>
    <script src="javascript/Stats.js?1" type="text/javascript"> 
    </script>
    <script src="javascript/WorkerConsole.js?1" type="text/javascript"> 
    </script>
    <script src="javascript/FunctionWorker.js?1" type="text/javascript"> 
    </script>
    <script src="lib/keyboardjs.js?1" type="text/javascript"> 
    </script>
    <script src="javascript/Help.js?1" type="text/javascript"> 
    </script>
    <script type="text/javascript">
    //<![CDATA[

        $(function () {
            var stats = new xStats;
            document.body.appendChild(stats.element);


            var oldLeft = 0;
            var oldTop = 0;

            var gameCanvasItem = $("#gameLayer");
            var gameCanvas = document.getElementById("gameLayer").getContext("2d");


            var element = document.getElementById("gameLayer");
            var canvasMoving = null;
            var canvasOnClick = function (e) {
                canvasMoving = { x: e.x, y: e.y };

            };
            var canvasMouseUp = function (e) {
                canvasMoving = null;
            };
            var canvasMouseMove = function (e) {
                if (canvasMoving) {
                    oldLeft = e.x - canvasMoving.x;
                    oldTop = e.y - canvasMoving.y;

                    canvasMoving = { x: e.x, y: e.y };

                }
            };


            element.addEventListener('mousedown', canvasOnClick);
            element.addEventListener('mouseup', canvasMouseUp);
            element.addEventListener('mousemove', canvasMouseMove);
            window.onscroll = scroll;

            function scroll(e) {
                e.preventDefault();
                return false;
            }


            var img = new Image();
            img.src = "assets/4.png";
            img.onload = function() {
                for (var i = 0; i < 20; i++) {
                    for (var a = 0; a < 20; a++) {
                        gameCanvas.drawImage(img, i * img.width, a * img.height);
                    }
                }
            };


            gameCanvasItem.attr("width", 20 * 128);
            gameCanvasItem.attr("height", 20 * 128);

            function drawit() {

                if (oldLeft != 0 || oldTop != 0) {

                    gameCanvasItem.css("left", (parseInt(gameCanvasItem.css("left").replace('px', '')) + oldLeft) + "px");
                    gameCanvasItem.css("top", (parseInt(gameCanvasItem.css("top").replace('px', '')) + oldTop) + "px");
                    oldLeft = 0;
                    oldTop = 0;
                }
            }

            window.setInterval(drawit, 1000 / 60);
            $("body").css("overflow", "hidden");
        }); 
        
 
   
    //]]>
        
    </script>
</head>
<body style="background-color: #000080;">
    <form id="form1" runat="server">
    <canvas id="gameLayer" style="margin: 0px; position: absolute; top: 0px; left: 0px;
        z-index: 0;"></canvas>
    </form>
</body>
</html>
