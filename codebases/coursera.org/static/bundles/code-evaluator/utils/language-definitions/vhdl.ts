/**
 *
 * VHDL syntax highlighting definitions for monaco editor
 * references https://github.com/microsoft/monaco-languages/blob/main/src/java/java.ts
 */
const VhdlHighlightRules = {
  keywords: [
    'access',
    'after',
    'ailas',
    'all',
    'architecture',
    'assert',
    'attribute',
    'begin',
    'block',
    'buffer',
    'bus',
    'case',
    'component',
    'configuration',
    'disconnect',
    'downto',
    'else',
    'elsif',
    'end',
    'entity',
    'file',
    'for',
    'function',
    'generate',
    'generic',
    'guarded',
    'if',
    'impure',
    'in',
    'inertial',
    'inout',
    'is',
    'label',
    'linkage',
    'literal',
    'loop',
    'mapnew',
    'next',
    'of',
    'on',
    'open',
    'others',
    'out',
    'port',
    'process',
    'pure',
    'range',
    'record',
    'reject',
    'report',
    'return',
    'select',
    'severity',
    'shared',
    'signal',
    'subtype',
    'then',
    'to',
    'transport',
    'type',
    'unaffected',
    'united',
    'until',
    'wait',
    'when',
    'while',
    'with',
    'true',
    'false',
  ],
  // https://github.com/ajaxorg/ace/blob/master/lib/ace/mode/vhdl_highlight_rules.js#L49
  typeKeywords: [
    'bit',
    'bit_vector',
    'boolean',
    'character',
    'integer',
    'line',
    'natural',
    'positive',
    'real',
    'register',
    'signed',
    'std_logic',
    'std_logic_vector',
    'string',
    '',
    'text',
    'time',
    'unsigned',
    'variable',
  ],

  operators: [
    '+',
    '-',
    '*',
    '**',
    '=',
    '/=',
    '<',
    '>',
    '<=',
    '>=',
    'abs',
    'and',
    'mod',
    'nand',
    'nor',
    'not',
    'rem',
    'rol',
    'ror',
    'sla',
    'sll',
    'sra',
    'srl',
    'xnor',
    'xor',
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

export default VhdlHighlightRules;
