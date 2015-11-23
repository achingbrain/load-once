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

  it('should load with arguments', function (done) {
    var stub = sinon.stub().callsArgWithAsync(2, null, true)
    var load = loadOnce(stub)

    load(1, 2, function (error) {
      expect(error).to.not.exist
      expect(stub.calledOnce).to.be.true

      load(1, 2, function (err) {
        expect(err).to.not.exist
        expect(stub.calledOnce).to.be.true
        expect(stub.getCall(0).args[0]).to.equal(1)
        expect(stub.getCall(0).args[1]).to.equal(2)
        expect(stub.getCall(0).args[2]).to.be.a('function')

        done()
      })
    })
  })
})
