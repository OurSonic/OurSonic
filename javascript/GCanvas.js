




function GCanvas(canvasName) {
    that = this;
    this.canvas = $("#"+canvasName);
    this.canvasItem = document.getElementById(canvasName).getContext("2d");
    this.canvasWidth = 0;
    this.canvasHeight = 0;
     

    
    that.draggingNode = null;

    function getCursorPosition(event) { 
        if (event.targetTouches) event = event.targetTouches[0];
      
        var x;
        var y;
        if (event.pageX != null && event.pageY != null) return that.last = { x: event.pageX, y: event.pageY };
        var element = (!document.compatMode || document.compatMode == 'CSS1Compat') ? document.documentElement : document.body;
        return that.last = { x: event.clientX + element.scrollLeft, y: event.clientY + element.scrollTop }; 
    }



    function canvasOnClick(e) { 
        var cell = getCursorPosition(e);

        for (ij = 0; ij < that.nodes.length; ij++) {
            n = that.nodes[ij];
            if (n.x < cell.x && n.y < cell.y && n.x + n.radius * 2 > cell.x && n.y + n.radius * 2 > cell.y) {
                n.click({ node: n, x: cell.x, y: cell.y });
                that.draggingNode = n;
                that.draggingNode.drag.start({ node: n, x: cell.x, y: cell.y }  );
            }
        } 
    }


    function canvasMouseMove(e) {
        e.preventDefault();
        if (that.draggingNode) { 
            var cell = getCursorPosition(e);
            that.draggingNode.drag.move({ node: that.draggingNode, x: cell.x, y: cell.y });
        }
         

    }
    function canvasMouseUp(e) { 
        if (that.draggingNode) { 
            var cell = getCursorPosition(e); 
             that.draggingNode.drag.end({ node: that.draggingNode, x: cell.x, y: cell.y });
        
              that.draggingNode = null; 
        } 

    }




    document.getElementById(canvasName).addEventListener('touchmove', canvasMouseMove);
    document.getElementById(canvasName).addEventListener('touchstart', canvasOnClick);
    document.getElementById(canvasName).addEventListener('click', canvasOnClick);
    document.getElementById(canvasName).addEventListener('touchend', canvasMouseUp);


    that.nodes = [];


    that.resizeCanvas = function () {
        that.canvasWidth = $(window).width();
        that.canvasHeight = $(window).height();

        that.canvas.attr("width", that.canvasWidth);
        that.canvas.attr("height", that.canvasHeight);        
    };

    that.addGradient = function (x, y, rad, sc, ec) {
        that.nodes.push(f = { type: 'gradient', x: x, y: y, radius: rad, startCol: sc, endCol: ec });
        that.addNodeMethods(f);
        return f;
    };

    that.addNodeMethods = function (node) {
        node.click = function (e) { };
        node.drag = { start: function (e) { }, move: function (e) { }, end: function (e) { } };
    };

    that.drawGradient = function (a, b, radius, col1, col2) {

        a += radius;
        b += radius;

        var p = that.canvasItem.createRadialGradient(a, b, 0, a, b, radius);

        startColor = 15;
        startColor = 48;

        p.addColorStop(0, col1);
        p.addColorStop(1, col2);



        that.canvasItem.fillStyle = p;
        that.canvasItem.fillRect(a - radius, b - radius, radius * 2, radius * 2);
    };



    that.draw = function () {

        that.canvasItem.clearRect(0, 0, that.canvasWidth, that.canvasHeight);

        that.canvasItem.fillStyle = "red";
        that.canvasItem.font = "23pt Arial";

        if (that.last)
            that.canvasItem.fillText(that.last.x + " " + that.last.y, 100, 65);
        if (that.draggingNode)
            that.canvasItem.fillText(that.draggingNode, 100, 95);   


        for (ij = 0; ij < that.nodes.length; ij++) {
            n = that.nodes[ij];
            switch (n.type.toLowerCase()) {
                case 'gradient':
                    that.drawGradient(n.x, n.y, n.radius, n.startCol, n.endCol);
                    break;
            }
        }

    };

     
    $(window).resize(this.resizeCanvas);
    this.resizeCanvas();
    setInterval(this.draw, 10);
};
 