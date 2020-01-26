function createWorld(width, height) {    

    const createEngine = function () {
        const engineConfig = {
            mapDataPath: "assets/forest-map.json", 
            assetsToLoad: [
                "assets/grass_s.png",
                "assets/vox/rocas_1_s.png",
                "assets/vox/arbol_1_s.png",
                "assets/vox/arbol_2_s.png",
                "assets/vox/arbol_3_s.png",
                "assets/vox/arbol_4_s.png",
                "assets/vox/arbol_5_s.png",
                "assets/fred_map_s.json"
            ],
            tileHeight: 98,
            isoAngle: 36,
            mapDraggable: false,
            highlightPath: false,
            highlightTargetTile: false,
            initialPositionFrame: { 
                x: 00,
                y: 0,
                w: width,
                h: height
            },
            backgroundColor: 0x356e08,
            engineInstanceReadyCallback: start
        };

        return TRAVISO.getEngineInstance(engineConfig);
    }    

    const getEngine = function() {
        return engine;
    }

    const start = function() {
        var ttext = new PIXI.Text('Merhaba')
        ttext.x = engine.getTilePosXFor(8,8);
        ttext.y = engine.getTilePosYFor(8,8);
        var container = new PIXI.Container();
        engine.mapContainer.addChild(container);
        container.addChild(ttext);
    }

    let engine = createEngine()
    return {
        getEngine
    }
}

module.exports = {
    createWorld
}