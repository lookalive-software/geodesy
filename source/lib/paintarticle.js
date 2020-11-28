const turf = require('@turf/turf')
const {cachelattice} = require('./cachelattice.js')
const {paintmask} = require('./paintmask')
const {shorten} = require('./mathutils')

const webcam = require('../templates/webcam.json')

// The only reason I need a black rect masked to the black background into a transparent cut-out of the geometry
// is for shape-outside views
// so maybe, for wallpapers where I'm not going to have a shape, I can instead simply return 
// c = Math.sqrt(a * a + b * b)
function pythagoras(a,b){ return Math.sqrt(a * a + b * b)}
function bbox2topleft([x1, y1, x2, y2]){ return [x1, y1, x2 - x1, y2 - y1]} /* minx/miny/width/height */
// bbox is minx miny maxx maxy
// viewbox is minx miny width height
// I need a function that takes cssvars and turns it back into a pixel bounding box
// top: top / left: left / bottom: top - height / right: left + width
// but then top is relative to:
// (ystep + ycent) * yunit * zoom
// and left is relative to:
// (xstep + xcent) * xunit * zoom

// once I have the left/top position of each art, I apply their width and height to get bottom/left
// then I can use Math.max(...) to find the largest horizontal position, and largest veritcal position
// double those and use for width and height: this keeps 50% 50% as my origin to position relatively to


module.exports = function(params /* articleparams */, index, arrayref){
    // bump shells up to the minumum needed to fill min wallpaper
    // so far these are the params needed 
    console.log(params)
    // moving to fixed radius for now
    let radius = 50 // 100

    // default values...
    let linejoin = "round" // I could load options if I want to move these to a default file
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
        maskmode, // flat | nested
        // wallpaper,
        // unionize,
        // precision,
        // stepover,
        embedurl,
        embedtag,
        art, // article title
    } = params

    // if we're in embed or text mode, we're going to unionize the polygons
    let unionize = ["embed", "text"].includes(type)
    let wallpaper = !unionize // if its union'd, it's not a wallpaper

    // and then pull some styles out...
    let cssvars = Object.fromEntries(Object.entries(params).filter(([key]) => ~key.indexOf('--')))
    let lattice = cachelattice({motif, shells})
    // transform bitmask:string to a boolmask:Boolean[]
    // doesnt support e notation

    let boolmask = BigInt(bitmask).toString(2).split('').map(Number).map(Boolean).reverse() // convert 1 and 0 strings into true and false values
    // let boolmask = Array.from({length: bitmask - 1}, e => false).concat(true)


    let flatgeometry = lattice.shells.flat()
    let maskedgeometry = (maskmode === 'nested')
        ? lattice.shells.filter((_, index) => boolmask[index]).flat() // returns true or false for that 'order' of the binary boolmask
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

    // console.log("MASKPOLYGON", maskpolygons.features.map(e => e.geometry.coordinates))
    let articlebbox = turf.bbox(allpolygons) // returns [minx, miny, maxx, maxy] of bounding box
    let sectionbbox = turf.bbox(maskpolygons)

    let [xunit, yunit] = lattice.meta.wallpaper

    Object.assign(cssvars, {
        "--xunit": shorten(2 * xunit * radius), // multiply by 2 because wallpaper is just half of the box.
        "--yunit": shorten(2 * yunit * radius)
    }) // maybe the other one is secleft, secheight... al, at, aw, ah, sl, st, sw, sh

    let atomgeometry, uniongeometry
        atomgeometry = uniongeometry = maskedgeometry.map(({pts}) => pts)
    // so i'll set uniongeometry equal to atomgeometry,
    // but if unionize is set, overwrite uniongeometry
    if(uniongeometry.length && unionize ){ 
        let closePolygon = polygon => polygon.concat([polygon[0]])
        // first have to get it into a [[[x,y]]] array of polygons which are arrays of xytuples
        // turf needs each list of pts to end with the same point it begins with
        let turfpolygons = atomgeometry.map(pts => turf.polygon([pts]))
        let scaledpolygons = turfpolygons.map(polygon => turf.transformScale(polygon, 1 + parseFloat(stepover)))
        let cleanPolygons = scaledpolygons.map(polygon =>
            turf.truncate(polygon, {precision: parseFloat(precision)})
        )

        let union = turf.union(...cleanPolygons)
        // I hate this but sometimes the geometry comes back as deeply nested arrays, I think if there's a whole?
        // in which case I have to flatten it. Maybe there's a cleaner way to do this but I'm eventually writing my own union algo that just looks at shared edges
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
    } // else its atomized, no change needed to geometry
    
    // xunit/y is minimum wallpaper size, whose value is one quadrant of a four quadrant euclidian plane
    // so I have to multiple by 2 to 
    // x/ywindow is the number of steps to multiply by to increase the unitcell
    let [minx, miny, width, height] = bbox2topleft(sectionbbox)
    let viewbox = (wallpaper ? [
        xunit * xwindow * -1, // min x
        yunit * ywindow * -1, // min y
        xunit * xwindow * 2,
        yunit * ywindow * 2
    ] : [
        minx - 1 * strapwork / 2, // farther left
        miny - 1 * strapwork / 2, // farther up
        width + 1 * strapwork, // wider
        height + 1 * strapwork // taller
    ]).map(n => shorten(n * radius))
    // after calculating the viewbox of each wallpaper and medallion
    // I can set the values of left top width height, but this 
    // these vars are used directly to position the medallions
    // but the wallpapers override -- be 100% of body 
    Object.assign(cssvars, {
        "--left":   viewbox[0] + 'px', // ha doesnt matter if its a square
        "--top":    viewbox[1] + 'px', // this might need to be flipped??
        "--width":  viewbox[2] + 'px',
        "--height": viewbox[3] + 'px'
    })

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
        "type": type,
        "style": cssvars, // mostly vars 
        "childNodes": [ // section gets psuedo elements to place float shapes in the vicinity of flowed text inside section
            {"section": {
                "title": art || ("article " + index), // TODO replace with params.title once it exists
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
                                // could simplify the markup with shape-left, shape-right, 
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
                            // if embedtag is webcam... 
                            // iframe | media (img/video) | camera
                            return embedtag == "webcam" ? webcam : [{[embedtag]: {
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