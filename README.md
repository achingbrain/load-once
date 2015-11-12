# load-once

Pass a function or promise to `load-once` and it'll only get executed once, sort of like a singleton.

## Callback API

```javascript
// foo.js
var loadOnce = require('load-once')
var value = 0

function operation (callback) {
  value++

  callback(null, value)
}

module.exports = loadOnce(operation)

// bar.js
var foo = require('foo.js')

foo(function (error, result) {
  console.info(result) // prints '1'
})

// baz.js
var foo = require('foo.js')

foo(function (error, result) {
  console.info(result) // prints '1'
})
```

## Promises API

```javascript
// foo.js
var loadOnce = require('load-once')
var value = 0

var operation = new Promise((resolve, reject) => {
  value++

  resolve(value)
})

module.exports = loadOnce(operation)

// bar.js
var foo = require('foo.js')

foo()
.then((result) => {
  console.info(result) // prints '1'
})

// baz.js
var foo = require('foo.js')

foo()
.then((result) => {
  console.info(result) // prints '1'
})
```

## Combining Promises and Callbacks

N.b. if you treat the output of load-once like a promise, the input must be a promise too.
