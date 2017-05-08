'use strict'
const https = require('https')
const http = require('http')
const url = require('url')
const EventEmitter = require('events')

class HTTPRequest extends EventEmitter {
  constructor (options) {
    super()
    this.http = http
    this._req = null
    this._isHttps = false
    this.hasReturned = false
  }

  start (config, cb, hasRun) {
    if ((config.port && config.port === 443) || config.useHttps) {
      this._isHttps = true
      this.http = https
    }

    if (!hasRun) {
      hasRun = 0
    } else {
      config.followRedirects--
    }

    const opts = Object.assign({
      hostname: config.host,
      method: 'GET',
      port: null,
      path: '/',
      headers: {
        'cache-control': 'no-cache'
      },
      followRedirects: 3
    }, config)

    this._req = this.http.request(opts, (res) => {
      this._res = res
      const chunks = []

      this._res.on('data', (chunk) => {
        chunks.push(chunk)
      })

      this._res.on('error', (err) => {
        if (this.hasReturned) {
          return
        }

        this.hasReturned = true
        return cb(err)
      })

      this._res.on('end', (err) => {
        if (this.hasReturned) {
          return
        }

        if (res.statusCode > 300 && res.statusCode < 400 && res.headers.location) {
          if (opts.followRedirects === 0) {
            this.hasReturned = true
            return cb(null)
          }
          // The location for some (most) redirects will only contain the path,  not the hostname;
          // detect this and add the host to the path.
          if (url.parse(this._res.headers.location).hostname) {
            // Hostname included; make request to res.headers.location
            config.path = this._res.headers.location
            this.start(config, cb, ++hasRun)
          } else {
            const err = new Error('didn\'t know how to handle this case')
            // Hostname not included; get host from requested URL (url.parse()) and prepend to location.
            this.hasReturned = true
            return cb(err)
          }
          // Otherwise no redirect; capture the response as normal
        } else {
          this.hasReturned = true
          return cb(null)
        }
      })
    })

    this._req.on('error', (err) => {
      if (this.hasReturned) {
        return
      }

      this.hasReturned = true
      return cb(err)
    })

    this.startTime = Date.now()
    this._req.end()
  }

  abort (cb) {
    this.hasReturned = true
    this._req.abort()
    return cb(null)
  }

  expect (expects) {
    if (expects.code && this._res.statusCode) {
      return this._res.statusCode === expects.code
    } else {
      return false
    }
  }
}

module.exports = HTTPRequest
