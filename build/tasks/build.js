const gulp = require("gulp");
const del = require('del');
const merge = require('merge2');
const runSequence = require('run-sequence');
const tsindex = require('gulp-create-tsindex');
const paths = require("../paths").paths;
const ts = require("gulp-typescript");
const tsProject = ts.createProject(paths.tsConfig);
const tslint = require("gulp-tslint");
const Configuration = require("tslint").Configuration;
const tsLintConfig = require("../../tslint.json");

gulp.task("tslint", function() {
    return gulp.src([paths.src + "/**/*.ts", paths.test + "/**/*.ts"])
        .pipe(tslint({
            formatter: "prose",
            configuration: Configuration.findConfiguration(paths.tsLintConfig, undefined).results
        }))
        .pipe(tslint.report({
            emitError: false
        }))
});

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
    runSequence('clean', "tslint", ["build-ts"],
        callback);
});