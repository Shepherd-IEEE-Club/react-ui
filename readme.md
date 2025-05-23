Mock-up UI for Mr. Stamps.
React.js and node.js


test

- Sticky Header on every page
  - Maybe It could be big and shrink when you scroll?
- Split pages up (Search, info, etc), Weird to have everything in one big long page
  - tabs?
  - sidebar?
- Search area
  - Enlarge image
    - On hover?
      - Maybe not be intuitive to old people.
    - Click on row/picture to enlarge and focus, click again anywhere to un-large. 
  (Include a big X button too, old people.) 
  - Search options area
    - follow you when you scroll  
    - Sidebar with search options that's always there? meh...
  - Search options
    - Town, database could store a list of towns to fill in.
      Easy way to do this is to have a town table and join with pm table
    - Drop down yes or no boxes should be checkboxes
  
  - Table
    - Sticky column headings 
    - Currently, you have to select a broad range. Then filter further with search box. This loads way too much data:
      1. Only load picture if it's on screen? 
      2. If it ain't broke...
      2. Database will generate tiny baby thumbnails for each picture. Only load big picture when you want to look at it.
      (I Like this idea).
      Could combine this with only-on screen

         - On this note, I feel like having to clunkily flip through pages and select how many entries you want to see is a technical limitation, and 
         the end user either: 
           1. DGAF
           2. would actually *prefer* to be able to infinitely scroll
       
         - This needs to be intuitive:
           - Visual indicator of how far you've scrolled (maybe like vscode)
           - Loading spinner when fetching more entries
           - A button to return back to the top 