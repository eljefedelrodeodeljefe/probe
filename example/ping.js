'use strict'
const Ping = require('../').Ping

const config = {
  host: 'google.com',
  path:'/',
  port: 443,
  // timeout: 20,
  useHttps: true
}

const expectResponse = {
  code: 200
}

const ping = new Ping()

ping.start(config, expectResponse, (err, diff) => {
  if (err) {
    return console.error(err)
  }
  console.log(diff)
})
