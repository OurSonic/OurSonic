<%@ Page Language="C#" AutoEventWireup="true" CodeFile="Game.aspx.cs" Inherits="Game" %>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
    <% string AJ = "a2aaas"; %>
    <meta name="viewport" content="width = device-width, initial-scale = 1, minimum-scale = 1, maximum-scale = 1, user-scalable = no" />
    <title>Our Sonic</title>
    <script src="lib/jquery.js" type="text/javascript"></script>
    <link rel="stylesheet" href="lib/codemirror.css">
    <script src="lib/codemirror.js"></script>
    <script src="lib/mode/javascript/javascript.js"></script>
    <script src="lib/util/simple-hint.js"></script>
    <link rel="stylesheet" href="lib/util/simple-hint.css">
    <script src="lib/util/javascript-hint.js"></script>
    <script src="lib/WebGL2d.js"></script>
    <link rel="stylesheet" href="lib/theme/night.css">
    <script src="lib/linq.js?<%= AJ %>" type="text/javascript"> 
    </script>
    <script src="javascript/WorkerConsole.js?<%= AJ %>" type="text/javascript"> 
    </script>
    <script src="javascript/FunctionWorker.js?<%= AJ %>" type="text/javascript"> 
    </script> 
    <script src="lib/Stats.js?<%= AJ %>" type="text/javascript"> 
    </script>
    <script src="lib/keyboardjs.js?<%= AJ %>" type="text/javascript"> 
    </script>
    <script src="javascript/Help.js?<%= AJ %>" type="text/javascript"> 
    </script>
    <script src="javascript/Editor.js?<%= AJ %>" type="text/javascript"> 
    </script>
    <script src="javascript/Tile.js?<%= AJ %>" type="text/javascript"> 
    </script>
    <script src="javascript/ObjectManager.js?<%= AJ %>" type="text/javascript"> 
    </script>
    <script src="javascript/Ring.js?<%= AJ %>" type="text/javascript"> 
    </script>
    <script src="javascript/ParallaxBG.js?<%= AJ %>" type="text/javascript"> 
    </script>
    <script src="javascript/TileItem.js?<%= AJ %>" type="text/javascript"> 
    </script>
    <script src="javascript/TileChunk.js?<%= AJ %>" type="text/javascript"> 
    </script>
    <script src="javascript/TilePiece.js?<%= AJ %>" type="text/javascript"> 
    </script>
    <script src="javascript/HeightMask.js?<%= AJ %>" type="text/javascript"> 
    </script>
    <script src="javascript/Tile.js?<%= AJ %>" type="text/javascript"> 
    </script>
    <script src="javascript/PieceLayoutMaker.js?<%= AJ %>" type="text/javascript"> 
    </script>
    <script src="javascript/Sonic.js?<%= AJ %>" type="text/javascript"> 
    </script>
    <script src="javascript/Sensor.js?<%= AJ %>" type="text/javascript"> 
    </script>
    <script src="javascript/SonicManager.js?<%= AJ %>" type="text/javascript"> 
    </script>
    <script src="javascript/UIManager.js?<%= AJ %>" type="text/javascript"> 
    </script>
    <script src="javascript/SonicEngine.js?<%= AJ %>" type="text/javascript"> 
    </script>
    <script src="javascript/UIArea.js?<%= AJ %>" type="text/javascript"> 
    </script>
    <script src="javascript/UserInterfaces/BGEditorArea.js?<%= AJ %>" type="text/javascript"> 
    </script>
    <script src="javascript/Animation.js?<%= AJ %>" type="text/javascript"> 
    </script>
    <script src="javascript/UserInterfaces/ColorEditorArea.js?<%= AJ %>" type="text/javascript"> 
    </script>
    <script src="javascript/UserInterfaces/LiveObjectsArea.js?<%= AJ %>" type="text/javascript"> 
    </script>
    <script src="javascript/UserInterfaces/DebuggerArea.js?<%= AJ %>" type="text/javascript"> 
    </script>
    <script src="javascript/UserInterfaces/LevelInformationArea.js?<%= AJ %>" type="text/javascript"> 
    </script>
    <script src="javascript/UserInterfaces/LevelManagerArea.js?<%= AJ %>" type="text/javascript"> 
    </script>
    <script src="javascript/UserInterfaces/ModifyTileArea.js?<%= AJ %>" type="text/javascript"> 
    </script>
    <script src="javascript/UserInterfaces/ModifyTilePieceArea.js?<%= AJ %>" type="text/javascript"> 
    </script>
    <script src="javascript/UserInterfaces/ModifyTileChunkArea.js?<%= AJ %>" type="text/javascript"> 
    </script>
    <script src="javascript/UserInterfaces/ModifyTilePieceArea.js?<%= AJ %>" type="text/javascript"> 
    </script>
    <script src="javascript/UserInterfaces/ObjectFrameworkListArea.js?<%= AJ %>" type="text/javascript"> 
    </script>
    <script src="javascript/UserInterfaces/ObjectFrameworkArea.js?<%= AJ %>" type="text/javascript"> 
    </script>
    <script src="javascript/UserInterfaces/ObjectInfoArea.js?<%= AJ %>" type="text/javascript"> 
    </script>
    <script src="javascript/UserInterfaces/SolidTileArea.js?<%= AJ %>" type="text/javascript"> 
    </script>
    <script src="javascript/UserInterfaces/TileChunkArea.js?<%= AJ %>" type="text/javascript"> 
    </script>
    <script src="javascript/UserInterfaces/TilePieceArea.js?<%= AJ %>" type="text/javascript"> 
    </script>
    <script type="text/javascript">
    //<![CDATA[

        $(function () {

            window.Worker = new FunctionWorker("javascript/FunctionWorker.js");
            /* fWorker.threadedFunction(
            function (e) {//start - in thread
            var j = 4 + 4;
            for (var a = 1; a < 1000; a++) {
            for (var i = 1; i < 2000000; i++) {
            j += i * 20;
            }
            for (var i = 1; i < 2000000; i++) {
            j -= i / 20;
            }
            if (a % 10 == 0) {
            e.callback(j);
            e.data = j;
            }
            }
            }, function (e) {//finish - not in thread
            $("body").append("<div>Finished: " + e.data + "</div>");


            }, function (e) {//callback - not in thread
            $("body").append("<div>Callback Data: " + e.data + "</div>");

            }
            );*/

            var stats = new xStats;
            document.body.appendChild(stats.element);

            var myCanv = new SonicEngine("gameLayer", "uiLayer");


        }); 
        
 
   
    //]]>
        
    </script>
    <script type="text/javascript" src="uploadify/swfobject.js"></script>
    <script type="text/javascript" src="uploadify/jquery.uploadify.v2.1.4.js"></script>
    <script type="text/javascript">
