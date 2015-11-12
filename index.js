'use strict'

var EventEmitter = require('events').EventEmitter

module.exports = function createLoadOnce (load) {
  var emitter = new EventEmitter()
  emitter.setMaxListeners(0)

  var loading = false
  var loaded

  return function loadOnce (callback) {
    if (callback) {
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
    } else if (global.Promise) {
      if (loaded) {
        return Promise.resolve(loaded)
      }

      if (loading) {
        return new Promise(function (resolve, reject) {
          emitter.once('loaded', function (result) {
            resolve(result)
          })
        })
      }

      loading = true

      return new Promise(function (resolve, reject) {
        load()
        .then(function (result) {
          loaded = result
          emitter.emit('loaded', loaded)
          resolve(result)
        })
        .catch(reject)
      })
    }
  }
}
