var gulp = require("gulp");
var browserSync = require("browser-sync").create();
var rimraf = require("rimraf");
var sass = require("gulp-sass");
var imagemin = require("gulp-imagemin");
var rename = require("gulp-rename");
var uglify = require("gulp-uglify");
var removeComments = require('gulp-strip-css-comments');
var watch = require("gulp-watch");

// Paths:

var path = {
    dist: {
        html: "dist/",
        js: "dist/js/",
        css: "dist/css/",
        img: "dist/img/",
        fonts: "dist/fonts/"
    },
    src: {
        html: "src/*.{htm,html}",
        js: "src/js/*.js",
        css: "src/sass/style.scss",
        img: "src/i/**/*.*",
        fonts: "src/fonts/**/*.*"
    },
    watch: {
        html: "src/**/*.{htm,html}",
        js: "src/js/**/*.js",
        css: "src/sass/**/*.scss",
        img: "src/img/**/*.*",
        fonts: "src/fonts/**/*.*"
    },
    clean: "dist"
};

// Tasks:

gulp.task("html:build", () => {
    return gulp.src(path.src.html)
    // .pipe(plumber())
    // .pipe(rigger())
    .pipe(gulp.dest(path.dist.html))
    .pipe(browserSync.reload({
        stream: true
    }));
});

gulp.task("css:build", () => {
    gulp.src(path.src.css)
    // .pipe(plumber())
    .pipe(sass())
    // .pipe(autoprefixer({
    //     browsers: ["last 5 versions"],
    //     cascade: true
    // }))
    // .pipe(cssbeautify())
    .pipe(gulp.dest(path.dist.css))
    // .pipe(cssnano({
    //     zindex: false,
    //     discardComments: {
    //         removeAll: true
    //     }
    // }))
    .pipe(removeComments())
    .pipe(rename("style.min.css"))
    .pipe(gulp.dest(path.dist.css))
    .pipe(browserSync.reload({
        stream: true
    }));
});

gulp.task("js:build", () => {
    gulp.src(path.src.js)
    // .pipe(plumber())
    // .pipe(rigger())
    .pipe(gulp.dest(path.dist.js))
    .pipe(uglify())
    .pipe(removeComments())
    .pipe(rename("bundle.js"))
    .pipe(gulp.dest(path.dist.js))
    .pipe(browserSync.reload({
        stream: true
    }));
});

gulp.task("fonts:build", () => {
    gulp.src(path.src.fonts)
    .pipe(gulp.dest(path.dist.fonts));
});

gulp.task("image:build", () => {
    gulp.src(path.src.img)
    .pipe(imagemin({
        optimizationLevel: 3,
        progressive: true,
        svgoPlugins: [{
            removeViewBox: false
        }],
        interlaced: true
    }))
    .pipe(gulp.dest(path.dist.img));
});

gulp.task("clean", (cb) => {
    rimraf(path.clean, cb);
    gulp.start("browser-sync");
    gulp.start("watch");
});

gulp.task("build", ["clean"], () => {
    gulp.start(["html:build", "css:build", "js:build", "fonts:build", "image:build"]);
});

gulp.task("browser-sync", () => {
    browserSync.init({
        server: "./dist"
    });
});

gulp.task("watch", () => {
    watch([path.watch.html], () => {
        gulp.start("html:build");
    });
    watch([path.watch.css], () => {
        gulp.start("css:build");
    });
    watch([path.watch.js], () => {
        gulp.start("js:build");
    });
    watch([path.watch.img], () => {
        gulp.start("image:build");
    });
    watch([path.watch.fonts], () => {
        gulp.start("fonts:build");
    });
});

gulp.task("default", ["build"]);