'use strict';

var _ = require('ls-lodash'),
    gulp = require('gulp'),
    lsGulpTasks = require('lvsf-gulp-tasks'),

    dirsToLint = ['./*.js', 'lib/**/*.js'],
    testDirsToLint = ['test/*.js'];

gulp.task('default', _.noop);

gulp.task('test', ['lint', 'stylecheck', 'mocha']);

gulp.task('lint', lsGulpTasks.lint(dirsToLint, testDirsToLint));

gulp.task('stylecheck', lsGulpTasks.checkstyle(dirsToLint.concat(testDirsToLint)));

gulp.task('mocha', ['lint', 'stylecheck'], lsGulpTasks.mocha(['test/**/*.test.js']));
