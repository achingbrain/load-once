'use strict'

var describe = require('mocha').describe
var it = require('mocha').it
var expect = require('chai').expect
var sinon = require('sinon')
require('sinon-as-promised')
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

  it('should only load once with promises', function (done) {
    if (!global.Promise) {
      return done()
    }

    var stub = sinon.stub().resolves(true)
    var load = loadOnce(stub)

    load()
    .then(function () {
      expect(stub.calledOnce).to.be.true

      load()
      .then(function () {
        expect(stub.calledOnce).to.be.true

        done()
      })
    })
  })

  it('should only load once concurrently with promises', function (done) {
    if (!global.Promise) {
      return done()
    }

    var stub = sinon.stub().resolves({})
    var load = loadOnce(stub)

    Promise
    .all([load(), load()])
    .then(function (results) {
      expect(stub.calledOnce).to.be.true
      expect(results[0]).to.equal(results[1])

      done()
    })
  })
})
