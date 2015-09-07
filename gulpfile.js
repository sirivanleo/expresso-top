"use strict"

var gulp = require('gulp'),
    nodemon = require('gulp-nodemon'),
    plumber = require('gulp-plumber'),
    livereload = require('gulp-livereload'),
    stylus = require('gulp-stylus'),
    bower = require('gulp-bower'),
    bowerMain = require('main-bower-files'),
    gulpFilter = require('gulp-filter'),
    concat = require('gulp-concat'),
    coffee = require('gulp-coffee'),
    clean = require('gulp-clean'),
    uglify = require('gulp-uglify'),
    gulpSequence = require('gulp-sequence');

var prdBuild = false;

gulp.task('prd', function() {
    prdBuild = true;
});

gulp.task('clean', function() {
    gulp.src('bower_components')
        .pipe(clean({
            force: true
        }))

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
    return bower();
});
gulp.task('bower-files', function() {
    var jsFilter = gulpFilter(prdBuild ? ['**/*.min.js'] : ['**/*.js', '!**/*.min.js'], {
            restore: true
        }),
        cssFilter = gulpFilter(prdBuild ? ['**/*.min.css'] : ['**/*.css', '!**/*.min.css'], {
            restore: true
        });

    gulp.src(bowerMain())
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
        script: 'index.js',
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
gulp.task('build', gulpSequence('bower', [
    'bower-files',
    'stylus',
    'client-coffee'
]));

gulp.task('default', [
    'build',
    'develop',
    'watch'
]);

gulp.task('prd-build', gulpSequence('prd', 'bower', 'build'));
