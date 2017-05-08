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
