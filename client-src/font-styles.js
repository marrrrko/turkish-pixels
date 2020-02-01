const PIXI = require('pixi.js')

module.exports = {
    buttonTextStyle: new PIXI.TextStyle({
        fontFamily: "Verdana, Geneva, sans-serif",
        fontSize: 28,
        fill: "white"
    }),
    screenMainTextStyle: new PIXI.TextStyle({
        fontFamily: "Georgia",
        fontSize: 28,
        fill: "white"
    }),
    guessWordMainTextStyle: new PIXI.TextStyle({
        fontFamily: "Georgia",
        fontSize: 42,
        fill: "black",
        fontWeight: "800",
    }),
    guessWordOptionTextStyle: new PIXI.TextStyle({
        fontFamily: "Georgia",
        fontSize: 28,
        fill: "white",
        fontWeight: "400",
    }),
    guessWordCorrect: new PIXI.TextStyle({
        fontFamily: "Georgia",
        fontSize: 44,
        fill: "green",
        fontWeight: "800",
    }),
    guessWordIncorrect: new PIXI.TextStyle({
        fontFamily: "Georgia",
        fontSize: 44,
        fill: "red",
        fontWeight: "800",
    }),
    answerTextStyle: new PIXI.TextStyle({
        fontFamily: "Georgia",
        fontSize: 28,
        fill: "black"
    }),
    subTextStyle: new PIXI.TextStyle({
        fontFamily: "Georgia",
        fontSize: 16,
        fill: 0x808080
    }),
    screenSubtitleTextStyle: new PIXI.TextStyle({
        fontFamily: "Courier",
        fontSize: 20,
        fill: "red"
    }),
    forestWordTextStyle: new PIXI.TextStyle({
        fontFamily: "Courier",
        fontSize: 20,
        fill: "white",
        fontWeight: "800",
        dropShadow: true,
        dropShadowColor: 0x202020,
        dropShadowBlur: 20
    })
}