
const fs = require('fs')
const _ = require('lodash')

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

    let sentence = buildRandomSentence(words)
    //console.log(JSON.stringify(sentence,null, "  "))

    console.log(`\nSentence to build:`)
    console.log(`  Verb: ${sentence.verb.english}, ${sentence.tense.english} tense`)
    console.log(`  Object: ${sentence.object.english}`)
    console.log(`  Subject: ${sentence.subject.english}`)
}

function buildRandomSentence(words) {
    let sentence = {}
    sentence.verb = _.sample(words.verbs)
    sentence.tense = _.sample(words.verbTenses)
    sentence.subject = _.sample(words.pronouns)
    let objectId = _.sample(sentence.verb.applicableObjects)
    sentence.object = _.find(words.commonNouns, n => n.id == objectId)

    return sentence
    
}

function startProgram() {
    Promise.resolve()
    .then(runProgram)
    .catch(function(e) {
        console.error("An error occurred.", e)
    })
}

startProgram()