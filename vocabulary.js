const fs = require('fs')
const _ = require('lodash')

async function loadWordDatabase() {    
    let wordData = await readFileAsync(__dirname + '/words.json', 'utf-8')
    let wordJSON = JSON.parse(wordData)
    //console.log(`Loaded ${wordJSON.length} turkish words.`)

    let wordDatabase = {}
    wordDatabase.all = wordJSON
    wordDatabase.verbs = wordJSON.filter(w => w.type == "verb")
    wordDatabase.commonNouns = wordJSON.filter(w => w.type == "common noun")
    wordDatabase.verbTenses = wordJSON.filter(w => w.type == "tense")
    wordDatabase.pronouns = wordJSON.filter(w => w.type == "pronoun")

    wordDatabase.getVerbByEnglishText = function(english) {
        return _.find(wordDatabase.verbs, v => v.english == english)
    }

    wordDatabase.getVerbTenseByEnglishName = function(english) {
        return _.find(wordDatabase.verbTenses, vt => vt.english == english)
    }

    wordDatabase.getVerbByTurkishText = function(turkish) {
        return _.find(wordDatabase.verbs, v => v.turkish == turkish)
    }

    return wordDatabase
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

module.exports = {
    loadWordDatabase
}