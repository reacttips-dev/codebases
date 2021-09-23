const parsePath = require('./parse-path');
const path2dPolyfill = require('./path2d-polyfill');

if (typeof window !== 'undefined') {
    path2dPolyfill(window);
}

module.exports = {
    path2dPolyfill,
    parsePath,
};