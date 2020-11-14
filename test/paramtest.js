// Create a query string and show it parsing out to the expected object

const paramparse = require('../source/lib/paramparse')

// it should return empty object and empty array for an empty string

console.log(paramparse("hello=world")) // { options: { hello: 'world' }, paramarray: [] }
console.log(paramparse("hello=world&something=more")) // { options: { hello: 'world', something: 'more' }, paramarray: [] }
console.log(paramparse("a-0=one&b-0=two&c-0=three")) // { options: {}, paramarray: [ { a: 'one', b: 'two', c: 'three' } ] }