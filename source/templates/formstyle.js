module.exports = {
    "style": {
        "body": {
            "box-sizing":"border-box",
            "margin": "0",
            "padding": "0",
            "overflow":"hidden"
        },
        "iframe": {
            "width":"calc(100% - 256px)",
            "height":"100%",
            "position":"absolute"
        },
        "form":{
            "z-index":"1",
            "padding": "10px 0",
            "width":"256px",
            "right":"0",
            "height":"100vh",
            "background":"rgba(200, 200, 200, 0.5)",
            "position":"absolute",
            "border":"2px solid rgba(0,0,0,0.2)",
            "display":"flex",
            "overflow":"hidden auto",
            "padding-bottom": "0",
            "flex-direction": "column",
        },
        "menu": {
            "margin": "0 auto",
            "width": "100%",
            "padding": "0 15px"
        },
        // these are the paint | move (mode) buttons and the clone | pop buttons (cmd)
        "menu > [name=\"mode\"], menu [name=\"cmd\"]": {
            "width": "50%",
            "position": "relative" // stacking order hack to overlap shadow
        },
        // these are the text | embed | net buttons
        "menu [name^=\"type\"]": {
            "width": "calc(100% / 3)",
            "position": "relative"
        },
        // elements that rely on focus are programmatically updated focused=true/false
        "div[focused=\"false\"]": {
            "display": "none"
        },
        "input.mv": {
            "margin": "0",
            "width": "20px"
        },
        // hide paint/move buttons when in defocus mode
        "[focus=\"null\"] [value=\"paint\"], [focus=\"null\"] [value=\"move\"]": {
            "display": "none"
        },
        "label.layer:first-child > [value^=\"▲\"]": {
            "opacity": "0.3",
            "pointer-events": "none"
        },
        "label.layer:last-child > [value^=\"▼\"]": {
            "opacity": "0.3",
            "pointer-events": "none"
        },

        // hide the paint or move fieldset when its not needed
        "form[mode=\"move\"] fieldset[for=\"paint\"], form[mode=\"paint\"] fieldset[for=\"move\"]": {
            "display": "none"
        },
        // update is wrapped ein noscript
        // defocus is the top button of the focus fieldset
        "menu > [name=\"defocus\"], menu > [value=\"update\"]": {
            "width": "100%"
        },
        "menu > [name=\"defocus\"]": {
            "border": "3px solid #5e5e5e", 
            "border-bottom": "0",
            "padding": "1px",
            "position": "relative",
            "top": "5px"
        },

        // give the selected tab a look of continuity with the fieldset, tab-style
        "[mode=\"paint\"] [value=\"paint\"], [mode=\"move\"] [value=\"move\"]": {
            "border": "3px solid #5e5e5e", 
            "border-bottom": "0",
            "padding": "1px",
            "top": "5px"
        },
        // same thing for the other three buttons
        ".text [value=\"text\"], .embed [value=\"embed\"], .net [value=\"net\"]": {
            "border": "3px solid #5e5e5e", 
            "border-bottom": "0",
            "padding": "1px",
            "top": "5px"
        }
,        "fieldset": {
            "margin-bottom":"10px",

            "font-family": "monospace",
            "font-size":   "large",
            "font-weight": "bold",
            // from a "neumorphic" generator
            "background": "linear-gradient(145deg, #f0f0f0, #cacaca)",
            "box-shadow":  "13px 13px 26px #a1a1a1, -13px -13px 26px #ffffff",

            "border": "3px solid #5e5e5e",
            "padding": "2px"
        },
        "label, section":{
            "display":"flex",
            "width": "212px",
            "justify-content":"space-between",
            "white-space":"nowrap",
            "align-items":"center",
            // "margin-bottom":"5px"
            "padding": "2px" // decided I prefered all around padding to 5px margin
        },
        "label.title": {
            "display":"inline-block",
            "overflow":"hidden",
            "text-overflow": "ellipsis",
            "white-space": "nowrap"
        },
        "label > *, section > *": {
            "margin": "2px 4px"
        },
        "input[type=\"text\"], select": {
            "width":"60%"
        },
        "input[name=\"web\"], [name^=\"art\"]": {
            "width": "100%",
            "text-align": "center",
            "padding": "5px 0",
        },
        "input[type=\"radio\"]": {
            // in case I want to hide the bubbles themselves and apply other :checked stytles
            // "display":"none"
        },
        // no checkboxes at the moment...
        // "input[type=\"checkbox\"]": {
        //     "width":"20px","height":"20px"
        // },
        // labels that are neighbors of type radio?
        "input[type=\"radio\"] ~ label": {
            "font-size": "small"
        },

        "input[type=\"number\"]": {
            "width": "25%",
            "text-align":"center"
        },
        "input[type=\"range\"]": {
            "width": "100%",
            "position": "relative",
            "min-width": "0", // had to add this because all of a sudden my ranges were overflowing from my fieldsets, firefox only behavoir
            "z-index": "1" // for overlapping with color input
        },
        "input[type=\"color\"]": {
            "width": "100%",
            "padding": "0",
            "height": "30px"
        },
        "alphawrap": {
            "display": "block",
            "mask-image": "linear-gradient(to right, transparent, black)",
            "-webkit-mask-image": "linear-gradient(to right, transparent, black)",
            "margin-top": "-15px"
        },
        "textarea": {
            "min-width": "201px",
            "max-width": "201px",
            "min-height": "9em"
        }
    }
}