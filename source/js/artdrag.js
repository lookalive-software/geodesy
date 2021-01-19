// each article, on pickup, use art.style.getPropertyValue("--xunit/yunit")
// this is the wallpaper width
// xunit * zoom, yunit * zoom
// and whenever the mouse position changes by some multiple of that
// apply that multiple to the form, which will recieve a change event and apply it
// after updating the form, have to fire an input event
// input.dispatchEvent(new Event('input'))
var root = document.querySelector('iframe')
// let form = document.querySelector('form')
var body
var update

// on mouse up, after recalculating the body, can scroll focusedarticle to view
// get focused article? set focusedArticle on createUpdatePos


// two conditions for destroying 

// I push an update to the form, but I need a listener on the form as well, whenever an article is moved, recalc the body and scrollintoview


// extra settimeout because load fires when subreources are loaded, but I'm not convinced it waits til first paint
root.addEventListener('load', () => {
	body = root.contentDocument.body // should exist by now!
	body.addEventListener('mouseup', destroyUpdate)
	body.childNodes.forEach(article => {
		// I'm going to make the article the this 		
		article.firstChild.addEventListener('mousedown', createUpdate.bind(article))
	})

	// first bug, embed doesnt work because pointer events none -- otherwise iframe doesn't interace. 
})

/* 
 * if mouseup happens outside the window (common when dragging over the edge), I have to catch it next time handlemove 
 */
function handleMove(event){
	if(event.buttons){
		update(event);
	} else {
		destroyUpdate()
	}
	return false
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

function destroyUpdate(){
	if(!update){ return console.error("DestoryUpdate was called twice?")}
	body.removeEventListener('mousemove', handleMove)
	update = null
	recalcAll()
}

// 'this' is the article
function createUpdate({clientX, clientY}){
	// I'm trying to avoid calling a listener on every mousemove, so I'm making sure to add and remove the persistent function handleMove
	// the function 'update' may be overwritten at any time, so could be a source of listener leaks where I just keep attaching new listeners
	// instead there is only ever one mousemove handler at a time, and only one update handler at a time
	// the handler and the update should be nullified either by mousemove with no buttons, or a mouseup on the document.
	// at that point, the recalc will be called.
	// before any mousedown event that creates a new update function, 
	if(update) return console.error("an update was overwritten without first being destroyed")
	console.log("CREATING UPDATE", this)
	// adding and removing 
	body.addEventListener('mousemove', handleMove)

	//this is a function creator. When a mouse/touchdown event occurs, the initial position 
	//is enclosed in a function, those variables are updated on mousemove and will persist
	//as long as the function exists. On touch/mouseup events, the function is destroyed (the variable it was assigned to is reassigned null)
	var theLastX = clientX;
	var theLastY = clientY;
	// could also ask, indexOf
	let focused = this.firstChild.id // this becomes global so that destroyUpdatePos knows who to scrollinto after recalculating...

  	// click focus on whatever radio button is up there... it won't reload the page, no problem if already selected
  	form.querySelector(`[type="radio"][name="focus"][id="${focused}"]`).click() // surely it will exist, right?
  	// clicking this scrolls into view too, 

	var globalzoom = body.style.getPropertyValue("--zoomg")
	var props = getCSSVars(this)

	// this should continue pointing at the current context
	// global update is called on mousemove

  	update = ({clientX, clientY, shiftKey}) => {

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

	  	if(shiftKey){
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
			this.style.setProperty("--xcent", dxcent.toFixed(2))
			this.style.setProperty("--ycent", dycent.toFixed(2))
		    form.querySelector(`[name="--xcent-${focused}"]`).value = dxcent.toFixed(2)
		    form.querySelector(`[name="--ycent-${focused}"]`).value = dycent.toFixed(2)
		  }
		// only update the step if article type is not net
		// could maybe use a couple functions 'update step' 'update cent'
		if(this.getAttribute('type') == 'net') return null
		this.style.setProperty("--xstep", (props.xstep + dxstep).toFixed(0))
		this.style.setProperty("--ystep", (props.ystep + dystep).toFixed(0))
		form.querySelector(`[name="--xstep-${focused}"]`).value = (props.xstep + dxstep).toFixed(0)
		form.querySelector(`[name="--ystep-${focused}"]`).value = (props.ystep + dystep).toFixed(0)
	}
}

function recalcAll(){
	// should also call when xystep / xycent on input...
	// this also relies on the focused var to stay correct...
	// well it gets updated whenever mousedown on a section, and then forces the form to reflect that
	// but what about when I change the form? when I'm moving an element by form, and calling recalcAll, I need to know its going to scroll into view based on the var "focused"

	let {xmag, ymag} = Array
		.from(body.children)
		.filter(article => article.getAttribute("type") != "net")
		.reduce(reduceMagnitude, {xmag: 0, ymag: 0})

	body.style.setProperty("--xmag", xmag)	
	body.style.setProperty("--ymag", ymag)
	// If I had my ctxify addons https://github.com/jazzyjackson/ctxify/blob/master/ctxify.browser.js
	// Object.assign(body.props.style, {xmag, ymag})
	// hiddenfocus should have been updated 
	console.log("scrolling to focused item", hiddenfocus.value)
	setTimeout(()=>{
		body
			.children[hiddenfocus.value]
			.firstChild
	        .scrollIntoView()
	}, 110) // 100ms is also my transition for body width, so wait for the body to expand before scrolling.

}

// could filture array first, querySelectorAll('article[type=embed], article[type=text])
// could have a few functions that do the same 
function reduceMagnitude({xmag, ymag}, article){
	if(article.getAttribute("type") == "net"){
		return {xmag, ymag} // skip nets
	}

	let props = getCSSVars(article)
  	let bboxtop = (props.top - (props.yunit * (props.ystep + props.ycent))) * props.zoom
	let bboxleft = (props.left + (props.xunit * (props.xstep + props.xcent))) * props.zoom
  	// let bboxtop = props.top
    //     -   props.zoom
    //     *   props.yunit
    //     *   (props.ystep + props.ycent)

    // let bboxleft = props.left // shouldn't I multiply everything by zoom?
    //     -   props.zoom
    //     *   props.xunit
    //     *   (props.xstep + props.xcent)

    return {
    	xmag: Math.max(
            xmag || 0, 
            Math.abs(bboxleft),
            Math.abs(bboxleft + (props.width * props.zoom))
        ),
		ymag: Math.max(
            ymag || 0, 
            Math.abs(bboxtop),
            Math.abs(bboxtop + (props.height * props.zoom))
        )
    }

}