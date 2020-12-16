// each article, on pickup, use art.style.getPropertyValue("--xunit/yunit")
// this is the wallpaper width
// xunit * zoom, yunit * zoom
// and whenever the mouse position changes by some multiple of that
// apply that multiple to the form, which will recieve a change event and apply it
// after updating the form, have to fire an input event
// input.dispatchEvent(new Event('input'))
var root = document.querySelector('iframe')
// let form = document.querySelector('form')
var body = null
root.addEventListener('load', () => {
	body = root.contentDocument.body
})

var updatePos
var focusedArticle

// on mouse up, after recalculating the body, can scroll focusedarticle to view
// get focused article?



// extra settimeout because load fires when subreources are loaded, but I'm not convinced it waits til first paint
root.addEventListener('load', () => {
	// let { body, documentElement } = root.contentDocument
	// console.log({body, documentElement})

	body.addEventListener('mouseup', event => {
	  if(updatePos){
	  	recalcAll() // only recalulcate when an updatePos just existed
	  	updatePos = undefined;
	  }
	  root.removeEventListener('mousemove', handleMove); // this listener gets added to root during a article on mousedown
	})
	body.childNodes.forEach(article => {
		console.log("ARTICLE", article)
		article.firstChild.addEventListener('mousedown', event => {
			console.log("mousedown on article", article)
			updatePos = createUpdatePos(event.clientX, event.clientY, article)
			body.addEventListener('mousemove', handleMove)
		})
	})

	// first bug, embed doesnt work because pointer events none -- otherwise iframe doesn't interace. 
})

/* 
 *
 */
function handleMove(event){
	// I don't remember why I was checking for event.buttons
	// I guess as a stopback in case mousemove fires without me holding the mouse down.
	if(event.buttons && updatePos){
		// event.preventDefault();
		updatePos(event.clientX, event.clientY, event.shiftKey);
	}
	return false;
}

//takes a node, returns a node.
// getParentNode node, string => node
// function findArticle(target){
//   //traverse up the tree until you find a leaf, or maybe no leaf is found, exit in that case too. return whatever was found.
//   while(target && target.tagName !== "article"){
//     target = target.parentElement;
//   }
//   return target;
// }

// so event.target is going ot be section, and all my cssvars on section.parentNode.style.cssVars
// if I want to use getCSSVars on serverside, I can just add a getPropertyValue getter on the object prototype
// Object.prototype.getPropertyValue(key){
// 	return this[key]
// }

function getCSSVars(article){
	return {
		"xunit":   Number(article.style.getPropertyValue("--xunit")),
		"yunit":   Number(article.style.getPropertyValue("--yunit")),
		"xcent":   Number(article.style.getPropertyValue("--xcent")),
		"ycent":   Number(article.style.getPropertyValue("--ycent")),
		"xstep":   Number(article.style.getPropertyValue("--xstep")),
		"ystep":   Number(article.style.getPropertyValue("--ystep")),
		"zoom":    Number(article.style.getPropertyValue("--zoom")),
		"left":    Number(article.style.getPropertyValue("--left")),
		"width":   Number(article.style.getPropertyValue("--width")),
		"top":     Number(article.style.getPropertyValue("--top")),
		"height":  Number(article.style.getPropertyValue("--height")),
	}
}

function destroyUpdatePos(){
	body.removeEventListener('mousemove', updatepos)
}

