const _ = require('lodash')
const letterTools = require('./letter-tools')

function harmonize2(word) {
    let lastVowel = letterTools.getLastVowel(word).toLowerCase()
    if(letterTools.charIsInLetterGroup(lastVowel, letterTools.LETTER_GROUPS.THICK_VOWELS)) {
        return "a"
    } else if(letterTools.charIsInLetterGroup(lastVowel, letterTools.LETTER_GROUPS.THIN_VOWELS)) {
        return "e"
    } else {
        throw new Error("I can't harmonize(2) a word without a vowel.")
    }
}

function harmonize4(word) {
    let lastVowel = letterTools.getLastVowel(word).toLowerCase()
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
        let wordEndsInVowel = letterTools.wordEndsWithLetterFromGroup(prefix, letterTools.LETTER_GROUPS.VOWELS)
        if(wordEndsInVowel) {
            prefix = prefix.trim().slice(0,-1)
        } 

        let harmonizedVowel = harmonize4(word)
        suffixes.push(suffixPattern.replace("_", harmonizedVowel))
        
    } else if (suffixPattern == "l_r") {
        let harmonizedVowel = harmonize2(word)
        suffixes.push(suffixPattern.replace("_", harmonizedVowel))
    } else {
        let harmonizedVowel = harmonize4(word)
        suffixes.push(suffixPattern.replace("_", harmonizedVowel))
    }

    return [prefix].concat(suffixes).join("")
}

const softeningExceptions = ["git", "tat", "dit", "et", "güt"]
function softenIfNeeded(word, suffixPattern) {
    let softenedWord = word

    let qualifiesForSoftening = softeningExceptions.includes(word.toLowerCase().trim())
    if(qualifiesForSoftening) {
        let firstLetterOfSuffix = suffixPattern.trim().slice(0,1)
        let startsWithVowel = letterTools.charIsInLetterGroup(firstLetterOfSuffix, letterTools.LETTER_GROUPS.VOWELS)
        if(startsWithVowel || firstLetterOfSuffix == "_") {            
            softenedWord = word.trim().slice(0,-1) + "d"
        }
    }

    return softenedWord
}

function makePossesive(noun, person, isPlural) {
    
}

function getVerbRoot(infinitiveVerb) {
    let suffix = infinitiveVerb.trim().toLowerCase().slice(-3)
    if(suffix != "mek" && suffix != "mak") {
        throw new Error("I can't give the the root of a word that's not a verb")
    }

    return infinitiveVerb.trim().slice(0, -3)
}

function conjugateVerb(verb, tense, person, isPlural, negativeForm, questionForm) {
    switch(tense.english) {
        case "present continuous":
            return conjugatePresentContinuousVerb(verb, person, isPlural, negativeForm, questionForm)
        default:
            throw new Error("Sorry. I don't know how to conjugate that.")
    }
}

function conjugatePresentContinuousVerb(verb, person, isPlural, negativeForm, questionForm) {
    let expression = []
    let rootWord = getVerbRoot(verb.turkish)
    
    if(negativeForm)
        expression.push(appendSuffixToWord(rootWord,"m_yor", 4))
    else 
        expression.push(appendSuffixToWord(rootWord,"_yor", 4))

    if(questionForm) {
        expression.push(" ")
        expression.push("mu")
        if(person == 1)
            expression.push("y")
    }
    
    if(isPlural) {
        expression.push(["uz", "sunuz", "lar"][person - 1])
    } else {
        expression.push(["um", "sun", ""][person - 1])
    }

    return expression.join("")
}

module.exports = {
    harmonize4,
    harmonize2,
    appendSuffixToWord,
    getVerbRoot,
    conjugateVerb
}
