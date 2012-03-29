window._TileChunkArea = function() {
    var modifyTC = sonicManager.uiManager.modifyTC = new TileChunkArea(30, 70, { x: 2, y: 2 }, null, 1);

    sonicManager.uiManager.modifyTileChunkArea.addControl(modifyTC);

    sonicManager.uiManager.modifyTileChunkArea.addControl(new Button(50, 35, 25, 22, "<<", sonicManager.uiManager.buttonFont, "rgb(50,150,50)",
        function() {
            if (sonicManager.uiManager.indexes.modifyIndex > 0)
                modifyTC.tileChunk = sonicManager.SonicLevel.Chunks[--sonicManager.uiManager.indexes.modifyIndex];
        }));
        sonicManager.uiManager.modifyTileChunkArea.addControl(new Button(80, 35, 25, 22, ">>", sonicManager.uiManager.buttonFont, "rgb(50,150,50)",
        function() {
            if (sonicManager.uiManager.indexes.modifyIndex < sonicManager.SonicLevel.Chunks.length)
                modifyTC.tileChunk = sonicManager.SonicLevel.Chunks[++sonicManager.uiManager.indexes.modifyIndex];
        }));
};