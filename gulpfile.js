"use strict"

var gulp = require('gulp'),
    nodemon = require('gulp-nodemon'),
    plumber = require('gulp-plumber'),
    livereload = require('gulp-livereload'),
    stylus = require('gulp-stylus'),
    bowerMain = require('main-bower-files'),
    gulpFilter = require('gulp-filter'),
    concat = require('gulp-concat'),
    coffee = require('gulp-coffee'),
    clean = require('gulp-clean'),
    uglify = require('gulp-uglify');

var prdBuild = false;

gulp.task('prd', function() {
    prdBuild = true;
});

gulp.task('clean', function() {
    gulp.src('public/components', {
        read: false
    }).pipe(clean(clean({
        force: true
    })));
    if (prdBuild) {
        //Do not continue
        return;
    }
    gulp.src('public/**/*.js', {
        read: false
    }).pipe(clean());
    gulp.src('public/**/*.css', {
        read: false
    }).pipe(clean());
});

gulp.task('bower', function() {
    var jsFilter = gulpFilter(prdBuild ? ['**/*.min.js'] : ['**/*.js', '!**/*.min.js'], {
            restore: true
        }),
        cssFilter = gulpFilter(prdBuild ? ['**/*.min.css'] : ['**/*.css', '!**/*.min.css'], {
            restore: true
        });

    gulp.src(bowerMain(), {
            base: 'public/components'
        })
        .pipe(cssFilter)
        .pipe(concat('libs.css'))
        .pipe(gulp.dest('public/css/'))
        .pipe(cssFilter.restore)
        .pipe(jsFilter)
        .pipe(concat('libs.js'))
        .pipe(gulp.dest('public/js/'));
});

gulp.task('stylus', function() {
    var styles = gulp.src('./client/css/*.styl')
        .pipe(plumber())
        .pipe(stylus({
            compress: prdBuild
        }))
        .pipe(gulp.dest('./public/css'))
        .pipe(livereload());
});

gulp.task('client-coffee', function() {
    var f = gulp.src('./client/coffee/*.coffee')
        .pipe(coffee())
        .pipe(concat('client.js'));
    if (prdBuild) {
        f.pipe(uglify()).pipe(gulp.dest('./public/js/'));
    } else {
        f.pipe(gulp.dest('./public/js/'));
    }

});

gulp.task('watch', function() {
    gulp.watch('./client/css/*.styl', ['stylus']);
    gulp.watch('./client/coffee/*.coffee', ['client-coffee']);
});

gulp.task('develop', function() {
    livereload.listen();
    nodemon({
        script: 'bin/www',
        ext: 'js jade coffee',
        stdout: false
    }).on('readable', function() {
        this.stdout.on('data', function(chunk) {
            if (/^Express server listening on port/.test(chunk)) {
                livereload.changed(__dirname);
            }
        });
        this.stdout.pipe(process.stdout);
        this.stderr.pipe(process.stderr);
    });
});

gulp.task('default', [
    'bower',
    'stylus',
    'client-coffee',
    'develop',
    'watch'
]);
gulp.task('prdBuild', [
    'prd',
    'bower',
    'stylus',
    'client-coffee',
    'clean'
]);
