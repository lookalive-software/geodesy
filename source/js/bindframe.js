let form = document.querySelector('form')
let frame = document.querySelector('iframe')
let defocus = document.querySelector('input[name="defocus"]')

let hiddenmode = document.querySelector('input[type="hidden"][name="mode"]')
let hiddenfocus = document.querySelector('input[type="hidden"][name="focus"]')

// another start up function to call would be to grab location.hash 
// and make sure that the zoom and body position
// instead of 

form.submit()

// the buffer sits underneath the frame
// before allowing the submission to reload the frame, the innerhtml of the document is copied to the buffer
// such that a persistent iframe can exist while the foreground flashed on reload

// the submit callback will remove this tag to hide the iframe, only works in firefox, otherwise I just have to reload after 250ms

let lasttimeout = 0

form.addEventListener('submit', event => {
    console.log("SUBMIT", event)
    // event.submitter was added to chrome in version 81
    // not available in safari or edge, so skip, will just have to do a hard reload
    if(!event.submitter) return null
    switch(event.submitter.name){
        case "mode":
            event.preventDefault()
            form.setAttribute('mode', event.submitter.value ) // switch modes
            hiddenmode.setAttribute('value',  event.submitter.value) // set value 
            return false // to ignore form submission 
        // 
        case "defocus":
            event.preventDefault()
            // figure out which radio is now checked
            let newfocus = document.querySelector('[type="radio"][name="focus"]:checked').value
            form.setAttribute("focus", newfocus) // 
            hiddenfocus.setAttribute("value", newfocus) // sets the value on the hidden form that gets submitted
            // actually why do I have a hiddenfocus? If the server builds the radiobuttons and checks one, isn't that my focus that gets submitted?
            // 
            // going to run through this twice, once for direct descendents from a menu
            // 
            document.querySelectorAll('div[focused]')
                    .forEach((div, index) => div.setAttribute("focused", newfocus == index)) // true or false
            return false // to ignore form submission 
    }
})

document.querySelectorAll('input, select, textarea').forEach(input => {
    input.addEventListener('change', event => {
        console.log("CHANGE", event.target.name)
    })
    input.addEventListener('input', event => {
        let key = event.target.name
        // nope this doesn't let me catch my --zoomg, which doesn't have the param child #, it's global.
        // replace with regex...
        let [varname] = key.match(/([-]{0,2}\w+)/) || []
        let [index] = key.match(/(?<=-)\d+$/) || []

        console.log("VARNAME", varname)
        console.log("index", index)
        // console.log(key, varname, event.target.value, index)
        // check if event.target.name ends in a digit
        // then instead of writing to the body, write the style vars directly to iframe.contentDocument.children[index].style.setProperty(prefix, value)
        if(varname.indexOf('--') === 0 && index){
            //todo check if contentdocument is null
            // this first child needs to be updated to '
            frame
                .contentDocument
                .body
                .children[index]
                .style
                .setProperty(varname, event.target.value)
        } else switch(varname){
            case '--zoomg':
                console.log("ZOOMG")
                frame
                    .contentDocument
                    .body
                    .style
                    .setProperty(varname, event.target.value)
            break
            case 'content': 
                try {
                    frame
                        .contentDocument
                        .body
                        .children[index]
                        .querySelector('span')
                        .textContent = event.target.value
                } catch(e) {
                    alert("couldn't find a span for " + index + "!" )
                }
                // set text
            break
            case 'web':
                // update the URL, send a POST query to the new address
                // all it takes to fork is to change the name -- could provide a little semver form so that you can do version bumps -- before you change something, change the name, you can always navigate back to the canonical name if you like the changes
                // but if I know I'm changing the name, maybe this address is just another pointer to the same history...
                // or I could at least communicate "forked from history $md5"
            break
            case 'art':
                // Ok, an article was renamed.
                // dig into the frame to setattribute to the title
                // and grab the nth radio button off the focus form and update its innertext
                // the numerical number is used to actually sort the layers
                // the art-title is just cosmetic for the form, and used as the title in html

            case 'focus':
                // when you click a radio button, name is focus -- gonna submit the form
                // submit will be caught
                console.log("clicking the defocus button!")
                setTimeout(defocus.click()) // should submit the form // if the focus changes, click defocus?
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