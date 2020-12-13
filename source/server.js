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

const motifs = ["square", "cairo", "honeycomb", "pyritohedron", "doublesquares", "snubsquare", "2to1brick", "alternatetriangles", "root13star", "goldenstars2"]
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
    console.log(req.url)
    let { pathname, query, hash } = url.parse(req.url)
    let { name, ext } = path.parse(pathname)
    // route is static | art | form | upload
    let route = pathname.split('/').slice(1,2).pop()
    // resource is the path of a file, either upload or static or the name of the 'space' being requested
    let resource = pathname.split('/').slice(2).join('/')
    let { paramarray, options } = paramparse(query)

    // if !options.web, options.web = resource
    console.log({route, resource, name, ext, hash})



    // it would be really great to have typed options that coerce stuff for me
    // modifyParamArray pulls defaultParams
    // but I should make sure options is filled out with defaults and overwrite
    // overwrite focus, mode, web -- global opts
    options = Object.assign({}, defaultOption, options)
    options.focus = Number(options.focus)

    switch(route){
        case '':
            res.writeHead(301, {"Location": "/form"})
            res.end()
        break
        // in art | form, use the pathname to look up an object, querybody.link 
        case 'form':
            paramarray = modifyParamArray(paramarray, options)
            res.end(elementary([
                {"head": [
                    {"title":["Geodesy"]}, // could be paramarray[options['focus']]['title'] // need to update it in bindframe.js on defocus
                    {"meta":{"charset":"UTF-8"}},
                    favicon, // maybe later favicon can take a url and embed it base64...
                    globalstyle,
                    formstyle
                ]},
                {"body": [
                    {"iframe": {"name": "frame", "frameborder": "0"}},
                    // maybe update the form attripbute  
                    form(paramarray, options),
                    {"script": {"src": "/static/source/js/bindframe.js"}},
                    {"script": {"src": "/static/source/js/artdrag.js"}}
                ]}
            ]))
        break
        case 'art': 
            paramarray = modifyParamArray(paramarray, options)
            // get painted array while adding bbox to paramarray
            let paintedarray = paramarray.map(paintarticle)

            // take xmag and ymag, addjust them by adding 
            // steps is a multiplier for wallpaper
            // dont forget to add wallpaper width

            // have to add a few style vars to the options group, filter out the vars, add to style
            // paramArray.bbox ? yea take current viewbox and push to array
            // and overwrite .bbox to be up to date -- current viewbox where everything is centered by the way!
            // then TODO apply a nevagtive top/left margin to correctly place the center of the body in the center of the screen...
            // let body = paramarray.map(paintarticle)
            // let {width, height} = body.bbox || {} // undefined at first // I have to think about whether that's a different center to worry about, center of bbox world starts at 50,50,...
            res.end(elementary([
                {"head": [
                    // this should also be the favicon and metacharset and all
                    {"title":["Geodesy"]},
                    {"meta":{"charset":"UTF-8"}},
            // hey it'd be very cool if I could use --zoomg to set media initial zoom
                    // {"meta": {"name": "viewport", "content": `width=device-width, initial-scale=${options['--zoomg']}`}},
                    // argument for putting zoomg in the body is I can use it in the width and height measurement of the body
                    // so the body decreases corresponding to the bodies being zoomed out, so the scroll bars dissapear
                    favicon,
                    globalstyle,
                    articlestyle
                ]},
                // instead of 
                // {"body": paramarray.map(paintarticle)}
                {"body": {
                    "style": {
                        "--zoomg": options["--zoomg"],
                        "--xmag": paramarray["xmag"],
                        "--ymag": paramarray["ymag"],
                        "width": `calc(var(--xmag) * 2px * var(--zoomg))`,
                        "height": `calc(var(--ymag) * 2px * var(--zoomg))`,
                    },
                    // width, height, top, left...
                    "childNodes": paintedarray
                }}
            ]))
        break
        case 'static':
        // only serving from 'hash', 'font', 'source/js', and uploaded files
        // /uploads/ GET / POST
        // all of these will be a hash too
        // static will look relative to the project folder
        /// so have an uploads folder to store files locally
        // easier to back up the whole server + content that way
        // so, move prepend all requests with static
        // then use this as a fallthrough, if url doesn't include art, form, or static, then redirect, prepend 'form'...
        // could decide whether to by default redirect to form or art
        default:
            res.writeHead(200, {
                'Content-Type': mimetypes[ext] || "text/plain",
                'Content-Encoding': ext == ".svg" ? "gzip" : "identity",
                'Cache-Control': 'max-age=31536000' // here's the file never talk to me again 
                // maybe to deal with uploads store them at their own hash so that I never have to 'check if a file has changed' or invalidate my cache
            })
            fs.createReadStream('./' + resource) // maybe .. ?
            .on('error', err => {
                console.error(err), res.end('404')
            })
            .pipe(res)
    }

}).listen(3031).on('listening', function(){console.log("Is listening on 3031")})
// I think the cwd of the server is the folder is was started in, so node souce/server.js servers files relateive to ./, not ./source
