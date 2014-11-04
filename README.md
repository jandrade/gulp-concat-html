#gulp-concat-html

This plugin allows you to concatenate all html files recursively, all of them selected from a directory. The main purpose of this plugin is to generate a style guide from a set of partials (HTMLs).

## Install

```sh
$ npm install --save-dev gulp-concat-html
```

## Usage

index.html

```html
<!DOCTYPE html>
<html>
    <head></head>
    <body>
		<div class="menu">
			<!-- sg-nav -->

			<!-- endsg-nav -->
		</div>

		....

		<div class="styleguide">
			<!-- styleguide -->

			<!-- endstyleguide -->
		</div>
	<body>
</html>
```

```js
var gulp = require('gulp');
var concatHtml = require('gulp-concat-html');

gulp.src('app/partials/**/*.html')
		.pipe(concatHtml.build())
		.pipe(concat("temp.html"))
		.pipe(concatHtml.replaceHtml("index.html", "index.html"))
		.pipe(gulp.dest('public'));
```

## API

### replaceHtml(source, dest)

#### source
Type: `String` `index.html`
HTML template

#### dest
Type: `String` `index.html`
Generated HTML


## Contributors

- [Juan David Andrade](http://jdandrade.com/)

## License

MIT - Copyright © 2014 Juan David Andrade