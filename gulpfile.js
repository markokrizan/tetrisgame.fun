var gulp = require('gulp');
var uglify = require('gulp-uglify');
var babel = require('gulp-babel');
var sass = require('gulp-sass');
var webpack = require('webpack-stream');
var clean = require('gulp-clean');

const scriptDirs = {
    src: "src/js/**/*.js",
    dest: "build/js"
}

const styleDirs = {
    src: "src/style/main.scss",
    dest: "build/style"
}

gulp.task('clean-scripts', function () {
    return gulp.src(scriptDirs.dest, {read: false}) //WARNING - clean DEST dir only!
      .pipe(clean());
});

gulp.task('clean-styles', function () {
    return gulp.src(styleDirs.dest, {read: false}) //WARNING - clean DEST dir only!
      .pipe(clean());
});

gulp.task("scripts", () => {
    return gulp.src(scriptDirs.src)
        .pipe(babel({ presets: ['es2015'] }))
        .pipe(uglify())
        .pipe(webpack({output: {filename: 'bundle.js'} }))
        .pipe(gulp.dest(scriptDirs.dest))
});

gulp.task("styles", () => {
    return gulp.src(styleDirs.src)
        .pipe(sass())
        .pipe(gulp.dest(styleDirs.dest));
});

gulp.task('default', ['clean-scripts', 'clean-styles', 'scripts', 'styles']);

