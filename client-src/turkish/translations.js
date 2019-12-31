const wordTools = require('./word-tools')
const _ = require('lodash')

function buildVerbSubjectSentence(wordDatabase, tenseName, negativeFormAllowed, questionFormAllowed) {
    const translation = {
        englishElements: []
    }

    const allowedTenses = wordDatabase.verbTenses.filter(t => t.english == tenseName)

    const verb = _.sample(wordDatabase.verbs)
    const subject = _.sample(wordDatabase.pronouns)
    const tense = _.sample(allowedTenses)
    let negativeForm = false
    if(negativeFormAllowed) {
        negativeForm = _.sample([true, false, false])
    }
    let questionForm = false
    if(questionFormAllowed) {
        questionForm = _.sample([true, false, false])
    }

    translation.englishElements.push({
        label: "Verb",
        value: verb.english
    })

    let subjectHint = ""
    if(subject.person == 2) {
        subjectHint = subject.isPlural ? " (plural)" : " (singular)"
    }

    translation.englishElements.push({
        label: "Subject",
        value: `${subject.english}${subjectHint}`
    })

    let tenseHints = []
    if(negativeForm)
        tenseHints.push("negative")
    if(questionForm)
        tenseHints.push("question")
    
    let tenseHint = ""
    if(tenseHints.length)
        tenseHint = `, ${tenseHints.join(" ")}`
    translation.englishElements.push({
        label: "Tense",
        value: `${tense.english}${tenseHint}`
    })


    let conjugatedVerb = wordTools.conjugateVerb(
        verb,
        tense,
        subject.person,
        subject.isPlural,
        negativeForm,
        questionForm)

    let questionMark = ""
    if(questionForm)
        questionMark = "?"
    translation.turkishText = `${subject.turkish} ${conjugatedVerb}${questionMark}`

    return translation
}

function buildPossesiveNoun(wordDatabase) {
    const translation = {
        englishElements: []
    }

    const noun = _.sample(wordDatabase.commonNouns)
    const owner = _.sample(wordDatabase.pronouns.filter(p => p.subtype && p.subtype === "possessive"))
    const translatedPronoun = wordTools.getPossesivePronoun(
        owner.person,
        owner.isPlural)
    const translatedNoun = wordTools.makePossesive(
        noun.turkish,
        owner.person,
        owner.isPlural)
    
    translation.englishElements.push({
        label: "Noun",
        value: noun.english
    })

    let ownerHint = ""
    if(owner.person == 2) {
        ownerHint = owner.isPlural ? " (plural)" : " (singular)"
    }

    translation.englishElements.push({
        label: "Whose",
        value: `${owner.english}${ownerHint}`
    })

    translation.turkishText = `${translatedPronoun} ${translatedNoun}`

    return translation
}

function buildLocativePreposition(wordDatabase) {
    const translation = {
        englishElements: []
    }

    let locations = wordDatabase.nouns.filter(n => n.locative)
    let location = _.sample(locations)
    let preposition = _.sample(["to", "at", "from"])

    translation.englishElements.push({
        label: "Place",
        value: location.english
    })

    translation.englishElements.push({
        label: "Place",
        value: preposition
    })

    translation.turkishText = "N/A"
    if(preposition == "to")
        translation.turkishText = wordTools.makeLocativeTo(location.turkish)
    else if (preposition == "at")
        translation.turkishText = wordTools.makeLocativeAt(location.turkish)
    else if (preposition == "from")
        translation.turkishText = wordTools.makeLocativeFrom(location.turkish)

    return translation
}

module.exports = {
    buildPossesiveNoun,
    buildVerbSubjectSentence,
    buildLocativePreposition
}