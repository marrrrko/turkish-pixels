const test = require('blue-tape')
const wordTools = require('../turkish/word-tools')

test("makePossesive", async function(t) {
    t.equal(
        wordTools.makePossesive("kitap",1, false),
        "kitabım"
    )
    t.equal(
        wordTools.makePossesive("kitap",2, false),
        "kitabın"
    )
    t.equal(
        wordTools.makePossesive("kitap",3, false),
        "kitabı"
    )
    t.equal(
        wordTools.makePossesive("kitap",1, true),
        "kitabımız"
    )
    t.equal(
        wordTools.makePossesive("kitap",2, true),
        "kitabınız"
    )
    t.equal(
        wordTools.makePossesive("kitap",3, true),
        "kitabı"
    )

    t.equal(
        wordTools.makePossesive(" kalem ",2, true),
        "kaleminiz"
    )

    t.equal(
        wordTools.makePossesive("aile",1, false),
        "ailem"
    )
    t.equal(
        wordTools.makePossesive("aile",2, false),
        "ailen"
    )
    t.equal(
        wordTools.makePossesive("aile",3, false),
        "ailesi"
    )
    t.equal(
        wordTools.makePossesive("aile",1, true),
        "ailemiz"
    )
    t.equal(
        wordTools.makePossesive("aile",2, true),
        "aileniz"
    )
    t.equal(
        wordTools.makePossesive("aile",3, true),
        "ailesi"
    )
})