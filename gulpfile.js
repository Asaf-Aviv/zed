const gulp        = require('gulp');
const sass        = require('gulp-sass');
const nodemon     = require('gulp-nodemon');
const browserSync = require('browser-sync');
const reload      = browserSync.reload;

gulp.task('browser-sync', ['nodemon'], () => {
    browserSync({
        proxy: "localhost:1337", // local node app address
        port: 5000, // use *different* port than above
        notify: true
    });
});

gulp.task('sass', () => {
    gulp.src('./public/sass/*.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(gulp.dest('dist/css/'))
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

gulp.task('default', ['sass', 'browser-sync', 'nodemon'], () => {
    gulp.watch('public/sass/*.scss', ['sass']);
    gulp.watch('public/sass/*.scss', reload);
    gulp.watch('public/css/*.css', reload);
    gulp.watch('views/**/*.pug', reload);
});