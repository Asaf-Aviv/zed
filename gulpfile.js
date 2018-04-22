const gulp = require('gulp');
const nodemon = require('gulp-nodemon');
const browserSync = require('browser-sync');
const reload = browserSync.reload;



gulp.task('browser-sync', ['nodemon'], () => {
    browserSync({
        proxy: "localhost:1337", // local node app address
        port: 5000, // use *different* port than above
        notify: true
    });
});

gulp.task('nodemon', function (cb) {
    var called = false;
    return nodemon({
        script: 'main.js',
        ignore: [
            'node_modules/'
        ]
    })
    .on('start', function () {
        if (!called) {
            called = true;
            cb();
        }
    })
    .on('restart', function () {
        setTimeout(function () {
            reload({
                stream: false
            });
        }, 500);
    });
});

gulp.task('default', ['browser-sync'], function () {
    gulp.watch(['public/css/*.css'], reload);
    gulp.watch(['views/*.pug'], reload);
    gulp.watch(['views/partials/*.pug'], reload);
});