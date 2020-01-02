const simpleTranslations = require('./games/simple-translations')
const translations = require('./turkish/translations')

export default
[
    {
        id: "a0623197-5ddd-4728-9766-5bf04aa59a22",
        label: "Present tense",
        gameCreator: simpleTranslations.createGame,
        config: {
            translationCreator: translations.buildVerb,
            arguments: [
                "present continuous",
                true,
                true
            ]
        }
    },
    {
        id: "63100a94-231d-40fe-a6d1-4717844171d7",
        label: "Future Tense",
        gameCreator: simpleTranslations.createGame,
        config: {
            translationCreator: translations.buildVerb,
            arguments: [
                "future",
                false,
                false
            ]
        }
    },
    {
        id: "68a0b84e-6ffe-4e16-9557-f84758afd700",
        label: "Possessives",
        gameCreator: simpleTranslations.createGame,
        config: {
            translationCreator: translations.buildPossesiveNoun
        }
    },
    {
        id: "030c38b6-44ea-4ca7-90a6-57dad6fc7b00",
        label: "To/At/From",
        gameCreator: simpleTranslations.createGame,
        config: {
            translationCreator: translations.buildLocativePreposition
        }
    },
    {
        id: "d39be530-5693-4fe9-ad12-12fd56ae65b8",
        label: "Numbers 0-10",
        gameCreator: simpleTranslations.createGame,
        config: {
            translationCreator: translations.buildSimpleNumberTranslation,
            arguments: [
                0,
                10
            ]
        }
    },
    {
        id: "2b617b04-4c92-4834-8cd8-9d0f01817e98",
        label: "Numbers 0-100",
        gameCreator: simpleTranslations.createGame,
        config: {
            translationCreator: translations.buildSimpleNumberTranslation,
            arguments: [
                0,
                100
            ]
        }
    }
]