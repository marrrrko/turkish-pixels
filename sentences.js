const vocabulary = require('./vocabulary')
const _ = require('lodash')
const turkish = require('./turkish')
const readline = require('readline')
const delay = function(delay) {
    return new Promise(function(resolve) {
        setTimeout(() => resolve(), delay)
    })
}
async function runAsCommandLineProgram() {
    let wordDatabase = await vocabulary.loadWordDatabase()

    while(true) {
        await askARandomTurkishQuestion(wordDatabase)
        await delay(4000)  
    }
    
}

async function askARandomTurkishQuestion(wordDatabase) {
    //let sentence = buildVerbSubjectObjectSentence(words, words.verbTenses)
    let sentence = buildVerbSubjectSentence(
                    wordDatabase,
                    wordDatabase.verbTenses.filter(t => t.english == "present continuous"),
                    _.random(0,1),
                    _.random(0,1))

    console.log(`\n======================================\n`)
    console.log(`Sentence to build:`)
    console.log(`  Verb: ${sentence.verb.english}`)
    if(sentence.object)
        console.log(`  Object: ${sentence.object.english}`)
    
    let subjectHint = ""
    if(sentence.subject.person == 2) {
        subjectHint = sentence.subject.isPlural ? " (plural)" : " (singular)"
    }
    console.log(`  Subject: ${sentence.subject.english}${subjectHint}`)
    
    let tenseHints = []
    if(sentence.negativeForm)
        tenseHints.push("negative")
    if(sentence.questionForm)
        tenseHints.push("question")
    
    let tenseHint = ""
    if(tenseHints.length)
        tenseHint = `, ${tenseHints.join(" ")}`
    console.log(`  Tense: ${sentence.tense.english}${tenseHint}`)

    await new Promise(function(resolve, reject) {
        rl = readline.createInterface({ input: process.stdin, output: process.stdout })
        rl.question('', (answer) => {      
            console.log(`Answer: ${_.capitalize(sentence.translation)}`)          
            rl.close()
            resolve()
        });
    })
}

function buildVerbSubjectObjectSentence(wordDatabase) {
    let sentence = {}
    sentence.verb = _.sample(wordDatabase.verbs)
    sentence.tense = _.sample(wordDatabase.verbTenses)
    sentence.subject = _.sample(wordDatabase.pronouns)
    let objectId = _.sample(sentence.verb.applicableObjects)
    sentence.object = _.find(wordDatabase.commonNouns, n => n.id == objectId)

    return sentence
}

function buildVerbSubjectSentence(wordDatabase, allowedTenses, negativeFormAllowed, questionFormAllowed) {
    let sentence = {}

    if(allowedTenses == null)
        allowedTenses = wordDatabase.verbTenses

    sentence.verb = _.sample(wordDatabase.verbs)
    sentence.subject = _.sample(wordDatabase.pronouns)
    sentence.tense = _.sample(allowedTenses)
    sentence.negativeForm = false
    if(negativeFormAllowed) {
        sentence.negativeForm = _.sample([true, false, false])
    }
    if(questionFormAllowed) {
        sentence.questionForm = _.sample([true, false, false])
    }

    let conjugatedVerb = turkish.conjugateVerb(
        sentence.verb,
        sentence.tense,
        sentence.subject.person,
        sentence.subject.isPlural,
        sentence.negativeForm,
        sentence.questionForm)

    sentence.translation = `${sentence.subject.turkish} ${conjugatedVerb}`

    return sentence
}

if (require.main === module) {
    Promise.resolve()
    .then(runAsCommandLineProgram)
    .catch(function(e) {
        console.error("An error occurred.", e)
        return 1
    })
    .then(function(errorCode) {
        process.exit(errorCode || 0)
    })
}

module.exports = {
    buildVerbSubjectSentence,
    buildVerbSubjectObjectSentence
}