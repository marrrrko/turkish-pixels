const _ = require('lodash')

async function prepareDatabaseFromJson(wordJSON) {    
    
    //console.log(`Loaded ${wordJSON.length} turkish words.`)

    let wordDatabase = {}
    wordDatabase.all = wordJSON
    wordDatabase.verbs = wordJSON.filter(w => w.type == "verb")
    wordDatabase.commonNouns = wordJSON.filter(w => w.type == "common noun")
    wordDatabase.properNouns = wordJSON.filter(w => w.type == "proper noun")
    wordDatabase.nouns = wordDatabase.commonNouns.concat(wordDatabase.properNouns)
    wordDatabase.verbTenses = wordJSON.filter(w => w.type == "tense")
    wordDatabase.pronouns = wordJSON.filter(w => w.type == "pronoun")
    wordDatabase.numbers = wordJSON.filter(w => w.type == "number")

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

async function loadWordDatabaseFromFile() {
    let wordData = await readFileAsync(__dirname + '/words.json', 'utf-8')
    let wordJSON = JSON.parse(wordData)
    return prepareDatabaseFromJson(wordJSON)
}

async function loadWordDatabaseFromAPI(url) {    
    let response = await fetch(url)
    return await response.json()
}

function readFileAsync(filename, encoding) {
    let fs = require('fs')
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
    loadWordDatabaseFromFile,
    loadWordDatabaseFromAPI
}