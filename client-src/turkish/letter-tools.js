const _ = require('lodash')

const LETTER_GROUPS = {
    THIN_VOWELS: ['e','i','ö','ü'],
    THICK_VOWELS: ['a','ı','o','u'],
    HARD_CONSONANTS: ["ç","f","h","k","p","s","ş","t"],
    HARD_VOWEL_CHANGING_CONSONANTS: ["ç","t","k","p"],
    HARD_VOWEL_CHANGING_CONSONANTS_VOWEL_MATCHES: ["c","d","ğ", "b"],
    SOFT_CONSONANTS: ["b","c","d","g","ğ","j","l","m","n","r","v","y","z"]
}

LETTER_GROUPS.VOWELS = LETTER_GROUPS.THIN_VOWELS.concat(LETTER_GROUPS.THICK_VOWELS)
LETTER_GROUPS.CONSONANTS = LETTER_GROUPS.HARD_CONSONANTS.concat(LETTER_GROUPS.SOFT_CONSONANTS)

function charIsInLetterGroup(char, letterGroup) {
    return char.length == 1 && _.includes(letterGroup, char.toLowerCase())
}

function wordEndsInVowel(word) {
    return wordEndsWithLetterFromGroup(word, LETTER_GROUPS.VOWELS)
}

function wordEndsInHardConsonant(word) {
    return wordEndsWithLetterFromGroup(word, LETTER_GROUPS.HARD_CONSONANTS)
}

function wordEndsWithLetterFromGroup(word, letterGroup) {
    let lastCharacterOfWord = word.trim().slice(-1).toLowerCase()
    return _.includes(letterGroup, lastCharacterOfWord)
}

function wordStartsWithVowel(word) {
    return wordStartsWithLetterFromGroup(word, LETTER_GROUPS.VOWELS)
}

function wordStartsWithLetterFromGroup(word, letterGroup) {
    let firstCharacterOfWord = word.trim()[0].toLowerCase()
    return _.includes(letterGroup, firstCharacterOfWord)
}

function getLastLetterInWordOfGroup(word, letterGroup) {
    return _.findLast(word.split(""), l => charIsInLetterGroup(l, letterGroup))
}

function getLastLetter(word) {
    return word.trim().slice(-1)
}

function getLastVowel(word) {
    return getLastLetterInWordOfGroup(word, LETTER_GROUPS.VOWELS)
}

module.exports = {
    LETTER_GROUPS,
    charIsInLetterGroup,
    wordEndsWithLetterFromGroup,
    wordEndsInVowel,
    wordEndsInHardConsonant,
    wordStartsWithVowel,
    getLastLetterInWordOfGroup,
    getLastLetter,
    getLastVowel    
}

