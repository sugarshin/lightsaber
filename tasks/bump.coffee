gulp = require 'gulp'
bump = require 'gulp-bump'

gulp.task 'bump-major', ->
  gulp.src './package.json'
    .pipe bump(
      type: 'major'
    )
    .pipe gulp.dest('./')

gulp.task 'bump-minor', ->
  gulp.src './package.json'
    .pipe bump(
      type: 'minor'
    )
    .pipe gulp.dest('./')

gulp.task 'bump-patch', ->
  gulp.src './package.json'
    .pipe bump()
    .pipe gulp.dest('./')
