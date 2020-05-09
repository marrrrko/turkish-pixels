const fontStyles = require('../font-styles')
const _ = require('lodash')
const PIXI = require('pixi.js')
const actions = require('../state/actions')
const events = require('events');
const eventEmitter = new events.EventEmitter();

function createWorld(stateStore, appContext) {
    
    let engine = null    

    const createWorldEngine = function() {    

        const engineConfig = {
            mapDataPath: "assets/village-map.json",
            tileHeight: 165,
            isoAngle: 27,
            mapDraggable: false,
            highlightPath: false,
            highlightTargetTile: false,
            initialPositionFrame: { 
                x: 0,
                y: 0,
                w: appContext.effectiveWidth,
                h: appContext.effectiveHeight
            },
            backgroundColor: 0x356e08,
            engineInstanceReadyCallback: playWorld,
            tileSelectCallback: tileSelected,
            objectSelectCallback: objectSelected,
            objectReachedDestinationCallback: playerHasReachedDestination
        }

        return TRAVISO.getEngineInstance(engineConfig)
    }    

    const playWorld = function() {

    }

    const tileSelected = function(tileNumber) {        
        
    }

    const objectSelected = function(view) {
        console.log(`Object selected: ${JSON.stringify(view)}`)
    }
    
    const playerHasReachedDestination = function(view) {
        if(playerIsInExitToForrest(view.mapPos)) {
            eventEmitter.emit("relocate", "forest", "village")
        }
    }

    const playerIsInExitToForrest = function(mapPos) {
        if(mapPos.r <= 3 && mapPos.c <= 3) {
            return true
        }

        return false
    }

    engine = createWorldEngine()

    const getEngine = function() {
        return engine
    }

    return {
        getEngine
    }

}

module.exports = {
    createWorld,
    eventEmitter
}
