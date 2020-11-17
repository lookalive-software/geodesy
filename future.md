0.6.0
In focus mode, the rest of the fieldsetes are hidden until you choose a focused article
The bottom half of the menu (the singular menu) has a title-header, a duplicate and delete button

The focus mode is set to defocus -- to show none of the local-fieldsets, 
SO there is a hidden radio button, focus value null. This way none of the local fieldsets will display.

0.6.1
I don't need the 'checked' ternarys on the 'add above' and 'add below' radios
Just need to be able to deselect all the others. Any change will submit the form,
falling back to whatever paint/move mode you were in, but now reflecting the newly focused article

dupe-6 value = duplicate
zero-6 value = collapse

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
