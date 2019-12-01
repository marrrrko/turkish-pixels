
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

    const primaryTextStyle = new TextStyle({
        fontFamily: "Georgia",
        fontSize: 36,
        fill: "white"
        });

    const subtitleTextStyle = new TextStyle({
        fontFamily: "Courier",
        fontSize: 20,
        fill: "red"
        });

    let app = undefined
    let screens = undefined 
    const resolutionFactor = 2

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
            resolution: resolutionFactor
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
            .add('LPC_house_interior/interior.png')
            .load(setTheStage)
    }

    function setTheStage() {    
        app.stage.addChild(createFloorSprite())
    
        screens = getVerbSubjectSentenceScreenConfig().map(function(screenConfig) {
            return createScreenSprite(screenConfig)        
        })
        screens.forEach(function(screen) {
            //setScreenText(screen, "Hello!")
            app.stage.addChild(screen)
        })

        let nextButton = createNextButton()
        app.stage.addChild(nextButton)


        app.renderer.render(app.stage)
        app.ticker.add(delta => gameLoop(delta))
    }

    function gameLoop(delta){

    }

    function updateText() {
        screens.forEach(screen => setScreenText(screen, "Boo!"))
    }

    function setScreenText(screen, text) {
        let mainText = screen.children[1]
        mainText.text = text
        mainText.x = screenWidth / 2 - (mainText.width / 2)
    }

    function createFloorSprite() {
        let floorTexture = PIXI.loader.resources["LPC_house_interior/interior.png"].texture
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

        let buttonText = new Text("Next", primaryTextStyle);
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

    let screenWidth = 225
    let screenHeight = 100
    function createScreenSprite(screenConfig) {
        let rectangle = new Graphics();
        rectangle.beginFill(0x00)
        rectangle.lineStyle(6, 0x242424, 1)
        rectangle.drawRoundedRect(0, 0, screenWidth, screenHeight, 5)
        rectangle.endFill()

        let mainText = new Text(screenConfig.mainText, primaryTextStyle);
        mainText.name = "main-text"
        mainText.x = screenWidth / 2 - (mainText.width / 2)
        mainText.y = screenHeight / 2 - (mainText.height / 2) - 3
        
        let subtitleText = new Text(screenConfig.subText, subtitleTextStyle);
        subtitleText.name = "sub-text"
        subtitleText.x = screenWidth / 2 - (subtitleText.width / 2)
        subtitleText.y = screenHeight / 2 + (mainText.height / 2) + 1

        let screen = new PIXI.Container();

        screen.addChild(rectangle)
        screen.addChild(mainText)
        screen.addChild(subtitleText)

        screen.position.set(screenConfig.x, screenConfig.y)

        return screen
    }

    function getVerbSubjectSentenceScreenConfig() {
        let screenConfigs = []
        screenConfigs.push({
            name: "verb",
            x: app.renderer.width / (2 * resolutionFactor) - (1.3 * screenWidth),
            y: app.renderer.height / (2 * resolutionFactor) - (0.8 * screenHeight),
            mainText: "---",
            subText: "Verb"
        })

        screenConfigs.push({
            name: "subject",
            x: app.renderer.width / (2 * resolutionFactor) + (0.3 * screenWidth),
            y: app.renderer.height / (2 * resolutionFactor) - (0.8 * screenHeight),
            mainText: "---",
            subText: "Subject"
        })

        screenConfigs.push({
            name: "tense",
            x: app.renderer.width / (2 * resolutionFactor) - (0.5 * screenWidth),
            y: app.renderer.height / (2 * resolutionFactor) + (0.8 * screenHeight),
            mainText: "---",
            subText: "Tense"
        })

        return screenConfigs
    }

    start()
}
