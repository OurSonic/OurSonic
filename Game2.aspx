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
    <script src="lib/linq.js?1" type="text/javascript"> 
    </script> 
    <script src="javascript/FunctionWorker.js?1" type="text/javascript"> 
    </script> 
    <script src="lib/Stats.js?1" type="text/javascript"> 
    </script>
    <script src="lib/keyboardjs.js?1" type="text/javascript"> 
    </script> 
        <script src="javascript/curCompress.js?1" type="text/javascript"> 
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
    
    <canvas id="gameLayer" style="margin: 0px; position: absolute; top: 0px; left: 0px; z-index: 0;"></canvas>
    <canvas id="uiLayer" style="margin: 0px; position: absolute; top: 0px; left: 0px; z-index: 0;"></canvas>
    
    <input type="file" id="picField" style="position: absolute; z-index: 100;">
    </form>
</body>
</html>
