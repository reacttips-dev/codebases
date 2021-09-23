const CodeMirror = require('codemirror');

require('./loadmodeWebpack');
require('codemirror/addon/mode/simple');
require('codemirror/addon/mode/overlay');
require('codemirror/addon/mode/multiplex');

require('codemirror/mode/meta');

require('./sublime');

require('codemirror/addon/fold/foldcode');
require('codemirror/addon/fold/foldgutter');
require('codemirror/addon/fold/brace-fold');
require('codemirror/addon/fold/xml-fold');
require('codemirror/addon/fold/markdown-fold');
require('codemirror/addon/fold/comment-fold');

require('codemirror/addon/selection/active-line');

require('codemirror/addon/edit/matchbrackets');
require('codemirror/addon/edit/closebrackets');
require('codemirror/addon/edit/closetag');
require('codemirror/addon/edit/matchtags');

require('codemirror/addon/comment/comment');

require('codemirror/addon/scroll/annotatescrollbar');
require('codemirror/addon/scroll/scrollpastend');

require('codemirror/addon/dialog/dialog');

require('codemirror/addon/search/searchcursor');
require('codemirror/addon/search/matchesonscrollbar');
require('codemirror/addon/search/match-highlighter');
require('./search');
require('codemirror/addon/search/jump-to-line');

require('./linting/lint');
require('./linting/eslint');
require('./linting/jsonlint');
require('./linting/htmlhint');

// Support mjs file extension
CodeMirror.findModeByName('javascript').ext.push('mjs');

// Add ReasonML extension, same parsing as Rust apparently
CodeMirror.findModeByName('rust').ext.push('re');

// Add frag and glsl modes
CodeMirror.modeInfo.unshift({
    name: 'Shader',
    mime: 'x-shader/x-fragment',
    mode: 'clike',
    ext: ['frag', 'glsl'],
});

// Add handlebars mode, with svelte as extension
// TODO: get svelte its own mode
CodeMirror.modeInfo.unshift({
    name: 'Handlebars',
    mime: 'text/x-handlebars-template',
    mode: 'handlebars',
    ext: ['hbs', 'handlebars', 'svelte', 'njk', 'eta'],
});

// Add dotenv mode
CodeMirror.modeInfo.unshift({
    name: 'Dotenv',
    mime: 'text/x-dotenv',
    mode: 'dotenv',
    ext: ['env'],
});

// jsx by default
CodeMirror.findModeByName('js').mime = 'text/jsx';
CodeMirror.findModeByName('js').mode = 'jsx';

CodeMirror.defineInitHook((instance) => {
    // automatically load 'htmlmixed' mode when we swap to 'handlebars' mode
    instance.on('optionChange', (_i, option) => {
        const value = instance.getOption(option);
        if (option === 'mode' && value.name === 'handlebars') {
            CodeMirror.autoLoadMode(instance, value.base);
        }
    });
});

export const MODE_CONFIG = {
    handlebars: {
        base: 'htmlmixed',
    },
};

export default CodeMirror;