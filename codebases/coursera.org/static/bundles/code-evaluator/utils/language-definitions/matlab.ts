/**
 *
 * matlab syntax highlighting definitions for monaco editor
 * references https://github.com/microsoft/monaco-languages/blob/main/src/java/java.ts
 */

const MatlabHighlightRules = {
  keywords: [
    'break',
    'case',
    'catch',
    'continue',
    'else',
    'elseif',
    'end',
    'for',
    'function',
    'global',
    'if',
    'otherwise',
    'persistent',
    'return',
    'switch',
    'try',
    'while',
    'true',
    'false',
    'inf',
    'Inf',
    'nan',
    'NaN',
    'eps',
    'pi',
    'ans',
    'nargin',
    'nargout',
    'varargin',
    'varargout',
  ],

  // https://www.mathworks.com/help/matlab/numeric-types.html
  typeKeywords: [
    'cell',
    'struct',
    'char',
    'double',
    'single',
    'logical',
    'int8',
    'int16',
    'int32',
    'int64)',
    'uint8',
    'uint16',
    'uint32',
    'uint64)',
    'sparse',
  ],

  operators: [
    '+',
    '-',
    '*',
    '.*',
    '=',
    '/',
    './',
    '\\',
    '.\\',
    '^',
    '.^',
    "'",
    '.',
    '<',
    '<=',
    '>',
    '>=',
    '==',
    '~=',
    '&',
    '|',
    '^',
  ],

  // common regular expressions
  symbols: /[=><!~?:&|+\-*/^%]+/,
  escapes: /\\(?:[abfnrtv\\"']|x[0-9A-Fa-f]{1,4}|u[0-9A-Fa-f]{4}|U[0-9A-Fa-f]{8})/,
  digits: /\d+(_+\d+)*/,

  tokenizer: {
    root: [{ include: 'common' }],

    common: [
      // identifiers and keywords
      [
        /[a-z_$][\w$]*/,
        {
          cases: {
            '@typeKeywords': 'keyword',
            '@keywords': 'keyword',
            '@default': 'identifier',
          },
        },
      ],

      [/[A-Z][\w$]*/, 'type.identifier'], // support syntax highlighting for class names

      // whitespace
      { include: '@whitespace' },

      // // numbers
      [/(@digits)[lL]?/, 'number'],

      // strings
      [/'([^'\\]|\\.)*$/, 'string.invalid'], // non-teminated string
      [/'/, 'string', '@string'],
      [
        /@symbols/,
        {
          cases: {
            '@operators': 'delimiter',
            '@default': '',
          },
        },
      ],
    ],

    whitespace: [
      [/[ \t\r\n]+/, ''],
      [/%{/, 'comment', '@comment'],
      [/%.*/, 'comment'],
    ],

    comment: [
      [/[^%{]+/, 'comment'],
      [/%\}/, 'comment', '@pop'],
    ],

    string: [
      [/[^\\']+/, 'string'],
      [/@escapes/, 'string.escape'],
      [/\\./, 'string.escape.invalid'],
      [/'/, 'string', '@pop'],
    ],
  },
};

export default MatlabHighlightRules;
