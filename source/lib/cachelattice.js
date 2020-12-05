/**
 * I just hear about a motif and a number of shells needed, 
 * 
 * I load cache from disk on startup, and every request I lookup the motif in my cache, check if it has .length > query.shells
 * 
 * If I have [motif].length > shells in cache, I exit, returning the array
 * Level 2: use a bitmask parameter to filter out the elements or shells in the array of arrays that buildlattice returns
 * 
 * If my cache is insufficient, I build a new lattice that has enough points to group into the requested number of shells, then I cache that.
 * 
 * 
 * buildmarkup applies the polygon svg syntax + style 
 */
var λ = require("./mathutils");
var {elementary} = require('@lookalive/elementary')
const zlib = require('zlib')
const fs = require('fs')
const path = require('path')
const Turf = require('@turf/turf')
const deepcopy = require('lodash.clonedeep')

const motifs = fs.readdirSync('./motifs').map(motifname => (
                    {[path.parse(motifname).name]: require('../../motifs/' + motifname)}
                )).reduce((a,b) => Object.assign(a,b), {})

const cache = fs.readdirSync('./cache').map(motifname => (
                    {[path.parse(motifname).name]: require('../../cache/' + motifname)}          
                )).reduce((a,b) => Object.assign(a,b), {})


// takes an array of pts[2] and adds the first point to the end so turf can handle it
function closePolygon(polygon){
    return polygon.concat([polygon[0]])
}

