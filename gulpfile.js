const gulp = require('gulp');
const nodemon = require('gulp-nodemon');

gulp.task('default', () => {
    nodemon({
        script: 'main.js',
        ext: 'js',
        env: {
            PORT: 3000
        },
        delay: "500",
        ignore: ['./node_modules/**']
    })
});