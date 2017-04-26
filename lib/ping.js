const https= require('https')
const http = require('http')
const url = require('url')
const Req = require('./request')

class Ping {
  constructor () {
    this.startTime = null
    this.endTime = null
    this.req = new Req()
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

  end () {
    this.endTime = Date.now()
    return this.endTime - this.startTime
  }
}

module.exports = Ping
