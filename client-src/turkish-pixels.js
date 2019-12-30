const PIXI = require('pixi.js')
const vocabulary = require('./vocabulary')
const gamesList = require('./games.js')
const scaleToWindow = require('./scaleToWindow')
const buttonsTool = require('./buttons-tool')

function docReady(fn) {
    if (document.readyState === "complete" || document.readyState === "interactive") {
        setTimeout(fn, 1)
    } else {
        document.addEventListener("DOMContentLoaded", fn)
    }
} 

docReady(init)

function init() {

    const appContext = {
        app: undefined,
        resolutionFactor: Math.round(window.devicePixelRatio * 100) / 100,
        effectiveWidth: undefined,
        effectiveHeight: undefined,
        pixelWidth: undefined,
        pixelHeight: undefined,
        topBarHeight: 50,
        baseMargin: 5

    }

    function createLaunchScreen() {
        let goButton = document.getElementById("go")
        goButton.addEventListener("click", (e) => {
            document.getElementById("startup").style.display = "none"
            let useFullScreen = document.getElementById("fullscreen-option").checked            
            if(useFullScreen)
                requestFullScreen()
            setTimeout(createApp, 200)
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

    const minWidth = 300
    const minHeight = 500
    function createApp() {    
        appContext.app = new PIXI.Application({
            width: minWidth,
            height: minHeight,
            antialias: true,
            resolution: appContext.resolutionFactor,

        })
        appContext.app.renderer.view.style.position = "absolute";
        appContext.app.renderer.view.style.display = "block";
        appContext.app.renderer.autoResize = true;
        const adaptedWidth = window.innerWidth > minWidth ? window.innerWidth : minWidth
        const adaptedHeigh = window.innerHeight > minHeight ? window.innerHeight : minHeight
        appContext.app.renderer.resize(adaptedWidth, adaptedHeigh);
        
        appContext.pixelWidth = appContext.app.renderer.width
        appContext.pixelHeight = appContext.app.renderer.height
        
        appContext.effectiveWidth = appContext.pixelWidth / appContext.resolutionFactor
        appContext.effectiveHeight = appContext.pixelHeight / appContext.resolutionFactor
        
        console.log(`Running at ${window.innerWidth}x${window.innerHeight} (ratio@${appContext.resolutionFactor}) rendered using ${appContext.app.renderer.width}x${appContext.app.renderer.height}`)
        
        document.body.appendChild(appContext.app.view)

        window.addEventListener("resize", function(event){ 
            scaleToWindow(appContext.app.renderer.view);
            //app.renderer.resize(window.innerWidth, window.innerHeight);
        });

        PIXI.loader
            .add('assets/LPC_house_interior/interior.png')
            .load(setTheStage)
    }

    async function setTheStage() {       
        appContext.wordDatabase = await vocabulary.loadWordDatabaseFromAPI("/api/words")

        appContext.menu = createGameMenuContainer()
        appContext.menu.visible = true
        appContext.app.stage.addChild(appContext.menu)

        appContext.topBar = createTopBarContainer()
        appContext.topBar.visible = true
        appContext.app.stage.addChild(appContext.topBar)

        appContext.app.renderer.render(appContext.app.stage)
        appContext.app.ticker.add(delta => gameLoop(delta))
    }

    function createTopBarContainer() {
        const topBar = new PIXI.Container()
        const box = new PIXI.Graphics()
        
        box.beginFill(0x2c2c2c, 0.05)
        box.drawRoundedRect(0, 0, appContext.effectiveWidth, appContext.topBarHeight, 0)
        box.endFill()

        const scoreText = new PIXI.Text("Score: 0")
        scoreText.y = (box.height / 2) - (scoreText.height / 2)
        scoreText.x = box.width - (scoreText.width + appContext.baseMargin)
        box.addChild(scoreText)

        topBar.addChild(box)

        return topBar
    }
    
    function createGameMenuContainer() {
        const menuContainer = new PIXI.Container()
        const background = new PIXI.Graphics();
        background.beginFill(0xFFFFFF)
        background.drawRect(0, 0, appContext.effectiveWidth, appContext.effectiveHeight)
        background.endFill()
        menuContainer.addChild(background)

        const buttons = new PIXI.Container()
        gamesList.default.forEach((gameInfo, index) => {
            const handler = function() { runGameHouse(gameInfo) }
            const button = buttonsTool.createButton(appContext, gameInfo.label, handler)
            const buttonHeight = button.height
            button.y = (buttonHeight + 4) * index
            buttons.addChild(button)
        })

        menuContainer.addChild(buttons)
        buttons.y = appContext.topBarHeight + (appContext.baseMargin * 2)
        buttons.x = (appContext.effectiveWidth / 2) - (buttons.width / 2)
        return menuContainer
    }

    function runGameHouse(gameInfo) {
        const gameHouseContainer = new PIXI.Container()
        const gameContext = gameInfo.creatorFunction.call(null, appContext, gameInfo.config)        
        gameHouseContainer.addChild(createFloorSprite())

        let gameArea = gameContext.gameAreaContainer
        gameArea.x = (gameHouseContainer.width / 2) - (gameArea.width / 2)
        gameHouseContainer.addChild(gameArea)

        appContext.app.stage.addChild(gameHouseContainer)
    }

    function createFloorSprite() {
        let floorTexture = PIXI.loader.resources["assets/LPC_house_interior/interior.png"].texture
        let floorFrame = new PIXI.Rectangle(0, 96, 32, 32)
        floorTexture.frame = floorFrame
        let floorSprite = new PIXI.Sprite(floorTexture)

        floorSprite.x = 100
        floorSprite.y = 100

        return new PIXI.extras.TilingSprite(floorTexture, appContext.effectiveWidth, appContext.effectiveHeight);
    }

    function gameLoop(delta){

    }

    createLaunchScreen()
}