// returns a copy of []
exports.cachelattice = function({motif /* enum */, shells /* number */}){

    // shells = Math.max(shells, motifs[motif].motif.length * 2 + 1) // for now just times number of shapes times two
    
    if(cache[motif] && cache[motif].shells.length >= shells){
        console.log("HIT")
        // setup the shells property with the requested number of shells
        // exit buildlattice once we've returned this {meta motif shells} object
        return {
            meta: cache[motif].meta,
            motif: cache[motif].motif, // overwrite the motif property with what was saved to cache
            shells: cache[motif].shells.slice(0, shells)
        }
    } else {
        let motifCopy = Object.assign(deepcopy(motifs[motif]), {shells: {}})
        
        motifCopy.meta.wallpaper = motifCopy.meta.wallpaper.map(n => λ.shorten(n)) // convert the wallpaper from algebraic to numeric right off the bat

        // how many orbitals do you want?
        // take the ceiling of the natual log and add one (or two? this was experimentally derived), 
        // that's how big the table has to be to return those orbits
        console.log("SHELLS", shells)
        let tablesize = λ.N(λ.run(`ceiling(log(${shells})) + 2`))
        console.log("TABLE", tablesize)
        // let tablesize = shells
        // we're building up from the canonical motif descriptor json
        // MODIFYING motifCopy.meta.viewbox property: flip the sign on the viewbox and turn them into numerics before writing to cache
        // TODO why did I put an if statement around this? under what conditions would this overwrite the viewbox twice?
        // if(motifCopy.meta.viewbox.length == 2){
        //     let [viewx, viewy] = motifCopy.meta.viewbox.map(shorten) // shorten also translates from algebraic to numeric numbers
        //     motifCopy.meta.viewbox = [-viewx, -viewy, viewx * 2, viewy * 2] // .map(shorten) if this produces too large of numbers, doubling shouldn't tho, just dividing causes problems    
        // }
        // don't calc the viewbox here, just convert the algebraic values to numerics -- no harm in doing this twice, tho I still don't understand how I was reusing the viewbox here, I thought I was just overwriting on the new object.
        // yo why is JSON stringify + parse the easiest way to make a deep copy of an object? I guess at least it simply throws for recursive objects.

        motifCopy.motif.forEach((shape, shapeIndex) => {
            // TODO maybe before asking the polygon offsetting to happen, you convert shape.polygon to numeric ? Will calc much faster
            // building up a table, applying basis skew, calculating the norms, return {[norm]: polygons[[]]}
            // console.log(shape.polygon) // this is going to modify the polygon object stored at this location in the motif array
            /* MODIFYING motifCopy.motif[shapeIndex].polygon */
            shape.polygon = shape.polygon.map(point => point.map(λ.shorten)) // converting all the points of all the polygons to numeric symbols
            // console.log(shape.polygon)
            console.log("SHAPE OFFSET")
            console.log(shape.offset)
            λ.applyShift(
                λ.M(
                    λ.dot(
                        λ.table(
                            tablesize,
                            tablesize
                        ), // returns a js array 
                        shape.basis // [["",""],["",""]] gets lambdafied by dot
                    )
                ),
                shape.offset
            ).map(([x,y]) => {
                console.log("XY", {x,y})
                // returning an array of points [[x,y]], one xy pair for each point in this lattice
                let thisnorm =  λ.calcNorm(x,y)
                console.log("NORM", {thisnorm})
                let polygonData = {
                    x: λ.shorten(x),
                    y: λ.shorten(y), // still algebraic numbers
                    shapeIndex // need to reach back into motifCopy.motif[shapeIndex].polygon to get pts
                }
                // Basically I'm building up shellsMap by pushing all the points into [norm]:shells
                // and then sorting that data structure, and then returning just a slice.
                motifCopy.shells[thisnorm]
                ? motifCopy.shells[thisnorm].push(polygonData)
                : motifCopy.shells[thisnorm] = new Array(polygonData)
                // so that will be an array of arrays of polygons
                // and it just needs to be upgraded into an array of arrays of polygonData (with offset points)
            })
        })
        // console.log(motifCopy.shells)
        // motifCopy.shells has now been built up as an array of shells of points
        // sort the entries by their numeric norm in 0th index of each 'entry'
        // then map over this sorted object entry grabbing just the 
        motifCopy.shells = Object.entries(motifCopy.shells) // [[norm, point[]], [norm, point[]]]
        .sort((a,b) => {
            console.log({a, b})
            return λ.N(a[0]) - λ.N(b[0])
        }) // at this point we've got a sorted array with smallest norm at the head and the largest norms at the tail
        .slice(0, shells) // from this sorted list of shells, slice down to just the requested amount
        .map(([_, polygonData]) => polygonData) // drop the norm, just work on [[polygonData]]
        .map(shells => shells.map(
            ({x,y,shapeIndex}) => { // the entries are still in a [[norm, point[]]] format
            // so now we're mapping over points

                // we can calculate spins of each of there.  Should points be converted to numeric at the point too?
                let xoffset = λ.shorten(x) // λ.shorten returns numeric...
                let yoffset = λ.shorten(y)

                // at this point xoffset and yoffset could be summed with article offset, to get global spin
                let thisspin = λ.shorten(Math.atan2(xoffset, yoffset)) // gives spin to the center between -1 and 1 radians.
                let thesepts = motifCopy.motif[shapeIndex].polygon.map(
                    ([x,y]) => [λ.shorten(x + xoffset), λ.shorten(y + yoffset)]
                )
                return Object.freeze({
                    m: shapeIndex,
                    x: xoffset, // y position of center of polygon
                    y: yoffset, // x position of center of polygon
                    spin: thisspin, // -1 to 1 radians
                    pts: closePolygon(thesepts) // [[x1,y1]...[xn,yn]] closed form for Turf.polygon (svg polygons don't need to be closed)
                })
            })
        )

        // console.log("tableSize", tablesize)
        // console.log("shells length", motifCopy.shells.length)
        
        fs.writeFileSync('./cache/' + motif + '.json', JSON.stringify(motifCopy, null, 2)); // cache is now updated
        console.log("MOTIFCOPY", JSON.stringify(motifCopy.motif))
        return cache[motif] = Object.freeze(motifCopy) // altering this motifcopy wouldn't break the cache but I think my intention is not to alter it further...
    }
}