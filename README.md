# load-once

Pass a function to `load-once` and it'll only get executed once, sort of like a singleton.

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

Arguments are also supported:

```javascript
// foo.js
var loadOnce = require('load-once')

function operation (arg1, arg2, callback) {
  callback(null, arg1 + ' ' + arg2)
}

module.exports = loadOnce(operation)

// bar.js
var foo = require('foo.js')

foo('hello', 'world', function (error, result) {
  console.info(result) // prints 'hello world'
})
```
