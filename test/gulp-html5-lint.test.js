'use strict';

var fs = require('fs'),
    es = require('event-stream'),
    path = require('path'),
    _ = require('ls-lodash'),
    gutil = require('gulp-util'),
    gulpHtml5Lint = require('../'),
    console = require('console'),
    expect = require('./test-helper').expect;

describe('gulp-html5-lint', function() {
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
});
