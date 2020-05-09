const actions = require('./actions')

const defaultState = {
  goodGuesses: []
}

function reducer(state = defaultState, action) {
    const { type, payload } = action
    switch (type) {
      case actions.ACTION_TYPES.GUESSED_WORD_CORRECTLY:
        return Object.assign({}, state, {
            goodGuesses: state.goodGuesses.concat(payload)
        })      
      default:
        return state
    }
}

module.exports = reducer