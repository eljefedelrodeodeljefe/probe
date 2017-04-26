const test = require('tape')
const probe = require('../../../')

test('Can make simple probe call and can abort', (t) => {
  t.plan(1)
  let hasCalled = false

  const fail = setTimeout(() => {
    if (!hasCalled) {
      hasCalled = true
      t.fail()
      return t.end()
    }
  }, 60000)

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
    clearTimeout(fail)
    probe.removeAllListeners('google-ping')

    if (!hasCalled) {
      hasCalled = true
      probe.abort()
      t.pass()
      return t.end()
    }
  })
})
