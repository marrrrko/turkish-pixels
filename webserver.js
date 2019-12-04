const serve = require('koa-static')
//const send = require('koa-send')
const Koa = require('koa')
const app = new Koa()
const vocabulary = require('./client-src/vocabulary')

let wordDatabase

app.use(serve('dist', { index: "index.html" }))
// app.use(async (ctx, next) => {
//     console.log(`Serving non static path "${ctx.path}"`)
//     if(!ctx.path.startsWith("/api/") && ctx.method == "GET") {
//         console.log("App provided")
//         await send(ctx, "./dist/index.html")
//     }
//     await next()
// })

app.use(async (ctx, next) => {
    await next()    
    if(ctx.path == "/api/words" && ctx.method == "GET") {
        ctx.body = wordDatabase
    }
})


async function start() {
    wordDatabase = await vocabulary.loadWordDatabaseFromFile()
    let port = 8888
    await app.listen(port)
    console.log(`Turkish pixels being served on port ${port} with ${wordDatabase.all.length} words.`)
}

start()