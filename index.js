const schedule = require('./lib/recurring')
const EventEmitter = require('events')

function patchEmitter (emitter, newEmitter) {
  const oldEmitter = emitter.emit

  emitter.emit = function () {
    newEmitter.emit.apply(newEmitter, arguments)
    // send them through the websocket received as a parameter
    oldEmitter.apply(emitter, arguments)
  }
  this.schedule = schedule
}

class Probe extends EventEmitter {
  constructor () {
    super()
    patchEmitter(schedule, this)
  }

  add (config, expects) {
    schedule.add(config, expects)
  }
}

module.exports = new Probe()

module.exports.Probe = Probe
module.exports.Ping = require('./lib/ping')
module.exports.Scheduler = require('./lib/recurring').Scheduler
module.exports.TimeRange = require('./lib/recurring').TimeRange
module.exports.HTTPRequest = require('./lib/request')