function createUpdatePos(clientX, clientY, article){
	//this is a function creator. When a mouse/touchdown event occurs, the initial position 
	//is enclosed in a function, those variables are updated on mousemove and will persist
	//as long as the function exists. On touch/mouseup events, the function is destroyed (the variable it was assigned to is reassigned null)
	var theLastX = clientX;
	var theLastY = clientY;

  	let index = article.firstChild.id
  	// click focus on whatever radio button is up there... it won't reload the page, no problem if already selected
  	form.querySelector(`[type="radio"][name="focus"][id="${index}"]`).click() // surely it will exist, right?


	var globalzoom = root.contentDocument.body.style.getPropertyValue("--zoomg")

	var props = getCSSVars(article)

  	return function(clientX, clientY, shift = false){
  	// return function({clientX, clientY, shift, buttons}){
  		// if(!buttons) destroyUpdatePos() // if no buttons, this function should've been destroy already
		var movementX = clientX - theLastX
		var movementY = -(clientY - theLastY)
		// compare how far I am from thelastx, overwrite the lastX once
		// I'm measuring how far I've moved since I first clicked, and applying that distance to the position of the article when it was first clicked
		let xunitadj = props.xunit * props.zoom * globalzoom
		let yunitadj = props.yunit * props.zoom * globalzoom

		let dxstep = Math.trunc(movementX / xunitadj)
		let dystep = Math.trunc(movementY / yunitadj)

		// now find the amount that can't be accounted for in numbers of wallpaper units
		// gives a ratio 0-1 of how much of an xunit we've moved -- will roll over when its applied dxstep++, dystep++/--
		let dxcent = (movementX % xunitadj) / xunitadj
		let dycent = (movementY % yunitadj) / yunitadj

	  	if(shift){
	      	// will be 0 or 1 if current xcent plus change in xcent is greater than one
	        let totalxcent = dxcent + props.xcent
	        let totalycent = dycent + props.ycent

	        if(totalxcent > 1){
	        	dxstep++
	        	dxcent = totalxcent - 1
	        } else if(totalxcent < 0){
	        	dxstep--
	        	dxcent = totalxcent + 1
	        } else {
	        	dxcent = totalxcent
	        }

	        if(totalycent > 1){
	        	dystep++
	        	dycent = totalycent - 1
	        } else if(totalycent < 0){
	        	dystep--
	        	dycent = totalycent + 1
	        } else {
	        	dycent = totalycent
	        }
			article.style.setProperty("--xcent", dxcent.toFixed(2))
			article.style.setProperty("--ycent", dycent.toFixed(2))
		    form.querySelector(`[name="--xcent-${index}"]`).value = dxcent.toFixed(2)
		    form.querySelector(`[name="--ycent-${index}"]`).value = dycent.toFixed(2)
	  	}
		article.style.setProperty("--xstep", (props.xstep + dxstep).toFixed(0))
		article.style.setProperty("--ystep", (props.ystep + dystep).toFixed(0))
		form.querySelector(`[name="--xstep-${index}"]`).value = (props.xstep + dxstep).toFixed(0)
		form.querySelector(`[name="--ystep-${index}"]`).value = (props.ystep + dystep).toFixed(0)

		// calcMag(article)
		// recalcAll(article)
	}
}

function recalcAll(){

	// body.style.setProperty("--xmag", 0)	
	// body.style.setProperty("--ymag", 0)	
	// body.childNodes.forEach(art => calcMag(art))

	let {xmag, ymag} = Array
		.from(body.children)
		.filter(article => article.getAttribute("type") != "net")
		.reduce(reduceMagnitude, {xmag: 0, ymag: 0})

	body.style.setProperty("--xmag", xmag)	
	body.style.setProperty("--ymag", ymag)
	// If I had my ctxify addons https://github.com/jazzyjackson/ctxify/blob/master/ctxify.browser.js
	// Object.assign(body.props.style, {xmag, ymag})
	// article.scrollIntoView()
}

// could filture array first, querySelectorAll('article[type=embed], article[type=text])
// could have a few functions that do the same 
function reduceMagnitude({xmag, ymag}, article){
	if(article.getAttribute("type") == "net"){
		return {xmag, ymag} // skip nets
	}

	let props = getCSSVars(article)
  	let bboxtop = props.top
        -   props.zoom
        *   props.yunit
        *   (props.ystep + props.ycent)

    let bboxleft = props.left // shouldn't I multiply everything by zoom?
        -   props.zoom
        *   props.xunit
        *   (props.xstep + props.xcent)

    return {
    	xmag: Math.max(
            xmag, 
            Math.abs(bboxleft),
            Math.abs(
            	bboxleft
                + props.width
                * props.zoom
            )
        ),
		ymag: Math.max(
            ymag, 
            Math.abs(bboxtop),
            Math.abs(
            	bboxtop
                + props.height
                * props.zoom
            )
        )
    }

}

function calcMag(article){

	// magnitude only cares about embeds and texts
	if(article.getAttribute("type") == "net") return null

	let body = root.contentDocument.body

	let props = getCSSVars(article)
	var thismagx = Number(body.style.getPropertyValue("--xmag"))
	var thismagy = Number(body.style.getPropertyValue("--ymag"))
	
	// set xmag and ymag

  	let bboxtop = props.top
        -   props.zoom
        *   props.yunit
        *   (props.ystep + props.ycent)

    let bboxleft = props.left
        -   props.zoom
        *   props.xunit
        *   (props.xstep + props.xcent)

	body.style.setProperty(
		"--xmag", 
		Math.max(
            thismagx || null, 
            Math.abs(bboxleft),
            Math.abs(
            	bboxleft
                + props.width
                * props.zoom
            )
        )
	)

	body.style.setProperty(
    	"--ymag",
    	Math.max(
            thismagy || null, 
            Math.abs(bboxtop),
            Math.abs(
            	bboxtop
                + props.height
                * props.zoom
            )
        )
    )
}