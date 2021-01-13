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

	// offset the medallion so its center lies on the articles origin 
	// this gets overwritten for NET articles
	"section, article:after": {
		"position": "absolute",
		"width": "100%",
		"height": "100%",
		"mask-image": "var(--mask)",
		"mask-position": "center",
		// for chrome:
	    "-webkit-mask-image": "var(--mask)",
	    "-webkit-mask-position": "center",
		"transform": `
			rotate(calc(1deg * var(--spin)))
		`
	},
	"article": {
		"--totalzoom": "calc(var(--zoom) * var(--zoomg))",
		"width": "var(--width)",
		"height": "var(--height)",
		"position": "absolute",
		"top": "calc(50% + (var(--top) * 1px))",
		"left": "calc(50% + (var(--left) * 1px))",
		"overflow": "hidden",
		"filter": "blur(calc(var(--blur) * 1px))",
		"transform": `
			translateX(calc(
				var(--xunit)
			  * (var(--xstep) + var(--xcent))
			  * var(--totalzoom)
			  * 1px
			))
			translateY(calc(
				var(--yunit)
			  * (var(--ystep) + var(--ycent))
			  * var(--totalzoom)
			  * -1px
			))
			scale(var(--totalzoom))
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
	"article:focus": {
		"outline": "none",
		"box-shadow": "none",
	},
	"article[type=\"text\"], article[type=\"embed\"]": {
		// for text and embed, I use clippath circle so that mouse events only reach children within the circle
		"clip-path": "circle()" // fills the whole square evenly
	},
	"article > svg": {
		"display": "none"
	},
	"article[type=\"text\"]:focus > div, article[type=\"embed\"]:focus > div": {
		"display": "block",
		"position": "absolute",
		"background-size": "contain",
		"pointer-events": "none",
		"width": "100%",
		"height": "100%",
		"animation": "spin 30s linear infinite",
	},
	"@keyframes spin": {
		"from": {
			"transform": "rotate(0deg)"
		},
		"to": {
			"transform": "rotate(359deg)"
		}
	},
	"article[type=\"net\"]": {
		"width": "100%",
		"height": "100%",
		"left": "0",
		"top": "0",
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
		"mask-size": "calc(1px * var(--width) * var(--zoom) * var(--zoomg))",
		"mask-position": `calc(
			50%
		  + var(--width)
		  * var(--xcent)
		  * var(--zoom)
		  * var(--zoomg)
		  * 1px
	  	) calc(
	  		50%
  		  - var(--height)
  		  * var(--ycent)
  		  * var(--zoom)
	  	  * var(--zoomg)
	  	  * 1px
  		)`,
		// for chrome:
		"-webkit-mask-size": "calc(1px * var(--width) * var(--zoom) * var(--zoomg))",
		"-webkit-mask-position": `calc(
			50%
		  + var(--width)
		  * var(--xcent)
		  * var(--zoom)
		  * var(--zoomg)
		  * 1px
	  	) calc(
	  		50%
  		  - var(--height)
  		  * var(--ycent)
  		  * var(--zoom)
	  	  * var(--zoomg)
	  	  * 1px
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

	// for EMBED articles // would be better if this reacts to an attribute added by form.js, so that everything works in /art/ mode
	"[type=\"embed\"] section > *, [type=\"text\"] section > *": {
		"pointer-events": "none",
		"user-select": "none"
	},
	"[type=\"embed\"] section > *": {
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