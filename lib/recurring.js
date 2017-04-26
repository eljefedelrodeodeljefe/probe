'use strict'
const EventEmitter = require('events')
const schedule = require('node-schedule')
const Range = schedule.Range
const Ping = require('./ping')

class TimeRange extends Range {
  constructor () {
    super()
  }
}

class Scheduler extends EventEmitter {
  constructor () {
    super()
    const self = this
    this.jobs = []
  }

  add (config, expects) {
    const self = this

    config = Object.assign({
      name: 'recurring-check',
      time: {
        second: null,
        minute: null,
        hour: null,
        date: null,
        month: null,
        year: null,
        dayOfWeek: null
      },
      task: undefined,
      path: config.path || '/',
      host: config.host
    }, config)

    const check = new schedule.RecurrenceRule()

    check.second = config.time.second
    check.minute = config.time.minute
    check.hour = config.time.hour
    check.date = config.time.date
    check.month = config.time.month
    check.year = config.time.year
    check.dayOfWeek =  config.time.dayOfWeek

    check._job = schedule.scheduleJob(check, () => {
      if (config.task) {
        config.task()
        self.emit(config.name, null, check)
      } else {
        self.ping = new Ping()
        self.ping.start(config, expects, (err, diff) => {
          if (err) {
            return self.emit('error', err, check)
          }
          self.emit(config.name, diff, check)
        })
      }
    })
    this.jobs.push(check)
  }

  abort () {
    if (!this.jobs.length) {
      return
    }
    for (var i = 0; i < this.jobs.length; i++) {
      this.jobs[i]._job.cancel()
    }

    return
  }
}

module.exports = new Scheduler()
module.exports.TimeRange = TimeRange
module.exports.Scheduler = Scheduler
