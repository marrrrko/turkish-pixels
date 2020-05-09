const PIXI = require('pixi.js')
const vocabulary = require('./vocabulary')
const scaleToWindow = require('./scaleToWindow')

const stateStore = require('./state/store')
const forestWorld = require('./worlds/forest')
const villageWorld = require('./worlds/village')

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

    function loadTraviso() {
        return new Promise(function(resolve, reject) {
            const script = document.createElement('script');
            script.onload = function () {
                resolve()
            };
            script.src = "assets/traviso.dev.js";

            document.head.appendChild(script);
        })
    }

    function createGameLaunchScreen() {
        let goButton = document.getElementById("go")

        const requestFullScreen = () => {
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

        goButton.addEventListener("click", (e) => {
            document.getElementById("startup").style.display = "none"
            let useFullScreen = document.getElementById("fullscreen-option").checked
            if(useFullScreen)
                requestFullScreen()
            setTimeout(createPixiContainer, 200)
        })
    }

    const minWidth = 300
    const minHeight = 500
    function createPixiContainer() {

        const adaptedWidth = window.innerWidth > minWidth ? window.innerWidth : minWidth
        const adaptedHeigh = window.innerHeight > minHeight ? window.innerHeight : minHeight

        appContext.app = new PIXI.Application({
            width: minWidth,
            height: minHeight,
            antialias: true,
            resolution: appContext.resolutionFactor
        })
        appContext.app.renderer.view.style.position = "absolute";
        appContext.app.renderer.view.style.display = "block";
        appContext.app.renderer.autoResize = true;
        appContext.app.renderer.resize(adaptedWidth, adaptedHeigh);

        appContext.pixelWidth = appContext.app.renderer.width
        appContext.pixelHeight = appContext.app.renderer.height

        appContext.effectiveWidth = appContext.pixelWidth / appContext.resolutionFactor
        appContext.effectiveHeight = appContext.pixelHeight / appContext.resolutionFactor

        //console.log(`Running at ${window.innerWidth}x${window.innerHeight} (ratio@${appContext.resolutionFactor}) rendered using ${appContext.app.renderer.width}x${appContext.app.renderer.height}`)

        document.body.appendChild(appContext.app.view)

        window.addEventListener("resize", function(event){
            scaleToWindow(appContext.app.renderer.view);
            //app.renderer.resize(window.innerWidth, window.innerHeight);
        });

        window.appContext = appContext

        PIXI.loader
            .add("assets/apple.png")
            .add("assets/grass_1.png")
            .add("assets/dirt_1.png")
            .add("assets/vox/rocas_1_s.png")
            .add("assets/vox/arbol_1_s.png")
            .add("assets/vox/arbol_2_s.png")
            .add("assets/vox/arbol_3_s.png")
            .add("assets/vox/arbol_4_s.png")
            .add("assets/vox/arbol_5_s.png")                
            .add("assets/fred_map_s.json")
            .add("assets/LPC_house_interior/interior.png")
            .add("assets/oto_evi.png")
            .load(loadFirstScene);
    }

    function loadScene(sceneName) {
        console.log("Time to go to " + sceneName)

        if(appContext.currentWorld) {
            appContext.app.stage.removeChild(appContext.currentWorld.getEngine())
        }

        if(sceneName == "village") {
            appContext.currentWorld = villageWorld.createWorld(stateStore, appContext)
            appContext.app.stage.addChild(appContext.currentWorld.getEngine());
            villageWorld.eventEmitter.on("relocate", loadScene)
        } else if(sceneName == "forest") {
            appContext.currentWorld = forestWorld.createWorld(stateStore, appContext)
            appContext.app.stage.addChild(appContext.currentWorld.getEngine());
            forestWorld.eventEmitter.on("relocate", loadScene)
        }
    }

    async function loadFirstScene() {
        appContext.wordDatabase = await vocabulary.loadWordDatabaseFromAPI("/api/words")
        loadScene("village")
    }

    loadTraviso()
    .then(createGameLaunchScreen())
}
