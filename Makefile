all: parse_content css

generate:
	./parser/generateWebpage.sh

clean: clean-content clean-css

parse_content:
	@ruby parser/compile_data.rb content/sections/*.md
	
parse-test:
	@ruby parser/compile_data.rb parser/Test.md

convert-videos:
	./parser/convertVideos.sh

clean-content:
	rm content/sections/*.html

install-parser-dependencies:
	sudo gem install redcarpet
	sudo gem install handlebars

watch:
	sass --watch scss/stylesheet.scss:stylesheet.css

css:
	sass scss/stylesheet.scss stylesheet.css

clean-css:
	rm -r stylesheet.css stylesheet.css.map .sass-cache
