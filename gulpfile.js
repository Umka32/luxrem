const gulp = require("gulp"); // подключаем файлы
const plumber = require("gulp-plumber");
const sourcemap = require("gulp-sourcemaps");
const less = require("gulp-less");
const postcss = require("gulp-postcss");
const autoprefixer = require("autoprefixer");
const csso = require("postcss-csso");
const imagemin = import("gulp-imagemin");
const webp = require("gulp-webp");
const svgstore = require("gulp-svgstore");
const rename = require("gulp-rename");
const htmlmin = require("gulp-htmlmin");
const uglify = require('gulp-uglify-es').default;
const del = require("del");
const sync = require("browser-sync").create();

//HTML-min минификация html файлов и перенос вв папку build

const html = () => {
  return gulp.src("source/*.html")
    .pipe(htmlmin({ collapseWhitespace: true }))
    .pipe(gulp.dest("build"))
}

exports.html = html;

//Script min

const script = () => {
  return gulp.src("source/js/main.js")
    .pipe(uglify())
    .pipe(rename("main.min.js"))
    .pipe(gulp.dest("build/js"))
}

exports.script = script;

//CSS

const styles = () => {
  return gulp.src("source/less/style.less") //место где берем файлы
    .pipe(plumber()) //отловщик ошибок
    .pipe(sourcemap.init()) // делает слепок текущего состояния
    .pipe(less()) // превращает лесс в цсс
    .pipe(postcss([
      autoprefixer(), //добавляем префиксы
      csso() // минификация
    ]))
    .pipe(rename("style.min.css"))
    .pipe(sourcemap.write(".")) // сравнивает с слепком, то что получилось
    .pipe(gulp.dest("build/css")) //куда положить результат выполнения
  // .pipe(sync.stream()); // обновление сервера для обновления
}

exports.styles = styles; //нужно для доступности таска из вне (терминала)

//Images оптимизирует картинки

const images = () => {
  return gulp.src("source/img/**/*.{png,jpg,svg}")
    .pipe(imagemin([
      imagemin.mozjpeg({ progressive: true }), //для картинок img
      imagemin.optipng({ optimizationLevel: 3 }),
      imagemin.svgo()
    ]))
    .pipe(gulp.dest("build/img"))
}

exports.images = images;

//Webp

const createwebp = () => {
  return gulp.src("source/img/**/*.{png,jpg}")
    .pipe(webp({ quality: 90 }))
    .pipe(gulp.dest("build/img"))
}

exports.createwebp = createwebp;

//Sprite

const sprite = () => {
  return gulp.src("source/img/icons/*.svg")
    .pipe(svgstore())
    .pipe(rename("sprite.svg"))
    .pipe(gulp.dest("build/img"))
}

exports.sprite = sprite;

//Copy

const copy = (done) => {
  gulp.src([
    "source/fonts/*.{woff,woff2,ttf}",
    "source/*.ico",
    "source/img/**/*.{jpg,png,svg}",
  ], {
    base: "source"
  })
    .pipe(gulp.dest("build"))
  done();
}

exports.copy = copy;

//Copy pages

const copages = (done) => {
  gulp.src("source/**/*.*",
    {
      base: "source"
    })
    .pipe(gulp.dest("."))
  done();
}

exports.copages = copages;

//Clean

const clean = () => {
  return del("build")
}
exports.clean = clean;

//Server

const server = (done) => {
  sync.init({
    server: {
      baseDir: 'build' //сюда смотрит сервер
    },
    cors: true,
    notify: false,
    ui: false,
  });
  done();
}

exports.server = server;

const reload = done => {
  sync.reload();
  done();
}

//Wathcher

const watcher = () => {
  gulp.watch("source/less/**/*.less", gulp.series(styles, reload));
  gulp.watch("source/js/main.js", gulp.series(script, reload));
  gulp.watch("source/*.html", gulp.series(html, reload));
}

//Перенос для Pages в GitHab

const pages = gulp.series(styles, copages);
exports.pages = pages;

//Build

const build = gulp.series(
  clean,
  gulp.parallel(
    html,
    script,
    styles,
    sprite,
    copy,
    images,
    createwebp
  )
);

exports.build = build;

exports.default = gulp.series(
  clean,
  gulp.parallel(
    html,
    script,
    styles,
    sprite,
    copy,
    createwebp
  ),
  gulp.series(
    server,
    watcher
  )
);  //запустить несколько задач подряд