// <![CDATA[
        $(document).ready(function () {
            $('#picField').uploadify({
                'uploader': 'uploadify/uploadify.swf',
                'script': 'ReflectImage.ashx',
                'cancelImg': 'uploadify/cancel.png',
                'folder': 'uploads',
                'auto': true,
                onUpload: function (e) {
                    alert(_H.stringify(e));
                }
            });
        });
// ]]>
    </script>
</head>
<body style="background-color: #000080;">
    <form id="form1" runat="server">
    <asp:ScriptManager runat="server" ID="scriptManager">
        <Services>
            <asp:ServiceReference Path="SonicLevels.asmx" />
        </Services>
    </asp:ScriptManager>
    <div id="d_clip_container">
    </div>
    <canvas id="gameLayer" style="margin: 0px; position: absolute; top: 0px; left: 0px;
        z-index: 0;"></canvas>
    <canvas id="uiLayer" style="margin: 0px; position: absolute; top: 0px; left: 0px;
        z-index: 0;"></canvas>
    <input type="file" id="picField" style="position: absolute; z-index: 100;">
    </form>
    <script type="text/javascript">

        var _gaq = _gaq || [];
        _gaq.push(['_setAccount', 'UA-30696843-1']);
        _gaq.push(['_trackPageview']);

        (function () {
            var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
            ga.src = ('https:' == document.location.protocol ? 'https://ssl' : 'http://www') + '.google-analytics.com/ga.js';
            var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
        })();

    </script>
</body>
</html>
