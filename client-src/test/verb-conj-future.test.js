const test = require('blue-tape')
const letterTools = require('../turkish/letter-tools')
const wordTools = require('../turkish/word-tools')
const vocabulary = require('../vocabulary')

test("conjugateFuture", async function(t) {
    let wordDatabase = await vocabulary.loadWordDatabaseFromFile()
    
    let future = wordDatabase.getVerbTenseByEnglishName("future")

    let toGive = wordDatabase.getVerbByTurkishText("vermek")    

    t.equal(
        wordTools.conjugateVerb(toGive, future, 1, false),
        "vereceğim")
    t.equal(
        wordTools.conjugateVerb(toGive, future, 2, false),
        "vereceksin")
    t.equal(
        wordTools.conjugateVerb(toGive, future, 3, false),
        "verecek")
    t.equal(
        wordTools.conjugateVerb(toGive, future, 1, true),
        "vereceğiz")
    t.equal(
        wordTools.conjugateVerb(toGive, future, 2, true),
        "vereceksiniz")
    t.equal(
        wordTools.conjugateVerb(toGive, future, 3, true),
        "verecekler")
    

    let toWait = wordDatabase.getVerbByTurkishText("beklemek")    
    t.equal(
        wordTools.conjugateVerb(toWait, future, 1, false),
        "bekleyeceğim")
    t.equal(
        wordTools.conjugateVerb(toWait, future, 2, false),
        "bekleyeceksin")
    t.equal(
        wordTools.conjugateVerb(toWait, future, 3, false),
        "bekleyecek")
    t.equal(
        wordTools.conjugateVerb(toWait, future, 1, true),
        "bekleyeceğiz")
    t.equal(
        wordTools.conjugateVerb(toWait, future, 2, true),
        "bekleyeceksiniz")
    t.equal(
        wordTools.conjugateVerb(toWait, future, 3, true),
        "bekleyecekler")

    let toGo = wordDatabase.getVerbByTurkishText("gitmek")
    t.equal(
        wordTools.conjugateVerb(toGo, future, 1, false),
        "gideceğim")

    t.equal(
        wordTools.conjugateVerb(toGo, future, 1, false),
        "gideceğim")

    let toWrite = wordDatabase.getVerbByTurkishText("yazmak")
    t.equal(
        wordTools.conjugateVerb(toWrite, future, 2, true),
        "yazacaksınız")
})