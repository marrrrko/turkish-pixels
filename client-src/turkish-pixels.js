const PIXI = require('pixi.js')
const vocabulary = require('./vocabulary')
const subjectVerbGame = require('./games/subject-verb')
const possesiveGame = require('./games/possesives')

function docReady(fn) {
    if (document.readyState === "complete" || document.readyState === "interactive") {
        setTimeout(fn, 1)
    } else {
        document.addEventListener("DOMContentLoaded", fn)
    }
} 

docReady(init)

function init() {

    let app = undefined
    const resolutionFactor = 2
    let gameContext = undefined

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

    function createApp() {    
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

    async function setTheStage() {    
        app.stage.addChild(createFloorSprite())
    
        let wordDatabase = await vocabulary.loadWordDatabaseFromAPI("/api/words")
        //gameContext = subjectVerbGame.createGame({ wordDatabase })
        gameContext = possesiveGame.createGame({ wordDatabase })
        gameContext.gameAreaContainer.x = app.renderer.width / (2 * resolutionFactor) - (gameContext.gameAreaContainer.width / 2)
        gameContext.gameAreaContainer.y = app.renderer.height / (2 * resolutionFactor) - (gameContext.gameAreaContainer.height / 2)
        app.stage.addChild(gameContext.gameAreaContainer)

        app.renderer.render(app.stage)
        app.ticker.add(delta => gameLoop(delta))
    }

    function createFloorSprite() {
        let floorTexture = PIXI.loader.resources["assets/LPC_house_interior/interior.png"].texture
        let floorFrame = new PIXI.Rectangle(0, 96, 32, 32)
        floorTexture.frame = floorFrame
        let floorSprite = new PIXI.Sprite(floorTexture)

        floorSprite.x = 100
        floorSprite.y = 100

        return new PIXI.extras.TilingSprite(floorTexture, app.renderer.width, app.renderer.height);
    }

    function gameLoop(delta){

    }

    createLaunchScreen()
}
