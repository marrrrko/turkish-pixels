const fontStyles = require('../font-styles')
const _ = require('lodash')
const PIXI = require('pixi.js')
const actions = require('../state/actions')
const events = require('events');
const eventEmitter = new events.EventEmitter();

function createWorld(stateStore, appContext) {

    let lastTargetWord = null
    let engine = null
    let guessPane = null    

    const createWorldEngine = function() {    

        const engineConfig = {
            mapDataPath: "assets/forest-map.json", 
            tileHeight: 161,
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
            backgroundColor: 0xFFEABF,
            engineInstanceReadyCallback: playWorld,
            tileSelectCallback: tileSelected,
            objectSelectCallback: objectSelected,
            objectReachedDestinationCallback: playerHasReachedDestination
        }

        return TRAVISO.getEngineInstance(engineConfig)
    }    

    const playWorld = function() {
            spreadSomeWords()        
    }

    const calculateDistance =function(pos1, pos2) {
        return Math.pow(
                Math.pow(Math.abs(pos1.c - pos2.c),2)
                + Math.pow(Math.abs(pos1.r - pos2.r),2)
        , 0.5)
    }

    const tileSelected = function(tileNumber) {        
        closeGuessPaneIfOpen()        
    }

    const objectSelected = function(view) {
        console.log(`Object selected: ${JSON.stringify(view)}`)
    }

    const WORD_MAX_DISTANCE = 1.5
    const playerHasReachedDestination = function(view) {
        if(lastTargetWord) {            
            const distanceToClickedWord = calculateDistance(view.mapPos, lastTargetWord.pos)        

            if(distanceToClickedWord <= WORD_MAX_DISTANCE) {
                setTimeout(() => {                    
                    guessWord(lastTargetWord.word, lastTargetWord.fruit)
                    lastTargetWord = null
                }, 250)
            }
        }

        if(playerIsInExitToVillage(view.mapPos)) {
            eventEmitter.emit("relocate", "village", "forest")
        } else {
            console.log(`Arrived at r/w ${view.mapPos.r}/${view.mapPos.c}`)
        }
    }

    const playerIsInExitToVillage = function(mapPos) {
        if(mapPos.r >= 36 && mapPos.c <= 3) {
            return true
        }

        return false
    }

    const guessWord = function(word, fruit) {

        const paneWidth = 300
        const paneHeight = 500

        const rectangle = new PIXI.Graphics();
        const backgroundColor = 0xffd000
        rectangle.beginFill(backgroundColor)
        rectangle.lineStyle(4, 0xAFAFAF, 1)
        rectangle.drawRoundedRect(0, 0, paneWidth, paneHeight, 10)
        rectangle.endFill()

        guessPane = new PIXI.Container()
        guessPane.addChild(rectangle)

        guessPane.x = (appContext.effectiveWidth / 2) - (paneWidth / 2)
        guessPane.y = (appContext.effectiveHeight / 2) - (paneHeight / 2)

        const titleText = new PIXI.Text(word.turkish, fontStyles.guessWordMainTextStyle);
        titleText.anchor.set(0.5, 0.5)
        titleText.x = paneWidth / 2
        titleText.y = 35
        guessPane.addChild(titleText)

        const options = buildWordOptions([word])
        const buttonWidth = paneWidth - 50
        const buttonHeight = 40
        const xOffset = (paneWidth / 2) - (buttonWidth / 2)        
        options.forEach((optionWord, index) => {
            const yOffset = 35 + ((index + 1) * 45)
            guessPane.addChild(createGuessOptionButton(
                optionWord,
                fruit,
                buttonWidth,
                buttonHeight,
                xOffset,
                yOffset,
                word.turkish == optionWord.turkish
            ))
        })

        appContext.app.stage.addChild(guessPane)
    }

    const createGuessOptionButton = function(word, fruit, buttonWidth, buttonHeight, xOffset, yOffzet, isCorrectAnswer) {

        const rectangle = new PIXI.Graphics();
        const backgroundColor = 0x00
        rectangle.beginFill(backgroundColor)
        rectangle.lineStyle(4, 0x242424, 1)
        rectangle.drawRoundedRect(0, 0, buttonWidth, buttonHeight, 5)
        rectangle.endFill()

        const button = new PIXI.Container()
        button.addChild(rectangle)

        const optionText = new PIXI.Text(word.english, fontStyles.guessWordOptionTextStyle);
        optionText.x = buttonWidth / 2 - optionText.width / 2
        optionText.y = buttonHeight /2 - optionText.height / 2

        button.addChild(optionText)
        button.x = xOffset
        button.y = yOffzet

        button.interactive = true
        button.buttonMode = true

        button.on('pointerup', () => {
            guessPane.removeChildren(2, 11)
            let resultText
            if(isCorrectAnswer) {
                resultText = new PIXI.Text("Correct!", fontStyles.guessWordCorrect);
                stateStore.dispatch(actions.guessedWordCorrectly(word.id, new Date))
            } else {
                resultText = new PIXI.Text("Wrong!", fontStyles.guessWordIncorrect);
            }

            resultText.x = guessPane.width / 2 - resultText.width / 2
            resultText.y = guessPane.height / 2 - resultText.height

            guessPane.addChild(resultText)
            engine.mapContainer.removeChild(fruit)

            setTimeout(closeGuessPaneIfOpen, 1000)
        })

        return button
    }

    const closeGuessPaneIfOpen = function() {
        if(guessPane) {
            appContext.app.stage.removeChild(guessPane)
            guessPane = null
        }
    }

    const buildWordOptions = function(existingOptions) {
        if(existingOptions.length == 9)
            return _.shuffle(existingOptions)

        return buildWordOptions(
            _.uniqBy(
                existingOptions.concat(
                    _.sample(appContext.wordDatabase.all)
                ),
                w => w.turkish
            )
        )
    }

    const spreadSomeWords= function() {
        let treePositions = getTreePositions()    

        const appleTexture = PIXI.loader.resources["assets/apple.png"].texture    
        //appleTexture.frame = new pixi.Rectangle(0, 0, 95, 95)    

        treePositions.forEach(p => {
            const word = _.sample(appContext.wordDatabase.all)
            addWordAtLocation(p, word, appleTexture)
        })
    }

    const addWordAtLocation = function (position, word, appleTexture) {
        const wordFruit = createWordFruit(position, word, appleTexture)
        //window.wf = window.wf || []
        //window.wf.push(wordFruit)
        engine.mapContainer.addChild(wordFruit);    
    }

    const wordFruitFontStyle = fontStyles.forestWordTextStyle
    const createWordFruit = function(position, word, appleTexture) {    
        
        const x = engine.getTilePosXFor(position.r, position.c)
        const y = engine.getTilePosYFor(position.r, position.c)

        const wordText = new PIXI.Text(word.turkish, wordFruitFontStyle)
        const textWidth = wordText.width
        wordText.x = x - (textWidth / 2);
        wordText.y = y - 85;
        
        const appleSprite = new PIXI.Sprite(appleTexture)            
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

            const currentPosition = engine.getCurrentControllable().mapPos
            const dist = calculateDistance(currentPosition, position)

            if(dist <= WORD_MAX_DISTANCE) {
                guessWord(word, wordFruit)
            } else {
                lastTargetWord = {
                    pos: {
                        r: position.r,
                        c: position.c
                    },
                    word,
                    fruit: wordFruit
                }
            }
        })

        return wordFruit
    }

    const getTreePositions = function() {

        let allPositions = _.flatten(
            Array(engine.mapSizeC)
            .fill(-1)
            .map((value,index) => index)
            .map(colIndex => {
                return Array(engine.mapSizeR)
                    .fill(-1)
                    .map((value,index) => { return { r: index, c: colIndex}})
            })
        )
        let treePositions = allPositions.filter(pos => {
            const itemsAtLocation = engine.getObjectsAtLocation(pos)
            return itemsAtLocation && itemsAtLocation.filter(i => i.type > 0 && i.type <= 5).length
        })

        return treePositions
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
