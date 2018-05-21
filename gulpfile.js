const gulp        = require('gulp');
const sass        = require('gulp-sass');
const uglify      = require('gulp-uglify');
const babel       = require('gulp-babel');
const cleanCSS    = require('gulp-clean-css');
const concat      = require('gulp-concat');
const nodemon     = require('gulp-nodemon');
const browserSync = require('browser-sync');
const reload      = browserSync.reload;

gulp.task('browser-sync', ['nodemon'], () => {
    browserSync({
        proxy: "localhost:1337",
        port: 5000,
        notify: true
    });
});

gulp.task('sass', () => {
    return gulp.src('public/sass/*.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(gulp.dest('public/css/'))
        .pipe(concat('styles.min.css'))
        .pipe(cleanCSS())
        .pipe(gulp.dest('dist/css/'));
});

gulp.task('minify-js', () => {
    return gulp.src('public/js/*.js')
        .pipe(babel({
            presets: ['env']
        }))
        .pipe(concat('client.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest('dist/js/'));
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

gulp.task('default', ['sass', 'browser-sync'], () => {
    gulp.watch('public/sass/*.scss', ['sass']);
    gulp.watch('public/sass/*.scss', reload);
    gulp.watch('views/**/*.pug', reload);
});