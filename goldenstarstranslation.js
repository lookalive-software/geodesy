// so iterate through the triangles finding their centroid
const math = require('algebrite')
const fs = require('fs')
const goldenstars = require('./motifs/goldenstars')
// have to add the three points together
goldenstars.motif.forEach((motif, i, self) => {
	let [[x1, y1], [x2, y2], [x3, y3]] = motif.polygon
	// I take for granted that every polygon is a triangle
	// so to average them I just add their xs and ys and divide by 3
	// gotta wrap everything in parans becase '+' followed by '-' crashes
	let xoffset = math.simplify(`(1 / 3) * ((${x1}) + (${x2}) + (${x3}))`).toString()
	let yoffset = math.simplify(`(1 / 3) * ((${y1}) + (${y2}) + (${y3}))`).toString()
	console.log({xoffset, yoffset})
	// so I could overwrite motif.offset at this point
	// now translate the xs and ys, overwrite them with their translated value
	let xs = [x1, x2, x3]
	let ys = [y1, y2, y3]

	// let translatedpolygon = Array.from({length: 3}, (_, i) => 
	let translatedpolygon = Array.from({length: 3}, (_, i) => 
		[
			`(${xs[i]}) - (${xoffset})`,
			`(${ys[i]}) - (${yoffset})`
		].map(
			// well this works ok except a lot of new points are grotequely long
			// 1/3*(-(65/8+29/8*5^(1/2))^(1/2)+1/2*(25/2+11/2*5^(1/2))^(1/2))
			// when WolfraAlpha can simplify to (-1/6)sqrt(5 + 2sqrt(5)) ! 
			// phrase => math.simplify(phrase).toString()
			phrase => math.float(phrase).d.toString()
		)
	)

	if(
		translatedpolygon[0][0] == translatedpolygon[1][0]
		&&
		translatedpolygon[1][0] == translatedpolygon[2][0]
		|| 
		translatedpolygon[0][1] == translatedpolygon[1][1]
		&&
		translatedpolygon[1][1] == translatedpolygon[2][1]
	){
		console.log("XS", xs)
		console.log("YS", ys)
		console.log("POLYGON", motif.polygon)
		console.log("TRANSLATED", translatedpolygon)
		console.log([xoffset, yoffset].map(
			phrase => math.float(phrase).d.toString()
		))
		process.exit()
	}
	console.log(self[i])

	Object.assign(self[i], {
		offset: [
			xoffset, 
			yoffset
			// yoffset + " - 2.22703" // sqrt((5/2) + (11/2sqrt(5)))
		].map(
			phrase => math.float(phrase).d.toString()
		),
		polygon: translatedpolygon
	})

	console.log(self[i])
	// this reconstructs [[x1, y1], [x2, y2]...] but after applying the centroid correction
	// so now the centroid is the offset from center, and the vertexs of each polygon are relative to 0,0
})

fs.writeFileSync('./motifs/goldenstars2.json', JSON.stringify(goldenstars, null, 2))

// adjustment:
// add 1/(2 Sin[Pi/ 5]) to the y component of all offsets so that the center of the upright star is what gets centered