const vocabulary = require('./client-src/vocabulary')
const _ = require('lodash')
const sentences = require('./client-src/turkish/sentences')

const delay = function(delay) {
    return new Promise(function(resolve) {
        setTimeout(() => resolve(), delay)
    })
}
async function runAsCommandLineProgram() {
    let wordDatabase = await vocabulary.loadWordDatabaseFromFile()

    while(true) {
        await askARandomTurkishQuestion(wordDatabase)
        await delay(1500)  
    }
}

async function askARandomTurkishQuestion(wordDatabase) {
    //let sentence = buildVerbSubjectObjectSentence(words, words.verbTenses)
    let sentence = sentences.buildVerbSubjectSentence(
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

    let readline = require('readline')
    await new Promise(function(resolve, reject) {
        rl = readline.createInterface({ input: process.stdin, output: process.stdout })
        rl.question('', (answer) => {      
            console.log(`Answer: ${_.capitalize(sentence.translation)}`)          
            rl.close()
            resolve()
        });
    })
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