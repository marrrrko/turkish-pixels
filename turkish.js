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

function wordEndsWithLetterFromGroup(word, letterGroup) {
    let lastCharacterOfWord = word.trim().slice(-1).toLowerCase()
    return _.includes(letterGroup, lastCharacterOfWord)
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

function harmonize2(word) {
    let lastVowel = getLastVowel(word).toLowerCase()
    if(charIsInLetterGroup(lastVowel, LETTER_GROUPS.THICK_VOWELS)) {
        return "a"
    } else if(charIsInLetterGroup(lastVowel, LETTER_GROUPS.THIN_VOWELS)) {
        return "e"
    } else {
        throw new Error("I can't harmonize(2) a word without a vowel.")
    }
}

function harmonize4(word) {
    let lastVowel = getLastVowel(word).toLowerCase()
    if(lastVowel == "a" || lastVowel == "ı") {
        return "ı"
    } else if(lastVowel == "e" || lastVowel == "i") {
        return "i"
    } else if (lastVowel == "o" || lastVowel == "u") {
        return "u"
    } else if (lastVowel == "ö" || lastVowel == "ü") {
        return "ü"
    } else {
        throw new Error("I can't harmonize(4) a word without a vowel.")
    }
}

function appendSuffixToWord(word, suffixPattern) {
    let suffixes = []
    let prefix = softenIfNeeded(word, suffixPattern)

    if(suffixPattern.startsWith("_yor")) {
        let wordEndsInVowel = wordEndsWithLetterFromGroup(prefix, LETTER_GROUPS.VOWELS)
        if(wordEndsInVowel) {
            prefix = prefix.trim().slice(0,-1)
        } 

        let harmonizedVowel = harmonize4(word)
        suffixes.push(suffixPattern.replace("_", harmonizedVowel))
        
    } else if (suffixPattern == "l_r") {
        let harmonizedVowel = harmonize2(word)
        suffixes.push(suffixPattern.replace("_", harmonizedVowel))
    }

    return [prefix].concat(suffixes).join("")
}

function softenIfNeeded(word, suffixPattern) {

    let softenedWord = word

    let lastLetterOfWord = getLastLetter(word)
    let mightNeedsSoftening = charIsInLetterGroup(
                                lastLetterOfWord,
                                LETTER_GROUPS.HARD_VOWEL_CHANGING_CONSONANTS)
    if(mightNeedsSoftening) {
        let firstLetterOfSuffix = suffixPattern.trim().slice(0,1)
        let startsWithVowel = charIsInLetterGroup(firstLetterOfSuffix, LETTER_GROUPS.VOWELS)
        if(startsWithVowel || firstLetterOfSuffix == "_") {
            let consonantIndex = LETTER_GROUPS.HARD_VOWEL_CHANGING_CONSONANTS.indexOf(lastLetterOfWord)
            let replacementConsonant = LETTER_GROUPS.HARD_VOWEL_CHANGING_CONSONANTS_VOWEL_MATCHES[consonantIndex]
            softenedWord = word.trim().slice(0,-1) + replacementConsonant
        }
    }

    return softenedWord
}

function getVerbRoot(infinitiveVerb) {
    let suffix = infinitiveVerb.trim().toLowerCase().slice(-3)
    if(suffix != "mek" && suffix != "mak") {
        throw new Error("I can't give the the root of a word that's not a verb")
    }

    return infinitiveVerb.trim().slice(0, -3)
}

function conjugateVerb(verb, tense, person, isPlural) {
    switch(tense.english) {
        case "present continuous":
            return conjugatePresentContinuousVerb(verb, person, isPlural)
        default:
            throw new Error("Sorry. I don't know how to conjugate that.")
    }
}

function conjugatePresentContinuousVerb(verb, person, isPlural) {
    let rootWord = getVerbRoot(verb.turkish)
    let word = appendSuffixToWord(rootWord,"_yor", 4)

    let verbPersonSuffix
    if(isPlural) {
        switch(person) {
            case 1:
                verbPersonSuffix = "uz"
                break
            case 2:
                verbPersonSuffix = "sunuz"
                break
            case 3:
                verbPersonSuffix = "lar"
                break
            default:
                throw new Error("I can't conjugate that")
        }
    } else {
        switch(person) {
            case 1:
                verbPersonSuffix = "um"
                break
            case 2:
                verbPersonSuffix = "sun"
                break
            case 3:
                verbPersonSuffix = ""
                break
            default:
                throw new Error("I can't conjugate that")
        }
    }

    return `${word}${verbPersonSuffix}`
}

module.exports = {
    LETTER_GROUPS,
    charIsInLetterGroup,
    getLastVowel,
    harmonize4,
    harmonize2,
    appendSuffixToWord,
    getVerbRoot,
    conjugateVerb
}

