// Filetree
// ========
const defaults = require('lodash/defaults');
const File = require('./file');

const Model = require('../model');

// The `Filetree` model represents a tree of files.
// eslint-disable-next-line func-names
const Filetree = function(I = {}, self) {
    I = I || /* istanbul ignore next */ {};
    self = self || Model(I);
    defaults(I, {
        files: []
    });

    self.attrModels('files', File);

    return self;
};

module.exports = Filetree;