'use strict'
const https= require('https')
const http = require('http')
const url = require('url')
const Req = require('./request')

class Ping {
  constructor (options) {
    this.startTime = null
    this.endTime = null
    this.options = options

    this.req = new Req(this.options)
  }

  start (target, expects, cb) {
    this.startTime = Date.now()

    this.req.start(target, (err) => {
      if (err) {
        return cb(err)
      }

      if (!this.req.expect(expects)) {
        return cb(new Error('did not match expectation'))
      }

      return cb(null, this.end())
    })
  }

  destroy (cb) {
    this.req.abort(cb)
  }

  end () {
    this.endTime = Date.now()
    return this.endTime - this.startTime
  }
}

module.exports = Ping
