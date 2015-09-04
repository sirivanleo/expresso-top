var gulp = require('gulp'),
  nodemon = require('gulp-nodemon'),
  plumber = require('gulp-plumber'),
  livereload = require('gulp-livereload'),
  stylus = require('gulp-stylus'),
  bowerMain = require('main-bower-files'),
  gulpFilter = require('gulp-filter'),
  concat = require('gulp-concat'),
  coffee = require('gulp-coffee');

gulp.task('bower', function() {
  var jsFilter = gulpFilter('**/*.js'),
    cssFilter = gulpFilter('**/*.css');

  gulp.src(bowerMain(), {base:'public/components'})
    .pipe(cssFilter)
    .pipe(concat('libs.css'))
    .pipe(gulp.dest('public/css/'));

  gulp.src(bowerMain(), {base:'public/components'})
    .pipe(jsFilter)
    .pipe(concat('libs.js'))
    .pipe(gulp.dest('public/js/'));
});

gulp.task('stylus', function () {
  gulp.src('./public/css/*.styl')
    .pipe(plumber())
    .pipe(stylus())
    .pipe(gulp.dest('./public/css'))
    .pipe(livereload());
});

gulp.task('client-coffee', function(){
  gulp.src('./public/coffee/*.coffee')
    .pipe(coffee({bare: false}))
    .pipe(concat('client.js'))
    .pipe(gulp.dest('./public/js/'));
});

gulp.task('watch', function() {
  gulp.watch('./public/css/*.styl', ['stylus']);
  gulp.watch('./public/coffee/*.coffee', ['client-coffee']);
});

gulp.task('develop', function () {
  livereload.listen();
  nodemon({
    script: 'bin/www',
    ext: 'js jade coffee',
    stdout: false
  }).on('readable', function () {
    this.stdout.on('data', function (chunk) {
      if(/^Express server listening on port/.test(chunk)){
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
