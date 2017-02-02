const Ping = require('../').Ping

const config = {
  host: 'google.com',
  path:'/'
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
