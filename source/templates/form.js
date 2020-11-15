module.exports = function(paramarray, options){
    return {"form": {
        "target": "frame",
        "action": "paramarray",
        "focus": "0",
        "mode": options.mode, // | paint | move -- this is a global setting that controls what click/drag tools are available in the iframe
        // focus turns each article into a button that changes which  
        "childNodes": [
        // a couple of hidden inputs to carry-over mode and focus ids so complete information is made on any submission
            {"input": {
                "name":"focus", "type":"hidden", "value": options.focus
            }},
            {"input": {
                "name":"mode", "type":"hidden", "value": options.mode
            }},
            // one 'focus' button
            {"menu": [
                {"input": {
                    "type":"submit",
                    "name": "mode",
                    "value": "focus",
                    "formtarget": "_self", // override 'frame'
                    "formaction": "form", // override 'paramarray'
                }},
                // focus fieldset
                {"fieldset": [
                    {"section": [
                        {"input": {
                            "type":"radio",
                            "name":"focus",
                            "value":"-1",
                            "id": "-1",
                            [ options.focus == "-1"  ? "checked" : "" ]: "" 
                        }},
                        {"label": {
                            "for":"-1",
                            "childNodes":[
                                "add article above"
                            ]
                        }},
                    ]},
                    ...paramarray.map((param, index) => (
                        {"section": [
                            {"input": {
                                "type":"radio",
                                "name":"focus",
                                "value": index,
                                "id": index, 
                                [ options.focus == index  ? "checked" : "" ]: "" 
                            }},
                            {"label": {
                                "for": index, 
                                "childNodes": [
                                    "article " + index
                                ]
                            }}
                        ]}
                    )),
                    {"section": [
                        {"input": {
                            "type":"radio",
                            "name":"focus",
                            "value": paramarray.length,
                            "id": paramarray.length,
                            [ options.focus == paramarray.length  ? "checked" : "" ]: "" 
                        }},
                        {[`label for="${paramarray.length}"`]:["add article below"]},
                    ]}
                    // // for each, create button using param.title for childnodes...
                    // {"input": {
                    //     "type":"submit",
                    // "name": "focus",
                    // "value": paramarray.length, // If focus is out of bounds (-1 or n+1) then a default object is appended...
                    //     // "selected": param.mode == "embed", // "true" or "false"
                    //     "formtarget": "_self", // override 'frame'
                    //     "formaction": "form", // override 'paramarray'
                    //     "childNodes": ["append layer"]
                    // }}
                ]},
                // paint button
                {"input": {
                    "type":"submit",
                    "name": "mode",
                    "value": "paint",
                    "formtarget": "_self", // override 'frame'
                    "formaction": "form", // override 'paramarray'
                }},
                // move button
                {"input": {
                    "type":"submit",
                    "name": "mode",
                    "value": "move",
                    "formtarget": "_self", // override 'frame'
                    "formaction": "form", // override 'paramarray'
                }}, 
                // paint fieldsets
                ...paramarray.map((param, n) => [
                    {"fieldset": {
                        "for": "paint",
                        "style": {"display": options.mode == "paint" && options.focus == n ? "initial": "none"},
                        "childNodes": [
                            {"label": [
                                "motif",
                                {"select": {
                                    "name": `motif-${n}`,
                                    // 'square', 'pyritohedron', 'p4octagon', 'honeycomb', 'doublesquares', 'alternatetriangles'
                                    "value": param.motif,
                                    "childNodes": [
                                        "square", 
                                        "pyritohedron",
                                        "p4octagon",
                                        "honeycomb", 
                                        "doublesquares",
                                        "alternatetriangles"
                                    ].map(motifname => (
                                        {"option": {
                                            "value": motifname,
                                            "childNodes": [motifname],
                                            [param.motif == motifname ? "selected": ""]: ""
                                        }}
                                    ))
                                }}
                            ]},
                            {"label": [
                                "shells", 
                                {"input":{
                                    "name": `shells-${n}`, "type":"number", "min":"1", "max": "50", "step":"1", "value": param.shells
                                }}
                            ]},
                            {"label": [
                                "strapwork (px)", 
                                {"input":{
                                    "name":`strapwork-${n}`,"type":"number","min":"0","max":"50","step":"1","value": param.strapwork
                                }}
                            ]},
                            {"label": [
                                "bitmask",
                                {"input": {
                                    "type": "number",
                                    "min": "0",
                                    "name": `bitmask-${n}`,
                                    "value": param.bitmask
                                }}
                                // draw the bitmask in binary somehow -- flow content with width / 16 so they wrap?
                            ]},
                            {"section": [ // how do I add checked to the appropriate radio? maybe don't have radios....
                                {"input": {"type":"radio", "name":`maskmode-${n}`, "value":"nested", "id":`nested-${n}`, [param.maskmode == "nested" ? "checked" : ""]: ""}},
                                {[`label for="nested-${n}"`]:["orbital"]},
                                {"input": {"type":"radio", "name":`maskmode-${n}`, "value":"flat", "id": `flat-${n}`, [param.maskmode == "flat" ? "checked" : ""]: ""}},
                                {[`label for="flat-${n}"`]:["elemental"]}
                            ]},
                            {"label": ["fill", {"input": {
                                "title":"Fill Opacity", 
                                "type":"range",
                                "max": "1",
                                "min": "0",
                                "step": "0.01",
                                "name":`--fillopacity-${n}`,
                                "value": param["--fillopacity"]
                            }}]},
                            {"alphawrap": [{"input": {
                                "title":"Fill Color",
                                "type":"color",
                                "name":`--fillcolor-${n}`,
                                "value": param["--fillcolor"]
                            }}]},
                            {"label": ["stroke", {"input": {
                                "title":"Stroke Opacity",
                                "type":"range",
                                "max": "1",
                                "min": "0",
                                "step": "0.01",
                                "name":`--strokeopacity-${n}`,
                                "value": param["--strokeopacity"]
                            }}]},
                            {"alphawrap": [{"input": {
                                "title":"Stroke Color",
                                "type":"color",
                                "name":`--strokecolor-${n}`,
                                "value":  param["--strokecolor"]
                            }}]},
                            {"label": [
                                "blur", 
                                {"input":{
                                    "name":`--blur-${n}`,"type":"range","min":"0","max": "10","step":"0.1","value": param['--blur']
                                }}
                            ]}
                    ]}},
                    {"fieldset": {
                        "style": {"display": options.mode == "move" && options.focus == n ? "initial": "none"},
                        "childNodes": [
                            {"label": [
                                "zoom", 
                                {"input":{
                                    "name":`--zoom-${n}`,"type":"number","min":"0.2","max": "3","step":"0.01","value": param["--zoom"]
                                }}
                            ]},
                            // 
                            {"label": [
                                "x steps", 
                                {"input":{
                                    "name":`--xstep-${n}`,"type":"number","step":"1","value": param["--xstep"]
                                }}
                            ]},
                            {"label": [
                                "y steps", 
                                {"input":{
                                    "name":`--ystep-${n}`,"type":"number","step":"1","value": param["--ystep"]
                                }}
                            ]},
                            // colors go here, SVG style settings
                            {"label": [
                                "x partial", 
                                {"input":{
                                    "name":`--xcent-${n}`,"type":"range","min":"0","max": "1","step":"0.01","value": param["--xcent"]
                                }}
                            ]},
                            {"label": [
                                "y partial", 
                                {"input":{
                                    "name":`--ycent-${n}`,"type":"range","min":"0","max": "1","step":"0.01","value": param["--ycent"]
                                }}
                            ]}
                    ]}},
                    {"div": {
                        "class": "tabs",
                        "style": {"display": n == options.focus ? "initial": "none"},
                        "childNodes": [
                            {"input": {
                                "name":`type-${n}`,
                                "type": "hidden", 
                                "value": param.type // jali || embed || text
                            }},
                            // menu[mode="text"]  [type="submit"][value="text"] -> style tab to show selected
                            // menu[mode="embed"] [type="submit"][value="embed"] -> style tab to show selected
                            // menu[mode="jali"]  [type="submit"][value="jali"] -> style tab to show selected
                            {"input": {
                                "name":`type-${n}`,
                                // "selected": param.type == "text", // "true" or "false"
                                "value": "text",
                                "type":"submit",
                                "formtarget": "_self", // override 'frame'
                                "formaction": "form", // override 'paramarray'
                                // "childNodes": ["text"]
                            }},
                            {"input": {
                                "name":`type-${n}`,
                                // "selected": param.type == "embed", // "true" or "false"
                                "value": "embed",
                                "type":"submit",
                                "formtarget": "_self", // override 'frame'
                                "formaction": "form", // override 'paramarray'
                                // "childNodes": ["embed"]
                            }},
                            {"input": {
                                "name":`type-${n}`,
                                // "selected": param.type === "jali", // "true" or "false"
                                "value": "net",
                                "type":"submit",
                                "formtarget": "_self", // override 'frame'
                                "formaction": "form", // override 'paramarray'
                                // "childNodes": ["jali"]
                            }}
                        ]
                    }},
                    {"fieldset": {
                        // text | embed | jālī ( જાળી )
                        "style": {"display": n == options.focus ? "initial": "none"},
                        "childNodes": [

                            ...(function(){
                                switch(param.type){
                                    case 'embed':
                                        return [{"label": [
                                            "url",
                                            {"input": {
                                                "type": "text", "name": `embedurl-${n}`, "value": param.embedurl
                                            }} 
                                        ]},
                                        {"section": [
                                            {"input": {
                                                "type":"radio",
                                                "name":`embedtag-${n}`,
                                                "value":"iframe",
                                                "id":`iframe-${n}`,
                                                [ param.embedtag === "iframe" ? "checked" : ""]: ""
                                            }},
                                            {"label":{
                                                "for":`iframe-${n}`,
                                                "childNodes": ["<iframe>"]
                                            }},
                                            {"input": {
                                                "type":"radio",
                                                "name":`embedtag-${n}`,
                                                "value":"video",
                                                "id": `video-${n}`,
                                                [ param.embedtag === "video" ? "checked" : ""]: ""
                                            }},
                                            {"label":{
                                                "for":`video-${n}`,
                                                "childNodes": ["<video>"]
                                            }},
                                            {"input": {
                                                "type":"radio",
                                                "name":`embedtag-${n}`,
                                                "value":"img",
                                                "id": `img-${n}`,
                                                [ param.embedtag === "img" ? "checked" : ""]: ""
                                            }},
                                            {"label":{
                                                "for":`img-${n}`,
                                                "childNodes": ["<img>"]
                                            }}
                                        ]},
                                        {"label": [
                                            "ifscale", 
                                            {"input":{
                                                "name":`--ifscale-${n}`,"type":"range","min":"1","max": "6","step":"0.1","value": param["--ifscale"]
                                            }}
                                        ]},
                                        {"label": [
                                            "ifx %", 
                                            {"input":{
                                                "name":`--ifxoffset-${n}`,"type":"range","min":"-100","max": "100","step":"1","value": param["ifxoffset"]
                                            }}
                                        ]},
                                        {"label": [
                                            "ify %", 
                                            {"input":{
                                                "name":`--ifyoffset-${n}`,"type":"range","min":"-100","max": "100","step":"1","value": param["ifyoffset"]
                                            }}
                                        ]}]
                                    case 'text':
                                        return [{"label": [
                                            {"textarea": {
                                                // would be cool if I can let you upload a txt file full of quotes
                                                // will need some of that javascript auto-scaling to find a size and margin that fills the space
                                                "name": `content-${n}`, "value": param.content
                                            }} 
                                        ]},
                                        {"label": [
                                            "color",
                                            {"input": {
                                                "title":"Text Opacity",
                                                "type":"range",
                                                "max": "1",
                                                "min": "0",
                                                "step": "0.01",
                                                "name":`--fontopacity-${n}`,
                                                "value": param["--fontopacity"]
                                            }}
                                        ]},
                                        {"alphawrap": [{"input": {
                                            "title":"Text Color",
                                            "type":"color",
                                            "name":`--fontcolor-${n}`,
                                            "value": param["--fontcolor"]
                                        }}]},
                                        {"label": [
                                            "size", 
                                            {"input":{
                                                "name":`--fontsize-${n}`,"type":"range","min":"1","max": "25","step":"1","value": param["--fontsize"]
                                            }}
                                        ]},
                                        {"label": [
                                            "margin", // maybe margin happens in percentage
                                            // replace this with "shape outside"...
                                            {"input":{
                                                "name":`--margin-${n}`,"type":"range","min":"0","max": "0.5","step":"0.05","value": param["--margin"]
                                            }}
                                        ]},
                                        // justify, top center bottom, left center right?
                                        {"label":[
                                            "sans",
                                            {"input": {
                                                "type":"range","name":`--MONO-${n}`,"min":"0","max":"1","step":"0.05","value": param["--MONO"]
                                            }},
                                            "mono"
                                        ]},
                                        {"label":[
                                            "linear",
                                            {"input": {
                                                "type":"range","name":`--CASL-${n}`,"min":"0","max":"1","step":"0.05","value": param["--CASL"]
                                            }},
                                            "casual"
                                        ]},
                                        {"label":[
                                            "light",
                                            {"input": {
                                                "type":"range","name":`--wght-${n}`,"min":"300","max":"1000","step":"20", "value": param["--wght"]
                                            }},
                                            "bold"
                                        ]},
                                        {"label":[
                                            "roman",
                                            {"input": {
                                                "style": {"direction": "rtl"}, // this horizontally flips the slider to that 0 is to the left and -15 is to the right
                                                "type": "range","name":`--slnt-${n}`,"min":"-15","max":"0","step":"0.25", "value": param["--slnt"]
                                            }}, 
                                        "italic"
                                        ]}
                                    ]
                                    // break // unreachable break since I'm returning
                                    case 'jali':
                                    default:
                                        return [{"label": [
                                            "x window", 
                                            {"input":{
                                                "name":`xwindow-${n}`,"type":"number","min":"1","step":"1","value": param.xwindow
                                            }}
                                        ]},
                                        {"label": [
                                            "y window", 
                                            {"input":{
                                                "name":`ywindow-${n}`,"type":"number","min":"1","step":"1","value": param.ywindow
                                            }}
                                        ]}]
                                        // for jali, being able to upload a background image and incoporating it into the jali would be great. Still have opportunity to spin images toward center...
                                } // close switch statement
                            })() // Immediately invoked
                        ]
                    }}
                ])
            ]}
        ]
    }}
}

