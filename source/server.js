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
const defaultOption = require('../types/defaultOption')
const mimetypes = require('../types/mimetypes')

const motifs = ["square", "honeycomb", "pyritohedron", "doublesquares"]
let choose = choices => choices[Math.floor(Math.random() * choices.length)]

// here I use defaultParam 
let defaultArticle = () => Object.assign({}, defaultParam, {motif: choose(motifs)})

function modifyParamArray(paramarray, options){
    switch(options.cmd){
        case "clone":
            // iterate from the end of the array, copying each element one index up until I hit the current focus, then copy that.
            for(var i = paramarray.length; i > options.focus; i--){
                paramarray[i] = paramarray[i - 1]
            }
            options.focus++
        break
        case "pop":
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
    // modifyParamArray pulls defaultParams
    // but I should make sure options is filled out with defaults and overwrite
    // overwrite focus, mode, web -- global opts
    options = Object.assign({}, defaultOption, options)
    options.focus = Number(options.focus)

    console.log("OPT", options)
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
        case 'art': 
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
        // later, I can request /65536/, /sha3/ etc to encode our intent of what kind of address we're looking for
        // plus it gives me a way to branch off at the root of the URL so I can keep form / paramarray and still fallthrough to 'read any file'
        // oh yeah so even UTF8 is a different response then just letting you read a file at some file path
        // so I'll do my best to allow you to upload files into the root folder, making the whole server able to pack up and download for local deployment
        // How about a sciter program that allows loading up a tarball and using it as your backend
        // just because I want to do as little translation as possible, maybe a server that accepts some path and then goes and grabs that tarball 
        case 'UTF8':
            // this needs to be an in-memory hash, loaded at startup and periodically overwritten (write then link)
            // but that lets me backup maybe even to the package.json so if I have this one file, I can reach out to the git repo + have all the saved URLs in memory
            // Ah -- taking whatever name you have for it, and then compressing it to a shorturl lets you have decodable long names in as little space as possible
            // Oh! The base65536 URLs are magic because they don't require the remote machine to have the file saved ! It is the compressed version of the URL
            // Right this whole thing is *I have to store compressed strings* but in UTF8, so I don't have to even store them anymore
            // If you send me a base65536 url, I can just convert it to bits and back into UTF8 and then redirect you to that decoded URL
            // maybe not the fastest to decompress but probably a hell of a lot faster than JSON buffers!
            // but for now, let me save a "url/to/space" with matching querystring -- which will itself contain the urltospace
        default:
            res.writeHead(200, {
                'Content-Type': mimetypes[ext] || "text/plain",
                'Content-Encoding': ext == ".svg" ? "gzip" : "identity",
                'Cache-Control': 'max-age=31536000' // here's the file never talk to me again 
                // maybe to deal with uploads store them at their own hash so that I never have to 'check if a file has changed' or invalidate my cache
            })
            fs.createReadStream('.' + pathname) // maybe .. ?
            .on('error', err => res.end('404'))
            .pipe(res)
    }

}).listen(3031).on('listening', function(){console.log("Is listening on 3031")})
// I think the cwd of the server is the folder is was started in, so node souce/server.js servers files relateive to ./, not ./source
