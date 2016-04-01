parse_content:
	@ruby parser/compile_data.rb content/sections/*.md

clean-content:
	rm content/sections/*.html

install-parser-dependencies:
	sudo gem install redcarpet
	sudo gem install handlebars

watch:
	sass --watch scss/stylesheet.scss:stylesheet.css

css:
	sass scss/stylesheet.scss stylesheet.css

clean:
	rm -r stylesheet.css stylesheet.css.map .sass-cache
