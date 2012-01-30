<%@ Page Language="C#" AutoEventWireup="true" CodeFile="Game.aspx.cs" Inherits="Game" %>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
    <meta name="viewport" content="width = device-width, initial-scale = 1, minimum-scale = 1, maximum-scale = 1, user-scalable = no" />
    <title>Our Sonic</title>
    <script src="http://ajax.googleapis.com/ajax/libs/jquery/1.6.1/jquery.js" type="text/javascript">
    </script>
    <script src="javascript/linq.js?1" type="text/javascript"> 
    </script>
    <script src="javascript/Color.js?1" type="text/javascript"> 
    </script>
    <script src="javascript/Help.js?1" type="text/javascript"> 
    </script>
    <script src="javascript/Stats.js?1" type="text/javascript"> 
    </script>
    <script src="javascript/Tile.js?1" type="text/javascript"> 
    </script>
    <script src="javascript/Ring.js?1" type="text/javascript"> 
    </script>
    <script src="javascript/TileChunk.js?1" type="text/javascript"> 
    </script>
    <script src="javascript/TilePiece.js?1" type="text/javascript"> 
    </script>
    <script src="javascript/HeightMask.js?1" type="text/javascript"> 
    </script>
    <script src="javascript/Tile.js?1" type="text/javascript"> 
    </script>
    <script src="javascript/UIArea.js?1" type="text/javascript"> 
    </script>
    <script src="javascript/Sonic.js?1" type="text/javascript"> 
    </script>
    <script src="javascript/SonicManager.js?1" type="text/javascript"> 
    </script>
    <script src="javascript/UIManager.js?1" type="text/javascript"> 
    </script>
    <script src="javascript/SonicEngine.js?1" type="text/javascript"> 
    </script>
    <script type="text/javascript">
                                //<![CDATA[
        $(function () {
            var stats = new Stats();

            // Align top-left
            stats.getDomElement().style.position = 'absolute';
            stats.getDomElement().style.left = '0px';
            stats.getDomElement().style.top = '0px';

            document.body.appendChild(stats.getDomElement());

            setInterval(function () {

                stats.update();

            }, 1000 / 60);

            
            var myCanv = new SonicEngine("build");



        }); 
                        //]]>
    </script>
</head>
<body style="background-color: #000080;">
    <form id="form1" runat="server">
    <asp:ScriptManager runat="server" ID="scriptManager">
        <Services>
            <asp:ServiceReference Path="SonicLevels.asmx" />
        </Services>
    </asp:ScriptManager>
    <canvas id="build" style="margin: 0px; position: absolute; top: 0px; left: 0px;"></canvas>
   
    </form>
</body>
</html>
