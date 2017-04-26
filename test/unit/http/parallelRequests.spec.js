const test = require('tape')
const steed = require('steed')()
const HTTPRequest = require('../../../').HTTPRequest

test('Be able to make requests in parallel', (t) => {
  t.plan(5)
  let isFirst = true

  function parallelRequest (cb) {
    const config = {
      host: 'google.com',
      path:'/'
    }

    const req = new HTTPRequest()

    function startReq (cb) {
      req.start(config, (err, res) => {
        if (err) {
          return cb(err)
        }

        t.ok(req.expect({ code: 200 }))
        t.equals(req._isHttps, false)
        return cb(null)
      })
    }

    if (isFirst) {
      isFirst = false
      process.nextTick(() => {
        startReq(cb)
      })
    } else {
      startReq(cb)
    }
  }


  steed.parallel([
    function (cb) {
      parallelRequest(cb)
    },
    function (cb) {
      parallelRequest(cb)
    },
  ], (err, results) => {
    if (err) {
      t.fail()
      return t.end()
    }

    t.pass()
    t.end()
  })
})

test('Be able to make requests in parallel and abort one.', (t) => {
  t.plan(3)
  let isFirst = true

  function parallelRequest (cb) {
    const config = {
      host: 'google.com',
      path:'/'
    }

    const req = new HTTPRequest()

    function startReq (cb) {
      req.start(config, (err, res) => {
        if (err) {
          return cb(err)
        }

        // in aborted cb, the next two funtion will not be
        // called, hence the plan count
        t.ok(req.expect({ code: 200 }))
        t.equals(req._isHttps, false)
        return cb(null)
      })
    }

    if (isFirst) {
      isFirst = false
      process.nextTick(() => {
        startReq(cb)
      })
    } else {
      startReq(cb)

      req.abort(() => {
        return cb(null)
      })
    }
  }


  steed.parallel([
    function (cb) {
      parallelRequest(cb)
    },
    function (cb) {
      parallelRequest(cb)
    },
  ], (err, results) => {
    if (err) {
      t.fail()
      return t.end()
    }

    t.pass()
    t.end()
  })
})
