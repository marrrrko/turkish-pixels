const vocabulary = require('./vocabulary')
const _ = require('lodash')
const turkish = require('./turkish')
const readline = require('readline')
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });



async function runAsCommandLineProgram() {
    let words = await vocabulary.loadWordDatabase()

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
    await new Promise(function(resolve, reject) {
        rl.question('\nHit enter to view the answer ', (answer) => {      
            console.log(`\n  ${sentence.translation}\n`)
            rl.close();
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

function buildVerbSubjectSentence(wordDatabase, allowedTenses) {
    let sentence = {}

    if(allowedTenses == null)
        allowedTenses = wordDatabase.verbTenses

    sentence.verb = _.sample(wordDatabase.verbs)
    sentence.tense = _.sample(allowedTenses)
    sentence.subject = _.sample(wordDatabase.pronouns)

    let conjugatedVerb = turkish.conjugateVerb(
        sentence.verb,
        sentence.tense,
        sentence.subject.person,
        sentence.subject.isPlural)

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