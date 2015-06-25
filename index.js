'use strict'

var EventEmitter = require('events').EventEmitter

module.exports = function createLoadOnce (load) {
  var emitter = new EventEmitter()
  emitter.setMaxListeners(0)

  var loading = false
  var loaded

  return function loadOnce (callback) {
    if (loaded) {
      return callback(null, loaded)
    }

    emitter.once('loaded', callback)

    if (!loading) {
      loading = true
      load(function finishedLoading (error, result) {
        loaded = result
        emitter.emit('loaded', error, loaded)
      })
    }
  }
}
