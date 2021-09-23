/* eslint-disable */

// Based on CodeMirror, copyright (c) by Marijn Haverbeke and others
// Distributed under an MIT license: http://codemirror.net/LICENSE
import CodeMirror from 'codemirror';

var defaultRules = {
    'tagname-lowercase': true,
    'attr-lowercase': true,
    'attr-value-double-quotes': true,
    'doctype-first': false,
    'tag-pair': true,
    'spec-char-escape': true,
    'id-unique': true,
    'src-not-empty': true,
    'attr-no-duplication': true,
};

CodeMirror.registerHelper('lint', 'html', async function(text, options) {
    const application = window.application;
    if (application && application.backendLintingEnabled()) {
        return null; // Results will be manually set via setLintResults.
    }

    // Dynamic import; webpack creates a separate bundle and loads it on demand.
    let HTMLHint;
    try {
        HTMLHint = (await
            import ( /* webpackChunkName: "htmlhint" */ 'htmlhint')).default;
    } catch (error) {
        // If we fail to load the chunk, do not run linting.
        if (error.name === 'ChunkLoadError') {
            return [];
        }
    }

    var found = [];

    if (!HTMLHint) {
        return found;
    }

    var messages = HTMLHint ? .verify(text, (options && options.rules) || defaultRules) || [];
    for (var i = 0; i < messages.length; i++) {
        var message = messages[i];
        var startLine = message.line - 1,
            endLine = message.line - 1,
            startCol = message.col - 1,
            endCol = message.col;
        found.push({
            from: CodeMirror.Pos(startLine, startCol),
            to: CodeMirror.Pos(endLine, endCol),
            message: message.message,
            severity: message.type,
        });
    }
    return found;
});