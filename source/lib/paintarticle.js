const turf = require('@turf/turf')
const {cachelattice} = require('./cachelattice.js')
const {paintmask} = require('./paintmask')
const {shorten} = require('./mathutils')

// The only reason I need a black rect masked to the black background into a transparent cut-out of the geometry
// is for shape-outside views
// so maybe, for wallpapers where I'm not going to have a shape, I can instead simply return 
// c = Math.sqrt(a * a + b * b)
function pythagoras(a,b){ return Math.sqrt(a * a + b * b)}
function bbox2topleft([x1, y1, x2, y2]){ return [x1, y1, x2 - x1, y2 - y1]} /* minx/miny/width/height */
// bbox is minx miny maxx maxy
// viewbox is minx miny width height

/**
 * All the geometry has to happen on a -90 to 90 range, so we start with unit = 1
 * bboxes and geometry at this point is unit 1
 * Once you're a viewbox/css, you should be multiplied by radius -- try to make this happen the same in all places
 * Are all sizes derived from a viewbox, such that if bbox2topleft does the transformation, I'll have the same funciton applied everywhere?
 * SVG units are always px ?
 */


 /**
    switch mode
        text or embed
        unionize & window
        wallpaper:
            atomize & wallpaper

 */

module.exports = function(params /* articleparams */, index, arrayref){
    // bump shells up to the minumum needed to fill min wallpaper
    // so far these are the params needed 
    console.log(params)
    // moving to fixed radius for now
    let radius = 50 // 100

    // default values...
    let linejoin = "round"
    let precision = "4"
    let stepover = "0.002"
    let {
        xwindow, // from case net / wallpaper
        ywindow, 
        // linejoin, // bevel | miter | round
        motif,
        shells,
        type, // embed | text | jali
        // radius,
        strapwork,
        content,
        bitmask,
        maskmode,
        // wallpaper,
        // unionize,
        // precision,
        // stepover,
        embedurl,
        embedtag
    } = params


    // if we're in embed or text mode, we're going to unionize the polygons
    let unionize = ["embed", "text"].includes(type)
    let wallpaper = !unionize // if its union'd, it's not a wallpaper

    // and then pull some styles out...
    let cssvars = Object.fromEntries(Object.entries(params).filter(([key]) => ~key.indexOf('--')))
    // applied to the svg 

    // wallpaper = (wallpaper == "wallpaper") // overwrite with true or false

    let lattice = cachelattice({motif, shells})
    // transform bitmask:string to a boolmask:Boolean[]
    // doesnt support e notation
    let boolmask = BigInt(bitmask).toString(2).split('').map(Number).map(Boolean).reverse() // convert 1 and 0 strings into true and false values

    // if(boolmask.every(v => !v)){ // if every value is false (!false returns true) then we're dealing with an empty array
    //     boolmask = boolmask.map(v => !v) // flip all of them to true
    // } // that just means 0 equals 1, but other bitmasks might leave you without geometry


// slice the boolmask down to however many elements you actually have -- 
// have I 

    let nestedgeometry = lattice.shells
    let flatgeometry = lattice.shells.flat()
    let maskedgeometry = (maskmode === 'nested')
        ? nestedgeometry.filter((_, index) => boolmask[index]).flat() // returns true or false for that 'order' of the binary boolmask
        : flatgeometry.filter((_, index) => boolmask[index]) 

    // if bitmask ended up providing no geometry, would hate to show nothing, show everything instead
    if(maskedgeometry.length === 0){
        maskedgeometry = flatgeometry // all polygons in this number of shells
        console.log(parseInt(boolmask.map(e => Number(e)).join(""), 2).toString(10), "is too large, or provided all 0s")
    }

    let allpolygons = turf.featureCollection(flatgeometry.map(
        ({pts}) => turf.polygon([pts])
    ))
    let maskpolygons = turf.featureCollection(maskedgeometry.map(
        ({pts}) => turf.polygon([pts])
    ))
    // could write to arrayref, basically if this element is not a wallpaper, append its bbox to a list, and take the bbox of all the bboxes so far
    // basically if(unionized) arrayref.artbox ? arrayref.artbox.push(articlebbox) : (arrayref.artbox = [])
    // the caller of paintarticle can check the artbox of the array and use that to describe the size of the body
    // dont forget to scale up by pixel amount
    // and dont forget to apply xstep ystep xcent ycent -- multipliers of wallx wally that determine the actual position of the bbox
    // so calc the bbox, apply transforms, and then push and grab the global bbox
    // set global bbox to body

    let articlebbox = turf.bbox(allpolygons) // returns [minx, miny, maxx, maxy] of bounding box
    let sectionbbox = turf.bbox(maskpolygons)

    let artviewbox = bbox2topleft(articlebbox).map(n => n * radius)

    let minwallpaper = lattice.meta.wallpaper
    let [wallx, wally] = lattice.meta.wallpaper

    let minradius = pythagoras(...minwallpaper)
    Object.assign(cssvars, {
        "--artrad": pythagoras(artviewbox[0], artviewbox[1]) * 2 + 'px',
        // "--minrad": minradius * radius + 'px'
        "--wallx": 2 * wallx * radius, // multiply by 2 because wallpaper is just half of the box.
        "--wally": 2 * wally * radius
    }) // maybe the other one is secleft, secheight... al, at, aw, ah, sl, st, sw, sh


    let shortestside = articlebbox.map(Math.abs).reduce((a,b) => Math.min(a,b))
    // if the bbox of the shells is less than even one of my wallpaperes, then default to one wallpaper
    let basismultiple = Math.max(1, Math.floor(shortestside / minradius)) //  scalar int
    // could replace this with a form input to change viewbox
    // console.log("MINRAD", minradius)
    // console.log("SHORTESTSIDE", shortestside)
    // console.log("BASISMULT", basismultiple)
    let atomgeometry = maskedgeometry.map(({pts}) => pts)
    let uniongeometry = atomgeometry
    // so i'll set uniongeometry equal to atomgeometry,
    // but if unionize is set, overwrite uniongeometry
    if(uniongeometry.length && unionize ){ 
        let closePolygon = polygon => polygon.concat([polygon[0]])
        // first have to get it into a [[[x,y]]] array of polygons which are arrays of xytuples
        // turf needs each list of pts to end with the same point it begins with
        let turfpolygons = atomgeometry.map(pts => turf.polygon([closePolygon(pts)]))
        let scaledpolygons = turfpolygons.map(polygon => turf.transformScale(polygon, 1 + parseFloat(stepover)))
        let cleanPolygons = scaledpolygons.map(polygon =>
            turf.truncate(polygon, {precision: parseFloat(precision)})
        )

        let union = turf.union(...cleanPolygons)

        if(union.geometry){
            let {coordinates} = union.geometry
            // console.log("COORD LENGTH", coordinates.length)
            // console.log("coordinates", coordinates)
            let depth = 0
            let depthtest = coordinates
            while(Array.isArray(depthtest)){
                depthtest = depthtest[0]
                depth++
            }
            // console.log(depth)
            uniongeometry = depth > 3 ? coordinates.flat() : coordinates

        } else {
            console.error("NO GEOMETRY???")
        }
        // console.log("atomgeometry", atomgeometry)
        // console.log("uniongeometry", uniongeometry)
        // just need to keep it in {m,x,y,spin,pts: [[x,y]]} format -- wrong
        // if you want {x,y,spin,pts} for each polygon have to run bbox, then average the bbox pts and measure atan between that and origin 
        // I only use x and y when positioning standalone sections -- svg just needs viewbox specified, polygons use their own pts
    } // else its atomized, no change needed to geometry

    // after you calculate the norm of the viewbox, pythagoraas(viewbox0 viewbox1),
    // filter everyone out with a larger norm than that
    // so that when painting the wallpaper, I won't catch any edges from polygons whose centers are further away from the center
    // than my furthest diagonal, viewbox[0] viewbox[1]

    // if(!unionized) // alternate branch for wallpaper viewbox
    if(wallpaper){
        // for wallpaper, top and left are radius * wallx and wally.... width and height are just radius * 2...
        viewbox = [
            // so this is creating a [minx, miny, maxx, maxy] format from the wallpaper expanded by some scalar
            wallx * xwindow * -2, // min x
            wally * ywindow * -2, // min y
            wallx * xwindow * 4,
            wally * ywindow * 4
        ].map(n => shorten(n * radius))
        // so I'll drop a reference to the svg masks 
        // TODO gonna upgrade maskgeometry to geometry once I figure turf out
        // for full screen I'm multiplying by 10 so I can 'scale' down to 0.1 to simulate zooming.
        // use a zoom factor as a 'scale'...
        Object.assign(cssvars, {
            "--top": "-500vh", // replace with width and height from form... multiple of base unit ? base unit as 10%?
            "--left": "-500vw",
            "--width": "1000vw",
            "--height": "1000vh",
        })
    } else { // else its a window
        // in window  mode, the section has the same size and position as the svg, like a window into svgspace
        let [minx, miny, width, height] = bbox2topleft(sectionbbox).map(n => n * radius)
        viewbox = [
            minx - 1 * strapwork / 2, // farther left
            miny - 1 * strapwork / 2, // farther up
            width + 1 * strapwork, // wider
            height + 1 * strapwork // taller
        ].map(shorten) // truncate precision
        // I used 1 * as a shorthand to ensure strapwork is a number before the addition
        // I had to apply +/- anyhow

        console.log("SECTIONBOX", sectionbbox)
        console.log("VIEWBOX", viewbox)
        Object.assign(cssvars, {
            "--left": viewbox[0] + 'px', // ha doesnt matter if its a square
            "--top": viewbox[1] + 'px', // this might need to be flipped??
            "--width": viewbox[2] + 'px',
            "--height": viewbox[3] + 'px'
        })
    }

    let maskhash = paintmask({viewbox, radius, strapwork, atomgeometry, uniongeometry, precision, linejoin})
    
    let maskurl = '/hash/'+maskhash+'mask.svg' // return name of file to fetch
    // only actually need shapes for text...
    let shapeurl = '/hash/'+maskhash+'shape.svg'
    // then get a shapeurl, still need viewbox, radius, uniongeometry, 

    Object.assign(cssvars, {
        "--mask": "url('" + maskurl + "#strapwork')"
        // "--shapeleft": maskurl + "#shapeleft"
        // "--shaperight": maskurl + "#shaperight"
    })

    return {"article": {
        "style": cssvars, // mostly vars 
        "childNodes": [ // section gets psuedo elements to place float shapes in the vicinity of flowed text inside section
            {"section": {
                "title": "article " + index, // TODO replace with params.title once it exists
                "type": type,
                "style": {
                    /* overwrites the parents assignement to a mask to frame the content of section */
                    "--mask": "url('" + maskurl + "#section')"
                },
                "childNodes": (function(){
                    // could definitely do a look ahead here and make this automatic
                    // if the media type of the remote URL is photo, video, audio... switch to certain interface
                    switch(type){
                        case "text":
                            return [
                                {"div": {"style": {
                                    "float": "left",
                                    "shape-outside": "url('" + shapeurl + "#left')"
                                }}},
                                {"div": {"style": {
                                    "float": "right",
                                    "shape-outside": "url('" + shapeurl + "#right')"
                                }}},
                                {"span": [content && content.replace(/\+/g,' ')]}, // replace + with space... 
                                // whenever I set the style for the iframe, I can certainly apply a zoom parameter since I'm hiding overflow anyway -- larger iframe is no big deal
                                // render shape-outside for div.left and div.right
                            ]
                        case "embed":
                            return [{[embedtag]: {
                                // autoloop and autoplay for video
                                // "autoplay": "true",
                                "loop": "true",
                                // "allow":"camera;microphone", for webcam
                                "src": embedurl
                            }}]
                        case "net":
                            return []
                        default:
                            // really this should be an error
                            console.warn("received unrecognized mode", mode)
                    }
                })()
            }}
            // and then a list of metasection or map areas that allow clicking a specific region of the geodesy
        ]
    }}
    // and so, whether wallpaper or window, the stylevars are set to the article, so they can be expressed by both chidlren: psuedo and quasi
}