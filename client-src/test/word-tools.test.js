const test = require('blue-tape')
const letterTools = require('../turkish/letter-tools')
const wordTools = require('../turkish/word-tools')

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

