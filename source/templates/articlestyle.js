// it would be nice to apply pointer events none and 50% transparency / gray out when mode is net -- since x and y don't apply to wallpapers

// since no params are used this could be JSON but then I couldn't have comments
module.exports = { "style": {
	// every article is a new container moved to the origin at 0,0
	// so that the positioning of sections and sectionafters can be done relative to center of the screen
    "@font-face": {
        "font-family": "recursive",
        "src": `url('/static/font/recursive.woff2') format('woff2-variations')`,
        "font-weight": "300 1000"
    },
    "html": {
    	// for body min height to be able to fill without content specified, html needs to be 100
    	"height": "100%"
    },
	"body": {
		"position": "relative",
		// gets exact dimensions with inline paintarticle, but falls to 100% at minimum
		"min-height": "100%",
		"min-width": "100%"
    },
    // position article at 0,0 center of body, offset by combination of step/cent/unitcell/zoom
    // position of section is always relative to 0,0 before scaling and rotation
    // 
	"article": {
		"position": "absolute",
		"left": "50%",
		"top": "50%",
		"filter": "blur(calc(var(--blur) * 1px))",
		"transform": "scale(var(--zoomg))", // gets overwritten with 'none' for [type=net], zoomg is applied to mask size 
	},
	// offset the medallion so its center lies on the articles origin 
	// this gets overwritten for NET articles
	"section, article:after": {
		"position": "absolute",
		"top": `calc(
			var(--top)
		  - 1px
	  	  * var(--zoom)
	  	  * var(--yunit)
		  * calc(
		  	  var(--ystep)
		  	+ var(--ycent)
		  	)
	  	)`,
		"left": `calc(
			var(--left)
		  + 1px
	  	  * var(--zoom)
  	  	  * var(--xunit)
		  * calc(
		  	  var(--xstep)
		  	+ var(--xcent)
  	  		)
	  	)`,
		"width": "var(--width)",
		"height": "var(--height)",

		"mask-image": "var(--mask)",
		"mask-position": "center",
		// for chrome:
	    "-webkit-mask-image": "var(--mask)",
	    "-webkit-mask-position": "center",
		"transform": `
			scale(var(--zoom))
			rotate(calc(1deg * var(--spin)))
		`
	},

	// to paint the background of sections
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
	// to paint the strap work
	"article:after": {
		"content": '""',
		"pointer-events": "none",
		"background": "var(--strokecolor)",
		"opacity": "var(--strokeopacity)",
	},

	// for NET (wallpaper) articles, fill the screen
	"article[type=\"net\"]": {
		"left": "0",
		"top": "0",
		"width": "100%",
		"height": "100%",
		"overflow": "hidden",
		// disable zoom and rotate transforms to the article
		// zoom is applied to the mask and rotation is applied to the net:section so that I can rotate the inner body
		"transform": "none"
	},
	"[type=\"net\"] section, [type=\"net\"]:after":{
		"transform": "rotate(calc(1deg * var(--spin)))",
		// wallpaper gets oversized to fill out its parent article while allowing its overflow to be hidden
		// maybe this should me a multiple of max(vh,vw) so it doesnt break on extreme aspect ratio
		"width": "300%",
		"height": "300%",
		"left": "-100%",
		"top": "-100%",
		// any movement of the wallpaper should be applied to:
		"mask-size": "calc(var(--width) * var(--zoom) * var(--zoomg))",
		"mask-position": `calc(
			50%
		  + var(--width)
		  * var(--xcent)
		  * var(--zoom)
		  * var(--zoomg)
	  	) calc(
	  		50%
	  		+ var(--height)
	  		* var(--ycent)
	  		* var(--zoom)
		  	* var(--zoomg)

  		)`,
		// for chrome:
		"-webkit-mask-size": "calc(var(--width) * var(--zoom) * var(--zoomg))",
		"-webkit-mask-position": `calc(
			50%
		  + var(--width)
		  * var(--xcent)
		  * var(--zoom)
	  	  * var(--zoomg)
	  	) calc(
	  		50%
	  		+ var(--height)
	  		* var(--ycent)
	  		* var(--zoom)
		  	* var(--zoomg)
  		)`,
	},
	// for TEXT articles
	"article[type=\"text\"] section": {
		"text-align":"var(--align)", // left | center | right | justify
		"overflow": "hidden", // fixed an issue with iframe showing through maskk
	},
	"[type=\"text\"] section > div": {
		// aka shapeleft / shaperight
		"width": "50%",
		"height": "100%",
		"shape-margin": "calc(var(--margin) * 100%)",
	},
	"article[type=\"text\"] section span": {
		"font-family": "recursive",
		"white-space": "pre-wrap",
		"line-height": "var(--hght)",
		"font-size": "calc(5px * var(--fontsize))",
		"color": "var(--fontcolor)",
		"opacity": "var(--fontopacity)",
		"font-variation-settings": `"MONO" var(--MONO), "CASL" var(--CASL), "wght" var(--wght), "slnt" var(--slnt), "CRSV" 0.5`,
	},

	// for EMBED articles
	"[type=\"embed\"] section": {
		"pointer-events": "none",
	},
	"[type=\"embed\"] section > *": {
		"pointer-events": "all",
		"opacity": "var(--fillopacity)",
		"min-width": "100%", // min width & height to allow img to scale without distortion
		"min-height": "100%",
		"transform": "scale(var(--ifscale))",
		"position": "absolute",
		"right": "calc(var(--ifxoffset) * var(--ifscale) * -1%)", // + to go left to right
		"top":  "calc(var(--ifyoffset) * var(--ifscale) * -1%)", // - to go bottom to top
		"z-index": "-1"
	},
}}