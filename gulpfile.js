var gulp = require('gulp');
var postcss = require('gulp-postcss');
var eslint = require('gulp-eslint');

var browserSync = require('browser-sync');
var reload = browserSync.reload;


var paths = {
    styles: 'src/app.css',
    scripts: 'src/js/**/*.js',
    js: 'build/bundle.js',
    img: 'src/img/**/*.{png,jpg,gif,svg}',
    build: 'build/',
    src: 'src/'
};


gulp.task('js:test', function () {
    return gulp.src([paths.scripts, 'gulpfile.js'])
        .pipe(eslint())
        .pipe(eslint.format())
        .pipe(eslint.failAfterError());
});

gulp.task('js:build', function () {
    return gulp.src(paths.scripts)
        .pipe(gulp.dest(paths.build + 'js'));
});

gulp.task('img:build', function () {
    gulp.src(paths.img)
        .pipe(gulp.dest(paths.build + 'img'));
});

gulp.task('css:build', function () {
    gulp.src(paths.styles)
        .pipe(
            postcss([
                require('postcss-import')(),
                require('autoprefixer')(),
                require('postcss-csso')()
            ]))
        .pipe(gulp.dest(paths.build));
});


gulp.task('css:test', function () {
    gulp.src([paths.src + '**/*.css'])
        .pipe(
            postcss([
                require('stylelint')(),
                require('postcss-reporter')({clearMessages: true})
            ])
        );
});


gulp.task('html:build', function () {
    gulp.src('src/*.html')
        .pipe(gulp.dest(paths.build))
        .pipe(reload({stream: true}));
});

gulp.task('serve', ['build'], function () {
    browserSync.init({
        server: {
            baseDir: './build'
        }
    });
});

gulp.task('watch', function () {
    gulp.watch(['gulpfile.js', paths.scripts], ['js:test']);
    gulp.watch([paths.img], ['img:build']);
    gulp.watch('src/*.html', ['html:build']);
    gulp.watch([paths.src + '**/*.css'], ['css:test']);
    gulp.watch(['./build'], browserSync.reload);
});


gulp.task('build', ['js:build', 'img:build', 'css:build', 'html:build']);
gulp.task('test', ['js:test', 'css:test']);
gulp.task('default', ['build', 'test', 'serve', 'watch']);
