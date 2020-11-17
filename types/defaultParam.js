module.exports = Object.freeze({
    // my actual fallback, well this is like the old idea of a home config file
    // but sure I'll accept a type-checked JSON file 
        // fieldset for=paint
        "motif": "honeycomb", // || square, pyritohedron, p4octagon, doublesquares
        "shells": 5, // || 1 50 1
        "strapwork": 10, // 0 50 1
        "bitmask": 0, // some sum of binary vector, no max. must be int I guess.
        "maskmode": "flat", // || "nested"
        "--fillopacity": 1,
        "--fillcolor": "#ffffff",
        "--strokeopacity": 1,
        "--strokecolor": "#000000",
        "--blur": 0,
        // fieldset for=move
        "--zoom": 1, // 0.2 < 0.01x < 3
        "--xstep": 0, // -Inf < 1x < Inf -- multiplies the wallpaper shift to move the pattern
        "--ystep": 0, // -Inf < 1x < Inf
        "--xcent": 0, // 0 < 0.01x < 1 -- determines partial offset, between alignments
        "--ycent": 0, // 0 < 0.01x < 1
        // modal tabs
        "type": "net", // text || embed
        // case embed
        "embedurl": "",
        "embedtag": "iframe", // video || img
        "--ifscale": 1, // 
        "--ifxoffset": 1, // 0 < 0.01 < 1
        "--ifyoffset": 1, // 0 < 0.01 < 1
        // case text
        "content": "", // lorem ipsum? programmable quote generator, use books of sentences, choose()
        "--fontopacity": 1, // 0 < 0.01 < 1
        "--fontcolor": "#000000", // 000 -> fff
            // line height ? 0em to 4em?
        "--fontsize": 10, // 1 < 1x < 25
        "--margin": 0.1, // 0 < 0.05x < 0.5
        "--MONO": 0, // 0 < 0.05x < 1 -- 0 is sans, 1 is monospace
        "--CASL": 0.5, //  0 < 0.05x < 1 -- 0 is times roman 1 is comic sans
        "--wght": 500, // 300 < 20x < 1000
        "--slnt": -5, // -15 < 0.25x < 0 -- -15 is italic, 0 is no slant
        // case jali
        "xwindow": 1, // 1 < 1x < Inf
        "ywindow": 1, // 1 < 1x < Inf
    })