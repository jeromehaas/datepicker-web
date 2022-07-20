const gulp = require('gulp');
const { series, parallel, dest } = require('gulp');
const sourcemaps = require('gulp-sourcemaps');
const browserSync = require('browser-sync').create();
const cssnano = require('gulp-cssnano');
const autoprefixer = require('gulp-autoprefixer');
const concat = require('gulp-concat');
const plumber = require('gulp-plumber');
const uglify = require('gulp-uglify');
const sass = require('gulp-sass')(require('sass'));
const webpackConfig = require('./webpack.config.js');
const webpackStream = require('webpack-stream');
const cleanCSS = require('gulp-clean-css');
const notifier = require('gulp-notifier');

// SOURCE PATHS
const filePaths = {
	scss: {
		src: ['./src/scss/reset.scss', './src/scss/variables.scss', './src/scss/fonts.scss', './src/scss/global.scss', './src/scss/icon.scss', './src/scss/datepicker.scss' ],
		dist: './css'
	},
	js: {
		src: ['./src/js/datepicker.js'],
		dist: './js'
	},
};

// SCSS
const scssTask = (done) => {
	gulp.src(filePaths.scss.src, { 'allowEmpty': true })
		.pipe(plumber({ errorHandler: notifier.error }))
		.pipe(concat('main.min.css'))
		.pipe(sourcemaps.init())
		.pipe(sass())
		.pipe(autoprefixer())
		.pipe(cssnano())
		.pipe(sourcemaps.write('.'))
		.pipe(cleanCSS())
		.pipe(dest(filePaths.scss.dist))
		.pipe(dest(filePaths.scss.dist));
	done();
};
	
// JS TASK
const jsTask = (done) => {
	gulp.src(filePaths.js.src)
		.pipe(plumber({ errorHandler: notifier.error }))
		.pipe(webpackStream(webpackConfig))
		.pipe(uglify())
		.pipe(dest(filePaths.js.dist))
		.pipe(dest(filePaths.js.dist));
	done();
};


// WATCH TASK
const watchTask = () => {
	browserSync.init({
		server: { baseDir: './' },
		open: false,
		port: 3007,
		ui: { port: 3008 }
	});
	gulp.watch('./index.html').on('change', browserSync.reload);
	gulp.watch(filePaths.scss.src, scssTask).on('change', browserSync.reload);
	gulp.watch(filePaths.js.src, jsTask).on('change', browserSync.reload);
};

const buildTask = series(scssTask, jsTask, watchTask);

module.exports = {
	default: buildTask,
};