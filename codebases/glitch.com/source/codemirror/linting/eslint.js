/* eslint-disable */

// Based on CodeMirror Lint addon to use ESLint, copyright (c) by Angelo ZERR and others
// Distributed under an MIT license: http://codemirror.net/LICENSE
import CodeMirror from 'codemirror';

var defaultConfig = {
    parserOptions: {
        ecmaVersion: 2020,
        sourceType: 'module',
        ecmaFeatures: {
            jsx: true,
        },
    },
    env: {
        browser: true,
        node: true,
        jquery: true,
        worker: true,
        mocha: true,
        jest: true,
        es6: true,
    },
    extends: ['eslint:recommended', 'plugin:@typescript-eslint/recommended'],
    plugins: ['eslint-plugin-svelte3'],
    rules: {
        'no-undef': 'error',
    },
};

let client = null;

function getConfig(type = 'javascript') {
    if (type === 'typescript') {
        defaultConfig.parser = '@typescript-eslint/parser';
    }
    return (application && application.eslintrc()) || defaultConfig;
}

CodeMirror.registerHelper('lint', 'javascript', async function(text, options) {
    const application = window.application;
    if (application && application.backendLintingEnabled()) {
        return null; // Results will be manually set via setLintResults.
    }

    // Dynamic import; webpack creates a separate bundle and loads it on demand.
    let Linter;
    try {
        Linter = (await
            import ( /* webpackChunkName: "eslint4b" */ 'eslint4b')).default;
    } catch (error) {
        // If we fail to load the chunk, do not run linting.
        if (error.name === 'ChunkLoadError') {
            return [];
        }
    }

    if (!client) {
        client = new Linter();
    }

    var result = [],
        config = getConfig('javascript');
    var errors = client.verify(text, config);
    for (var i = 0; i < errors.length; i++) {
        var error = errors[i];
        result.push({
            message: error.message,
            severity: getSeverity(error),
            from: getPos(error, true),
            to: getPos(error, false),
        });
    }
    return result;
});

function getPos(error, from) {
    var line = error.line - 1,
        ch = from ? error.column : error.column + 1;
    if (error.node && error.node.loc) {
        line = from ? error.node.loc.start.line - 1 : error.node.loc.end.line - 1;
        ch = from ? error.node.loc.start.column : error.node.loc.end.column;
    }
    return CodeMirror.Pos(line, ch - 1);
}

function getSeverity(error) {
    switch (error.severity) {
        case 1:
            return 'warning';
        case 2:
            return 'error';
        default:
            return 'error';
    }
}