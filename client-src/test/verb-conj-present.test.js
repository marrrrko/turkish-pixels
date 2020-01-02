const test = require('blue-tape')
const letterTools = require('../turkish/letter-tools')
const wordTools = require('../turkish/word-tools')
const vocabulary = require('../vocabulary')

test("conjugatePresentContinuous", async function(t) {
    let wordDatabase = await vocabulary.loadWordDatabaseFromFile()
    
    let presentContinuous = wordDatabase.getVerbTenseByEnglishName("present continuous")

    let toCome = wordDatabase.getVerbByTurkishText("gelmek")
    let toGo = wordDatabase.getVerbByTurkishText("gitmek")
    let toWant = wordDatabase.getVerbByTurkishText("istemek")
    let toKnow = wordDatabase.getVerbByTurkishText("bilmek")
    let toTake = wordDatabase.getVerbByTurkishText("almak")
    let toRead = wordDatabase.getVerbByTurkishText("okumak")
    let toDo = wordDatabase.getVerbByTurkishText("yapmak")
    
    t.equal(
        wordTools.conjugateVerb(toCome, presentContinuous, 2, false),
        "geliyorsun")

    t.equal(
        wordTools.conjugateVerb(toGo, presentContinuous, 1, true),
        "gidiyoruz")

    t.equal(
        wordTools.conjugateVerb(toWant, presentContinuous, 1, false),
        "istiyorum")

    t.equal(
        wordTools.conjugateVerb(toKnow, presentContinuous, 2, true, false, true),
        "biliyor musunuz")

    t.equal(
        wordTools.conjugateVerb(toTake, presentContinuous, 2, false, true, false),
        "almıyorsun"
    )

    t.equal(
        wordTools.conjugateVerb(toTake, presentContinuous, 1, true, true, true),
        "almıyor muyuz"
    )

    t.equal(
        wordTools.conjugateVerb(toRead, presentContinuous, 3, false, false, true),
        "okuyor mu"
    )

    t.equal(
        wordTools.conjugateVerb(toRead, presentContinuous, 1, true, true, false),
        "okumuyoruz"
    )

    t.equal(
        wordTools.conjugateVerb(toRead, presentContinuous, 2, true, true, true),
        "okumuyor musunuz"
    )

    t.equal(
        wordTools.conjugateVerb(toDo, presentContinuous, 1, false, false, false),
        "yapıyorum"
    )
})
