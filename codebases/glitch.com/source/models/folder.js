// Folder
// ========

const defaults = require('lodash/defaults');
const Model = require('../model');
const {
    randomId
} = require('../util');

// The `Folder` model represents a folder with a number of children.
// eslint-disable-next-line func-names
const Folder = function(I = {}) {
    I = I || /* istanbul ignore next */ {};
    defaults(I, {
        name: '',
        children: [],
        uuid: randomId(),
        level: 0,
        // in rewind preview, we can't build folders from OT state (as the folders don't go to OT until the rewind is accepted), so we build a temporary path
        rewindPreviewPath: null,
    });

    if (!I.name) {
        throw new Error('Folder must have a folder name');
    }

    const self = Model(I);

    self.attrAccessor('name');
    self.attrObservable('children', 'uuid', 'level', 'rewindPreviewPath');
    self.attrObservable('renaming');

    self.extend({
        sortChildren() {
            self.children().sort((A, B) => {
                if (A.type() === B.type()) {
                    return A.name() >= B.name() ? 1 : -1;
                }
                // folders always go before before files
                // eslint-disable-next-line no-else-return
                else if (A.type() === 'folder') {
                    return -1;
                } else {
                    return 1;
                }
            });
        },

        id() {
            return self.uuid();
        },

        type() {
            return 'folder';
        },
    });

    self.children.observe(self.sortChildren);

    return self;
};

module.exports = Folder;