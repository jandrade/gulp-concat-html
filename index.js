/**
 * Imports
 */
// through2 is a thin wrapper around node transform streams
var through = require('through2'),
	gutil = require('gulp-util'),
	fs = require('fs'),
	path = require('path'),
	_ = require('lodash'),
	PluginError = gutil.PluginError;

/**
 * Variables
 */
// read item template file
var itemsCollection = [],
	dir,
	itemTemplate = fs.readFileSync(__dirname + '/templates/item.html').toString(),
	navTemplate = fs.readFileSync(__dirname + '/templates/nav.html').toString();

// consts
const PLUGIN_NAME = 'concat-html';

// Used to replace anything within a start and end tag.
var replaceRegExp = /<!--\s*?styleguide\s*?-->[\s\S]*?<!--\s*?endstyleguide\s*?-->/g;

// Used to remove start and end tags.
var removeRegExp = / *?<!--\s*?styleguide\s*?--> *\n?| *?<!--\s*?endstyleguide\s*?--> *\n?/g;

var navRegExp = /<!--\s*?sg-nav\s*?-->[\s\S]*?<!--\s*?endsg-nav\s*?-->/g;

/**
 * Build each item
 * @return {Stream} NodeJS Stream
  */
function build() {
	var contentHtml = '';

	// creating a stream through which each file will pass
	var stream = through.obj(function(file, enc, cb) {
		var data = {
			code: file.contents.toString().replace(/\</gi, '&lt;'),
			contents: file.contents.toString(),
			name: path.basename(file.relative, '.html'),
			file: 'item.html'
		};

		var currentDir = path.dirname(file.relative);

		if (dir !== currentDir) {
			itemsCollection.push({
				name: currentDir, 
				items: []
			});
		}

		// add items list (nav)
		itemsCollection[itemsCollection.length-1].items.push(data.name);

		dir = currentDir;

		// parse item template
		contentHtml = gutil.template(itemTemplate, data);

		file.contents = new Buffer(contentHtml);

		this.push(file);

		return cb();
	});

	// returning the file stream
	return stream;
}


/**
 * Replaces <!-- styleguide --> with the generated content
 * @param  {String} source - HTML template
 * @param  {String} dest - Generated HTML
 * @return {Stream} NodeJS Stream
 */
function replaceHtml(source, dest) {
	// read index file
	var index = fs.readFileSync(source).toString();

	if (!dest) {
		throw new PluginError(PLUGIN_NAME, 'Missing index path!');
	}

	// creating a stream through which each file will pass
	var stream = through.obj(function(file, enc, cb) {

		if (file.isNull()) {
			 // do nothing if no contents
		}

		index = index.replace(replaceRegExp, file.contents.toString());
		
		// create nav
		var nav = _.template(navTemplate, {
			folders: itemsCollection,
		});

		index = index.replace(navRegExp, nav);
		
		// create new file
		var processedFile = new gutil.File({
			path: dest,
			contents: new Buffer(index)
		});

		this.push(processedFile);
		
		return cb();
	});

	// returning the file stream
	return stream;
};

var concatHtml = {
	replaceHtml: replaceHtml,
	build: build
};

// exporting the plugin main function
module.exports = concatHtml;