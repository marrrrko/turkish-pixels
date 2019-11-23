const serve = require('koa-static')
const send = require('koa-send')
const Koa = require('koa')
const app = new Koa()

app.use(serve('dist', { index: "fred.html" }))
app.use(async (ctx, next) => {
    console.log(`Serving non static path "${ctx.path}"`)
    if(!ctx.path.startsWith("/api/") && ctx.method == "GET") {
        console.log("App provided")
        await send(ctx, "./dist/index.html")
    }
    await next()
})
app.use(async (ctx, next) => {
    await next()    
    if(ctx.path == "/api/profile" && ctx.method == "GET") {
        ctx.body = {
            about: { 
                header: `Happy provider of all software engineering elements needed to move projects from start to finish.`,
                flickrImageTag: `<a data-flickr-embed="true" href="https://www.flickr.com/photos/markcarrier/37155103626/in/dateposted-ff/" title="Alcatraz"><img src="https://live.staticflickr.com/4429/37155103626_317fd9671f_k.jpg" width="100%" alt="Alcatraz"></a>`,
                body: `I truly enjoy writing all kinds of software. Whether it's a mobile responsive web app using node.js or a smart home device algorithm in python, my goal is to get things working end-to-end without wasting time.\nOver the years, I've learned that the following elements play an essential role in making a software project successful:\n* A strong focus on quality while being flexible with regard to methodology and tools.\n* Having a good plan but being ready to change it at any time.\n* Building strong feedback loops that help detect problems early.\n\nI'm happy to work with almost any technology but favour the following:\n* Serverside: Node.js, Python, .Net Core\n* Client-side & Mobile: React, Bootstrap, responsive and progressive design\n* Data-persistence: Postgres, Redis, CouchDB\n* Infrastructure: Linux, Docker, AWS\n\nMy company is based in Montreal, Canada. I am currently living in beautiful Antalya, Turkey.`,
                aboutSiteFooter: `This site is meant as a showcase of my web development skills.  You can view the source on github`
            },
            experienceSections: [ { title: "Born", body: "Became human"} ],
            education: [ { title: "Kindergarten", body: "Learned to tie shoes "}]
        }
    }
})



app.listen(8888, () => console.log("At your service (port 8888)!!"))