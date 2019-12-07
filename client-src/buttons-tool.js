const PIXI = require('pixi.js')
const defaultButtonWidth = 150
const defaultButtonHeight = 50

const buttonTextStyle = new PIXI.TextStyle({
    fontFamily: "Georgia",
    fontSize: 28,
    fill: "white"
    });

function createButton(label, clickHandler) {
    let rectangle = new PIXI.Graphics();
    rectangle.beginFill(0xfca103)
    rectangle.lineStyle(2, 0xd4d4d4, 1)
    rectangle.drawRoundedRect(0, 0, defaultButtonWidth, defaultButtonHeight, 5)
    rectangle.endFill()

    let buttonText = new PIXI.Text(label, buttonTextStyle);        
    buttonText.x = defaultButtonWidth / 2 - (buttonText.width / 2)
    buttonText.y = defaultButtonHeight / 2 - (buttonText.height / 2) - 3

    let button = new PIXI.Container();

    button.addChild(rectangle)
    button.addChild(buttonText)

    //button.x = app.renderer.width / (2 * resolutionFactor) - nextButtonWidth / 2
    //button.y = (app.renderer.height * 4) / (5 * resolutionFactor)

    button.interactive = true;
    button.buttonMode = true;

    button
        .on('pointerover', onButtonOver)
        .on('pointerout', onButtonOut)            
        .on('pointerup', clickHandler)
        // .on('pointerupoutside', onNextButtonUp)            
        // .on('pointerdown', onNextButtonDown)

    return button
}

function onButtonOver() {
    this.children[0].destroy()
    let rectangle = new PIXI.Graphics();
    rectangle.beginFill(0xd48600)
    rectangle.lineStyle(2, 0xd4d4d4, 1)
    rectangle.drawRoundedRect(0, 0, defaultButtonWidth, defaultButtonHeight, 5)
    rectangle.endFill()
    this.addChildAt(rectangle, 0)
}

function onButtonOut() {
    this.children[0].destroy()
    let rectangle = new PIXI.Graphics();
    rectangle.beginFill(0xfca103)
    rectangle.lineStyle(2, 0xd4d4d4, 1)
    rectangle.drawRoundedRect(0, 0, defaultButtonWidth, defaultButtonHeight, 5)
    rectangle.endFill()
    this.addChildAt(rectangle, 0)
}

module.exports = {
    createButton
}