export const VIEW_MODES = {
  PRETTY: 'pretty',
  RAW: 'raw',
  PREVIEW: 'preview'
};

export const MONACO_THEMES = {
  LIGHT: 'vs-light',
  DARK: 'vs-dark',
  POSTMAN_LIGHT: 'postmanThemeLight',
  POSTMAN_DARK: 'postmanThemeDark'
};

export const THEME_MAP = {
  light: MONACO_THEMES.POSTMAN_LIGHT,
  dark: MONACO_THEMES.POSTMAN_DARK
};

export const LANGUAGE_PLAINTEXT = 'plaintext';

export const EDITOR_FEEDBACK_STATES = {
  FORMATTING: 'Formatting...'
};

// Since monaco has different names for few languages. Hence creating a map for it.
export const TEXT_EDITOR_LANGUAGE_MAP = {
  'text': 'plaintext',
  'c_cpp': 'cpp',
  'golang': 'go',
  'objectivec': 'objective-c',
  'ocaml': 'fsharp', // ocaml files have .ml as extension and fsharp language in monaco supports .ml extensions. https://github.com/microsoft/monaco-languages/blob/master/src/fsharp/fsharp.contribution.ts
  'graphql_sdl': 'graphql'
};

// List of all of the text editor settings which can be customized via Settings modal
export const CUSTOMIZABLE_TEXT_EDITOR_SETTINGS = [
  'editorFontFamily',
  'responseFontSize',
  'editorIndentCount',
  'editorIndentType',
  'editorAutoCloseBrackets',
  'editorAutoCloseQuotes',
  'editorRenderNonPrintable'
];

export const TEXT_EDITOR_VALIDATION_MESSAGE_LEVEL = {
  INFO: 1,
  WARNING: 2,
  ERROR: 3
};

export const TEXT_EDITOR_DEFAULT_SETTINGS = {
  FONT_SIZE: 12,
  INDENT_COUNT: 4,
  INDENT_TYPE: 'space',
  AUTO_CLOSE_BRACKETS: true,
  AUTO_CLOSE_QUOTES: true,
  RENDER_NON_PRINTABLE: false
};
