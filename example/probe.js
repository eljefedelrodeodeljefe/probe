'use strict'
const probe = require('../')

const config = {
  name: 'google-ping',
  time: {
    second: 50
  },
  host: 'google.com',
  path:'/'
}

const expectResponse = {
  code: 200
}

probe.add(config, expectResponse)
probe.on('google-ping', () => {
  console.log('received ping')
})
