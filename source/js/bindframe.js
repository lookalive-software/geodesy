let form = document.querySelector('form')
let frame = document.querySelector('iframe')
let defocus = document.querySelector('input[name="defocus"]')

console.log(defocus)

form.submit()

// the buffer sits underneath the frame
// before allowing the submission to reload the frame, the innerhtml of the document is copied to the buffer
// such that a persistent iframe can exist while the foreground flashed on reload

// the submit callback will remove this tag to hide the iframe, only works in firefox, otherwise I just have to reload after 250ms

let lasttimeout = 0

// document.querySelectorAll('textarea').forEach(textarea => {
//     // textarea can have a target
//     // reach into the frame
//     frame.contentDocument.body.querySelector()
// })

document.querySelectorAll('input, select, textarea').forEach(input => {
    input.addEventListener('input', event => {
        let key = event.target.name


        let hyphenpos = key.lastIndexOf('-')
        let varname = ~hyphenpos ? key.slice(0, hyphenpos) : key
        let artindex = ~hyphenpos ? key.slice(hyphenpos + 1) : null

        console.log("VARNAME", varname)
        // console.log(key, varname, event.target.value, artindex)
        // check if event.target.name ends in a digit
        // then instead of writing to the body, write the style vars directly to iframe.contentDocument.children[index].style.setProperty(prefix, value)
        if(varname.indexOf('--') === 0){
            //todo check if contentdocument is null
            // this first child needs to be updated to '
            frame
                .contentDocument
                .body
                .children[artindex]
                .style
                .setProperty(varname, event.target.value)
        } else switch(varname){
            case 'content': 
                try {
                    frame
                        .contentDocument
                        .body
                        .children[artindex]
                        .querySelector('span')
                        .textContent = event.target.value
                } catch(e) {
                    alert("couldn't find a span for " + artindex + "!" )
                }
                // set text
            break
            case 'focus':
                console.log("clicking the defocus button!")
                setTimeout(defocus.click()) // should submit the form
            break
            default: 
                clearInterval(lasttimeout) // cancel timeout that would have set class to active
                // debounce
                lasttimeout = setTimeout(()=>{
                // basically this is submit the form in 100ms unless the form is submitted again, apply the same delay to that one.
                    form.submit()
                }, 100)
                console.log("submitting " + event.target.name)
        }
    })
})