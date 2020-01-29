const fontStyles = require('../font-styles')
const _ = require('lodash')

let lastTargetWord = null

function createWorldEngine(width, height, readyCallback) {    

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
        engineInstanceReadyCallback: readyCallback,
        objectReachedDestinationCallback: playerHasReachedDestination
    };

    return TRAVISO.getEngineInstance(engineConfig);
}    

function playWorld(pixi, worldEngine, wordDatabase) {
        spreadSomeWords(pixi, worldEngine, wordDatabase)        
}

function playerHasReachedDestination(view) {
    console.log("I'm at " + JSON.stringify(view.mapPos))
    if(lastTargetWord) {
        console.log("Word: " + JSON.stringify(lastTargetWord))
        const distanceToClickedWord = 
            Math.pow(
                Math.pow(Math.abs(view.mapPos.c - lastTargetWord.c),2)
                + Math.pow(Math.abs(view.mapPos.r - lastTargetWord.r),2)
            , 0.5)

        if(distanceToClickedWord <= 1.5) {
            setTimeout(() => {
                alert(lastTargetWord.word.english)
                lastTargetWord = null
            }, 250)
        }
    }
}

function spreadSomeWords(pixi, worldEngine, wordDatabase) {
    let treePositions = getTreePositions(worldEngine)    

    const appleTexture = pixi.loader.resources["assets/apple.png"].texture    
    //appleTexture.frame = new pixi.Rectangle(0, 0, 95, 95)    

    treePositions.forEach(p => {
        const word = _.sample(wordDatabase.all)
        addWordAtLocation(pixi, worldEngine, p, word, appleTexture)
    })
}

function addWordAtLocation(pixi, worldEngine, position, word, appleTexture) {
    const wordFruit = createWordFruit(pixi, worldEngine, position, word, appleTexture)
    window.wf = window.wf || []
    window.wf.push(wordFruit)
    worldEngine.mapContainer.addChild(wordFruit);    
}

const wordFruitFontStyle = fontStyles.forestWordTextStyle
function createWordFruit(pixi, worldEngine, position, word, appleTexture) {    
    
    const x = worldEngine.getTilePosXFor(position.r, position.c)
    const y = worldEngine.getTilePosYFor(position.r, position.c)

    const wordText = new PIXI.Text(word.turkish, wordFruitFontStyle)
    const textWidth = wordText.width
    wordText.x = x - (textWidth / 2);
    wordText.y = y - 85;
    
    const appleSprite = new pixi.Sprite(appleTexture)            
    appleSprite.x = x - 15;
    appleSprite.y = y - 115
    appleSprite.width = 30
    appleSprite.height = 30
    
    const wordFruit = new PIXI.Container();        
    wordFruit.addChild(wordText)
    wordFruit.addChild(appleSprite)

    wordFruit.interactive = true;
    wordFruit.buttonMode = true;

    wordFruit.on('pointerup', () => {
        lastTargetWord = {
            r: position.r,
            c: position.c,
            word 
        }
    })

    return wordFruit
}

function getTreePositions(worldEngine) {

    let allPositions = _.flatten(
        Array(worldEngine.mapSizeC)
        .fill(-1)
        .map((value,index) => index)
        .map(colIndex => {
            return Array(worldEngine.mapSizeR)
                .fill(-1)
                .map((value,index) => { return { r: index, c: colIndex}})
        })
    )
    let treePositions = allPositions.filter(pos => {
        const itemsAtLocation = worldEngine.getObjectsAtLocation(pos)
        return itemsAtLocation && itemsAtLocation.filter(i => i.type > 0 && i.type <= 5).length
    })

    return treePositions
}

module.exports = {
    createWorldEngine,
    playWorld,
    spreadSomeWords,
    getTreePositions
}