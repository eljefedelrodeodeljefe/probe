const Scheduler = require('./lib/recurring').Scheduler
const EventEmitter = require('events')

function patchEmitter (emitter, newEmitter) {
  const oldEmitter = emitter.emit

  emitter.emit = function () {
    newEmitter.emit.apply(newEmitter, arguments)
    // send them through the websocket received as a parameter
    oldEmitter.apply(emitter, arguments)
  }
}

class Probe extends EventEmitter {
  constructor () {
    super()
    this.schedule = new Scheduler()
    patchEmitter(this.schedule, this)
  }

  add (config, expects) {
    this.schedule.add(config, expects)
  }

  abort () {
    this.schedule.abort()
  }
}

module.exports = new Probe()

module.exports.Probe = Probe
module.exports.Ping = require('./lib/ping')
module.exports.Scheduler = require('./lib/recurring').Scheduler
module.exports.TimeRange = require('./lib/recurring').TimeRange
module.exports.HTTPRequest = require('./lib/request')
