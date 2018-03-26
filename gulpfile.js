const gulp = require('gulp')
const browserSync = require('browser-sync')
const nodemon = require('gulp-nodemon')

gulp.task('browser-sync', function () {
   var files = [
      '*.html',
      'public/*.*',
      'js/**/*.js',
      'sass/**/*.scss'
   ];

   browserSync.init(files, {
      server: {
         baseDir: './'
      }
   });
});