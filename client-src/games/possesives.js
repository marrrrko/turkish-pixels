const PIXI = require('pixi.js')
const sentences = require('../turkish/sentences')
const screensTool = require('../screens-tool')
const buttonsTool = require('../buttons-tool')
const _ = require('lodash')

const smallScreenWidth = 325
const largeScreenWidth = 500
const smallScreenHeight = 100
const baseMargin = 14

function createGame(gameContext) {
    let screenArea = new PIXI.Container();        

    let verbScreen = screensTool.createScreenSprite(smallScreenWidth, smallScreenHeight, true)
    verbScreen.x = (largeScreenWidth - smallScreenWidth) / 2
    verbScreen.name = "Owner"
    screensTool.setScreenSubText(verbScreen, "Owner")
    screenArea.addChild(verbScreen)

    let subjectScreen = screensTool.createScreenSprite(smallScreenWidth, smallScreenHeight, true)
    subjectScreen.name = "Object"
    subjectScreen.x = (largeScreenWidth - smallScreenWidth) / 2
    screensTool.setScreenSubText(subjectScreen, "Object")
    subjectScreen.y = smallScreenHeight + baseMargin
    screenArea.addChild(subjectScreen)

    let answerScreen = screensTool.createScreenSprite(largeScreenWidth, smallScreenHeight, false, true)
    answerScreen.name = "answer"        
    answerScreen.y = 2 * (smallScreenHeight + baseMargin)
    screenArea.addChild(answerScreen)

    let buttonArea = createButtonArea(gameContext)
    buttonArea.x = screenArea.width / 2 - buttonArea.width / 2
    buttonArea.y = answerScreen.y + answerScreen.height + (baseMargin * 2)
    screenArea.addChild(buttonArea)

    gameContext.gameAreaContainer = screenArea

    return gameContext
}

function createButtonArea(gameContext) {
    let buttonArea = new PIXI.Container();   
    let nextButton = buttonsTool.createButton(gameContext, "Next", () => advanceGame(gameContext))
    buttonArea.addChild(nextButton)

    return buttonArea
}

function advanceGame(gameContext) {
    if(gameContext.possesive) {
        screensTool.setScreenText(gameContext.gameAreaContainer.children[2], `${_.capitalize(gameContext.possesive.translation)}`)
        gameContext.possesive = null
    } else {
        gameContext.possesive = sentences.buildPossesiveNoun(
            gameContext.wordDatabase)
        screensTool.setScreenText(gameContext.gameAreaContainer.children[2], "")
        gameContext = displayQuestion(gameContext)
    }
}

function displayQuestion(gameContext) {
    let ownerHint = ""
    let ownerLabel = gameContext.possesive.owner.english
    if(gameContext.possesive.owner.alternateEnglish && gameContext.possesive.owner.alternateEnglish.length) {
        ownerLabel = [ownerLabel].concat(gameContext.possesive.owner.alternateEnglish).join("/")
    }

    if(gameContext.possesive.owner.person == 2) {
        ownerHint = gameContext.possesive.owner.isPlural ? " (plural)" : " (singular)"
    }
    screensTool.setScreenText(gameContext.gameAreaContainer.children[0], `${ownerLabel}${ownerHint}`)   
    screensTool.setScreenText(gameContext.gameAreaContainer.children[1], gameContext.possesive.noun.english)

    return gameContext
}

module.exports = {
    createGame
}