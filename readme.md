- A queryparse function that returns an array of paramobjects and one options/global object
- later: pull in typescript interfaces to check against global object and params, return detailed reason for failing type check, return API documentation

- a params endpoint: one kind of response which returns a finished page HTML, another json response that can just return the body of the page (new nodes)
- a form endpoint: take current query string, set it to defaults, then render a form based on these
- you'll have to check the options object for control-keys: submit buttons which specify an action like 'append article', or 'delete article 5' -- what would usually be a transformation of state is actually a form-transform

- The Form
Two sections, 3 tabs each
Top section is mode, as in editing mode: focus | paint | move,
    focus is a single pane with a list of submit buttons that change the focus of the form and page
    with js, capture the 'focus change' and update some attributes that the CSS will show the newly focus submenus
    So in this case, focus paint and move subforms are always generated, but CSS shows only the selected tab
        When paint or move is selected, the tab is shown, but the only menu that is visible is one that matches the focused id
        So when generating the form, use the 'focus' id to set a 'selected' attributte on the menus that should be shown to the user
        The rest of them are still baked into the HTML so on any 'submit' all their values are still part of the querystring


Bottom section is type: net | text | embed
    Depending on the type, only that form is sent to avoid any unncessary state in the query string

    There is actually one bottom section for each article, but only the focused bottom section is shown

Eventually net will allow file uploads to be used in the wallpaper, embed should allow uploads for sure, for video/image/pdf

The goal of geodesy is making the virtual locations of information more memorable
    by making each location visually distinct,
        and allowing navigation from one space "into" another, allowing you to back out and ask "how did I get here"


TODO
Flip the focus interface to the bottom, maybe start off with large numbers and then let the title shrink and wrap (breakword can add a bit of space to long passages) if the title gets larger

Or, as for defaults, nets go by their theme, emded goes by EITHER 

So the numbers get longer titles but the layer menu still arranges them numerically and I always use that nthchild(n) as the lookup, so I can assume parity between the "title" parameter of the form and the "title" attribute of the 

Later: focused article gets some visual priority -- maybe fade everything else out or focus on it --- ah, after I implement z-distance (racehorse interface dragging the articles up and down, or maybe even a move editor in the sidebar - a little x y z graph that shows us and lets you click on a new position (maybe with area map!))

So some ways to make it easier to move in javascriptlessland -- joy stick or a map of the space -- so you can just pick up and drop an element !


First, allow a spacename and a localaddress -- this turns into a URL and the titles of each article

So actually the "space name" is the only pointer to the whole space, and everytime the form is updated, not only is the querystring history pushed

Which item is highlighted will actually be by title # hash in the url -- might not make a difference but at the very least 'scrolls to it'

So lets say you always have something focused, gives it an extra title on the URL even tho the same content will be served with just the base.

So I parse the url and use just the name of the URL, later I convert everything leading up to the name into dashes. So you can have 'paths' that each point to their own space.

When the form is submitted, I will draw a new link on the form -- maybe a little earth emoji or lock emoji to express if this URL is accessible online

So I have one text box that corresponds with the URL
Another text box that corresponds with each article name -- so param.title gets incorporated, and the base-url is a key into a redirection object that stores the entire URL as a string and updates it often

So anytime I restart my server, I just need to have my shortname to see 
If I want to, I could store every query string or periodic query strings under their hashes, maybe some metadata about name and time and ownership...
Then I could request sha -- I could even set the url scheme to be sha3 and then as I update my form and POST my form, I'll get an address back which lets me 

It could be a redirect if I wanted to keep the URL visible in history, or a term rewriting -- before trying to parse the query, check if the address is sha5 or form...
if its sha5 then update the value of URL and move on, client will get the form and timespace at that address and can continue POSTing updates to that URL (if scheme is sha5, take the posted form, hash it, use that new key as the keyname and then redirect so the form requests the new, updated hash -- this way you'll have the history of the file in your browser history without having the content of the file or super long urls)

OK so route utf8, check routes object for keyname -- overwrites the URL with the value that's stored or 404s

The form will get a link at that address -- two parts maybe! with and without the hash. click on either part and get the content.

Adjust the labels to overlap it a little bit

TODO 2

Branches grow within a particular subdivision of space, and even tho I only track changes, I can view any particular state by rewinding or fast forwarding, with very low bandwidth for seeing "what the next change is" -- mostly small messages updating position and style parameters, with the occasional url or text, a few kilobytes at most. View cross-sections of branching (creating a finer grid and skinnier twigs if necessary, fractally, infinitely, as much space as you need)

