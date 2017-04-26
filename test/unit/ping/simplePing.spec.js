const test = require('tape')
const Ping = require('../../../index').Ping

test('Can make simple ping', (t) => {
  t.plan(2)

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
      t.fail(err)
      return t.end()
    }

    t.ok(diff)
    t.pass()
    return t.end()
  })

})
