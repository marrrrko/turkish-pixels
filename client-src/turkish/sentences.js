const wordTools = require('./word-tools')
const _ = require('lodash')

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

    let conjugatedVerb = wordTools.conjugateVerb(
        sentence.verb,
        sentence.tense,
        sentence.subject.person,
        sentence.subject.isPlural,
        sentence.negativeForm,
        sentence.questionForm)

    sentence.translation = `${sentence.subject.turkish} ${conjugatedVerb}`

    return sentence
}

module.exports = {
    buildVerbSubjectSentence,
    buildVerbSubjectObjectSentence
}