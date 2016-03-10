watch:
	sass --watch scss/stylesheet.scss:stylesheet.css

css:
	sass scss/stylesheet.scss stylesheet.css

clean:
	rm -r stylesheet.css stylesheet.css.map .sass-cache
