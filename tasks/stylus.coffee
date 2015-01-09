gulp = require 'gulp'
stylus = require 'gulp-stylus'
nib = require 'nib'
plumber = require 'gulp-plumber'
notify = require 'gulp-notify'
$ = require './../config.json'



gulp.task 'stylus', ->
  gulp.src "./#{$.SRC}/*.styl"
    .pipe plumber
      errorHandler: notify.onError '<%= error.message %>'
    .pipe stylus
      use: nib()
      compress: true
    .pipe gulp.dest $.DEST,
      cwd: './'
