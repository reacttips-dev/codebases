type CodeLanguage = {
  name: string;
  value: string;
};

/**
 * Supported languages for code in CML.
 * When you add a new language, be sure to include support for that language in the monaco editor plugin https://github.com/webedx-spark/web/blob/main/config/webpack/plugins/index.ts#L36
 *
 * @type {Array}
 */
// TODO: Generate types based on `name` and `value`
export const codeLanguages: Array<CodeLanguage> = [
  {
    name: 'JavaScript',
    value: 'javascript',
  },

  {
    name: 'HTML',
    value: 'html',
  },

  {
    name: 'CSS',
    value: 'css',
  },

  {
    name: 'Scala',
    value: 'scala',
  },

  {
    name: 'Java',
    value: 'java',
  },

  {
    name: 'Python',
    value: 'python',
  },

  {
    name: 'JSON',
    value: 'json',
  },

  {
    name: 'PHP',
    value: 'php',
  },

  {
    name: 'Ruby',
    value: 'ruby',
  },

  {
    name: 'R',
    value: 'r',
  },

  {
    name: 'SQL',
    value: 'sql',
  },

  {
    name: 'Perl',
    value: 'perl',
  },

  {
    name: 'XML',
    value: 'xml',
  },

  {
    name: 'Objective C',
    value: 'objectivec',
  },

  {
    name: 'Shell Script',
    value: 'sh',
  },

  {
    name: 'MATLAB',
    value: 'matlab',
  },

  {
    name: 'C and C++',
    value: 'c_cpp',
  },

  {
    name: 'Swift',
    value: 'swift',
  },

  {
    name: 'LaTeX',
    value: 'latex',
  },

  {
    name: 'Plain Text',
    value: 'plain_text',
  },

  {
    name: 'Haskell',
    value: 'haskell',
  },

  {
    name: 'VHDL',
    value: 'vhdl',
  },

  {
    name: 'OCaml',
    value: 'ocaml',
  },

  {
    name: 'Scheme',
    value: 'scheme',
  },

  {
    name: 'Prolog',
    value: 'prolog',
  },
  {
    name: 'Yaml',
    value: 'yaml',
  },
  {
    name: 'Dockerfile',
    value: 'dockerfile',
  },
];

// Map Monaco editor language keys  to Ace Editor to language keys
export const languageMapper = {
  javascript: 'javascript',
  html: 'html',
  css: 'css',
  java: 'java',
  python: 'python',
  json: 'json',
  php: 'php',
  ruby: 'ruby',
  r: 'r',
  sql: 'sql',
  perl: 'perl',
  xml: 'xml',
  objectivec: 'objective-c',
  sh: 'shell',
  c_cpp: 'cpp', // eslint-disable-line camelcase
  swift: 'swift',
  plain_text: 'plaintext', // eslint-disable-line camelcase
  scheme: 'scheme',
  yaml: 'yaml',
  scala: 'scala',
  haskell: 'haskell',
  ocaml: 'ocaml',
  prolog: 'prolog',
  latex: 'latex',
  matlab: 'matlab',
  vhdl: 'vhdl',
  dockerfile: 'dockerfile',
} as const;

export type LanguageType = keyof typeof languageMapper;

export const isLanguageType = (val?: string): val is LanguageType =>
  !!val && codeLanguages.some((language) => language.value === val);

export default codeLanguages;
