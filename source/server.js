// builtins
const http = require('http')
const url = require('url')
const path = require('path')
const fs = require('fs')
// node modules
const { elementary } = require('@lookalive/elementary')
// local modules
const paramparse = require('./lib/paramparse')
// static templates
const favicon = require('./templates/favicon')
const globalstyle = require('./templates/globalstyle')
const formstyle = require('./templates/formstyle')
const articlestyle = require('./templates/articlestyle')
// functional templates
const form = require('./templates/form')


// types
const defaultParam = require('../types/defaultParam')
const mimetypes = require('../types/mimetypes')

const motifs = ["square", "honeycomb", "pyritohedron", "doublesquares"]
let choose = choices => choices[Math.floor(Math.random() * choices.length)]

http.createServer((req, res) => {

    let { pathname, query } = url.parse(req.url)
    let { name, ext } = path.parse(pathname)
    let { paramarray, options } = paramparse(query)

    console.log(options)

    // if options.defocus, set focus to null
    // this hides all local fieldsets + the buttons move/paint
    // if(options.defocus){
    //     options.focus = "null"
    // }
    // until I have an actual mode-switched implemented I'll skip this step

    let defaultArticle = () => Object.assign({}, defaultParam, {motif: choose(motifs)})
    // maybe this is hacky but maybe later I can have a more generalized 'randomize' strategy: I'm just falling back to types/defaultParam, and overwriting blank arrays with a randomized motif
    // when I switch from one type of article to another, the current querystring doesn't contain all the necessary values -- so merge with default params
    paramarray = paramarray.map(param => Object.assign({}, defaultParam, param))
                                //    : [defaultArticle()] // I guess I need to be sure that I'm not breaking out of a type, if I change the name of motifs or whatever
    if(!paramarray.length){
        // I can assume there's no global params either if theres 0 articles, assume blank slate
        options.focus = 0
        options.mode = "paint"
        paramarray.push(defaultArticle())
    }
    // this is my 'add article' bounds checks, I could check what motif is next to me, or even duplicate whats next to me...
    // this whole section gets overwritten once I have dupe and drop 
    if(options.focus == -1){
        options.focus = 0
        paramarray.unshift(defaultArticle())
    }
    if(options.focus == paramarray.length){ // length is actually out of bounds, our signal that a new 
        paramarray.push(defaultArticle())
    }
    // but if I have duplicate buttons, that lets me create a bottom or top layer just by duplicating at the edge
    // So come up with a fast element dupe algorithm. or delete an element!
    // Count down from the end, copying elements 

    // scan the paramarray for 'delete' and 'duplicate' keys, and perform that operation before moving on
    // prepend or append default object is out of bounds focus is experienced

    console.log(name)
    switch(name){
        case '':
            res.writeHead(301, {"Location": "/form"})
            res.end()
        break
        case 'form':
            res.end(elementary([
                {"head": [
                    {"title":["Geodesy"]},
                    {"meta":{"charset":"UTF-8"}},
                    favicon, // maybe later favicon can take a url and embed it base64...
                    globalstyle,
                    formstyle
                ]},
                {"body": [
                    {"iframe": {"name": "frame", "frameborder": "0"}},
                    // maybe update the form attripbute  
                    form(paramarray, options)
                ]}
            ]))
        break
        default:
                res.writeHead(200, {'Content-Type': mimetypes[ext]})
                fs.createReadStream('.' + pathname)
                .on('error', err => res.end('404'))
                .pipe(res) // compress it here if you want
    }

}).listen(3031).on('listening', function(){console.log("Is listening on 3031")})