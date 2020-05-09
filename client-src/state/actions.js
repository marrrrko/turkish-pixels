
const ACTION_TYPES = {
    GUESSED_WORD_CORRECTLY: 'GUESSED_WORD_CORRECTLY',
}


function guessedWordCorrectly(wordId, timestamp) {
    return {
        type: ACTION_TYPES.GUESSED_WORD_CORRECTLY,
        payload: {
            wordId,
            timestamp
        }
    }
}

module.exports = {
    ACTION_TYPES,
    guessedWordCorrectly
}