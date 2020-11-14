// builtins
const http = require('http')
const url = require('url')
const path = require('path')
const fs = require('fs')
// node modules
const { elementary } = require('@lookalive/elementary')
// local modules
const paramparse = require('./lib/paramparse')
const {favicon} = require('./templates/favicon')
const {globalstyle} = require('./templates/globalstyle')
const {formstyle} = require('./templates/formstyle')
const {articlestyle} = require('./templates/articlestyle')


// types
const defaultParam = require('../types/defaultParam')

const motifs = ["square", "honeycomb", "pyritohedron", "doublesquares"]
let choose = choices => choices[Math.floor(Math.random() * choices.length)]

http.createServer((req, res) => {

    let { pathname, query } = url.parse(req.url)
    let { paramarray, options } = paramparse(query)

    // maybe this is hacky but maybe later I can have a more generalized 'randomize' strategy: I'm just falling back to types/defaultParam, and overwriting blank arrays with a randomized motif
    paramarray = paramarray.length ? paramarray.map(param => Object.assign({}, defaultParam, param))
                                   : [Object.assign({}, defaultParam, {motif: choose(motifs)})] // I guess I need to be sure that I'm not breaking out of a type, if I change the name of motifs or whatever

    res.end(elementary([
        {"head": [
            {"title":["Geodesy"]},
            {"meta":{"charset":"UTF-8"}},
            favicon(), // maybe later favicon can take a url and embed it base64...
            globalstyle(),
            formstyle()
        ]},
        {"body": [
            {"h1": ["hello world"]}
        ]}
    ]))
}).listen(3031).on('listening', function(){console.log("Is listening on 3031")})