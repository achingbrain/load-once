'use strict'

var describe = require('mocha').describe
var it = require('mocha').it
var expect = require('chai').expect
var sinon = require('sinon')
var loadOnce = require('../')
var async = require('async')

describe('load-once', function () {
  it('should only load once', function (done) {
    var stub = sinon.stub().callsArgWithAsync(0, null, true)
    var load = loadOnce(stub)

    load(function (error) {
      expect(error).to.not.exist
      expect(stub.calledOnce).to.be.true

      load(function (err) {
        expect(err).to.not.exist
        expect(stub.calledOnce).to.be.true

        done()
      })
    })
  })

  it('should only load once concurrently', function (done) {
    var stub = sinon.stub().callsArgWithAsync(0, null, true)
    var load = loadOnce(stub)

    async.parallel([
      load,
      load
    ], function (error) {
      expect(error).to.not.exist
      expect(stub.calledOnce).to.be.true

      done()
    })
  })
})
