const PIXI = require('pixi.js')

const screenMainTextStyle = new PIXI.TextStyle({
    fontFamily: "Georgia",
    fontSize: 28,
    fill: "white"
    });

const answerTextStyle = new PIXI.TextStyle({
    fontFamily: "Georgia",
    fontSize: 28,
    fill: "black"
    });

const screenSubtitleTextStyle = new PIXI.TextStyle({
    fontFamily: "Courier",
    fontSize: 20,
    fill: "red"
    });

function createScreenSprite(width, height, includeSubText, invertColours) {
    let rectangle = new PIXI.Graphics();
    let backgroundColor = 0x00
    if(invertColours)
        backgroundColor = 0xcfcfcf
    rectangle.beginFill(backgroundColor)
    rectangle.lineStyle(4, 0x242424, 1)
    rectangle.drawRoundedRect(0, 0, width, height, 5)
    rectangle.endFill()

    let mainTextStyle = screenMainTextStyle
    if(invertColours)
        mainTextStyle = answerTextStyle
    let mainText = new PIXI.Text("", mainTextStyle);        
    mainText.name = "main-text"
    mainText.anchor.set(0.5, 0.5)
    mainText.x = width / 2
    mainText.y = height / 2
    
    let screen = new PIXI.Container();

    screen.addChild(rectangle)
    screen.addChild(mainText)

    if(includeSubText) {
        let subtitleText = new PIXI.Text("", screenSubtitleTextStyle);
        subtitleText.name = "sub-text"
        subtitleText.anchor.set(0.5, 0.5)
        subtitleText.x = width / 2

        subtitleText.y = height / 2 + (mainText.height / 2) + 15
        
        screen.addChild(subtitleText)
    }

    //screen.position.set(screenConfig.x, screenConfig.y)

    return screen
}

function setScreenText(screen, text) {
    let mainText = screen.children[1]
    mainText.text = text
    //mainText.x = (screen.width / 2) - (mainText.width / 2)
}

function setScreenSubText(screen, subtext) {
    let subtextText = screen.children[2]
    subtextText.text = subtext
    //subtextText.x = screen.width / 2 - (subtextText.width / 2)
}

module.exports = {
    createScreenSprite,
    setScreenText,
    setScreenSubText
}