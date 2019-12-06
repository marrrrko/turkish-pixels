import * as PIXI from 'pixi.js'
import * as vocabulary from './vocabulary'
import * as sentences from './sentences'

function docReady(fn) {
    if (document.readyState === "complete" || document.readyState === "interactive") {
        setTimeout(fn, 1)
    } else {
        document.addEventListener("DOMContentLoaded", fn)
    }
} 

docReady(init)

function init() {

    const Application = PIXI.Application,
        loader = PIXI.loader,
        resources = PIXI.loader.resources,
        Sprite = PIXI.Sprite,
        Container = PIXI.Container,    
        Graphics = PIXI.Graphics,
        TextureCache = PIXI.utils.TextureCache,
        Text = PIXI.Text,
        TextStyle = PIXI.TextStyle,
        Rectangle = PIXI.Rectangle

    const screenMainTextStyle = new TextStyle({
        fontFamily: "Georgia",
        fontSize: 28,
        fill: "white"
        });

    const answerTextStyle = new TextStyle({
        fontFamily: "Georgia",
        fontSize: 28,
        fill: "black"
        });

    const screenSubtitleTextStyle = new TextStyle({
        fontFamily: "Courier",
        fontSize: 20,
        fill: "red"
        });

    let app = undefined
    let screens = undefined 
    const resolutionFactor = 2
    let sentence = undefined
    let wordDatabase = undefined

    function start() {
        let goButtons = document.querySelectorAll(".go-button")
        goButtons.forEach(function(el) {
            el.addEventListener("click", (e) => {
                goButtons.forEach(function(el2) {
                    el2.style.display = "none"
                })
                
                if(el.id == "go-fs")
                    requestFullScreen()
                setTimeout(initialize, 200)
            })
        })
    }

    function requestFullScreen() {
        var element = document.body;
        if (element.requestFullScreen) {
            element.requestFullScreen();
        } else if (element.mozRequestFullScreen) {
            element.mozRequestFullScreen();
        } else if (element.webkitRequestFullScreen) {
            element.webkitRequestFullScreen(Element.ALLOW_KEYBOARD_INPUT);
        } else if (element.msRequestFullscreen) {
            element.msRequestFullscreen();
        }
        
    };

    function initialize() {    
        app = new PIXI.Application({
            width: 256,
            height: 256,
            antialias: true,
            resolution: resolutionFactor,

        })
        app.renderer.view.style.position = "absolute";
        app.renderer.view.style.display = "block";
        app.renderer.autoResize = true;
        app.renderer.resize(window.innerWidth, window.innerHeight);
        console.log(`Running at ${window.innerWidth}x${window.innerHeight}`)
        document.body.appendChild(app.view)

        window.addEventListener("resize", function(event){ 
            scaleToWindow(app.renderer.view);
            //app.renderer.resize(window.innerWidth, window.innerHeight);
        });

        PIXI.loader
            .add('assets/LPC_house_interior/interior.png')
            .load(setTheStage)
    }

    function setTheStage() {    
        app.stage.addChild(createFloorSprite())
    
        screens = createVerbSubjectSentenceScreenArea()
        screens.x = app.renderer.width / (2 * resolutionFactor) - (screens.width / 2)
        screens.y = app.renderer.height / (2 * resolutionFactor) - (screens.height / 2)
        app.stage.addChild(screens)

        app.renderer.render(app.stage)
        app.ticker.add(delta => gameLoop(delta))
        startTheGame()
    }

    async function startTheGame() {
        wordDatabase = await vocabulary.loadWordDatabaseFromAPI("/api/words")
        askAQuestion()
    }

    function askAQuestion() {
        sentence = sentences.buildVerbSubjectSentence(
            wordDatabase,
            wordDatabase.verbTenses.filter(t => t.english == "present continuous"),
            _.random(0,1),
            _.random(0,1))

        let nextButton = createNextButton()
        app.stage.addChild(nextButton)

        setScreenText(screens.children[0], `${sentence.verb.english}`)
        
        let subjectHint = ""
        if(sentence.subject.person == 2) {
            subjectHint = sentence.subject.isPlural ? " (plural)" : " (singular)"
        }
        setScreenText(screens.children[1], `${sentence.subject.english}${subjectHint}`)
        
        let tenseHints = []
        if(sentence.negativeForm)
            tenseHints.push("negative")
        if(sentence.questionForm)
            tenseHints.push("question")
        
        let tenseHint = ""
        if(tenseHints.length)
            tenseHint = `, ${tenseHints.join(" ")}`
        setScreenText(screens.children[2], `${sentence.tense.english}${tenseHint}`)
    }

    function gameLoop(delta){

    }

    function updateText() {
        if(sentence) {
            setScreenText(screens.children[3], `${_.capitalize(sentence.translation)}`)
            sentence = null
        } else {
            setScreenText(screens.children[3], "")
            askAQuestion()
        }
    }

    function createFloorSprite() {
        let floorTexture = PIXI.loader.resources["assets/LPC_house_interior/interior.png"].texture
        let floorFrame = new Rectangle(0, 96, 32, 32)
        floorTexture.frame = floorFrame
        let floorSprite = new PIXI.Sprite(floorTexture)

        floorSprite.x = 100
        floorSprite.y = 100

        return new PIXI.extras.TilingSprite(floorTexture, app.renderer.width, app.renderer.height);
    }

    const nextButtonWidth = 150
    const nextButtonHeight = 50
    
    function createNextButton() {
        let rectangle = new Graphics();
        rectangle.beginFill(0xfca103)
        rectangle.lineStyle(2, 0xd4d4d4, 1)
        rectangle.drawRoundedRect(0, 0, nextButtonWidth, nextButtonHeight, 5)
        rectangle.endFill()

        let buttonText = new Text("Next", screenMainTextStyle);        
        buttonText.x = nextButtonWidth / 2 - (buttonText.width / 2)
        buttonText.y = nextButtonHeight / 2 - (buttonText.height / 2) - 3

        let button = new PIXI.Container();

        button.addChild(rectangle)
        button.addChild(buttonText)

        button.x = app.renderer.width / (2 * resolutionFactor) - nextButtonWidth / 2
        button.y = (app.renderer.height * 4) / (5 * resolutionFactor)

        button.interactive = true;
        button.buttonMode = true;

        button
            .on('pointerover', onNextButtonOver)
            .on('pointerout', onNextButtonOut)            
            .on('pointerup', onNextButtonUp)
            // .on('pointerupoutside', onNextButtonUp)            
            // .on('pointerdown', onNextButtonDown)

        return button
    }

    function onNextButtonOver() {
        this.children[0].destroy()
        let rectangle = new Graphics();
        rectangle.beginFill(0xd48600)
        rectangle.lineStyle(2, 0xd4d4d4, 1)
        rectangle.drawRoundedRect(0, 0, nextButtonWidth, nextButtonHeight, 5)
        rectangle.endFill()
        this.addChildAt(rectangle, 0)
    }

    function onNextButtonOut() {
        this.children[0].destroy()
        let rectangle = new Graphics();
        rectangle.beginFill(0xfca103)
        rectangle.lineStyle(2, 0xd4d4d4, 1)
        rectangle.drawRoundedRect(0, 0, nextButtonWidth, nextButtonHeight, 5)
        rectangle.endFill()
        this.addChildAt(rectangle, 0)
    }

    function onNextButtonUp() {
        updateText()
    }

    const smallScreenWidth = 325
    const largeScreenWidth = 500
    const smallScreenHeight = 100
    const baseMargin = 14
    function createScreenSprite(width, height, includeSubText, invertColours) {
        let rectangle = new Graphics();
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
        let mainText = new Text("", mainTextStyle);        
        mainText.name = "main-text"
        mainText.anchor.set(0.5, 0.5)
        mainText.x = width / 2
        mainText.y = height / 2
        
        let screen = new PIXI.Container();

        screen.addChild(rectangle)
        screen.addChild(mainText)

        if(includeSubText) {
            let subtitleText = new Text("", screenSubtitleTextStyle);
            subtitleText.name = "sub-text"
            subtitleText.anchor.set(0.5, 0.5)
            subtitleText.x = smallScreenWidth / 2

            subtitleText.y = smallScreenHeight / 2 + (mainText.height / 2) + 15
            
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

    function createVerbSubjectSentenceScreenArea() {
        let screenArea = new PIXI.Container();        

        let verbScreen = createScreenSprite(smallScreenWidth, smallScreenHeight, true)
        verbScreen.x = (largeScreenWidth - smallScreenWidth) / 2
        verbScreen.name = "verb"
        setScreenSubText(verbScreen, "Verb")
        screenArea.addChild(verbScreen)

        let subjectScreen = createScreenSprite(smallScreenWidth, smallScreenHeight, true)
        subjectScreen.name = "verb"
        subjectScreen.x = (largeScreenWidth - smallScreenWidth) / 2
        setScreenSubText(subjectScreen, "Subject")
        subjectScreen.y = smallScreenHeight + baseMargin
        screenArea.addChild(subjectScreen)

        let tenseScreen = createScreenSprite(smallScreenWidth, smallScreenHeight, true)
        tenseScreen.name = "tense"
        tenseScreen.x = (largeScreenWidth - smallScreenWidth) / 2
        setScreenSubText(tenseScreen, "Tense")
        tenseScreen.y = 2 * (smallScreenHeight + baseMargin)
        screenArea.addChild(tenseScreen)

        let answerScreen = createScreenSprite(largeScreenWidth, smallScreenHeight, false, true)
        answerScreen.name = "answer"        
        answerScreen.y = 3 * (smallScreenHeight + baseMargin)
        screenArea.addChild(answerScreen)

        return screenArea
    }

    start()
}
