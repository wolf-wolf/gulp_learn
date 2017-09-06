var gulp = require('gulp'),
    plugins = require('gulp-load-plugins')(),
    pump = require('pump'),
    del = require('del'),
    runSequence = require('run-sequence'),
    browserSync = require('browser-sync').create(),
    reload = browserSync.reload;

var settings = {
    enviroment: process.env.NODE_ENV || 'production',
    configFolder: './config',
    srcFolder: './src',
    distFolder: './dist/**/*',
}

//构建前清理原构建目录
gulp.task('clean', function(cb) {
    del(settings.distFolder, cb);
});

//对代码文件进行打包
gulp.task('usemin', function(cb) {
    del(settings.distFolder);
    pump([gulp.src('./src/index.html'),
            plugins.usemin({
                mainCss: [
                    plugins.autoprefixer('last 2 version'),
                    plugins.rename({ suffix: '.min' }),
                    plugins.cssnano,
                    plugins.rev
                ],
                vendorCss: [
                    plugins.autoprefixer('last 2 version'),
                    plugins.rename({ suffix: '.min' }),
                    plugins.cssnano,
                    plugins.rev
                ],
                html: [function() {
                    return plugins.htmlmin({ collapseWhitespace: true });
                }],
                mainJs: [
                    plugins.rename({ suffix: '.min' }),
                    plugins.uglify,
                    plugins.rev
                ],
                scripts: [
                    plugins.rename({ suffix: '.min' }),
                    plugins.uglify,
                    plugins.rev
                ]
            }),
            gulp.dest('dist/')
        ],
        cb)
});

//图片文件构建
gulp.task('images', function() {
    return gulp.src('src/images/**/*')
        .pipe(plugins.cache( //图片压缩
            plugins.imagemin({
                optimizationLevel: 3,
                progressive: true,
                interlaced: true
            })))
        .pipe(gulp.dest('dist/images')); //输出构建后的文件
});

gulp.task('notify', function() {
    gulp.src('src/index.html').pipe(plugins.notify({ message: 'all task complete' }))
});

//完整的构建任务
gulp.task('process', ['usemin', 'images'], function(cb) {
    cb(null);
});

gulp.task('build', ['clean', 'process'], function() {

});

//开发环境
gulp.task('dev', function() {
    browserSync.init({
        files: ['src/**/*'],
        server: {
            baseDir: "./src"
        },
        injectChanges: true
    });
});