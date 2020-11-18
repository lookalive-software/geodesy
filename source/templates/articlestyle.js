// since no params are used this could be JSON but then I couldn't have comments
module.exports = { "style": {
	// every article is a new container moved to the origin at 0,0
	// so that the positioning of sections and sectionafters can be done relative to center of the screen
    "@font-face": {
        "font-family": "recursive",
        /* attempt to use localy hosted woff file but fallback to google font API*/
        "src": `url('/font/recursive.woff2') format('woff2-variations')`,
        // "src": `url('https://fonts.googleapis.com/css2?family=Recursive:slnt,wght,CASL,CRSV,MONO@-15..0,300..1000,0..1,0..1,0..1&display=swap')`,
        "font-weight": "300 1000"
    },
	"article, article:before, section, article:after": {
		"position": "absolute"
	},
	"article:before, article:after": {
		"content": '""',
		"pointer-events": "none"
	},
	"section > div": {
		"width": "50%",
		"height": "100%",
		"shape-margin": "calc(var(--margin) * 100%)",
	},
	"section[type=\"embed\"]": {
		"pointer-events": "none",
	},
	// iframe should only exist in embed mode, no?
	// last-child in embed mode is going to be a video, 
	// "[mode=\"embed\"] iframe, [mode=\"embed\"] img, [mode=\"embed\"] video": {
	"[type=\"embed\"] > *": {
		"pointer-events": "all",
		// "frameborder": "0",
		"opacity": "var(--fillopacity)",
		"min-width": "100%", // min width to allow img to scale
		"height": "100%",
		"transform": "scale(var(--ifscale))",
		"position": "absolute",
		"right": "calc(var(--ifxoffset) * var(--ifscale) * 1%)", // + to go left to right
		"top":  "calc(var(--ifyoffset) * var(--ifscale) * 1%)", // - to go bottom to top
		"z-index": "-1"
	},
	"article": {
		// "width": "0",
		// "height": "0",
		"overflow":"visible", // default ?
		// this x / y offset needs to be multiplied by art... 
		"left": "calc(50vw + 1px * calc(calc(var(--xstep) + var(--xcent)) * var(--wallx) * var(--zoom)))", // + to go left to right
		"top":  "calc(50vh - 1px * calc(calc(var(--ystep) + var(--ycent)) * var(--wally) * var(--zoom)))", // - to go bottom to top
		// "top": "50vh",
		"filter": "blur(calc(var(--blur) * 1px))",
		// "opacity": "var(--opacity)",
		"transform": "scale(var(--zoom))"

	},
	"article:before": {
		// maybe apply a polygon mask to demarcate the size of the wallpaper
		// then make it a j/k kind of thing to increase the h z scalar of the wallpaper
		"top": "calc(var(--artrad) / -2 - 20px)",
		"left": "calc(var(--artrad) / -2 - 20px)",
		"width": "calc(var(--artrad))",
		"height": "calc(var(--artrad))",
		"border-radius": "100%",
		// eventually instead of a border it will be a embedded svg
		// "border": "20px solid black",	
		"z-index":"1"
	},
	"section": {
		"text-align":"justify", // left | center | right | justify
		"overflow": "hidden" // fixed an issue with iframe showing through maskk
	},
	"section > span": {
		"font-family": "recursive",
		"font-size": "calc(5px * var(--fontsize))",
		"color": "var(--fontcolor)",
		"opacity": "var(--fontopacity)",
		"font-variation-settings": `"MONO" var(--MONO), "CASL" var(--CASL), "wght" var(--wght), "slnt" var(--slnt), "CRSV" 0.5`,
	},
	"section:before": {
		"background": "var(--fillcolor)",
		"opacity": "var(--fillopacity)",
		"content":`""`,
		"width": "100%",
		"height": "100%",
		"position": "absolute", // needs to get taken out of the flow so it doesn't push my shape down
		"z-index": "-1", // then needs to be dropped under the text since absolute pos created new stacking order
		"left": "0px" // without this I was getting pushed to the middle of the parent, not sure why
	},
	"section, article:after": {
		// there's a bleed over on
		"width": "calc(var(--width) - 1px)",
		"height": "calc(var(--height) - 1px)",
		"top": "var(--top)",
		"left": "var(--left)",
		"mask-image": "var(--mask)",
	    "-webkit-mask-image": "var(--mask)",
	    "-webkit-mask-position": "center",
	    "mask-image": "var(--mask)",
		"mask-position": "center",
		"display":"block" // to get floated widths correct
	},
	"article:after": {
		"background": "var(--strokecolor)",
		"opacity": "var(--strokeopacity)",
		"content": `""`
	},
	// "section:before":{
		// "float":"left"
		// shape-outside hash#shapeleft
	// },
	// "section::after":{
	// 	"float":" right"
	// 	// shape-outside: url(var(--shaperight))
	// }
}}