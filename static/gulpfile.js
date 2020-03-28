const { src, dest, watch, task } = require('gulp');
const sass = require('gulp-sass'); 
const minifyCSS = require('gulp-csso');
const minifyJS = require('gulp-minify');
const rename = require('gulp-rename');

sass.compiler = require('node-sass');

task('js', () =>
    src('src/js/*.js')
        .pipe(minifyJS({
            ext:{
                src:'.js',
                min:'.min.js'
            },
        }))
        .pipe(dest('./build/js')))

task('scss', () =>
    src('src/scss/*.scss')
        .pipe(sass.sync().on('error', sass.logError))
        .pipe(minifyCSS())
        .pipe(rename({suffix: '.min'}))
        .pipe(dest('./build/css')))

task('default', () => {
    watch(['src/scss/*.scss'], task('scss'));
    watch(['src/js/*.js'], task('js'));
})