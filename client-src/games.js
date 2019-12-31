const simpleTranslations = require('./games/simple-translations')
const translations = require('./turkish/translations')

export default
[
    {
        "name": "present-continous-simple-subject-verb",
        "label": "Present tense",
        "gameCreator": simpleTranslations.createGame,
        "config": {
            "translationCreator": translations.buildVerbSubjectSentence,
            "arguments": [
                "present continuous",
                true,
                true
            ]
        }
    },
    {
        "name": "ossessives",
        "label": "Possessives",
        "gameCreator": simpleTranslations.createGame,
        "config": {
            "translationCreator": translations.buildPossesiveNoun
        }
    },
    {
        "name": "to-at-from",
        "label": "To/At/From",
        "gameCreator": simpleTranslations.createGame,
        "config": {
            "translationCreator": translations.buildLocativePreposition
        }
    }
]