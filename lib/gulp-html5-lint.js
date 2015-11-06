'use strict';

var _ = require('ls-lodash'),
    through = require('through2'),
    moment = require('moment'),
    htmlLint = require('html5-lint'),
    gutil = require('gulp-util'),
    PluginError = gutil.PluginError,
    pluginName = require('../package').name,
    request = require('sync-request');

module.exports = function gulpHtml5Lint(options) {
    var linterOpts = _.safeMerge({
            apiCheck: {
                timeout: moment.duration(10, 'seconds').asMilliseconds(),
                triggerError: false
            }
        }, options),
        errorOutputList = [],
        req,
        apiAvailable;

    try {
        req = request('GET', linterOpts.apiCheck.website || 'https://html5.validator.nu', {
            timeout: linterOpts.apiCheck.timeout
        });
    }
    catch (e) {
        req = {
            statusCode: 0
        };
    }
    finally {
        apiAvailable = req.statusCode === 200;
    }

    if (!apiAvailable && !linterOpts.apiCheck.triggerError) {
        gutil.log('HTML lint API is DOWN. Skipping linting.');
    }

    function transformFunction(file, enc, cb) {
        if (file.isNull()) {
            return cb(null, file);
        }

        if (!apiAvailable) {
            if (linterOpts.apiCheck.triggerError) {
                return cb(new PluginError(pluginName, 'HTML lint API is down. Aborting.'));
            }
            return cb(null, file);
        }

        if (file.isStream()) {
            return cb(new PluginError(pluginName, 'Streaming not supported'));
        }

        try {
            htmlLint(file.contents.toString(), linterOpts, function htmlLintCallback(err, results) {
                _.forEach(results.messages, function(msg) {
                    var errorMsg = msg.type + ': ' + msg.message + '\n' +
                        '    at ' + file.path + ':' + msg.lastLine + ':' + msg.lastColumn;

                    errorOutputList.push(errorMsg);
                });

                cb(null, file);
            });
        } catch (err) {
            errorOutputList.push(err.toString());
            cb(null, file);
        }
    }

    function flushFunction(cb) {
        if (!_.isEmpty(errorOutputList)) {
            /*jshint validthis:true */
            this.emit('error', new PluginError(pluginName, '\n' + errorOutputList.join('\n\n') + '\n', {
                showStack: false
            }));
        }
        cb();
    }

    return through.obj(transformFunction, flushFunction);
};
