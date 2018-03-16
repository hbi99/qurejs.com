

/*-------------------------------------------------------------------------
 * Include Gulp & Tools We'll Use
 *
 *-------------------------------------------------------------------------*/

var fs          = require('fs'),
	path        = require('path'),
	colors      = require('colors'),
	gulp        = require('gulp'),
	$           = require('gulp-load-plugins')(),
	del         = require('del'),
	cleanCSS    = require('gulp-clean-css'),
	stylish     = require('jshint-stylish'),
	sequence    = require('run-sequence'),
	nodemon     = require('gulp-nodemon'),
	inject      = require('gulp-inject-string');

var include_options = {
		prefix    : '@@',
		basepath  : '@file'
	},
	srcPaths = {
		scripts : ['./www/res/js/**/*.js', '!./www/res/js/**/*.min.js', './www/res/js/site.js'],
		styles  : ['./www/res/css/**/*.less', './www/res/css/style.less']
	},
	destPaths = {
		base    : './www/res/',
		script  : './www/res/js/',
		styles  : './www/res/css/'
	};


/*-------------------------------------------------------------------------
 * Gulp HELP
 *
 *-------------------------------------------------------------------------*/
gulp.task('help', function() {
	console.log('\n----------------------------------------------------------------------------------\n** DEVELOPMENT Mode **\n');
	console.log('  gulp frontend'.white    +'\t\tWatch and auto-compiles files and restart node-server'.grey);
	console.log('\n----------------------------------------------------------------------------------\n\n');
});



/*-------------------------------------------------------------------------
 * Declaring tasks
 *
 *-------------------------------------------------------------------------*/

// Removes files in specified folder
gulp.task('clean:www', del.bind(null, [destPaths.base +'*.min.*']));

// Processes javascript files
gulp.task('scripts', function() {
	return gulp.src(srcPaths.scripts[2])
		.pipe($.fileInclude(include_options))
	//	.pipe($.uglify())
		.pipe($.rename({suffix: '.min'}))
		.pipe(gulp.dest(destPaths.script))
		.pipe($.size({title: 'scripts'}));
});

// Processes Less files
gulp.task('styles', function() {
	return gulp.src(srcPaths.styles[1])
		.pipe($.less())
		.pipe(cleanCSS({keepSpecialComments: 0}))
		.pipe($.rename({suffix: '.min'}))
		.pipe(gulp.dest(destPaths.styles))
		.pipe($.size({title: 'styles'}));
});

// Watch source files and moves them accordingly
gulp.task('watch', function() {
	gulp.watch(srcPaths.scripts, ['scripts']);
	gulp.watch(srcPaths.styles,  ['styles']);
});


// This task is for frontend development
gulp.task('frontend', function(cb) {
	sequence('clean:www', ['scripts', 'styles'], 'watch', cb);
});


