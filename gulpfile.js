var gulp = require('gulp'),
    autoprefixer = require('gulp-autoprefixer'),
    beeper = require('beeper'),
    sassGlob = require('gulp-sass-glob'),
    imagemin = require('gulp-imagemin'),
    sass = require('gulp-sass'),
    sourcemaps = require('gulp-sourcemaps'),
    uglify = require('gulp-uglify'),
    svgSprite = require('gulp-svg-sprite'),
    svgSymbols = require('gulp-svg-symbols'),
    pngquant = require('imagemin-pngquant'),
    notify = require('gulp-notify'),
    del = require('del'),
    runSequence = require('run-sequence'),
    browserSync = require('browser-sync').create(),
    reload = browserSync.reload;

/*------------------------------------*\
  #OPTIONS
\*------------------------------------*/

var paths = {
    source: {
      styles: 'source/css/**/*.scss',
      images: 'source/images/*',
      sprites: 'source/svg-sprites/*.svg',
      icons: 'source/svg-icons/*.svg',
      scripts: 'source/js/*.js',
      patterns: ['pattern-library/**/*.html', 'pattern-library/**/*.md', 'pattern-library/data.json',],
    },
    dist: {
      styles: 'css',
      images: 'images',
      sprites: 'images',
      icons: 'images',
      scripts: 'js',
    }
};

var spriteConfig = {
    dest: '',
    shape: {
        spacing: {
            padding: 5
        }
    },
    mode: {
      css: {
          bust: false,
          dest: './',
          sprite: 'images/sprites.svg',
          render: {
              scss: {
                  dest: './source/css/base/_sprites.scss',
                  template: './source/svg-sprites/sprites.scss'
              }
          }
      }
    }
};

/*------------------------------------*\
  #ERRORS
\*------------------------------------*/

function onError(err) {
  notify({
    title: 'Task failed',
    message: 'See the terminal for details.',
  }).write(err);
  beeper();
  console.log(err.toString());
  if (watching) {
    this.emit('end');
  } else {
    process.exit(1);
  }
}

/*------------------------------------*\
  #Images
\*------------------------------------*/

gulp.task('images', function(callback) {
  runSequence('clean-images', ['imagemin', 'sprites', 'shapes'], callback);
});

// get rid of old images
gulp.task('clean-images', function() {
    return del([ paths.dist.images ]);
});

// minify images
gulp.task('imagemin', function () {
   return gulp.src(paths.source.images)
      .pipe(imagemin({
          progressive: true,
          svgoPlugins: [{removeViewBox: false}],
          use: [pngquant()]
      }))
      .pipe(gulp.dest('./pattern-library/assets/images'))
      .pipe(gulp.dest(paths.dist.images));
});

/*------------------------------------*\
  #SVGS
\*------------------------------------*/

gulp.task('sprites', function() {
    return gulp.src(paths.source.sprites)
        .pipe(svgSprite(spriteConfig))
        .pipe(gulp.dest(''));
});

// build svg shapes
gulp.task('shapes', function () {
  return gulp.src(paths.source.icons)
    .pipe(svgSymbols({
        id: 'icon-%f',
        templates: ['default-svg'],
        title: '%f',
        slug: function (name) {
            return name.toLowerCase().trim().replace(/\s/g, '-');
        }
    }))
    .pipe(gulp.dest('./pattern-library/assets/images'))
    .pipe(gulp.dest(paths.dist.images));
});

/*------------------------------------*\
  #SCRIPTS
\*------------------------------------*/

gulp.task('scripts', function() {
  return gulp.src(paths.source.scripts)
    .pipe(uglify().on('error', onError))
    .pipe(gulp.dest('./pattern-library/assets/js'))
    .pipe(gulp.dest(paths.dist.scripts))
    .pipe(reload({ stream: true }));
});

/*------------------------------------*\
  #SERVER
\*------------------------------------*/

gulp.task('serve', ['styles'], function() {
    browserSync.init({
        server: './pattern-library'
    });

    gulp.watch(paths.source.styles, ['styles']).on('change', reload);
    gulp.watch(paths.source.patterns).on('change', reload);
});

/*------------------------------------*\
  #STYLES
\*------------------------------------*/

gulp.task('styles', function () {
    return gulp.src(paths.source.styles)
      .pipe(sourcemaps.init()) // Start source maps
      .pipe(sassGlob())
      .pipe(sass({outputStyle: 'compressed'}).on('error', onError))
      .pipe(autoprefixer({
          browsers: ['last 5 versions'],
          cascade: false,
          // flexbox: 'no-2009'
      }))
      .pipe(sourcemaps.write('/')) // Finish source maps
      .pipe(gulp.dest(paths.dist.styles))
      .pipe(gulp.dest('./pattern-library/assets/css'))
      .pipe(reload({ stream: true }));
});

/*------------------------------------*\
  #WATCH
\*------------------------------------*/

gulp.task('watch', function() {
    watching = true;
    gulp.watch(paths.source.styles, ['styles']);
    gulp.watch(paths.source.scripts, ['scripts']);
    gulp.watch(paths.source.icons, ['shapes']);
    gulp.watch([paths.source.images, paths.source.sprites], ['images']);
});

/*------------------------------------*\
  #DEFAULT
\*------------------------------------*/

gulp.task('default', ['serve', 'watch']);
