// builtins
const http = require('http')
const url = require('url')
const path = require('path')
const fs = require('fs')
// node modules
const { elementary } = require('@lookalive/elementary')
// local modules
const paramparse = require('./lib/paramparse')
const paintarticle = require('./lib/paintarticle')
// static templates
const favicon = require('./templates/favicon')
const globalstyle = require('./templates/globalstyle')
const formstyle = require('./templates/formstyle')
const articlestyle = require('./templates/articlestyle')
// functional templates
const form = require('./templates/form')

// print
console.log("CWD")
console.log(process.cwd())

// types
const defaultParam = require('../types/defaultParam')
const mimetypes = require('../types/mimetypes')

const motifs = ["square", "honeycomb", "pyritohedron", "doublesquares"]
let choose = choices => choices[Math.floor(Math.random() * choices.length)]

let defaultArticle = () => Object.assign({}, defaultParam, {motif: choose(motifs)})

function modifyParamArray(paramarray, options){


    // maybe this is hacky but maybe later I can have a more generalized 'randomize' strategy: I'm just falling back to types/defaultParam, and overwriting blank arrays with a randomized motif
    // when I switch from one type of article to another, the current querystring doesn't contain all the necessary values -- so merge with default params
                                //    : [defaultArticle()] // I guess I need to be sure that I'm not breaking out of a type, if I change the name of motifs or whatever
    if(paramarray.length == 0){
        // I can assume there's no global params either if theres 0 articles, assume blank slate
        options.focus = 0
        options.mode = "paint"
        paramarray.push(defaultArticle())
    } else {
        paramarray = paramarray.map(
            param => Object.assign({}, defaultParam, param)
        )
    }

    console.log("options", options)
    console.log("paramarray", paramarray.map(e => e.motif))

    console.log(paramarray.map(e => e.motif))
    switch(options.cmd){
        case "dupe":
            // iterate from the end of the array, copying each element one index up until I hit the current focus, then copy that.
            for(var i = paramarray.length; i > options.focus; i--){
                paramarray[i] = paramarray[i - 1]
            }
        break
        case "drop":
            // iterate through array, starting from the focused element to the end (less 1, since we're always reading the +1nth element in the body of the loop)
            for(var i = options.focus; i < paramarray.length - 1; i++){
                paramarray[i] = paramarray[i + 1]
            }
            paramarray.length-- // drop last element
        break
        default:
            console.log("noop")
    }
    console.log(paramarray.map(e => e.motif))


    // this is my 'add article' bounds checks, I could check what motif is next to me, or even duplicate whats next to me...
    // this whole section gets overwritten once I have dupe and drop 
    if(options.focus == -1){
        options.focus = 0
        console.log("UNSHIFTING")
        paramarray.unshift(defaultArticle())
    }
    if(options.focus == paramarray.length){ // length is actually out of bounds, our signal that a new 
        console.log("PUSHING")
        paramarray.push(defaultArticle())
    }
    // but if I have duplicate buttons, that lets me create a bottom or top layer just by duplicating at the edge
    // So come up with a fast element dupe algorithm. or delete an element!
    // Count down from the end, copying elements 

    // scan the paramarray for 'delete' and 'duplicate' keys, and perform that operation before moving on
    // prepend or append default object is out of bounds focus is experienced

    return paramarray
}

http.createServer((req, res) => {

    let { pathname, query } = url.parse(req.url)
    let { name, ext } = path.parse(pathname)
    let { paramarray, options } = paramparse(query)


    // if options.defocus, set focus to null
    // this hides all local fieldsets + the buttons move/paint
    // if(options.defocus){
    //     options.focus = "null"
    // }
    // until I have an actual mode-switched implemented I'll skip this step
    console.log(name)
    switch(name){
        case '':
            res.writeHead(301, {"Location": "/form"})
            res.end()
        break
        case 'form':
            paramarray = modifyParamArray(paramarray, options)
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
                    form(paramarray, options),
                    {"script": {"src": "/source/js/bindframe.js"}}
                ]}
            ]))
        break
        case 'paramarray': 
            paraymarray = modifyParamArray(paramarray, options)
            // let body = paramarray.map(paintarticle)
            // let {width, height} = body.bbox || {} // undefined at first // I have to think about whether that's a different center to worry about, center of bbox world starts at 50,50,...
            res.end(elementary([
                {"head": [
                    // this should also be the favicon and metacharset and all
                    {"title":["Geodesy"]},
                    {"meta":{"charset":"UTF-8"}},
                    favicon,
                    globalstyle,
                    articlestyle
                ]},
                // instead of 
                // {"body": paramarray.map(paintarticle)}
                {"body": {
                    // width, height, top, left...
                    "childNodes": paramarray.map(paintarticle)
                }}
            ]))
        break
        default:
                res.writeHead(200, {'Content-Type': mimetypes[ext] || "text/plain" })
                fs.createReadStream('.' + pathname) // maybe .. ?
                .on('error', err => res.end('404'))
                .pipe(res) // compress it here if you want
    }

}).listen(3031).on('listening', function(){console.log("Is listening on 3031")})
// I think the cwd of the server is the folder is was started in, so node souce/server.js servers files relateive to ./, not ./source
