/* jshint esnext: true */
'use strict';

/**
 * External dependencies.
 */
const {
	series,
	parallel,
	watch
} = require( 'gulp' );

const { src, dest } = require( 'gulp' );
const sass = require( 'gulp-sass' );
const autoprefixer = require( 'gulp-autoprefixer' );
const cleancss = require( 'gulp-clean-css' );
const change = require( 'gulp-change' );
const rename = require( 'gulp-rename' );
const plumber = require( 'gulp-plumber' );
const size = require('gulp-size');

const sass_properties = {
	indentType: 'tab',
	indentWidth: 1,
	outputStyle: 'expanded',
	precision: 3,
};

/**
 * Build SASS files.
 */
export function process_styles() {

	return src( './scss/*.scss' )
		.pipe( plumber() )
		.pipe(
			sass( sass_properties ).on( 'error', sass.logError )
		)
		.pipe(
			autoprefixer(
				{ cascade: false }
			)
		)
		.pipe(
			rename(
				( path ) => { path.extname = '.css'; }
			)
		)
		.pipe(
			dest( './' )
		)
		.pipe(
			change( removeComments )
		)
		.pipe(
			cleancss( { level: 2 } )
		)
		.pipe(
			rename(
				( path ) => { path.extname = '.min.css'; }
			)
		)
		.pipe(
			size(
				{
					showFiles: true,
				}
			)
		)
		.pipe(
			size(
				{
					showFiles: true,
					gzip: true
				}
			)
		)
		.pipe(
			dest( './dist/' )
		);

}


/**
 * Remove comments from the source so that they can be minified away.
 */
const removeComments = function( content ) {

	content = content.replace( /\/\*\*!/g, '/**' );
	content = content.replace( /\/\*!/g, '/*' );

	return content;

};


export const build = process_styles;

export const watchFiles = function( done ) {

	watch(
		'./scss/**/*.scss',
		process_styles
	);

	done();

};

export default series(
	build,
	watchFiles
);
