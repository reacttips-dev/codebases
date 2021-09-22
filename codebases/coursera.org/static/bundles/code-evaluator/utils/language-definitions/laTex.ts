/**
 *
 * LaTex syntax highlighting definitions for monaco editor
 * https://github.com/microsoft/monaco-languages/
 */

const LaTexHighlightRules = {
  digits: /\d+(_+\d+)*/,

  tokenizer: {
    root: [{ include: 'common' }],

    common: [
      [/\B\\\w+/, 'keyword'],
      [/\{.*?\}/, 'type.identifier'],

      // numbers
      [/(@digits)[lL]?/, 'number'],
    ],
  },
};

export default LaTexHighlightRules;
