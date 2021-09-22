/**
 *
 * Haskell syntax highlighting definitions for monaco editor
 * references https://github.com/microsoft/monaco-languages/blob/main/src/java/java.ts
 */
const HaskellHighlightRules = {
  // https://wiki.haskell.org/Keywords
  keywords: [
    'as',
    'case',
    'of',
    'class',
    'data',
    'data',
    'family',
    'data',
    'instance',
    'default',
    'deriving',
    'deriving',
    'instance',
    'do',
    'forall',
    'foreign',
    'hiding',
    'if',
    'then',
    'else',
    'import',
    'infix',
    'infixl',
    'infixr',
    'instance',
    'let',
    'in',
    'mdo',
    'module',
    'newtype',
    'proc',
    'qualified',
    'rec',
    'type',
    'type',
    'family',
    'type',
    'instance',
    'where',
    'print',
  ],

  // https://www.haskell.org/onlinereport/haskell2010/haskellch6.html
  // https://www.haskell.org/onlinereport/haskell2010/haskellch6.html#x13-1350006.4
  typeKeywords: ['Bool', 'String', 'Integer', 'Int', 'Float', 'Double'],

  operators: [
    '+',
    '-',
    '*',
    '/',
    '..',
    '&&',
    '||',
    '=',
    '>',
    '<',
    '==',
    '<=',
    '>=',
    '/=',
    '\\',
    '\\\\',
    ':',
    '++',
    '!!',
    '<-',
    '->',
    '::',
    '=>',
    '>>',
    '>>=',
    '>@>',
    '_',
    '~',
    '!',
    '@',
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

      // // whitespace
      { include: '@whitespace' },

      // // // numbers
      [/(@digits)[lL]?/, 'number'],

      // // strings
      [/"([^"\\]|\\.)*$/, 'string.invalid'], // non-teminated string
      [/"/, 'string', '@string'],
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
      [/--.*$/, 'comment'],
    ],

    string: [
      [/[^\\"]+/, 'string'],
      [/@escapes/, 'string.escape'],
      [/\\./, 'string.escape.invalid'],
      [/"/, 'string', '@pop'],
    ],
  },
};

export default HaskellHighlightRules;
