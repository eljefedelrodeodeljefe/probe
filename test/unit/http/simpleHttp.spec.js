const test = require('tape')
const HTTPRequest = require('../../../').HTTPRequest

test('Can make simple http call', (t) => {
  t.plan(3)
  const config = {
    host: 'google.com',
    path:'/'
  }

  const req = new HTTPRequest()
  req.start(config, (err, res) => {
    if (err) {
      t.fail()
    }

    t.ok(req.expect({ code: 200 }))
    t.equals(req._isHttps, false)
    t.pass()
    t.end()
  })
})

test('should not follow redirect and instead return the statuscode', (t) => {
  t.plan(3)
  const config = {
    host: 'google.com',
    path:'/',
    followRedirects: 0
  }

  const req = new HTTPRequest()
  req.start(config, (err, res) => {
    if (err) {
      t.fail()
    }

    t.ok(req.expect({ code: 302 }))
    t.equals(req._isHttps, false)
    t.pass()
    t.end()
  })
})


test('Can make simple https call', (t) => {
  t.plan(3)
  const config = {
    host: 'google.com',
    path:'/',
    useHttps: true
  }

  const req = new HTTPRequest()
  req.start(config, (err, res) => {
    if (err) {
      t.fail()
    }

    t.ok(req.expect({ code: 200 }))
    t.equals(req._isHttps, true)
    t.pass()
    t.end()
  })
})
