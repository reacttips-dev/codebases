/*
 * decaffeinate suggestions:
 * DS101: Remove unnecessary use of Array.from
 * DS102: Remove unnecessary code created because of implicit returns
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
// File Model
// ==========
//
// The `File` model represents a file in a file system. It is populated by data
// returned from the Github API.
const defaults = require('lodash/defaults');
const Model = require('../model');
const {
    randomId,
    extension,
    extensionType
} = require('../util');

// Attributes
// ----------
// `path` is the path to the file.
//
// `content` contains the text content of the file.
// eslint-disable-next-line func-names
const File = function(I = {}) {
    I = I || /* istanbul ignore next */ {};
    defaults(I, {
        uuid: randomId(),
        content: '',
        base64Content: undefined,
        extensionType: '',
        path: '',
        modifiedByRewind: false,
        addedByRewind: false,
        deletedByRewind: false,
        rewindPatches: undefined,
    });

    if (!I.path) {
        throw new Error('File must have a path');
    }

    const self = Model(I);

    self.attrAccessor('projectId');

    self.attrObservable(...Array.from(Object.keys(I) || /* istanbul ignore next */ []));
    self.attrObservable('renaming');

    self.extend({
        // The extension is the last part of the filename after the `.`, for example
        // `"coffee"` for a file named `"main.coffee"` or `"haml"` for a file named
        // `"filetree.haml"`.
        extension() {
            // > md
            return extension(self.path());
        },

        withoutExtension() {
            // > public/views/yo
            // eslint-disable-next-line no-useless-escape, no-useless-escape
            return self.path().replace(/\.[^\.\/]*$/, '');
        },

        name() {
            // > yo.md
            return self.path().replace(/(.*\/)/g, '');
        },

        id() {
            return self.uuid();
        },

        folders() {
            // > ["public", "views"]
            const splitPath = self.path().split('/');
            return splitPath.splice(0, splitPath.length - 1);
        },

        isMedia() {
            return self.base64Content() != null;
        },

        type() {
            return 'file';
        },

        hasImmutableFilename() {
            return self.path() === '.env' || self.path().startsWith('.data/');
        },
    });

    self.extensionType(extensionType(self.path()));

    return self;
};

module.exports = File;
// eslint-disable-next-line dot-notation
File['randomUUID'] = randomId;