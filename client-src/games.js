const possesives = require('./games/possesives')
const subjectVerb = require('./games/subject-verb')

export default
[
    {
        "name": "present-continous-simple-subject-verb",
        "label": "Present tense",
        "creatorFunction": subjectVerb.createGame,
        "config": {
            "sentenceCreatorModule": "./turkish/sentences.js",
            "sentenceCreatorFunction": "buildVerbSubjectSentence"
        }
    },
    {
        "name": "simple-possesives",
        "label": "Possesives",
        "creatorFunction": possesives.createGame,
        "config": {
            "sentenceCreatorModule": "./turkish/sentences.js",
            "sentenceCreatorFunction": "buildPossesiveNoun"
        }
    },
    {
        "name": "to-at-from",
        "label": "To/At/From",
        "creatorModule": "./games/simple-translations.js",
        "creatorFunction": "createGame",
        "config": {
            "sentenceCreatorModule": "./turkish/sentences.js",
            "sentenceCreatorFunction": "buildToAtFrom"
        }
    }
]