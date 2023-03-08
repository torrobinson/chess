// Sass configuration
const gulp = require('gulp');
const sass = require('gulp-sass')(require('sass'));
const rename = require("gulp-rename");

// Builds any scss file
gulp.task('sass', function(callback) {
  return gulp
	.src('./styles/scss/style.scss')
	.pipe(sass().on('error', sass.logError))
	.pipe(rename('style.css'))
	.pipe(gulp.dest('./styles/'));
  callback();
});

// Default task to fun for development. Run `gulp` or `gulp default`
gulp.task(
	'default',
	// Run the SCSS function and watch for any file changes
	gulp.series('sass', function(callback) {
		gulp.watch('./styles/scss/**/*.scss', gulp.series('sass'));
		callback();
	})
);
