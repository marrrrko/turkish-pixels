const test = require('blue-tape')
const turkish = require('../turkish')
const vocabulary = require('../vocabulary')

test('charIsInLetterGroup', async function(t) {
    t.ok(turkish.charIsInLetterGroup('a', turkish.LETTER_GROUPS.VOWELS), "a is a vowel")
    t.ok(turkish.charIsInLetterGroup('Ö', turkish.LETTER_GROUPS.VOWELS), "Ö is a vowel")
    t.notOk(turkish.charIsInLetterGroup('p', turkish.LETTER_GROUPS.VOWELS), "p is not a vowel")
    t.notOk(turkish.charIsInLetterGroup('fred', turkish.LETTER_GROUPS.VOWELS), "fred is not a vowel")
    t.notOk(turkish.charIsInLetterGroup('iiii', turkish.LETTER_GROUPS.VOWELS), "iiii is not a vowel")
})

test('getLastVowel', async function(t) {
    t.equal("a", turkish.getLastVowel("anlamak"))
    t.equal("u", turkish.getLastVowel("yorgunum"))
    t.equal("a", turkish.getLastVowel("yapınca"))
    t.equal("ü", turkish.getLastVowel("ünlüyüm"))
    t.equal("ü", turkish.getLastVowel("köprü"))
    t.equal("ö", turkish.getLastVowel("göz"))
    t.equal("U", turkish.getLastVowel("KUŞ"))
    t.equal(undefined, turkish.getLastVowel("BYL"))
})

test('harmonize2', async function(t) {
    t.equal("a",turkish.harmonize2("hafta"))
    t.equal("e",turkish.harmonize2("dün"))
    t.equal("a",turkish.harmonize2("kuzu"))
    t.equal("e",turkish.harmonize2("mühendis"))
})

test('harmonize4', async function(t) {
    t.equal("ı",turkish.harmonize4("hafta"))
    t.equal("ü",turkish.harmonize4("dün"))
    t.equal("u",turkish.harmonize4("kuzu"))
    t.equal("i",turkish.harmonize4("mühendis"))
})

test("getVerbRoot", async function(t) {
    t.equal("yap", turkish.getVerbRoot("yapmak"))
    t.equal("git", turkish.getVerbRoot("gitmek"))
    t.equal("çalış", turkish.getVerbRoot("çalışmak"))
    t.equal("konuş", turkish.getVerbRoot("konuşmak"))
    t.equal("bil", turkish.getVerbRoot("bilmek"))
    t.equal("al", turkish.getVerbRoot("almak"))
})

test('appendSuffixToWord', async function(t) {
    t.equal(turkish.appendSuffixToWord("gün", "l_r", 2), "günler")
    t.equal(turkish.appendSuffixToWord("gel", "_yor", 4), "geliyor")
    t.equal(turkish.appendSuffixToWord("oku", "_yorsun", 4), "okuyorsun")
    //t.equal(turkish.appendSuffixToWord("", "", 4), "")
    //t.equal(turkish.appendSuffixToWord("", "", 4), "")
})

test("conjugateVerb", async function(t) {
    let wordDatabase = await vocabulary.loadWordDatabase()
    
    let presentContinuous = wordDatabase.getVerbTenseByEnglishName("present continuous")

    let toCome = wordDatabase.getVerbByEnglishName("to come")
    let toGo = wordDatabase.getVerbByEnglishName("to go")
    let toWant = wordDatabase.getVerbByEnglishName("to want")
    let toKnow = wordDatabase.getVerbByEnglishName("to know")
    let toTake = wordDatabase.getVerbByEnglishName("to take")
    let toRead = wordDatabase.getVerbByEnglishName("to read")
    
    t.equal(
        turkish.conjugateVerb(toCome, presentContinuous, 2, false),
        "geliyorsun")

    t.equal(
        turkish.conjugateVerb(toGo, presentContinuous, 1, true),
        "gidiyoruz")

    t.equal(
        turkish.conjugateVerb(toWant, presentContinuous, 1, false),
        "istiyorum")

    t.equal(
        turkish.conjugateVerb(toKnow, presentContinuous, 2, true, false, true),
        "biliyor musunuz")

    t.equal(
        turkish.conjugateVerb(toTake, presentContinuous, 2, false, true, false),
        "almıyorsun"
    )

    t.equal(
        turkish.conjugateVerb(toTake, presentContinuous, 1, true, true, true),
        "almıyor muyuz"
    )

    t.equal(
        turkish.conjugateVerb(toRead, presentContinuous, 3, false, false, true),
        "okuyor mu"
    )

    t.equal(
        turkish.conjugateVerb(toRead, presentContinuous, 1, true, true, false),
        "okumuyoruz"
    )

    t.equal(
        turkish.conjugateVerb(toRead, presentContinuous, 2, true, true, true),
        "okumuyor musunuz"
    )
})