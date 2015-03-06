'use strict';

var path = require('path'),
    chai = require('chai');

chai.use(require('sinon-chai'));
chai.use(require('chai-as-promised'));

module.exports = {
    expect: chai.expect
};
