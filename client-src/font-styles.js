const PIXI = require('pixi.js')

const buttonTextStyle = new PIXI.TextStyle({
    fontFamily: "Verdana, Geneva, sans-serif",
    fontSize: 28,
    fill: "white"
});

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

const subTextStyle = new PIXI.TextStyle({
    fontFamily: "Georgia",
    fontSize: 16,
    fill: 0x808080
});

const screenSubtitleTextStyle = new PIXI.TextStyle({
    fontFamily: "Courier",
    fontSize: 20,
    fill: "red"
});

module.exports = {
    buttonTextStyle,
    screenMainTextStyle,
    answerTextStyle,
    subTextStyle,
    screenSubtitleTextStyle
}