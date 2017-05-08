'use strict'
const test = require('tape')
const HTTPRequest = require('../../../').HTTPRequest

test('Will pass errors when they occur in the request', (t) => {
  t.plan(3)
  const config = {
    host: 'something.local',
    path:'/'
  }

  const req = new HTTPRequest()
  req.start(config, (err, res) => {
    t.ok(err)
    t.notOk(res)
    t.pass()
    t.end()
  })
})

test('Throws a timeout', (t) => {
  t.plan(4)
  const config = {
    host: 'something.local',
    path:'/'
  }

  const req = new HTTPRequest({timeout:  50})
  req.start(config, (err, res) => {
    t.ok(err)
    t.equals(err.name, 'TimeoutError')
    t.notOk(res)
    t.pass()
    t.end()
  })
})
