const https= require('https')
const http = require('http')
const url = require('url')

class Ping {
  constructor () {
    this.startTime = null
    this.endTime = null
    this.req = null
  }

  start (target, expects, cb) {
    const self = this
    // this will foolishly expect a SSL service as sweet path
    if ((target.port && target.port !== 80) || (target.useHttps !== undefined && target.useHttps === true)) {
      self.makeFallbackRequest(target, expects, true, (err) => {
        // when the user has actually used the wrong protocol or there was a
        // protocol redirect. May easily happen when one does not use 80 or 443
        // as port, e.g. 22 or any other random
        if (err === 'EPROTO') {
          this.makeFallbackRequest(target, expects, false, (err) => {
            if (err) {
              return cb(err, self.end())
            }
            return cb(null, self.end())
          })
        } else if (err) {
          return cb(err)
        } else {
          return cb(null, self.end())
        }
      })
    } else if (target.useHttps === false) {
      self.makeFallbackRequest(target, expects, false, cb)
    } else {
      self.makeFallbackRequest(target, expects, true, (err) => {
        if (err === 'ECONNREFUSED') {
          this.makeFallbackRequest(target, expects, false, (err) => {
            if (err) {
              return cb(err, self.end())
            }
            return cb(null, self.end())
          })
        } else if (err) {
          return cb(err)
        } else {
          return cb(null, self.end())
        }
      })
    }
  }

  expects (res, expects) {
    if (expects.code) {
      return res.statusCode === expects.code
    } else {
      return false
    }
  }

  end () {
    this.endTime = Date.now()
    return this.endTime - this.startTime
  }

  makeFallbackRequest (target, expects, useHttps, cb) {
    const self = this

    let hasCalled = false

    const options = {
      'method': 'GET',
      'hostname': target.host,
      'port': target.port || null,
      'path': target.path || '/',
      'headers': {
        'cache-control': 'no-cache',
      }
    }

    function reqCb (res) {
      if (res.statusCode > 300 && res.statusCode < 400 && res.headers.location) {
        // The location for some (most) redirects will only contain the path,  not the hostname;
        // detect this and add the host to the path.
        if (url.parse(res.headers.location).hostname) {
          // Hostname included; make request to res.headers.location
          target.path = res.headers.location
          self.makeFallbackRequest(target, expects, useHttps, cb)
        } else {
          const err = new Error('didn\'t know how to handle this case')
          // Hostname not included; get host from requested URL (url.parse()) and prepend to location.
          if (!hasCalled) {
            hasCalled = true
            return cb(err)
          }
        }
        // Otherwise no redirect; capture the response as normal
      } else {
        let chunks = []

        res.on('data', function (chunk) {
          chunks.push(chunk)
        })

        res.on('error', (err) => {
          if (!hasCalled) {
            hasCalled = true
            return cb(err)
          }
        })

        res.on('end', () => {
          if (!hasCalled) {
            hasCalled = true
            if (self.expects(res, expects)) {
              return cb(null, self.end())
            } else {
              return cb(new Error('not healthy according to expecation'), self.end())
            }
          }
        })
      }
    }

    if (useHttps === true) {
      self.req = https.request(options, reqCb)
    } else {
      self.req = http.request(options, reqCb)
    }

    self.req.on('error', (err) => {
      if (!hasCalled) {
        hasCalled = true
        return cb(err.code)
      }
    })

    self.startTime = Date.now()
    self.req.end()
  }
}

module.exports = Ping
