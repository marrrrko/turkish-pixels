const test = require('blue-tape')
const letterTools = require('../turkish/letter-tools')
const wordTools = require('../turkish/word-tools')
const vocabulary = require('../vocabulary')

test('charIsInLetterGroup', async function(t) {
    t.ok(letterTools.charIsInLetterGroup('a', letterTools.LETTER_GROUPS.VOWELS), "a is a vowel")
    t.ok(letterTools.charIsInLetterGroup('Ö', letterTools.LETTER_GROUPS.VOWELS), "Ö is a vowel")
    t.notOk(letterTools.charIsInLetterGroup('p', letterTools.LETTER_GROUPS.VOWELS), "p is not a vowel")
    t.notOk(letterTools.charIsInLetterGroup('fred', letterTools.LETTER_GROUPS.VOWELS), "fred is not a vowel")
    t.notOk(letterTools.charIsInLetterGroup('iiii', letterTools.LETTER_GROUPS.VOWELS), "iiii is not a vowel")
})

test('getLastVowel', async function(t) {
    t.equal("a", letterTools.getLastVowel("anlamak"))
    t.equal("u", letterTools.getLastVowel("yorgunum"))
    t.equal("a", letterTools.getLastVowel("yapınca"))
    t.equal("ü", letterTools.getLastVowel("ünlüyüm"))
    t.equal("ü", letterTools.getLastVowel("köprü"))
    t.equal("ö", letterTools.getLastVowel("göz"))
    t.equal("U", letterTools.getLastVowel("KUŞ"))
    t.equal(undefined, letterTools.getLastVowel("BYL"))
})

test('getHarmonizedVowel2', async function(t) {
    t.equal("a",wordTools.getHarmonizedVowel2("hafta"))
    t.equal("e",wordTools.getHarmonizedVowel2("dün"))
    t.equal("a",wordTools.getHarmonizedVowel2("kuzu"))
    t.equal("e",wordTools.getHarmonizedVowel2("mühendis"))
})

test('getHarmonizedVowel4', async function(t) {
    t.equal("ı",wordTools.getHarmonizedVowel4("hafta"))
    t.equal("ü",wordTools.getHarmonizedVowel4("dün"))
    t.equal("u",wordTools.getHarmonizedVowel4("kuzu"))
    t.equal("i",wordTools.getHarmonizedVowel4("mühendis"))
})

test("getVerbRoot", async function(t) {
    t.equal("yap", wordTools.getVerbRoot("yapmak"))
    t.equal("git", wordTools.getVerbRoot("gitmek"))
    t.equal("çalış", wordTools.getVerbRoot("çalışmak"))
    t.equal("konuş", wordTools.getVerbRoot("konuşmak"))
    t.equal("bil", wordTools.getVerbRoot("bilmek"))
    t.equal("al", wordTools.getVerbRoot("almak"))
})

test('appendSuffixToWord', async function(t) {
    t.equal(wordTools.appendSuffixToWord("gün", "l_r", 2), "günler")
    t.equal(wordTools.appendSuffixToWord("gel", "_yor", 4), "geliyor")
    t.equal(wordTools.appendSuffixToWord("oku", "_yorsun", 4), "okuyorsun")
    //t.equal(turkish.appendSuffixToWord("", "", 4), "")
    //t.equal(turkish.appendSuffixToWord("", "", 4), "")
})

test("conjugateVerb", async function(t) {
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

test("softenNoun", async function(t) {
    t.equal(
        wordTools.softenNoun("amaç"),
        "amac"
    )
    t.equal(
        wordTools.softenNoun("çiçek"),
        "çiçeğ"
    )
    t.equal(
        wordTools.softenNoun("kitap"),
        "kitab"
    )
    t.equal(
        wordTools.softenNoun("ümit"),
        "ümid"
    )
})


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