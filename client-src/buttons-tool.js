const PIXI = require('pixi.js')
const fontStyles = require('./font-styles')

function createButton(buttonWidth, label, clickHandler, backgroundColor = 0xfca103, buttonHeight = 50) {
    const rectangle = new PIXI.Graphics()    

    rectangle.beginFill(backgroundColor)
    rectangle.lineStyle(2, 0xd4d4d4, 1)
    rectangle.drawRoundedRect(0, 0, buttonWidth, buttonHeight, 5)
    rectangle.endFill()

    const textStyle = new PIXI.TextStyle({
        fontFamily: fontStyles.buttonTextStyle.fontFamily,
        fontSize: fontStyles.buttonTextStyle.fontSize,
        fill: fontStyles.buttonTextStyle.fill
    });

    let buttonText = new PIXI.Text(label, textStyle);
        
    while(buttonText.width + 15 > rectangle.width) {
        textStyle.fontSize = textStyle.fontSize - 2
        buttonText = new PIXI.Text(label, textStyle);
    }

    buttonText.x = buttonWidth / 2 - (buttonText.width / 2)
    buttonText.y = buttonHeight / 2 - (buttonText.height / 2)

    let button = new PIXI.Container();

    button.addChild(rectangle)
    button.addChild(buttonText)

    //button.x = app.renderer.width / (2 * resolutionFactor) - nextButtonWidth / 2
    //button.y = (app.renderer.height * 4) / (5 * resolutionFactor)

    button.interactive = true;
    button.buttonMode = true;

    button.on('pointerup', clickHandler)
        // .on('pointerupoutside', onNextButtonUp)            
        // .on('pointerdown', onNextButtonDown)
        // .on('pointerover', function() {
        //     onButtonOver.bind(this, buttonWidth)
        // })
        // .on('pointerout', function() {
        //     onButtonOut.bind(this, buttonWidth)
        // })  

    return button
}

function onButtonOver(buttonWidth) {
    this.children[0].destroy()
    let rectangle = new PIXI.Graphics();
    rectangle.beginFill(0xd48600)
    rectangle.lineStyle(2, 0xd4d4d4, 1)
    rectangle.drawRoundedRect(0, 0, buttonWidth, buttonWidth, 5)
    rectangle.endFill()
    this.addChildAt(rectangle, 0)
}

function onButtonOut(event, buttonWidth) {
    this.children[0].destroy()
    let rectangle = new PIXI.Graphics();
    rectangle.beginFill(0xfca103)
    rectangle.lineStyle(2, 0xd4d4d4, 1)
    rectangle.drawRoundedRect(0, 0, buttonWidth, buttonWidth, 5)
    rectangle.endFill()
    this.addChildAt(rectangle, 0)
}

module.exports = {
    createButton
}