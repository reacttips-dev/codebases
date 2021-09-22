'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _slate = require('slate');

/**
 * Create a new cell
 */
function createCell(opts, nodes) {
    return _slate.Block.create({
        type: opts.typeCell,
        nodes: nodes || [createEmptyContent(opts)]
    });
}

/**
 * Create a new default content block
 */

function createEmptyContent(opts) {
    return _slate.Block.create({
        type: opts.typeContent,
        nodes: [_slate.Text.create()]
    });
}

exports.default = createCell;