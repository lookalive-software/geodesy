exports.formstyle = () => ({
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
        "form#formlayers input[type=\"radio\"]:checked ~ label ": {
            "background":"rgba(100,100,255,0.3)"
        },
        // "form > button":{
        //     "border-radius": "8px",
        //     "padding": "8px 0",
        //     "width": "90%",
        //     "margin-top":"auto"
        // },
        // "#formprops > input:first-child": {
        //     "width":"90%",
        //     "font-size":"medium",
        //     "font-weight":"bold",
        //     "text-align":"center",
        //     "margin-bottom":"15px",
        //     "background": "transparent",
        //     "border":"none",
        //     "border-bottom":"2px solid black"
        // },
        "menu": {
            "padding-left": "20px",
            "width": "200px"
        },
        "fieldset": {
            "margin-bottom":"10px",
            "border-radius":"8px",
            "display":"flex",
            "flex-direction":"column",
            "justify-content":"space-evenly",

            "font-family":"monospace",
            "font-size":"large",
            "font-weight":"bold",
            // from a "neumorphic" generator
            "background": "linear-gradient(145deg, #f0f0f0, #cacaca)",
            "box-shadow":  "13px 13px 26px #a1a1a1, -13px -13px 26px #ffffff"
        },
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
            "margin": "0 5px"
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
            "width":"25%",
            "text-align":"center"
        },
        "input[type=\"range\"]": {
            "width":"100%",
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
        "summary":{
            "height":"1em"
        },
        "summary > legend":{
            "position":"relative",
            "top":"-0.9em",
            "left":"1em"
        },
        "alphawrap": {
            "display": "block",
            "mask-image": "linear-gradient(to right, transparent, black)",
            "-webkit-mask-image": "linear-gradient(to right, transparent, black)",
            "margin-top": "-15px"
        },
    }
})