const PIXI = require('pixi.js')
const screensTool = require('../screens-tool')
const buttonsTool = require('../buttons-tool')
const _ = require('lodash')

const textElementMinHeight = 100

function createGame(appContext, gameConfig) {

    const gameAreaWidth = Math.ceil(appContext.effectiveWidth * 0.85)
    const topBarClearance = appContext.topBarHeight + (appContext.baseMargin * 2)   
    const answerScreen = screensTool.createScreenSprite(gameAreaWidth, textElementMinHeight, false, true)     

    const gameArea = new PIXI.Container();
    const buttonArea = new PIXI.Container();        
    const cardArea = new PIXI.Container()
    cardArea.y = topBarClearance

    gameArea.addChild(buttonArea)
    gameArea.addChild(cardArea)            
    gameArea.addChild(answerScreen)

    let translationArgs = [appContext.wordDatabase]
    if(gameConfig.arguments)
        translationArgs = translationArgs.concat(gameConfig.arguments)

    const showScoreButtons = function() {
        const margin = 2 * appContext.baseMargin
        const halfButtonWidth = (gameAreaWidth - margin) / 2
        const scoreUpButton = buttonsTool.createButton(halfButtonWidth, "I got it right", scoreUp, 0x00AC17)
        const scoreDownButton = buttonsTool.createButton(halfButtonWidth, "I got it wrong", scoreDown, 0xFF0000)
        buttonArea.addChild(scoreUpButton)
        scoreDownButton.x = halfButtonWidth + margin
        buttonArea.addChild(scoreDownButton)
    }

    const revealAnswer = function(translation) {
        screensTool.setScreenText(answerScreen, `${_.capitalize(translation.turkishText)}`)
        const previousButton = buttonArea.children[0]
        previousButton.destroy()   
        showScoreButtons()     
    }

    const showViewButton = function(translation) {
        const nextButton = buttonsTool.createButton(gameAreaWidth, "View Translation", () => revealAnswer(translation))
        buttonArea.addChild(nextButton)
    }

    const scoreUp = function() {
        goToNext()
    }

    const scoreDown = function() {
        goToNext()
    }

    const goToNext = function() {
        //Cleanup
        while(buttonArea.children.length) {
            buttonArea.children[0].destroy(true)
        }
        while(cardArea.children.length) {
            cardArea.children[0].destroy(true)
        }     
        screensTool.setScreenText(answerScreen, "")

        //New setup
        const nextTranslation = gameConfig.translationCreator.call(null, ...translationArgs)
        setup(nextTranslation)
    }

    const setup = function(translation) {

        const numberOfNeededCards = translation.englishElements.length
        
        showViewButton(translation)
        buttonArea.y = appContext.effectiveHeight - (buttonArea.height + (8 * appContext.baseMargin))        
        answerScreen.y = buttonArea.y - (answerScreen.height + (2 * appContext.baseMargin))        
        const availableVerticalSpace = answerScreen.y - topBarClearance        
        const pixelsPerRow = Math.floor(availableVerticalSpace / numberOfNeededCards)
        const cardHeight = pixelsPerRow - (2 * appContext.baseMargin)

        const cards = translation.englishElements.map(e => screensTool.createCard(
            gameAreaWidth,
            cardHeight,
            e.value,
            e.label))    

        cards.forEach((card, index) => {        
            card.y = index * pixelsPerRow
            cardArea.addChild(card)
        })              
    }
    
    const firstTranslation = gameConfig.translationCreator.call(null, ...translationArgs)
    setup(firstTranslation)
    return gameArea
}

module.exports = {
    createGame
}