/*
 * decaffeinate suggestions:
 * DS101: Remove unnecessary use of Array.from
 * DS102: Remove unnecessary code created because of implicit returns
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */

const {
    CDN_URL
} = require('./env');

const TEXT_EXTENSIONS = {
    coffee: true,
    cson: true,
    jade: true,
    json: true,
    pug: true,
    ruby: true,
    styl: true,
    csv: true,
};

const TEXT_FILE_TYPE_REGEXP = /(^text\/)|(^application\/json$)|(^application\/(x-)?javascript$)/;

const Util = {
    extension(path) {
        let match;
        // eslint-disable-next-line no-cond-assign, no-useless-escape, no-useless-escape
        if (path && (match = path.match(/\.([^\.\/]*)$/))) {
            return match[1];
            // eslint-disable-next-line no-else-return
        } else {
            return '';
        }
    },

    extensionType(path) {
        if (path === '.env') {
            return 'env';
        }

        const extensionLookup = [{
                type: 'image',
                extensions: ['gif', 'ico', 'jpeg', 'jpg', 'png', 'svg'],
            },
            {
                type: 'audio',
                extensions: ['ogg', 'mp3', 'wav'],
            },
            {
                type: 'pdf',
                extensions: ['pdf'],
            },
            {
                type: 'logic',
                extensions: ['js', 'jsx', 'coffee', 'ts', 'rb', 'ruby', 'py', 'swift', 'tsx'],
            },
            {
                type: 'data',
                extensions: ['json', 'cson'],
            },
            {
                type: 'info',
                extensions: ['md', 'markdown', 'mdown', 'txt'],
            },
            {
                type: 'view',
                extensions: ['html', 'jade', 'jadelet', 'haml', 'hbs', 'ejs', 'pug'],
            },
            {
                type: 'style',
                extensions: ['css', 'less', 'stylus', 'styl'],
            },
            // eslint-disable-next-line func-names
        ].reduce(function(table, item) {
            // eslint-disable-next-line no-return-assign, no-shadow
            item.extensions.forEach((extension) => (table[extension] = item.type));

            return table;
        }, {});

        return extensionLookup[Util.extension(path)] || 'other';
    },

    cancelEvent(event) {
        event.preventDefault();
        return false;
    },

    // from https://stackoverflow.com/a/14482123/2318064
    nthIndex(string, matchString, number) {
        // eslint-disable-next-line no-var
        var max = string.length;
        // eslint-disable-next-line no-var
        var index = -1;
        // eslint-disable-next-line no-plusplus, no-plusplus
        while (number-- && index++ < max) {
            index = string.indexOf(matchString, index);
            if (index < 0) break;
        }
        return index;
    },

    keyIsMeta(keyCode) {
        const LEFT = 37;
        const UP = 38;
        const RIGHT = 39;
        const DOWN = 40;
        const SHIFT = 16;
        const META = 91;
        const ALT = 18;
        const CTRL = 17;
        const metaKeyCodes = [LEFT, UP, RIGHT, DOWN, SHIFT, META, ALT, CTRL];

        return metaKeyCodes.includes(keyCode);
    },

    isTextFile(file) {
        return file.type.match(TEXT_FILE_TYPE_REGEXP) || (file.type === '' && TEXT_EXTENSIONS[Util.extension(file.name).toLowerCase()]);
    },

    readFile(file, method) {
        method = method || /* istanbul ignore else */ 'readAsText';
        // eslint-disable-next-line func-names
        return new Promise(function(resolve, reject) {
            const reader = new window.FileReader();

            reader.onload = () => resolve(reader.result);
            reader.onerror = reject;
            return reader[method](file);
        });
    },

    randomId() {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        return [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15].map(() => chars[Math.floor(Math.random() * chars.length)]).join('');
    },

    // eslint-disable-next-line consistent-return
    pathIsInvalid(path) {
        const invalidChars = ['..', '$', '~', '\\', '*'];
        // can't contain an invalid character
        // eslint-disable-next-line prefer-const
        for (let invalidChar of invalidChars) {
            if (path.indexOf(invalidChar) > -1) {
                return true;
            }
        }
        // first character can't be '/'
        if (path.substring(0, 1) === '/') {
            return true;
        }
        // last character can't be '/'
        if (path.substr(-1) === '/') {
            return true;
        }
    },

    cdnURL(s3URL) {
        if (!s3URL) {
            return '';
        }
        // eslint-disable-next-line no-useless-escape, no-useless-escape, no-useless-escape
        return s3URL.replace(/https?\:\/\/[^\/]+\/[^\/]+\//, `${CDN_URL}/`);
    },

    // Returns a promise for a DOM Image that is fulfilled with that image when
    // it is loaded or rejected with an error
    /* istanbul ignore next */
    blobToImage(file) {
        // eslint-disable-next-line func-names
        return new Promise(function(resolve, reject) {
            const image = new Image();
            image.onload = () => resolve(image);
            image.onerror = reject;

            // eslint-disable-next-line no-return-assign
            return (image.src = URL.createObjectURL(file));
        });
    },

    /**
     * Check if localStorage is available for use. Browsers sometimes block localStorage for privacy
     * reasons, e.g. Chrome blocks localStorage for sites in an iframe hosted on another domain.
     */
    isLocalStorageAvailable() {
        try {
            return !!window.localStorage;
        } catch (err) {
            return false;
        }
    },
};

module.exports = Util;