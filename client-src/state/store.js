const reducer = require('./reducer')
const redux = require('redux')

const thunk = require('redux-thunk').default
const { logger } = require('redux-logger')

const store = redux.createStore(reducer, redux.applyMiddleware(thunk,logger))

module.exports = store