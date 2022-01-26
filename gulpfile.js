import gulp from 'gulp';
import plumber from 'gulp-plumber';
import sass from 'gulp-dart-sass';
import postcss from 'gulp-postcss';
import csso from 'postcss-csso';
import rename from 'gulp-rename';
import htmlmin from 'gulp-htmlmin'
import terser from 'gulp-terser';
import squoosh from 'gulp-libsquoosh';
import autoprefixer from 'autoprefixer';
import svgstore from 'gulp-svgstore';
import svgo from 'gulp-svgmin'
import browser from 'browser-sync';

// Styles

export const styles = () => {
  return gulp.src('source/sass/style.scss', { sourcemaps: true })
    .pipe(plumber()) //2. Обработка ошибок
    .pipe(sass().on('error', sass.logError)) //style.scss ==> style.css
    .pipe(postcss([ //style.css
      autoprefixer(), //style.css ==> style.css {prefics}
      csso() // style.css {prefics} ==> style.css {prefics min}
    ]))
    .pipe(rename('style.min.css'))
    .pipe(gulp.dest('build/css', { sourcemaps: '.' }))
    .pipe(browser.stream());
}

//HTML

export const html = () => {
  return gulp.src('source/*.html')
  .pipe(htmlmin ({ collapseWhitespace: true}))
  .pipe(gulp.dest('build'));
}

//Script

export const script = () => {
  return gulp.src('source/js/*.js')
  .pipe(terser())
  .pipe(gulp.dest('build/js'))
}

//Images

export const images = () => {
  return gulp.src('source/img/**/*.{jpg,png}')
  .pipe(squoosh())
  .pipe(gulp.dest('build/img'))
}

//WebP

export const createwebp = () => {
  return gulp.src('source/img/**/*.{jpg,png}')
  .pipe(squoosh({
    webp: {}
  }))
  .pipe(gulp.dest('build/img'))
}

//Svg

export const svg = () =>
  gulp.src(['source/img/*.svg', '!source/img/icons/*.svg'])
  .pipe(svgo())
  .pipe(gulp.dest('build/img'));

   const sprite = () => {
    return gulp.src('source/img/icons/*.svg')
      .pipe(svgo())
      .pipe(svgstore({
        inlineSvg: true
      }))
      .pipe(rename('sprite.svg'))
      .pipe(gulp.dest('build/img'));
  }

// Server

const server = (done) => {
  browser.init({
    server: {
      baseDir: 'build'
    },
    cors: true,
    notify: false,
    ui: false,
  });
  done();
}

// Watcher

const watcher = () => {
  gulp.watch('source/sass/**/*.scss', gulp.series(styles));
  gulp.watch('source/*.html').on('change', browser.reload);
}


export default gulp.series(
  html, styles, server, watcher
);
