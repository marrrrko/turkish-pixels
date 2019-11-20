const test = require('blue-tape')
const turkish = require('../turkish')

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