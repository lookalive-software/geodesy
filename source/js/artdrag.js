// each article, on pickup, use art.style.getPropertyValue("--xunit/yunit")
// this is the wallpaper width
// xunit * zoom, yunit * zoom
// and whenever the mouse position changes by some multiple of that
// apply that multiple to the form, which will recieve a change event and apply it
// after updating the form, have to fire an input event
// input.dispatchEvent(new Event('input'))
var root = document.querySelector('iframe')
// let form = document.querySelector('form')

var updatePos

// extra settimeout because load fires when subreources are loaded, but I'm not convinced it waits til first paint
root.addEventListener('load', () => {
	let { body, documentElement } = root.contentDocument
	console.log({body, documentElement})

	body.addEventListener('mouseup', event => {
	  if(updatePos) updatePos = undefined;
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
	event.preventDefault()
	// I don't remember why I was checking for event.buttons
	// I guess as a stopback in case mousemove fires without me holding the mouse down.
	if(event.buttons && updatePos){
		event.preventDefault();
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


function createUpdatePos(clientX, clientY, article){
	//this is a function creator. When a mouse/touchdown event occurs, the initial position 
	//is enclosed in a function, those variables are updated on mousemove and will persist
	//as long as the function exists. On touch/mouseup events, the function is destroyed (the variable it was assigned to is reassigned null)
	var theLastX = clientX;
	var theLastY = clientY;

  	let index = article.firstChild.id


	var globalzoom = root.contentDocument.body.style.getPropertyValue("--zoomg")

	var props = {
		"xunit": Number(article.style.getPropertyValue("--xunit")),
		"yunit": Number(article.style.getPropertyValue("--yunit")),
		"xcent": Number(article.style.getPropertyValue("--xcent")),
		"ycent": Number(article.style.getPropertyValue("--ycent")),
		"xstep": Number(article.style.getPropertyValue("--xstep")),
		"ystep": Number(article.style.getPropertyValue("--ystep")),
		"zoom":  Number(article.style.getPropertyValue("--zoom")),
	}

  	var enclosedUpdatePos = function(clientX, clientY, shift = false){
      var movementX = clientX - theLastX;
      var movementY = clientY - theLastY;
      // overwrite enclosed variables
      // theLastX = clientX;
      // theLastY = clientY;

      // compare how far I am from thelastx, overwrite the lastX once

      // I'm measuring how far I've moved since I first clicked, and applying that distance to the position of the article when it was first clicked
      let xunitadj = props.xunit * props.zoom * globalzoom
      let yunitadj = props.yunit * props.zoom * globalzoom

      let dxstep = Math.trunc(movementX / xunitadj)
      let dystep = Math.trunc(movementY / yunitadj)

      // now find the amount that can't be accounted for in numbers of wallpaper units
      // gives a ratio 0-1 of how much of an xunit we've moved -- will roll over when its applied dxstep++, dystep++/--
      let dxcent = (movementX % xunitadj) / xunitadj
      let dycent = (movementY % yunitadj) / -yunitadj

      console.log({dxcent, dycent})

  	if(shift){
      	// will be 0 or 1 if current xcent plus change in xcent is greater than one
      	dxstep += Math.trunc(dxcent + props.xcent) // if dxcent is negative, this will add a negative number to step...
      	dystep += Math.trunc(dycent + props.ycent)

      	dxcent = dxcent % 1
      	dycent = (dycent % 1) // invert

      	if(dxcent < 0){
      		dxcent = 1 + dxcent
      	}
      	if(dycent < 0){
      		dycent = 1 + dycent
      	}

		article.style.setProperty("--xcent", dxcent.toPrecision(5))
		article.style.setProperty("--ycent", dycent.toPrecision(5))
	    form.querySelector(`[name="--xcent-${index}"]`).value = dxcent.toPrecision(5)
	    form.querySelector(`[name="--ycent-${index}"]`).value = dycent.toPrecision(5)
  	}
      // would have to store 

      // console.log({dxstep, dystep, dxcent, dycent})

    article.style.setProperty("--xstep", (props.xstep + dxstep).toPrecision(5))
    article.style.setProperty("--ystep", (props.ystep - dystep).toPrecision(5))
    form.querySelector(`[name="--xstep-${index}"]`).value = (props.xstep + dxstep).toPrecision(5)
    form.querySelector(`[name="--ystep-${index}"]`).value = (props.ystep - dystep).toPrecision(5)

  }
  return enclosedUpdatePos;
};


