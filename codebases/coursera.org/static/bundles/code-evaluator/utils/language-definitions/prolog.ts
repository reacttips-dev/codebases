/**
 *
 * prolog syntax highlighting definitions for monaco editor
 * references https://github.com/microsoft/monaco-languages/blob/main/src/java/java.ts
 */

const PrologHighlightRules = {
  keywords: [
    'if',
    'write',
    'forall',
    'abs',
    'atan',
    'cos',
    'exp',
    'log',
    'sin',
    'sqrt',
    'tan',
    'sign',
    'float',
    'floor',
    'truncate',
    'round',
    'ceiling',
    'true',
    'false',
  ],

  typeKeywords: ['float', 'integer'],

  operators: ['+', '-', '*', '/', '\\', '==', '@<', '@=<', '@>', '@>=', '<<', '>>', '**', 'mod', 'rem', '='],

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
      [/\/\*/, 'comment', '@comment'],
      [/%.*/, 'comment'],
    ],

    comment: [
      [/[^*]+/, 'comment'],
      [/\*\//, 'comment', '@pop'],
      [/[*]/, 'comment'],
    ],
    string: [
      [/[^\\']+/, 'string'],
      [/@escapes/, 'string.escape'],
      [/\\./, 'string.escape.invalid'],
      [/'/, 'string', '@pop'],
    ],
  },
};

export default PrologHighlightRules;
