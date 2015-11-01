'use strict';

var gulp = require('gulp');
var jshint = require('gulp-jshint');
var gulpMocha = require('gulp-mocha');

gulp.task('jshint', function(){
    gulp.src(['gulpfile.js', 'index.js', 'test/*.js', 'lib/*.js'])
    .pipe(jshint())
    .pipe(jshint.reporter('jshint-stylish'));
    //.pipe(jshint.reporter('default'));
});

gulp.task('test', ['jshint'], function(){
  gulp.src('test/**/*test.js')
  // .pipe(gulpMocha()) // this is the default mocha reporter
  .pipe(gulpMocha({reporter: 'nyan'}));
  // .pipe(gulpMocha({reporter: 'mocha-lcov-reporter'}));
  // .pipe(gulpMocha({reporter: 'mocha-notifier-reporter'}));
});


gulp.task('default', ['jshint', 'test']);
