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
