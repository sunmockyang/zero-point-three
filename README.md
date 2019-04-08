# A Multimedia Journalism Piece
Created for a Master's in Journalism thesis of [Priscilla Hwang](http://priscillahwang.com).

![Underground preloader image](https://github.com/sunmockyang/zero-point-three/blob/develop/content/images/preloader_bg.jpg "Underground")

### View the finished piece [here](http://underground.priscillahwang.com).

### To Generate Website
Run `./parser/generateWebsite.sh` from the root of the repository. Content has not been included in this repo since it may be sensitive.

## Dev Notes
### Situation
All content was written and created by the client and during the development,
and knowing the content could change right up till deployment,
we wanted a system where the content could be updated by the client easily with some level of control over the styling.

### Execution
A full blown content management system would've been overkill and also another moving piece with it's own liabilities.
So I came up with the idea of parsing markdown that's written by the client first into custom HTML for content such as quotes, images, headers, and then parsed again by an markdown to HTML renderer to handle smaller things such as italics and links.

Each section of the article was divided up into separate markdown files that would be parsed into an html file each and then injected with JavaScript at page load.

This way allowed the parsing system to also be aware of all types of media going into the piece so all raw content provided by the client could be encoded as part of the parsing process.

### Retrospective
#### Pros
- Easy to adjust styles
- Very extensible
- Easy for client to specify different types of media and the order that it comes in.
- Dev focus could be maintained on styling, scripting, and optimizations.

#### Cons
- Had to set up a good portion of system before any results could be seen
- Issues rose up as content was being added so sometimes problems had to be resolved very late into the game

### Notes for future:
- Consider a design to put everything into separate pages. Reduce load times
- Add a minify step to minify + gzip everything

### Things done since the website has launched:
- Fixed some typos
- Adjusted video encryption
- Fixed initial page load flow, site will load far faster with less lags
- Added basic minification to everything
- Removed all generated content from git since we don't need them when the site is no longer under active development
- Move hosting from standard hosting to github pages
  - Serve all videos from AWS S3
  - Export to `docs` folder
