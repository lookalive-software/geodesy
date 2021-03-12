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

const paramcache = {}

const motifs = ["square", "cairo", "honeycomb", "pyritohedron", "doublesquares", "snubsquare", "2to1brick", "alternatetriangles", "root13star", "goldenstars2"]
let choose = choices => choices[Math.floor(Math.random() * choices.length)]

// here I use defaultParam 
let defaultArticle = () => Object.assign({}, defaultParam, {motif: choose(motifs)})

function modifyParamArray(paramarray, options){
    // go through the paramarry , find which index has a cmd key,
    // then read that cmd value (up or down)
    // if the value of options.cmd ends in a number
    let endsWithDigits = /(\w*)-(\d+)$/

    if(endsWithDigits.test(options.cmd)){
        // let [symbol, index] = options.cmd.match(endsWithDigits).slice(1,3)

        let key = options.cmd
        let hyphenpos = key.lastIndexOf('-')
        let symbol = key.slice(0, hyphenpos)
        let index = Number(key.slice(hyphenpos + 1))

        // the index is which layer was clicked
        // the symbol is whether to move that layer up or down
        // in the case of 0, it can only be moved down (swap with one higher index)
        // the last index can only be moved up (take last param, swap it with one lesser index)
        let temp = paramarray[index]
        if(symbol == "▲"){
            console.error("Moving " + index + " UP ")
            paramarray[index] = paramarray[index - 1]
            paramarray[index - 1] = temp
            options.focus = index - 1

        }
        if(symbol == "▼"){
            console.error("Moving " + index + " DOWN ")
            paramarray[index] = paramarray[index + 1]
            paramarray[index + 1] = temp
            options.focus = index + 1
        }

    } else if(options.cmd == "clone"){
        // iterate from the end of the array, copying each element one index up until I hit the current focus, then copy that.
        for(var i = paramarray.length; i > options.focus; i--){
            paramarray[i] = paramarray[i - 1]
        }
        options.focus++
    } else if(options.cmd == "pop"){
        // iterate through array, starting from the focused element to the end (less 1, since we're always reading the +1nth element in the body of the loop)
        for(var i = options.focus; i < (paramarray.length - 1); i++){
            paramarray[i] = paramarray[i + 1]
        }
        paramarray.length-- // drop last element
        options.focus > 0 && options.focus-- // decrement the focused element IF there is an element to drop down to 
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
    
    let { 
        pathname,
        query,
        hash
    } = url.parse(req.url)

    let {
        name,
        ext
    } = path.parse(pathname)

    let {
        paramarray,
        options
    } = paramparse(query)

    // route is static | art | form | upload
    let route = pathname
                .split('/')
                .slice(1,2)
                .pop()
    // resource is the path of a file, either upload or static or the name of the 'space' being requested
    let resource = pathname
                    .split('/')
                    .slice(2)
                    .join('/')

    // if !options.web, options.web = resource
    // console.log({route, resource, name, ext, hash})

    // it would be really great to have typed options that coerce stuff for me
    // modifyParamArray pulls defaultParams
    // but I should make sure options is filled out with defaults and overwrite
    // overwrite focus, mode, web -- global opts
    // use the resource URL as the web in options UNLESS a new web is supplied in the options object
    // options are just params without a number at the end, number indicates index in list
    options = Object.assign({}, defaultOption, {web: resource}, options)
    options.focus = Number(options.focus)

    switch(route){
        case '':
            res.writeHead(301, {"Location": "/form"})
            res.end()
        break
        // in art | form, use the pathname to look up an object, querybody.link 
        case 'form':
            // if options was included in the request, then I can check the incoming 'url' against my current url...
            if(options.web != resource){
                // maybe, before redirecting to the name without the query,
                // you can go ahead and store the param object at the paramcache on the new name
                paramcache[options.web] = [paramarray, options]
                res.writeHead(301, {"Location": '/form/' + options.web })
                res.end()
                break;
            }
            // anytime I post the form, 
            // take the rest of the url parts, append them with '/' to be a single string key
            // IF THERE IS a parameter object included, then we're being overwritten
            // but if paramarray.length = 0, lookup from paramcache 
            // if there is paramarray, store the new result at the address indicated by resource
            console.error("PARAM ARRAY LENGTH", paramarray.length)
            console.error("RESOURCE LOOKS LIKE", paramcache[resource])
            if( !paramarray.length && paramcache[resource] ){
                console.error("LOOKING UP", resource);
                [paramarray,options] = paramcache[resource]
            } else {
                // write the current resource path to the paramacache using latest params
                console.error("STORING AT", resource)
                paramcache[resource] = [paramarray, options]
            }
            paramarray = modifyParamArray(paramarray, options)

            // if options.web is different than resource, redirect to options.web as the new url... I only want to see the result of the form
            //


            // else continue with default options and default article
            // then I can use the URLs as a list of pages to 'burn' to the git archive
            // to easily push 

            res.end(elementary([
                {"head": [
                    {"title":["Geodesy"]}, // could be paramarray[options['focus']]['title'] // need to update it in bindframe.js on defocus
                    {"meta":{"charset":"UTF-8"}},
                    {"script": {"src": "/static/node_modules/@lookalive/elementary/elementary.js"}},

                    favicon, // maybe later favicon can take a url and embed it base64...
                    globalstyle,
                    formstyle
                ]},
                {"body": [
                    {"iframe": {
                        "name": "frame",
                        "allow": "camera;microphone",
                        "frameborder": "0"}
                    },
                    // maybe update the form attripbute  
                    form(paramarray, options),
                    {"script": {"src": "/static/source/js/bindframe.js"}},
                    {"script": {"src": "/static/source/js/artdrag.js"}}
                ]}
            ]))
        break
        case '$':
        case 'art': 
            console.error("PARAM ARRAY LENGTH", paramarray.length)
            if( !paramarray.length && paramcache[resource] ){
                console.error("LOOKING UP", resource)
                ;[paramarray,options] = paramcache[resource]
            } else {
                // write the current resource path to the paramacache using latest params
                console.error("STORING AT", resource)
                paramcache[resource] = [paramarray, options]
            }
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
                        "transition": "width 0.1s, height 0.1s"
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
