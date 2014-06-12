var fs = require('fs'),
    exec = require('child_process').exec,
    gulp = require('gulp'),
    concat = require('gulp-concat'),
    jshint = require('gulp-jshint'),
    uglify = require('gulp-uglify'),
    stylish = require('jshint-stylish'),
    replace = require('gulp-replace'),
    beautify = require('gulp-beautify');

gulp.task('compile', function() {
  return gulp.src(['src/core.js'])
    .pipe(replace(/\/\/ require ([\s-]*(.*?\.js))/g, function(match, p1) {
      return fs.readFileSync(p1, 'utf8');
    }))
    .pipe(concat('zeppelin.js'))
    .pipe(beautify({
      indentSize: 2
    }))
    .pipe(gulp.dest('./lib/'));
});

gulp.task('minify', ['compile'], function() {
  return gulp.src('./lib/zeppelin.js')
    .pipe(concat('zeppelin-min.js'))
    .pipe(uglify())
    .pipe(gulp.dest('./lib/'));
});

gulp.task('jshint', ['compile'], function() {
  return gulp.src('./lib/zeppelin.js')
    .pipe(jshint())
    .pipe(jshint.reporter(stylish))
    .pipe(jshint.reporter('fail'));
});

gulp.task('build_tests', function() {
  return gulp.src(tests)
    .pipe(concat('tests.js'))
    .pipe(gulp.dest('./test/'));
});

gulp.task('test', ['compile'], function() {
  var path = './node_modules/mocha-phantomjs/bin/mocha-phantomjs',
      options = '-R spec -p ./node_modules/phantomjs/bin/phantomjs',
      command = './test/index.html';

  exec(path + ' ' + options + ' ' + command, function (error, stdout, stderr) {
    if (stdout) {
      console.log(stdout);
    } else if (stderr) {
      console.error(stderr);
    } else if (error) {
      console.error(error);
    }
  });
});

gulp.task('watch', function() {
  watcher = gulp.watch(['./src/*.js', './test/*.js'], {
    interval: 500,
    debounceDelay: 1000
  }, ['test']);
});

gulp.task('build', ['compile', 'minify'], function(next) {
  next();
});
