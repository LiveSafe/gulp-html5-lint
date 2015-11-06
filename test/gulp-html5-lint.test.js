'use strict';

var fs = require('fs'),
    es = require('event-stream'),
    path = require('path'),
    _ = require('ls-lodash'),
    gutil = require('gulp-util'),
    gulpHtml5Lint = require('../'),
    moment = require('moment'),
    console = require('console'),
    expect = require('./test-helper').expect,
    sinon = require('sinon');

describe('gulp-html5-lint', function() {
    this.timeout(moment.duration(12, 'seconds').asMilliseconds());

    function makeTestContext(fixtureName) {
        var fileContents = fs.readFileSync(path.join(__dirname, 'fixtures', 'valid.html')),
            fileContentsString = String(fileContents),
            gutilFile = new gutil.File({
                path: 'test/fixtures/' + fixtureName + '.html',
                cwd: 'test/',
                base: 'test/fixtures',
                contents: fs.readFileSync(path.join(__dirname, 'fixtures', fixtureName + '.html'))
            });

        return {
            fileContents: fileContents,
            fileContentsString: fileContentsString,
            gutilFile: gutilFile
        };
    }

    it('should pass through valid files unchanged', function(done) {
        var stream = gulpHtml5Lint(),
            context = makeTestContext('valid');

        stream.on('error', done);

        stream.on('data', function(newFile) {
            expect(String(newFile.contents)).to.equal(context.fileContentsString);
            done();
        });

        stream.write(context.gutilFile);
        stream.end();
    });

    it('should emit error to stream on invalid html', function(done) {
        var stream = gulpHtml5Lint(),
            context = makeTestContext('invalid'),
            errMsg =
                '\nerror: Start tag seen without seeing a doctype first. Expected “<!DOCTYPE html>”.\n' +
                '    at test/fixtures/invalid.html:1:6\n\n' +
                'error: End tag for  “body” seen, but there were unclosed elements.\n' +
                '    at test/fixtures/invalid.html:7:11\n\n' +
                'error: Unclosed element “div”.\n    at test/fixtures/invalid.html:6:13\n';

        stream.on('error', function(err) {
            expect(err.message).to.equal(errMsg);
            done();
        });

        stream.write(context.gutilFile);
        stream.end();
    });

    describe('API down', function() {
        var invalidURL = 'http://invalid-website.v';

        function generateTest(lintOpts, onData, onError) {
            var stream = gulpHtml5Lint(lintOpts),
                context = makeTestContext('valid');

            stream.on('error', onError);
            stream.on('data', onData);

            stream.write(context.gutilFile);
            stream.end();
        }

        it('should log a warning by default when dependency website is down', function(done) {
            sinon.spy(gutil, 'log');
            generateTest(
                {apiCheck: {website: invalidURL}},
                function() {
                    sinon.assert.calledOnce(gutil.log);
                    sinon.assert.calledWith(gutil.log, 'HTML lint API is DOWN. Skipping linting.');
                    gutil.log.restore();
                    done();
                },
                function() {
                    throw new Error('Should not error out.');
                }
            );
        });

        it('should error out when dependency website is down and triggerError is set', function(done) {
            generateTest(
                {apiCheck: {website: invalidURL, triggerError: true}},
                function() {
                    throw new Error('Should not receive data.');
                },
                function() {
                    done();
                }
            );
        });
    });
});
