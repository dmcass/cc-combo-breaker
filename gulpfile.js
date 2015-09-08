/* eslint-env node */
/* eslint strict: [2, "global"] */
"use strict";

var http = require("http");
var path = require("path");
var del = require("del");
var argv = require("yargs").argv;
var ecstatic = require("ecstatic");
var gulp = require("gulp");
var $ = require("gulp-load-plugins")();
var LessPluginCleanCSS = require("less-plugin-clean-css");
var cleancss = new LessPluginCleanCSS({ advanced: true });
var distDir = "dist/";
var exDir = "example/";

gulp.task("clean", function (cb) {
    del([distDir, exDir], cb);
});

gulp.task("template", function () {
    return gulp.src("src/template.html")
        .pipe($.minifyHtml({ empty: true}))
        .pipe(gulp.dest(distDir));
});

gulp.task("js", ["template"], function () {
    function addSlashes( str ) {
        return (str + "").replace(/[\\"']/g, "\\$&").replace(/\u0000/g, "\\0");
    }

    var template = addSlashes(require("fs").readFileSync(distDir + "template.html").toString());
    del([distDir + "template.html"]);

    return gulp.src(["src/combo-breaker.js"])
        .pipe($.concat("combo-breaker.min.js"))
        .pipe($.replace(/___TEMPLATE___/, template))
        .pipe($.ngAnnotate())
        .pipe($.uglify())
        .pipe(gulp.dest(distDir));
});

gulp.task("css", function () {
    return gulp.src(["src/combo-breaker.less"])
        .pipe($.less({
            plugins: [cleancss],
            strictMath: true
        }))
        .pipe(gulp.dest(distDir));
});

gulp.task("build", ["js", "css"]);

gulp.task("buildExample", ["build"], function () {
    var sources = require("wiredep")().js;
    sources.push(distDir + "**/*");

    return gulp.src(sources)
        .pipe(gulp.dest(exDir));
});

gulp.task("bump", function () {
    return gulp.src(["./bower.json", "./package.json"])
        .pipe($.bump({ type: argv.t }))
        .pipe(gulp.dest("."));
});

gulp.task("serve", ["buildExample"], function () {
    http.createServer(ecstatic({ root: path.join(__dirname, exDir) })).listen(8888);

    gulp.watch(["src/**/*"], ["buildExample"]);
});

gulp.task("default", ["build"]);
