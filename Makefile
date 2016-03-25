parse_content:
	@cd parser && ruby compile_data.rb Test.md
	@# @cd content && ruby parse_content.rb Test.md
	@# cd content && ruby parse_content.rb sections/01-Prologue.md

watch:
	sass --watch scss/stylesheet.scss:stylesheet.css

css:
	sass scss/stylesheet.scss stylesheet.css

clean:
	rm -r stylesheet.css stylesheet.css.map .sass-cache
