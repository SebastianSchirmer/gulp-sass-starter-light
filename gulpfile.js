'use strict';

/**
 * Requires
 */
var gulp = require('gulp');
var util = require('gulp-util');
var sass = require('gulp-sass');
//var autoprefixer = require('gulp-autoprefixer');
var del = require('del');
var concat = require('gulp-concat');
var plumber = require('gulp-plumber');
var browserSync = require('browser-sync');
var changed = require('gulp-changed');

// PostCSS Plugins
var postcss = require('gulp-postcss');
var autoprefixer = require('autoprefixer');
var postCssProcessors = [
    autoprefixer({ browsers: ['last 1 Chrome version', 'iOS >= 8', 'Android >= 4'] })
    //.pipe(autoprefixer('last 2 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4'))
];

// ...
gulp.task('clean', function () {
    log('Deleting dist folder');
    return del([
        'dist'
    ]);
});

// -----------------------------------------------------------
// ...
// -----------------------------------------------------------
gulp.task('styles', function () {
    gulp.src('./src/sass/**/*.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(postcss(postCssProcessors))
        //.pipe(autoprefixer('last 2 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4'))
        .pipe(gulp.dest('dist/styles'))
        .pipe(browserSync.reload({
            stream: true
        }));
});

// -----------------------------------------------------------
// ...
// -----------------------------------------------------------
gulp.task('scripts', function () {
    return gulp.src(['./src/scripts/**/*.js'])
        .pipe(plumber())
        .pipe(concat('app.js'))
        .pipe(gulp.dest('dist/scripts'))
        .pipe(browserSync.reload({
            stream: true
        }));
});

// -----------------------------------------------------------
// ...
// -----------------------------------------------------------
gulp.task('images', function () {
    return gulp.src('src/images/**')
        .pipe(changed('dist/images'));
});

// -----------------------------------------------------------
// ...
// -----------------------------------------------------------
gulp.task('html', function () {
    gulp.src('./src/**/*.html')
        .pipe(gulp.dest('dist/'));
});

// -----------------------------------------------------------
// ...
// -----------------------------------------------------------
gulp.task('browser-sync', ['styles', 'scripts'], function () {
    browserSync({
        server: {
            baseDir: './dist/',
            injectChanges: true // this is new
        }
    });
});

// -----------------------------------------------------------
// ...
// -----------------------------------------------------------
gulp.task('watch', function () {
    // Watch .html files
    gulp.watch('src/**/*.html', ['html', browserSync.reload]);
    gulp.watch('dist/*.html').on('change', browserSync.reload);
    // Watch .sass files
    gulp.watch('src/sass/**/*.scss', ['styles', browserSync.reload]);
    // Watch .js files
    gulp.watch('src/scripts/*.js', ['scripts', browserSync.reload]);
    // Watch image files
    gulp.watch('src/images/**/*', ['images', browserSync.reload]);
});


// ...
gulp.task('default', function () {
    gulp.start('styles', 'scripts', 'images', 'html', 'browser-sync', 'watch');
});

///////////////////////
// General functions //
///////////////////////

function log(msg) {
    if (typeof msg === 'object') {
        for (var item in msg) {
            if (msg.hasOwnProperty(item)) {
                util.log(util.colors.yellow(msg[item]));
            }
        }
    } else {
        util.log(util.colors.yellow(msg));
    }
}
