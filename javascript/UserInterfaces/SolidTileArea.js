window.SolidTileArea = function() {

    var solidTileArea = sonicManager.uiManager.solidTileArea = new UiArea(40, 450, 430, 400, sonicManager.uiManager, true);
    solidTileArea.visible = false;
    sonicManager.uiManager.UIAreas.push(solidTileArea);
    solidTileArea.addControl(new TextArea(30, 25, "Modify Solid Tile", sonicManager.uiManager.textFont, "blue"));


    solidTileArea.addControl(new Button(50, 35, 25, 22, "<<", sonicManager.uiManager.buttonFont, "rgb(50,150,50)",
        function() {
            if (sonicManager.uiManager. indexes.tpIndex > 0)
                sonicManager.uiManager.modifyTilePieceArea.tilePiece = sonicManager.SonicLevel.Blocks[--sonicManager.uiManager.sonicManager.uiManager.indexes.tpIndex];
        }));

    solidTileArea.addControl(new Button(75, 35, 25, 22, ">>", sonicManager.uiManager.buttonFont, "rgb(50,150,50)",
        function() {
            if (sonicManager.uiManager.indexes.tpIndex < sonicManager.SonicLevel.Blocks.length)
                sonicManager.uiManager.modifyTilePieceArea.tilePiece = sonicManager.SonicLevel.Blocks[++sonicManager.uiManager.indexes.tpIndex];
        }));
    solidTileArea.addControl(new Button(360, 80, 45, 22, "Full", sonicManager.uiManager.buttonFont, "rgb(50,150,50)",
        function() {
            for (var i = 0; i < 16; i++) {
                sonicManager.uiManager.modifyTilePieceArea.tilePiece.heightMask.items[i] = 16;

            }
            this.sprites = [];
        }));

    solidTileArea.addControl(new Button(360, 130, 45, 22, "XFlip", sonicManager.uiManager.buttonFont, function() {
        if (sonicManager.uiManager.modifyTilePieceArea.tpc.XFlip) {
            return "rgb(190,120,65)";
        } else {
            return "rgb(50,150,50)";
        }
    },
        function() {
            sonicManager.uiManager.modifyTilePieceArea.tpc.XFlip = !sonicManager.uiManager.modifyTilePieceArea.tpc.XFlip;
        }));
    solidTileArea.addControl(new Button(360, 160, 45, 22, "YFlip", sonicManager.uiManager.buttonFont, function() {
        if (sonicManager.uiManager.modifyTilePieceArea.tpc.YFlip) {
            return "rgb(190,120,65)";
        } else {
            return "rgb(50,150,50)";
        }
    },
        function() {
            sonicManager.uiManager.modifyTilePieceArea.tpc.YFlip = !sonicManager.uiManager.modifyTilePieceArea.tpc.YFlip;
        }));

    solidTileArea.addControl(new Button(200, 35, 180, 22, "Modify Height Map", sonicManager.uiManager.buttonFont, "rgb(50,150,50)",
        function() {
            sonicManager.uiManager.modifyTilePieceArea.state = (sonicManager.uiManager.modifyTilePieceArea.state + 1) % 3;
            switch (sonicManager.uiManager.modifyTilePieceArea.state) {
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
};