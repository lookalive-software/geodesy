module.exports = {
    "style": {
        "body": {
            "box-sizing":"border-box",
            "margin": "0",
            "padding": "0",
            "overflow":"hidden"
        },
        "iframe": {
            "width":"100%",
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
        },

        "menu": {
            // "padding-left": "20px",
            "width": "200px",
            "margin": "0 auto"
            // "border-radius":"8px",
            // "border":"2px solid rgba(0,0,0,0.2)",
        },
        // this will be the tab button
        "menu > [name=\"defocus\"], menu > [value=\"update\"]": {
            "width": "100%"
        },
        "menu > [name=\"mode\"]": {
            "width": "50%",
            "position": "relative" // stacking order hack to overlap shadow
        },
        "menu [name^=\"type\"]": {
            "width": "calc(100% / 3)",
            "position": "relative"
        },
        "div.hide": {
            "display": "none"
        },
        // hide the paint or move fieldset when its not needed
        "form[mode=\"move\"] fieldset[for=\"paint\"], form[mode=\"paint\"] fieldset[for=\"move\"]": {
            "display": "none"
        },
        // give the selected tab a look of continuity with the fieldset, tab-style
        "[mode=\"paint\"] [value=\"paint\"], [mode=\"move\"] [value=\"move\"]": {
            "border-bottom": "0",
            "top": "3px"
        },
        // hide paint/move buttons when in defocus mode
        "[focus=\"null\"] [value=\"paint\"], [focus=\"null\"] [value=\"move\"]": {
            "display": "none"
        },
        // same thing for the other three buttons
        ".text [value=\"text\"], .embed [value=\"embed\"], .net [value=\"net\"]": {
            "border-bottom": "0",
            "top": "3px"
        },

        "fieldset": {
            "margin-bottom":"10px",

            "display":"flex",
            "flex-direction":"column",
            // "justify-content":"space-evenly",

            "font-family": "monospace",
            "font-size":   "large",
            "font-weight": "bold",
            // from a "neumorphic" generator
            "background": "linear-gradient(145deg, #f0f0f0, #cacaca)",
            "box-shadow":  "13px 13px 26px #a1a1a1, -13px -13px 26px #ffffff"
        },

        // except for 
        "label, section":{
            "display":"flex",
            "justify-content":"space-between",
            "white-space":"nowrap",
            "align-items":"center",
            "margin-bottom":"5px"
        },
        // "#linearpaint, #drawerase": {
        //     "justify-content":"center"
        // },

        "label > *, section > *": {
            "margin": "2px 4px"
        },
        "input[type=\"text\"], select": {
            "width":"60%"
        },
        "input[type=\"radio\"]": {
            // "display":"none"
        },
        "input[type=\"checkbox\"]": {
            "width":"20px","height":"20px"
        },
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
            "z-index": "1" // for overlapping with color input
            // "text-align":"center"
        },
        "input[type=\"color\"]": {
            "width": "100%",
            "padding": "0",
            "height": "30px"
        },
        "[name^=\"fillcolor\"]":{
            "right":"75px",
            "bottom": "15px"
        },
        "[name^=\"strokecolor\"]":{
            "left":"75px",
            "top": "15px"
        },
        "alphawrap": {
            "display": "block",
            "mask-image": "linear-gradient(to right, transparent, black)",
            "-webkit-mask-image": "linear-gradient(to right, transparent, black)",
            "margin-top": "-15px"
        }
    }
}