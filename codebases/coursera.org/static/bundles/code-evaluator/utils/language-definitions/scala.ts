/**
 *
 * scala syntax highlighting definitions for monaco editor
 * references https://github.com/microsoft/monaco-languages/blob/main/src/java/java.ts
 */

const ScalaHighlightRules = {
  keywords: [
    'case',
    'default',
    'do',
    'else',
    'for',
    'if',
    'match',
    'while',
    'throw',
    'return',
    'try',
    'true',
    'trye',
    'catch',
    'false',
    'finally',
    'yield',
    ' abstract',
    'class',
    'def',
    'extends',
    'final',
    'forSome',
    'implicit',
    'implicits',
    'import',
    'lazy',
    'new',
    'object',
    'null',
    'override',
    'package',
    'private',
    'protected',
    'sealed',
    'super',
    'this',
    'trait',
    'type',
    'val',
    'var',
    'with',
    'assert',
    'assume',
    'require',
    'print',
    'println',
    'printf',
    'readLine',
    'readBoolean',
    'readByte',
    'readShort',
    'readChar',
    'readInt',
    'readLong',
    'readFloat',
    'readDouble',
  ],

  typeKeywords: [
    'Long',
    'Float',
    'Char',
    'Int',
    'Byte',
    'Short',
    'Int',
    'Double',
    'String',
    'Boolean',
    'Unit',
    'Null',
    'Nothing',
    'Any',
    'AnyRef',
  ],

  operators: [
    '+',
    '-',
    '*',
    '/',
    '**',
    '%',
    '=',
    '>',
    '<',
    '==',
    '<=',
    '>=',
    '!=',
    '&&',
    '||',
    '!',
    '++',
    '--',
    '<<',
    '!',
    '~',
    '?',
    ':',
    '>>',
    '>>>',
    '+=',
    '-=',
    '*=',
    '/=',
    '&=',
    '|=',
    '^=',
    '%=',
    '<<=',
    '>>=',
    '>>>=',
  ],

  // common regular expressions
  symbols: /[=><!~?:&|+\-*/^%]+/,
  escapes: /\\(?:[abfnrtv\\"']|x[0-9A-Fa-f]{1,4}|u[0-9A-Fa-f]{4}|U[0-9A-Fa-f]{8})/,
  digits: /\d+(_+\d+)*/,
  octalDigits: /[0-7]+(_+[0-7]+)*/,
  binaryDigits: /[0-1]+(_+[0-1]+)*/,
  hexDigits: /[[0-9a-fA-F]+(_+[0-9a-fA-F]+)*/,

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
      [/(@digits)[eE]([-+]?(@digits))?[fFdD]?/, 'number.float'],
      [/(@digits)\.(@digits)([eE][-+]?(@digits))?[fFdD]?/, 'number.float'],
      [/0[xX](@hexDigits)[Ll]?/, 'number.hex'],
      [/0(@octalDigits)[Ll]?/, 'number.octal'],
      [/0[bB](@binaryDigits)[Ll]?/, 'number.binary'],
      [/(@digits)[fFdD]/, 'number.float'],
      [/(@digits)[lL]?/, 'number'],

      // delimiter: after number because of .\d floats
      [/[;,.]/, 'delimiter'],

      // strings
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
      [/\/\*/, 'comment', '@comment'],
      [/\/\/.*$/, 'comment'],
    ],

    comment: [
      [/[^/*]+/, 'comment'],
      [/\*\//, 'comment', '@pop'],
      [/[/*]/, 'comment'],
    ],

    string: [
      [/[^\\"]+/, 'string'],
      [/@escapes/, 'string.escape'],
      [/\\./, 'string.escape.invalid'],
      [/"/, 'string', '@pop'],
    ],
  },
};

export default ScalaHighlightRules;
