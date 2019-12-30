const PIXI = require('pixi.js')
const fontStyles = require('./font-styles')

function createCard(width, height, text, subtext) {
    const background = new PIXI.Graphics()
    background.beginFill(0xFEFFE4)
    background.drawRoundedRect(0,0, width, height, 2)
    background.endFill()

    const textStyle = new PIXI.TextStyle({
        fontFamily: fontStyles.answerTextStyle.fontFamily,
        fontSize: fontStyles.answerTextStyle.fontSize,
        fill: fontStyles.answerTextStyle.fill
    });

    let mainText = new PIXI.Text(text, textStyle);
    while(mainText.width + 10 > background.width) {
        textStyle.fontSize = textStyle.fontSize - 2
        mainText = new PIXI.Text(text, textStyle);
    }
    mainText.anchor.set(0.5, 0.5)
    mainText.x = width / 2
    mainText.y = height / 2

    const subText = new PIXI.Text(subtext, fontStyles.subTextStyle);
    subText.anchor.set(0.5, 0.5)
    subText.x = width / 2
    subText.y = height - (subText.height + 1) / 2

    const card = new PIXI.Container()
    card.addChild(background)
    card.addChild(mainText)
    card.addChild(subText)

    return card
}

function createScreenSprite(width, height, includeSubText, invertColours) {
    let rectangle = new PIXI.Graphics();
    let backgroundColor = 0x00
    if(invertColours)
        backgroundColor = 0xcfcfcf
    rectangle.beginFill(backgroundColor)
    rectangle.lineStyle(4, 0x242424, 1)
    rectangle.drawRoundedRect(0, 0, width, height, 5)
    rectangle.endFill()

    let mainTextStyle = fontStyles.screenMainTextStyle
    if(invertColours)
        mainTextStyle = fontStyles.answerTextStyle
    let mainText = new PIXI.Text("", mainTextStyle);     
    mainText.name = "main-text"
    mainText.anchor.set(0.5, 0.5)
    mainText.x = width / 2
    mainText.y = height / 2
    
    let screen = new PIXI.Container();

    screen.addChild(rectangle)
    screen.addChild(mainText)

    if(includeSubText) {
        let subtitleText = new PIXI.Text("", fontStyles.screenSubtitleTextStyle);
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
    createCard,
    createScreenSprite,
    setScreenText,
    setScreenSubText
}