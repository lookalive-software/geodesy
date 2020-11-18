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
    switch(options.cmd){
        case "dupe":
            // iterate from the end of the array, copying each element one index up until I hit the current focus, then copy that.
            for(var i = paramarray.length; i > options.focus; i--){
                paramarray[i] = paramarray[i - 1]
            }
            options.focus++
        break
        case "drop":
            // iterate through array, starting from the focused element to the end (less 1, since we're always reading the +1nth element in the body of the loop)
            for(var i = options.focus; i < (paramarray.length - 1); i++){
                paramarray[i] = paramarray[i + 1]
            }
            paramarray.length-- // drop last element
            options.focus > 0 && options.focus-- // decrement the focused element IF there is an element to drop down to
        break
        default:
            console.log("noop")
    }

    // if last element was deleted, we'll get reset
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

    return paramarray
}

http.createServer((req, res) => {

    let { pathname, query } = url.parse(req.url)
    let { name, ext } = path.parse(pathname)
    let { paramarray, options } = paramparse(query)

    // it would be really great to have typed options that coerce stuff for me
    options.focus = Number(options.focus)


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
