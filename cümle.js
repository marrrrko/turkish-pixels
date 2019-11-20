
const fs = require('fs')
const _ = require('lodash')
const turkish = require('./turkish')
const readline = require('readline')
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

async function loadWordDatabase() {    
    let wordData = await readFileAsync(__dirname + '/kelimeler.json', 'utf-8')
    let wordJSON = JSON.parse(wordData)
    //console.log(`Loaded ${wordJSON.length} turkish words.`)
    return wordJSON
}

function readFileAsync(filename, encoding) {
    return new Promise(function(resolve, reject) {
        fs.readFile(filename, encoding, function(err, data) {
            if(err)
                reject(err)
            else
                resolve(data)
        })
    })
}

async function runProgram() {
    let words = {}
    words.all = await loadWordDatabase()
    words.verbs = words.all.filter(w => w.type == "verb")
    words.commonNouns = words.all.filter(w => w.type == "common noun")
    words.verbTenses = words.all.filter(w => w.type == "tense")
    words.pronouns = words.all.filter(w => w.type == "pronoun")

    //let sentence = buildVerbSubjectObjectSentence(words, words.verbTenses)
    let sentence = buildVerbSubjectSentence(words, words.verbTenses.filter(t => t.english == "present continuous"))

    console.log(`\nSentence to build:`)
    console.log(`  Verb: ${sentence.verb.english}`)
    if(sentence.object)
        console.log(`  Object: ${sentence.object.english}`)
    
    let subjectHint = ""
    if(sentence.subject.person == 2) {
        subjectHint = sentence.subject.isPlural ? " (plural)" : " (singular)"
    }
    console.log(`  Subject: ${sentence.subject.english}${subjectHint}`)
    console.log(`  Tense: ${sentence.tense.english}`)
    rl.question('\nHit enter to view the answer ', (answer) => {      
        console.log(`\t${sentence.translation}`)
        rl.close();
    });
}

function buildVerbSubjectObjectSentence(words) {
    let sentence = {}
    sentence.verb = _.sample(words.verbs)
    sentence.tense = _.sample(words.verbTenses)
    sentence.subject = _.sample(words.pronouns)
    let objectId = _.sample(sentence.verb.applicableObjects)
    sentence.object = _.find(words.commonNouns, n => n.id == objectId)

    return sentence
}

function buildVerbSubjectSentence(words, allowedTenses) {
    let sentence = {}
    sentence.verb = _.sample(words.verbs)
    sentence.tense = _.sample(allowedTenses)
    sentence.subject = _.sample(words.pronouns)

    let conjugatedVerb = conjugateVerb(
        sentence.verb,
        sentence.tense,
        sentence.subject.person,
        sentence.subject.isPlural)

    sentence.translation = `${sentence.subject.turkish} ${conjugatedVerb}`

    return sentence
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
    let rootWord = turkish.getVerbRoot(verb.turkish)
    let word = turkish.appendSuffixToWord(rootWord,"_yor", 4)
    // let suffix1 = ""
    // let lastLetterOfRootWord = rootWord.trim().slice(-1)
    // if(turkish.isVowel(lastLetterOfRootWord)) {
    //     suffix1 = "y"
    // }
    // let suffix2 = turkish.harmonize4(rootWord)
    // let suffix3 = "yor"
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

function startProgram() {
    Promise.resolve()
    .then(runProgram)
    .catch(function(e) {
        console.error("An error occurred.", e)
    })
}

startProgram()