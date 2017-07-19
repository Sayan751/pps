const gulp = require("gulp");
const del = require('del');
const merge = require('merge2');
const runSequence = require('run-sequence');
const tsindex = require('gulp-create-tsindex');
const paths = require("../paths").paths;
const ts = require("gulp-typescript");
const tsProject = ts.createProject(paths.tsConfig);

gulp.task("build-ts", function() {
    const tsResult = tsProject.src()
        .pipe(tsindex(paths.src + '/index.ts'))
        .pipe(tsProject());

    return merge([
        tsResult.dts.pipe(gulp.dest(paths.dist + '/definitions')),
        tsResult.js.pipe(
            gulp.dest(paths.dist)
        )
    ]);
});

gulp.task("clean", function() { return del(paths.dist) });

gulp.task('build', function(callback) {
    runSequence('clean', ["build-ts"],
        callback);
});