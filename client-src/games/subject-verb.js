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
    verbScreen.name = "verb"
    screensTool.setScreenSubText(verbScreen, "Verb")
    screenArea.addChild(verbScreen)

    let subjectScreen = screensTool.createScreenSprite(smallScreenWidth, smallScreenHeight, true)
    subjectScreen.name = "verb"
    subjectScreen.x = (largeScreenWidth - smallScreenWidth) / 2
    screensTool.setScreenSubText(subjectScreen, "Subject")
    subjectScreen.y = smallScreenHeight + baseMargin
    screenArea.addChild(subjectScreen)

    let tenseScreen = screensTool.createScreenSprite(smallScreenWidth, smallScreenHeight, true)
    tenseScreen.name = "tense"
    tenseScreen.x = (largeScreenWidth - smallScreenWidth) / 2
    screensTool.setScreenSubText(tenseScreen, "Tense")
    tenseScreen.y = 2 * (smallScreenHeight + baseMargin)
    screenArea.addChild(tenseScreen)

    let answerScreen = screensTool.createScreenSprite(largeScreenWidth, smallScreenHeight, false, true)
    answerScreen.name = "answer"        
    answerScreen.y = 3 * (smallScreenHeight + baseMargin)
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
    let nextButton = buttonsTool.createButton("Next", () => advanceGame(gameContext))
    buttonArea.addChild(nextButton)

    return buttonArea
}

function advanceGame(gameContext) {
    if(gameContext.sentence) {
        screensTool.setScreenText(gameContext.gameAreaContainer.children[3], `${_.capitalize(gameContext.sentence.translation)}`)
        gameContext.sentence = null
    } else {
        gameContext.sentence = sentences.buildVerbSubjectSentence(
            gameContext.wordDatabase,
            gameContext.wordDatabase.verbTenses.filter(t => t.english == "present continuous"),
            _.random(0,1),
            _.random(0,1))
        screensTool.setScreenText(gameContext.gameAreaContainer.children[3], "")
        gameContext = displayQuestion(gameContext)
    }
}

function displayQuestion(gameContext) {
    screensTool.setScreenText(gameContext.gameAreaContainer.children[0], `${gameContext.sentence.verb.english}`)
    let subjectLabel = gameContext.sentence.subject.english
    if(gameContext.sentence.subject.alternateEnglish && gameContext.sentence.subject.alternateEnglish.length) {
        subjectLabel = _.sample([subjectLabel].concat(gameContext.sentence.subject.alternateEnglish))
    }
    let subjectHint = ""
    if(gameContext.sentence.subject.person == 2) {
        subjectHint = gameContext.sentence.subject.isPlural ? " (plural)" : " (singular)"
    }
    screensTool.setScreenText(gameContext.gameAreaContainer.children[1], `${subjectLabel}${subjectHint}`)
    
    let tenseHints = []
    if(gameContext.sentence.negativeForm)
        tenseHints.push("negative")
    if(gameContext.sentence.questionForm)
        tenseHints.push("question")
    
    let tenseHint = ""
    if(tenseHints.length)
        tenseHint = `, ${tenseHints.join(" ")}`
    screensTool.setScreenText(gameContext.gameAreaContainer.children[2], `${gameContext.sentence.tense.english}${tenseHint}`)

    return gameContext
}

module.exports = {
    createGame
}