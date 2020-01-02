const _ = require('lodash')
const letterTools = require('./letter-tools')

function getHarmonizedVowel2(word) {
    let lastVowel = letterTools.getLastVowel(word).toLowerCase()
    if(letterTools.charIsInLetterGroup(lastVowel, letterTools.LETTER_GROUPS.THICK_VOWELS)) {
        return "a"
    } else if(letterTools.charIsInLetterGroup(lastVowel, letterTools.LETTER_GROUPS.THIN_VOWELS)) {
        return "e"
    } else {
        throw new Error("I can't harmonize(2) a word without a vowel.")
    }
}

function getHarmonizedVowel4(word) {
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
    let prefix = softenVerb(word, suffixPattern)

    if(suffixPattern.startsWith("_yor")) {
        let wordEndsInVowel = letterTools.wordEndsWithLetterFromGroup(prefix, letterTools.LETTER_GROUPS.VOWELS)
        if(wordEndsInVowel) {
            prefix = prefix.trim().slice(0,-1)
        } 

        let harmonizedVowel = getHarmonizedVowel4(word)
        suffixes.push(suffixPattern.replace("_", harmonizedVowel))
        
    } else if (suffixPattern == "l_r") {
        let harmonizedVowel = getHarmonizedVowel2(word)
        suffixes.push(suffixPattern.replace("_", harmonizedVowel))
    } else {
        let harmonizedVowel = getHarmonizedVowel4(word)
        suffixes.push(suffixPattern.replace("_", harmonizedVowel))
    }

    return [prefix].concat(suffixes).join("")
}

const softeningExceptions = ["git", "tat", "dit", "et", "güt"]
function softenVerb(word, suffixPattern) {
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

function softenNoun(word) {
    let needsSoftenning = letterTools.wordEndsWithLetterFromGroup(
        word,
        letterTools.LETTER_GROUPS.HARD_VOWEL_CHANGING_CONSONANTS)

    if(needsSoftenning) {        
        return soften(word)
    } else {
        return word
    }
}

function soften(word) {
    const lastLetter = letterTools.getLastLetter(word)
    const hardConsonentIndex = letterTools.LETTER_GROUPS.HARD_VOWEL_CHANGING_CONSONANTS.indexOf(lastLetter)
    const softenedConsonent = letterTools.LETTER_GROUPS.HARD_VOWEL_CHANGING_CONSONANTS_VOWEL_MATCHES[hardConsonentIndex]
    return word.trim().slice(0,-1) + softenedConsonent
}

function makePossesive(noun, person, isPlural) {
    if(!noun)
        throw new Error("Need a noun!")
    noun = noun.trim()
    let wordEndsInVowel = letterTools.wordEndsWithLetterFromGroup(noun, letterTools.LETTER_GROUPS.VOWELS)
    let nextVowel = getHarmonizedVowel4(noun)
    if(wordEndsInVowel) {
        if(!isPlural) {
            switch(person) {
                case 1:
                    return `${noun}m`
                case 2:
                    return `${noun}n`
                case 3:
                    return `${noun}s${nextVowel}`
                default:
                    throw new Error("Impossible person")
            }
        } else {
            switch(person) {
                case 1:
                    return `${noun}m${nextVowel}z`
                case 2:
                    return `${noun}n${nextVowel}z`
                case 3:
                    return `${noun}s${nextVowel}`
                default:
                    throw new Error("Impossible person")
            }
        }
    } else {
        let softenedNoun = softenNoun(noun)
        if(!isPlural) {
            switch(person) {
                case 1:
                    return `${softenedNoun}${nextVowel}m`
                case 2:
                    return `${softenedNoun}${nextVowel}n`
                case 3:
                    return `${softenedNoun}${nextVowel}`
                default:
                    throw new Error("Impossible person")
            }
        } else {
            switch(person) {
                case 1:
                    return `${softenedNoun}${nextVowel}m${nextVowel}z`
                case 2:
                    return `${softenedNoun}${nextVowel}n${nextVowel}z`
                case 3:
                    return `${softenedNoun}${nextVowel}`
                default:
                    throw new Error("Impossible person")
            }
        }
    }
}

function getPossesivePronoun(person, isPlural) {
    if(!isPlural) {
        switch(person) {
            case 1:
                return `benim`
            case 2:
                return `senin`
            case 3:
                return `onun`
            default:
                throw new Error("Impossible person")
        }
    } else {
        switch(person) {
            case 1:
                return `bizim`
            case 2:
                return `sizin`
            case 3:
                return `onların`
            default:
                throw new Error("Impossible person")
        }
    }
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
            return conjugatePresentContinuous(verb, person, isPlural, negativeForm, questionForm)
        case "future":
            return conjugateFuture(verb, person, isPlural, negativeForm, questionForm)
        default:
            throw new Error("Sorry. I don't know how to conjugate that.")
    }
}

