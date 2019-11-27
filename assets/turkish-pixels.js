
function docReady(fn) {
    if (document.readyState === "complete" || document.readyState === "interactive") {
        setTimeout(fn, 1)
    } else {
        document.addEventListener("DOMContentLoaded", fn)
    }
} 

let Application = PIXI.Application,
    loader = PIXI.loader,
    resources = PIXI.loader.resources,
    Sprite = PIXI.Sprite,
    Container = PIXI.Container,    
    Graphics = PIXI.Graphics,
    TextureCache = PIXI.utils.TextureCache,
    Text = PIXI.Text,
    TextStyle = PIXI.TextStyle,
    Rectangle = PIXI.Rectangle

let app = undefined

function start() {
    let goButton = document.getElementById("go")
    goButton.addEventListener("click", (e) => {
        goButton.style.display = "none"
        requestFullScreen()
        setTimeout(initialize, 2000)
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
    app = new PIXI.Application({width: 256, height: 256})
    app.renderer.view.style.position = "absolute";
    app.renderer.view.style.display = "block";
    app.renderer.autoResize = true;
    app.renderer.resize(window.innerWidth, window.innerHeight);
    document.body.appendChild(app.view)
    requestFullScreen()

    window.addEventListener("resize", function(event){ 
        scaleToWindow(app.renderer.view);
        //app.renderer.resize(window.innerWidth, window.innerHeight);
    });

    PIXI.loader
        .add('LPC_house_interior/interior.png')
        .load(setup)
}

function setup() {    
    
    let floorTexture = PIXI.loader.resources["LPC_house_interior/interior.png"].texture
    let floorFrame = new Rectangle(0, 96, 32, 32)
    floorTexture.frame = floorFrame
    let floorSprite = new PIXI.Sprite(floorTexture)

    floorSprite.x = 100
    floorSprite.y = 100

    //app.stage.addChild(floorSprite)
    let tilingSprite = new PIXI.extras.TilingSprite(floorTexture, app.renderer.width, app.renderer.height);
    app.stage.addChild(tilingSprite)

    app.renderer.render(app.stage)
}

docReady(start)