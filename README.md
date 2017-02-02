# Probe

> Ping and probe stuff

## Usage

Ping something once
```js
const Ping = require('probe').Ping

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
```

Probe something conitnuously
```js
const probe = require('probe')

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
```


## License

MIT
