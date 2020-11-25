How to do push history? Need a function that scans over the whole form and assembles a query string.
grab all inputs, name + value right? figure out which radio is checked, if a checkbox is checked...

0.6.0
In focus mode, the rest of the fieldsetes are hidden until you choose a focused article
The bottom half of the menu (the singular menu) has a title-header, a duplicate and delete button

The focus mode is set to defocus -- to show none of the local-fieldsets, 
SO there is a hidden radio button, focus value null. This way none of the local fieldsets will display.

Incorporate xstep xcent etc into position of each article

0.6.1
I don't need the 'checked' ternarys on the 'add above' and 'add below' radios
Just need to be able to deselect all the others. Any change will submit the form,
falling back to whatever paint/move mode you were in, but now reflecting the newly focused article

dupe-6 value = duplicate
zero-6 value = collapse

I think the iframe was just so I didn't lose form state when I reloaded the page
But now that the form is generated from querystring, I think I can paint the form in the same context as the articles, what is the iframe doing for me otherwise?

Make sure pointer events are disabled until the iframe accepts them, the frame should block everything

0.7.0

Good control over push history -- come up with a term rewrite algorithm, and have a general debounce function that calls a callback once an argument stays the same for 500ms etc

So you don't have to have called remote to have your URL updated -- duplicate or crunch will also have to term-rewrite the array on serverside

Add article rotation, line height, maybe skew (you could even have buttons to enable further forms... so 'add skew' adds some range controls, but they could be disabled and dropped) -- skew should theoretically let me lay things down in 3D a bit

Skew could be paired with selecting a symmetry: octahedral, tetrahedral, dodecahedral, for rotating polygons and planes. 

1.0.0
in focus mode, allow me to create a new article anywhere on the screen
    The wallpapers may fill the screen, but they only accept pointer events within the polygon-sections
can paint and click and drag

1.1.0

can drag files onto the field 

2.0

Hyperdrive is just a distributed replication system -- So you can boot up as many IP addresses or domains and have them all point to each other as a way to keep your files stored, as long as the network is running...


Should be able to serve a few users off a raspberry pi -- keep the SVGs 
It would help if I could cache the SVG structure and be able to 
So the hash would refer to the geometric configuration, and that's all that would be saved on disk / kept in memory -- well thats a trade off, I'd want to keep the SVG globjects in memory to quickly replace the style attributes (stroke width...) and compress it on the fly to save bandwidth, that's a trade off with cpu overhead

So this is all towards the goal of creating a media-layout framework that is flexible enough for 2D + 3D interfaces, so we can create unique, distinctive spaces to keep data-compositions. 

crystollographic grid for memorable data-compositions



How can I turn a point group into a NURB surfaces so that they deform or average into more biologic forms
Like Hunderwasser said, to start molding the architecture

// if you've never seen it before, it might as well be magic
// dialing up dimensions is just making room for more unique shadows
// the more complex the polyhedra, the more faces
// even by having the honeycomb in the first place you get a virtually 

// fourier transform soundwave -> font settings : the 'entropy' of the signal is related to weight
// A very pure or whispery / hf voice occupies little of the harmonic axis. bias towards lower voice.
// Basically a measure of richness vs 'thinness', thin font weight for averaged fourier samples with small std dev

// another cachelattice setup -- write the urls to request a geometry+volatiles
// and I calculate geometry on the fly
// but if a geo-vol is requested 3,4,5 times -- write it to compressed svg to offload repeat computations
// gotta find a balance between having an answer ready to go and storing 10s of thousands of svgs


# all it takes to implement the name-addressing:
Take a querystring or a POST body:
	assign the resolved paramarray to the keyname

	for now, keyname is always everything-after-the-[form|art]-header
	Eventually I'll remove the form/art distinction and embed the 
	Basically maybe the form has a ""
	Maybe there is an option to keep history in the URL so the back button works -- tradeoff to storing only a single state to the key on server side. whether its form/art/null is immaterial -- first, I take the querystring or resolve the address to the memquery, if there is no parameters (via query OR postbody), then just retrieve the parameters and serve the form or the art or the null (204 successful)

	If there are parameters, I validate the form then store at memquery[webaddress]
	{option, params}
	Else, lookup memquery[webaddress] (even if webaddress is an empty string thats fine) --
		Then return what is requested, null if no request is necessary (AJAX update), form to generate form, art to paint articles

	At first, send the whole URL every time I need to update -- later I can send update-fragments to lower bandwidth

	-- this will allow for partial key-value updates: /any/webaddress?anykey=newvalue -- basically, the api for modifying a serverside state

querycache -- give a short url to a long query string

# identity / auth
Maybe I can build on keybase so you add people's public keys to a server if they're allowed to edit -- usual ownership policies, 777

This could allow storing binaries in a row in sqlite without forgoing ownership rules at least when you spin up the server -- if you want to compress and encrypt it and then host it in the database that's fine, it will have to buffer the file out to the file-system (basically indexes the bytes with a filename in the directory tables) -- for fast readout to client, each file stored compressed and streamed.


Draw a new surface on the grid in increased space, catch the link changes -- and express branches of browsing in space like a tree.



Split a video, arrange the scenes along different paths in space -- wrap around timeline, infinite timeline horizontal or verticle, arbitrary commentary information that you can delete 

Eventually implement music scoring -- each plane (or sphere) is a slice of time, and so doing trace the path 