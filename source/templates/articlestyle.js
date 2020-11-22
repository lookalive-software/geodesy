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
	"[type=\"embed\"] section": {
		"pointer-events": "none",
	},
	// iframe should only exist in embed mode, no?
	// last-child in embed mode is going to be a video, 
	// "[mode=\"embed\"] iframe, [mode=\"embed\"] img, [mode=\"embed\"] video": {
	"[type=\"embed\"] section > *": {
		"pointer-events": "all",
		// "frameborder": "0",
		"opacity": "var(--fillopacity)",
		"min-width": "100%", // min width & height to allow img to scale without distortion
		"min-height": "100%",
		"transform": "scale(var(--ifscale))",
		"position": "absolute",
		"right": "calc(var(--ifxoffset) * var(--ifscale) * -1%)", // + to go left to right
		"top":  "calc(var(--ifyoffset) * var(--ifscale) * -1%)", // - to go bottom to top
		"z-index": "-1"
	},
	// section[type="net|text|embed"]
	// body will have to have absolute size now for articles to be positioned correctly

	"article": {
		// "width": "0",
		// "height": "0",
		"overflow":"visible", // default ?
		// this x / y offset needs to be multiplied by art... 
		"left": "calc(50% + 1px * calc(calc(var(--xstep) + var(--xcent)) * var(--wallx) * var(--zoom)))", // + to go left to right
		"top":  "calc(50% - 1px * calc(calc(var(--ystep) + var(--ycent)) * var(--wally) * var(--zoom)))", // - to go bottom to top
		// "top": "50vh",
		"filter": "blur(calc(var(--blur) * 1px))",
		// "opacity": "var(--opacity)",
		// "transform": "scale(var(--zoom))",
		"transform": "rotate(calc(1deg * var(--spin)))"
	},
	"article[type=\"net\"]": {
		// there's a smaller width/height if it helps rendering,
		// maybe its the diagonal of the max(vh, vh) square that would let it rotate
		"left": "-100%",
		"top": "-100%",
		// left 50% for every extra 100%
		"width": "300%",
		"height": "300%"
	},
	"section": {
		"text-align":"var(--align)", // left | center | right | justify
		"overflow": "hidden" // fixed an issue with iframe showing through maskk
	},
	"section > span": {
		"font-family": "recursive",
		"white-space": "pre-wrap",
		"line-height": "var(--hght)",
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
		// well multiply one piel by the scale
		"width": "calc(var(--width) * var(--zoom))",
		"height": "calc(var(--height) * var(--zoom) )", // add zoom here!
		// this is relative to the article, which is centered
		// maybe it makes more sense for these to be 100%
		// and the article be scaled and positioned?
		"top": "calc(var(--top) * var(--zoom))",
		"left": "calc(var(--left) * var(--zoom))",
		"mask-image": "var(--mask)",
	    "-webkit-mask-image": "var(--mask)",
	    // instead of center
	    // we'll do calc(50% + --x/ycent)
	    // steps don't do anything for wallpaper
	    // for medallions, this will always be center
	    // xycent and step are applied to the article.
	    "-webkit-mask-position": "center",
		"mask-position": "center",

		"mask-size": "calc(var(--width) * var(--zoom))",
		"-webkit-mask-size": "calc(var(--width) * var(--zoom))",
		"display":"block" // to get floated widths correct
	},
	// more specific, cascading override for net articles -- just fill the screen
	// remember mask-size can be used with zoom

	"[type=\"net\"] section, [type=\"net\"]:after":{
		"width": "100%",
		"height": "100%",
		"left": "0",
		"top": "0",
		// any movement of the wallpaper should be applied to:

		"mask-position": "calc(50% + var(--width) * var(--xcent)) calc(50% + var(--height) * var(--ycent))",
		"-webkit-mask-position": "calc(50% + var(--width) * var(--xcent)) calc(50% + var(--height) * var(--ycent))"
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