/* eslint-disable */

// Based on CodeMirror, copyright (c) by Marijn Haverbeke and others
// Distributed under an MIT license: http://codemirror.net/LICENSE
import CodeMirror from 'codemirror';

CodeMirror.registerHelper('lint', 'json', async function(text) {
    const application = window.application;
    if (application && application.backendLintingEnabled()) {
        return null; // Results will be manually set via setLintResults.
    }

    // Dynamic import; webpack creates a separate bundle and loads it on demand.
    let jsonlint;
    try {
        jsonlint = (await
            import ( /* webpackChunkName: "jsonlint" */ 'jsonlint')).default;
    } catch (error) {
        // If we fail to load the chunk, do not run linting.
        if (error.name === 'ChunkLoadError') {
            return [];
        }
    }

    var found = [];
    jsonlint.parser.parseError = function(str, hash) {
        var loc = hash.loc;
        found.push({
            from: CodeMirror.Pos(loc.first_line - 1, loc.first_column),
            to: CodeMirror.Pos(loc.last_line - 1, loc.last_column),
            message: str
        });
    };
    try {
        jsonlint.parse(text);
    } catch (e) {}
    return found;
});