function conjugatePresentContinuous(verb, person, isPlural, negativeForm, questionForm) {
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

function conjugateFuture(verb, person, isPlural, negativeForm, questionForm) {
    const rootWord = getVerbRoot(verb.turkish)

    let conjugatedVerb = appendHarmonizedSuffix(rootWord,"_c_k")

    if(!isPlural) {
        conjugatedVerb = appendHarmonizedSuffix(conjugatedVerb, ["*m", "s*n", ""][person - 1])
    } else {
        conjugatedVerb = appendHarmonizedSuffix(conjugatedVerb, ["*z", "s*n*z", "l_r"][person - 1])
    }
    return conjugatedVerb
}

function appendHarmonizedSuffix(root, suffixPattern) {    
    root = root.trim()
    suffixPattern = suffixPattern.trim()
    const expression = []

    if(!suffixPattern)
        return root

    const rootEndsInVowel = letterTools.wordEndsInVowel(root)
    const rootEndsInHardConsonant = letterTools.wordEndsInHardConsonant(root)
    const suffixStartsWithVowel = (
        letterTools.wordStartsWithVowel(suffixPattern)
        || suffixPattern[0] == "_"
        || suffixPattern[0] == "*"
    )

    if(rootEndsInVowel && suffixStartsWithVowel) {
        expression.push(root)
        expression.push("y")
    } else if(rootEndsInHardConsonant && suffixStartsWithVowel) {
        expression.push(soften(root))
    } else {
        expression.push(root)
    }

    return harmonizePattern(expression.join(""), suffixPattern)
}

function harmonizePattern(baseWord, suffixPattern) {
    const suffixes = `${baseWord}${suffixPattern}`.split("_")
    return suffixes.reduce(harmonize2PatternReducer, "") 
}

function harmonize2PatternReducer(accumulator, current) {

    const contains4Pattern = current.indexOf("*") > -1

    if(accumulator === "" && !contains4Pattern)
        return current    
    
    if(contains4Pattern) {
        const suffixes = `${accumulator}${current}`.split("*")
        return suffixes.reduce(harmonize4PatternReducer, "")
    } else {
        const nextVowel = getHarmonizedVowel2(accumulator)
        return `${accumulator}${nextVowel}${current}`
    }
}

function harmonize4PatternReducer(accumulator, current) {
    if(accumulator === "")
        return current

    const nextVowel = getHarmonizedVowel4(accumulator)

    return `${accumulator}${nextVowel}${current}`
}

function makeLocativeTo(location) {
    location = location.trim()
    const letter = getHarmonizedVowel2(location)
    if(letterTools.wordEndsWithLetterFromGroup(location, letterTools.LETTER_GROUPS.CONSONANTS)) {        
        return `${location}${letter}`
    } else {
        return `${location}y${letter}`
    }
}

function makeLocativeAt(location) {
    location = location.trim()
    const letter = getHarmonizedVowel2(location)
    if(letterTools.wordEndsWithLetterFromGroup(location, letterTools.LETTER_GROUPS.HARD_CONSONANTS)) {
        return `${location}t${letter}`
    } else {
        return `${location}d${letter}`
    }
}

function makeLocativeFrom(location) {
    location = location.trim()
    const letter = getHarmonizedVowel2(location)
    if(letterTools.wordEndsWithLetterFromGroup(location, letterTools.LETTER_GROUPS.HARD_CONSONANTS)) {
        return `${location}t${letter}n`
    } else {
        return `${location}d${letter}n`
    }
}

module.exports = {
    getHarmonizedVowel4,
    getHarmonizedVowel2,
    appendSuffixToWord,
    getVerbRoot,
    conjugateVerb,
    makePossesive,
    getPossesivePronoun,
    softenVerb,
    softenNoun,
    makeLocativeTo,
    makeLocativeAt,
    makeLocativeFrom
}
