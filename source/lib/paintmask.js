// viewbox, geometry, radius, strapwork....
// colors and others will be handed down via css vars

// can I also add the clippaths, 

// might as well pass the whole lattice too, or at least motif
// so I can iterate over the motif creating a clippath for each

// so one of t
// {"clipPath": {
// 	"id": "clip-0"
// 	"clipPathUnits":"objectBoundingBox",
// 	"childNodes": [{"polygon": {"pts": motif.pts}}]
// 	// points normalized into a 0,0,1,1 coordinate system to cut a radiusxradius section
// }}
const crypto = require('crypto')
const zlib = require('zlib')
const fs = require('fs')
const {elementary} = require('@lookalive/elementary')

exports.paintmask = ({viewbox, uniongeometry, atomgeometry, strapwork, radius, precision, linejoin}) => {
    let queryhash = crypto.createHash('sha256').update(JSON.stringify({
    	svghash: Math.random() // Later will represent the hash of an actual form vars
        // viewbox,
        // strapwork, 
        // radius
    })).digest('hex').slice(-16)

    // viewbox is minx miny width height

    // flip the polarity from to describe the pos
    // viewbox[0] = -viewbox[0]
    // viewbox[1] = -viewbox[1] 
    // 
    // trick is, in order to reveal one mask at a time, and also be able to adjust view...

    // offset defaults to 0, just used to shift polygons over to the left, by one half width...

    // 

    let paintpolygon = pts => (
        {"polygon": {
            "points":  pts.map(([x,y]) => [
                (x * radius).toPrecision(precision), 
                (y * radius).toPrecision(precision)
            ].join(', ')).join(' ')
        }}
    )

	let mask = {"svg": {
        "xmlns": "http://www.w3.org/2000/svg",
        "viewbox": viewbox.join(', '), // I think I have to subtract strapwork straight onto the viewbox as it comes in
        "width": viewbox[2], // 3rd element of viewbox is width
        "height": viewbox[3], // 4th element of viewbox is height
        "id":"test",
        "childNodes": [
        	{"defs": [
        		// I need atomgeometry, which is the original polygons in either case
        		// And I need uniongeometry, which is the result of union'ing the atoms
				{"g": {
					"id": "atomgeometry",
                    "childNodes": atomgeometry.map(paintpolygon)
                }},
                // eventually I can put in a switch that uses the same def for both union and strapwork
                // I'll
				{"g": {
					"id": "uniongeometry",
                    "childNodes": uniongeometry.map(paintpolygon)
                }},
                // So I need one mask 
                {"mask": {
	                "id": "atomicmask",
	                // "maskUnits": "userSpaceOnUse",
	                // "maskContentUnits": "objectBoundingBox",
	                "childNodes": [
                        {"rect": {
                            "fill": "black",
                            "width": "100%",
                            "height": "100%"
                        }},
	                	{"use": {
	                		"href": "#atomgeometry",
	                		"x": -viewbox[0],
                            "y": -viewbox[1],
                            // without any overlap, the polygons get rendered as seperate bodies with a very thin edge between them
                            // but if stroke is 0 I very much want the body to appear seamless,
                            // so I make sure to use a stroke width of adaquete overlap to make the body appear solid 
                            // if its 1 or 0, stroke width should also be 0, or if 0, negative 1 !
                            // this is very convenient that stroke-width defauls to 1 for invalid values!
                            // so when I reach 0, stroke-width is -1, and the stroke becomes 1 which is exactly how thick I want it
                            // Npx -> (N - 1)px == 2px -> 1px, 1px -> 0px, 0px -> (default) 1px, 
                            "stroke-width": Math.min(strapwork - 1, 2), // Math.max(strapwork - 1, 1),
							"stroke": "white", 
							"fill": "white" 
	                	}},
                        // second 'strapwork' mask to block out anything behind strapwork
                        // allows for opacity of strapwork to be set
                        // without seeing through into the iframe, but to the ground beaneath
                        {"use": {
                            "href": "#uniongeometry",
                            "x": -viewbox[0],
                            "y": -viewbox[1],
                            "stroke-width": strapwork,
                            "stroke": "black",
                            "fill": "transparent" 
                        }}
	                ]
	            }},
	        	{"mask": {
	                "id": "strapworkmask",
	                // "maskUnits": "userSpaceOnUse",
	                // "maskContentUnits": "objectBoundingBox",
	                "childNodes": [{
	                	"use": {
	                		"href": "#uniongeometry",
	                		"x": -viewbox[0],
	                		"y": -viewbox[1],
	                        "stroke-width": strapwork,
							"stroke": "white",
							"fill": "transparent" 
	                	}
	                }]
	            }}
            ]},
            {"style":{
                "polygon": {
                    "stroke-linejoin": linejoin // miter | bevel | round
                },
            	"#section, #strapwork": {
            		"display": "none"
            	},
            	"#section:target, #strapwork:target": {
            		"display": "initial"
            	}
            }},
    		{"rect": {
    			"id": "section",
    			"width": "100%",
    			"height": "100%",
    			"fill":"black",
    			"mask": "url(#atomicmask)" // 
    		}},
    		{"rect": {
    			"id": "strapwork",
    			"width": "100%",
    			"height": "100%",
    			"fill":"black",
    			"mask": "url(#strapworkmask)" // ${unionized ? uniongeometry : }
    		}},
		]
	}}

    let shape = {"svg": {
        "xmlns": "http://www.w3.org/2000/svg",
        "viewbox": viewbox.join(', '), // I think I have to subtract strapwork straight onto the viewbox as it comes in
        "width": viewbox[2] / 2, // 3rd element of viewbox is width
        "height": viewbox[3], // 4th element of viewbox is height
        "id":"test",
        "childNodes": [
            {"defs": [
                // uniongeometry is fewer...
                // I guess eventually to minimize my markup I can just describe the polygons and move them into position...  
                {"g": {
                    "id": "uniongeometry",
                    "childNodes": uniongeometry.map(paintpolygon)
                }},
                // for the second rectangle, mask with the offset version....
                // so describe the viewport, then define a rectangle masked with the uniongeometry

                // actually the rectangle background will be kept,
                // in order to mask an opaque rectangle later, cutting out the geometry as 'transparent'
                // so they can be used for shape-outside and flow text.
                {"mask": {
                    "id": "leftmask", 
                    "childNodes": [
                        {"rect": {
                            "fill": "white",
                            "width": "100%",
                            "height": "100%"
                        }},
                        {"use": {
                            "href": "#uniongeometry",
                            "x": -viewbox[0],
                            "y": -viewbox[1],
                            "stroke-width": strapwork,
                            "stroke": "white", // I actually want the stroke of the geometry to be a part of the 'background' I keept, so text is not flowed underneath a thick border
                            "fill": "black" 
                        }
                    }]
                    // mask#left uses uniongeometry as white polygons as their original positions, x y 
                    // uniongeometry positions polygons on a -90 to 90 basis, multiplied by radius
                    // somehow I decided to use -left -top to position the mask in place

                }},
                // so for the right mask, instead of x being left, x is now left + width, 2left?
                {"mask": {
                    "id": "rightmask", 
                    "childNodes": [
                        {"rect": {
                            "fill": "white",
                            "width": "100%",
                            "height": "100%"
                        }},
                        {"use": {
                            "href": "#uniongeometry",
                            "x": -(viewbox[0] + (viewbox[2] / 2)), // shift left by half of width
                            "y": -viewbox[1],
                            "stroke-width": strapwork,
                            "stroke": "white", // I actually want the stroke of the geometry to be a part of the 'background' I keept, so text is not flowed underneath a thick border
                            "fill": "black" 
                        }
                    }]
                    // mask#left uses uniongeometry as white polygons as their original positions, x y 
                    // uniongeometry positions polygons on a -90 to 90 basis, multiplied by radius
                    // somehow I decided to use -left -top to position the mask in place

                }}
            ]},
            {"style":{
                // "polygon": {
                //     "stroke-linejoin": linejoin // miter | bevel | round
                // },
                "#left, #right": {
                    "display": "none"
                },
                "#left:target, #right:target": {
                    "display": "initial"
                }
            }},
            {"rect": {
                "id": "left",
                "width": "100%",
                "height": "100%",
                "fill":"black",
                "mask": "url(#leftmask)" // 
            }},
            {"rect": {
                "id": "right",
                "width": "100%",
                "height": "100%",
                "fill":"black",
                "mask": "url(#rightmask)" // ${unionized ? uniongeometry : }
            }},
        ]
    }}


    // define two masks, then define two rects using those masks
    // left mask, right mask is everything shifted to the left.
    // I should be able to take the union geometry, mask a rectangle with it...

    // So I define a group of polygons, then use that group from within a mask
    // when I use the group I can shift its coordinates
    // So I still have two rectangles (left / right), each using one of two masks (left / right)
    // but the right mask uses the same geometry, just shifted over by half of width





    // next shape SVG should be half width
    // so calc the width, draw the shape...
    // then draw the shapes again but shifted to the left by the width / 2

    fs.writeFileSync('./hash/'+queryhash+'mask.svg', elementary(mask))
    // fs.writeFileSync('./hash/'+queryhash+'mask.svg', zlib.gzipSync(elementary(mask)))
    fs.writeFileSync('./hash/'+queryhash+'shape.svg', elementary(shape))
    // fs.writeFileSync('./hash/'+queryhash+'.svg', elementary(svg))
    // cache is now updated
    // 
    // could also do this async, sync open then stream write (so it exists by the time the client request it, even if the end of the file doesn't exist yet)
    // return '/hash/'+queryhash+'mask.svg' // return name of file to fetch
    return queryhash
}

