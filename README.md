# gulp-html5-lint [![Circle CI](https://circleci.com/gh/LiveSafe/gulp-html5-lint.svg?style=shield&circle-token=dc2208875ac9ed2ee25737769da1c21095e492f1)](https://circleci.com/gh/LiveSafe/gulp-html5-lint) [![Build Status](https://travis-ci.org/LiveSafe/gulp-html5-lint.svg)](https://travis-ci.org/LiveSafe/gulp-html5-lint)

## Usage

First, install `gulp-html5-lint` as a development dependency:

```bash
npm install --save-dev gulp-html5-lint
```

Then add it to your `gulpfile.js`:

```js
var html5Lint = require('gulp-html5-lint');

gulp.task('html5-lint', function() {
    return gulp.src('./src/*.html')
        .pipe(html5Lint());
});
```

## API

### html5Lint(options)

Options are those you would provide to https://github.com/mozilla/html5-lint

Additional options include:

* `apiCheck.timeout` {_number_} request timeout to check if html5 lint API is available (__default: 10 seconds__)
* `apiCheck.triggerError` {_boolean_} timeout on request to check whether html5 lint API is available (__default: false__)

## License

[MIT License](http://en.wikipedia.org/wiki/MIT_License)
