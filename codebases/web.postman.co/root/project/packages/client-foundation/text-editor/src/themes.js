import { light, dark } from '@postman/aether';

export const themes = [];

themes.push({
  id: 'postmanThemeLight',
  props: { 'base': 'vs', 'inherit': true, 'colors': { 'editor.background': light['background-color-primary'] }, 'rules': [{ 'token': 'comment', 'foreground': '#5F8FBF', 'fontStyle': '' }, { 'token': 'string', 'foreground': '#2A00FF', 'fontStyle': '' }, { 'token': 'constant.character.escape', 'foreground': '#7090FF', 'fontStyle': '' }, { 'token': 'constant.other.placeholder', 'foreground': '#7090FF', 'fontStyle': '' }, { 'token': 'constant.numeric', 'foreground': '#FF00AA', 'fontStyle': '' }, { 'token': 'keyword.other.unit', 'foreground': '#FF00AA', 'fontStyle': '' }, { 'token': 'keyword', 'foreground': '#800555', 'fontStyle': 'bold' }, { 'token': 'storage.type.primitive', 'foreground': '#800555', 'fontStyle': 'bold' }, { 'token': 'storage.type.class', 'foreground': '#800555', 'fontStyle': 'bold' }, { 'token': 'storage.type.struct', 'foreground': '#800555', 'fontStyle': 'bold' }, { 'token': 'storage.type.enum', 'foreground': '#800555', 'fontStyle': 'bold' }, { 'token': 'storage.type.modifier', 'foreground': '#800555', 'fontStyle': 'bold' }, { 'token': 'storage.type.namespace', 'foreground': '#800555', 'fontStyle': 'bold' }, { 'token': 'storage.type.template', 'foreground': '#800555', 'fontStyle': 'bold' }, { 'token': 'storage.type.function', 'foreground': '#800555', 'fontStyle': 'bold' }, { 'token': 'storage.type.union', 'foreground': '#800555', 'fontStyle': 'bold' }, { 'token': 'storage.type.js', 'foreground': '#800555', 'fontStyle': 'bold' }, { 'token': 'storage.type.interface', 'foreground': '#800555', 'fontStyle': 'bold' }, { 'token': 'storage.type.impl', 'foreground': '#800555', 'fontStyle': 'bold' }, { 'token': 'storage.type.trait', 'foreground': '#800555', 'fontStyle': 'bold' }, { 'token': 'storage.modifier', 'foreground': '#800555', 'fontStyle': 'bold' }, { 'token': 'keyword.operator.new', 'foreground': '#800555', 'fontStyle': 'bold' }, { 'token': 'keyword.operator.delete', 'foreground': '#800555', 'fontStyle': 'bold' }, { 'token': 'keyword.operator.word', 'foreground': '#800555', 'fontStyle': 'bold' }, { 'token': 'keyword.operator.sizeof', 'foreground': '#800555', 'fontStyle': 'bold' }, { 'token': 'keyword.operator.alignof', 'foreground': '#800555', 'fontStyle': 'bold' }, { 'token': 'keyword.operator.logical.python', 'foreground': '#800555', 'fontStyle': 'bold' }, { 'token': 'constant.language', 'foreground': '#800555', 'fontStyle': 'bold' }, { 'token': 'variable.language', 'foreground': '#800555', 'fontStyle': 'bold' }, { 'token': 'keyword.declaration.function', 'foreground': '#800555', 'fontStyle': 'bold' }, { 'token': 'keyword.declaration.class', 'foreground': '#800555', 'fontStyle': 'bold' }, { 'token': 'keyword.declaration.struct', 'foreground': '#800555', 'fontStyle': 'bold' }, { 'token': 'keyword.declaration.enum', 'foreground': '#800555', 'fontStyle': 'bold' }, { 'token': 'keyword.declaration.union', 'foreground': '#800555', 'fontStyle': 'bold' }, { 'token': 'keyword.declaration.trait', 'foreground': '#800555', 'fontStyle': 'bold' }, { 'token': 'keyword.declaration.interface', 'foreground': '#800555', 'fontStyle': 'bold' }, { 'token': 'keyword.declaration.impl', 'foreground': '#800555', 'fontStyle': 'bold' }, { 'token': 'keyword.declaration.type', 'foreground': '#800555', 'fontStyle': 'bold' }, { 'token': 'keyword.operator', 'foreground': '#000000', 'fontStyle': '' }, { 'token': 'entity.name.type', 'foreground': '#800555', 'fontStyle': '' }, { 'token': 'storage.type', 'foreground': '#800555', 'fontStyle': '' }, { 'token': 'entity.name.type.template', 'foreground': '#336633', 'fontStyle': 'bold' }, { 'token': 'meta.kernel-call punctuation.section.kernel', 'foreground': '#336633', 'fontStyle': 'bold' }, { 'token': 'meta.kernel-call entity.name.function', 'foreground': '#336633', 'fontStyle': '' }, { 'token': 'variable.other.member', 'foreground': '#333333', 'fontStyle': '' }, { 'token': 'variable.other.property', 'foreground': '#333333', 'fontStyle': '' }, { 'token': 'entity.name.function', 'foreground': '#000000', 'fontStyle': 'bold' }, { 'token': 'meta.preprocessor', 'foreground': '#808080', 'fontStyle': '' }, { 'token': 'meta.preprocessor keyword.control.directive', 'foreground': '#7F3F6A', 'fontStyle': 'bold' }, { 'token': 'meta.preprocessor string.quoted', 'foreground': '#9580FF', 'fontStyle': '' }, { 'token': 'support.function', 'foreground': '#642880', 'fontStyle': 'bold' }, { 'token': 'support.type.python', 'foreground': '#642880', 'fontStyle': 'bold' }, { 'token': 'support.type.posix-reserved', 'foreground': '#642880', 'fontStyle': 'bold' }, { 'token': 'variable.parameter.function.language.special.self', 'foreground': '#000000', 'fontStyle': 'italic' }, { 'token': 'variable.language.special.self', 'foreground': '#000000', 'fontStyle': 'italic' }, { 'token': 'variable.parameter.function.language.special.cls', 'foreground': '#000000', 'fontStyle': 'italic' }, { 'token': 'variable.language.special.cls', 'foreground': '#000000', 'fontStyle': 'italic' }, { 'token': 'entity.name.function.decorator', 'foreground': '#7D7D7D', 'fontStyle': 'italic' }, { 'token': 'string.quoted.docstring', 'foreground': '#406080', 'fontStyle': '' }, { 'token': 'entity.name.tag', 'foreground': '#800555', 'fontStyle': 'bold' }, { 'token': 'entity.other.attribute-name', 'foreground': '#800555', 'fontStyle': '' }, { 'token': 'meta.tag.preprocessor entity.name.tag', 'foreground': '#5F8FBF', 'fontStyle': 'italic' }, { 'token': 'meta.tag.preprocessor entity.other.attribute-name', 'foreground': '#5F8FBF', 'fontStyle': 'italic' }, { 'token': 'meta.tag.preprocessor string', 'foreground': '#5F8FBF', 'fontStyle': 'italic' }, { 'token': 'meta.tag.preprocessor text', 'foreground': '#5F8FBF', 'fontStyle': 'italic' }, { 'token': 'meta.tag.metadata.doctype entity.name.tag', 'foreground': '#5F8FBF', 'fontStyle': 'italic' }, { 'token': 'meta.tag.metadata.doctype entity.other.attribute-name', 'foreground': '#5F8FBF', 'fontStyle': 'italic' }, { 'token': 'meta.tag.metadata.doctype string', 'foreground': '#5F8FBF', 'fontStyle': 'italic' }, { 'token': 'meta.tag.metadata.doctype text', 'foreground': '#5F8FBF', 'fontStyle': 'italic' }, { 'token': 'entity.name.section', 'foreground': '#800555', 'fontStyle': 'bold' }, { 'token': 'punctuation.definition.heading', 'foreground': '#800555', 'fontStyle': 'bold' }, { 'token': 'markup.inline.raw', 'foreground': '#FF00AA', 'fontStyle': '' }, { 'token': 'punctuation.definition.raw', 'foreground': '#FF00AA', 'fontStyle': '' }, { 'token': 'punctuation.definition.list', 'foreground': '#000000', 'fontStyle': 'bold' }, { 'token': 'markup.bold', 'foreground': '#000000', 'fontStyle': 'bold' }, { 'token': 'markup.underline', 'foreground': '#000000', 'fontStyle': 'underline' }, { 'token': 'markup.italic', 'foreground': '#000000', 'fontStyle': 'italic' }, { 'token': 'keyword.codetag', 'foreground': '#86A3BF', 'fontStyle': 'bold' }, { 'token': 'support', 'foreground': '#336633', 'fontStyle': '' }, { 'token': 'token.info-token', 'foreground': '#316BCD' }, { 'token': 'token.warn-token', 'foreground': '#CD9731' }, { 'token': 'token.error-token', 'foreground': '#CD3131' }, { 'token': 'token.debug-token', 'foreground': '#800080' }, { 'token': 'postman.variable.json', 'foreground': '#F26B3A', 'fontStyle': 'italic' }, { 'token': 'postman.variable.string.json', 'foreground': '#F26B3A', 'fontStyle': 'italic' }, { 'token': 'key.identifier', 'foreground': '#7f0055' }, { 'token': 'argument.identifier', 'foreground': '#7f007f' }, { 'token': 'graphql.types', 'foreground': '#7f007f' }] }
});

themes.push({
  id: 'postmanThemeDark',
  props: { 'base': 'vs-dark', 'inherit': true, 'colors': { 'activityBar.background': '#282828', 'activityBar.foreground': '#f8f8f2', 'badge.background': '#75715e', 'badge.foreground': '#f8f8f2', 'button.background': '#75715e', 'debugToolBar.background': '#1e1f1c', 'diffEditor.insertedTextBackground': '#4b661680', 'diffEditor.removedTextBackground': '#90274a70', 'dropdown.background': '#414339', 'dropdown.listBackground': '#1e1f1c', 'editor.background': dark['background-color-primary'], 'editor.foreground': '#f8f8f2', 'editor.lineHighlightBackground': '#3e3d32', 'editor.selectionBackground': '#878b9180', 'editor.selectionHighlightBackground': '#575b6180', 'editor.wordHighlightBackground': '#4a4a7680', 'editor.wordHighlightStrongBackground': '#6a6a9680', 'editorCursor.foreground': '#f8f8f0', 'editorGroup.border': '#34352f', 'editorGroup.dropBackground': '#41433980', 'editorGroupHeader.tabsBackground': '#1e1f1c', 'editorHoverWidget.background': '#414339', 'editorHoverWidget.border': '#75715e', 'editorIndentGuide.activeBackground': '#767771', 'editorIndentGuide.background': '#464741', 'editorLineNumber.activeForeground': '#c2c2bf', 'editorLineNumber.foreground': '#90908a', 'editorSuggestWidget.background': '#272822', 'editorSuggestWidget.border': '#75715e', 'editorWhitespace.foreground': '#464741', 'editorWidget.background': '#1e1f1c', 'focusBorder': '#75715e', 'input.background': '#414339', 'inputOption.activeBorder': '#75715e', 'inputValidation.errorBackground': '#90274a', 'inputValidation.errorBorder': '#f92672', 'inputValidation.infoBackground': '#546190', 'inputValidation.infoBorder': '#819aff', 'inputValidation.warningBackground': '#848528', 'inputValidation.warningBorder': '#e2e22e', 'list.activeSelectionBackground': '#75715e', 'list.dropBackground': '#414339', 'list.focusBackground': '#414339', 'list.highlightForeground': '#f8f8f2', 'list.hoverBackground': '#3e3d32', 'list.inactiveSelectionBackground': '#414339', 'menu.background': '#1e1f1c', 'menu.foreground': '#cccccc', 'minimap.selectionHighlight': '#878b9180', 'panel.border': '#414339', 'panelTitle.activeBorder': '#75715e', 'panelTitle.activeForeground': '#f8f8f2', 'panelTitle.inactiveForeground': '#75715e', 'peekView.border': '#75715e', 'peekViewEditor.background': '#272822', 'peekViewEditor.matchHighlightBackground': '#75715e', 'peekViewResult.background': '#1e1f1c', 'peekViewResult.matchHighlightBackground': '#75715e', 'peekViewResult.selectionBackground': '#414339', 'peekViewTitle.background': '#1e1f1c', 'pickerGroup.foreground': '#75715e', 'progressBar.background': '#75715e', 'selection.background': '#ccccc7', 'settings.numberInputBackground': '#32342d', 'settings.textInputBackground': '#32342d', 'sideBar.background': '#1e1f1c', 'sideBarSectionHeader.background': '#272822', 'statusBar.background': '#414339', 'statusBar.debuggingBackground': '#75715e', 'statusBar.noFolderBackground': '#414339', 'statusBarItem.remoteBackground': '#ac6218', 'tab.border': '#1e1f1c', 'tab.inactiveBackground': '#34352f', 'tab.inactiveForeground': '#ccccc7', 'terminal.ansiBlack': '#333333', 'terminal.ansiBlue': '#6a7ec8', 'terminal.ansiBrightBlack': '#666666', 'terminal.ansiBrightBlue': '#819aff', 'terminal.ansiBrightCyan': '#66d9ef', 'terminal.ansiBrightGreen': '#a6e22e', 'terminal.ansiBrightMagenta': '#ae81ff', 'terminal.ansiBrightRed': '#f92672', 'terminal.ansiBrightWhite': '#f8f8f2', 'terminal.ansiBrightYellow': '#e2e22e', 'terminal.ansiCyan': '#56adbc', 'terminal.ansiGreen': '#86b42b', 'terminal.ansiMagenta': '#8c6bc8', 'terminal.ansiRed': '#c4265e', 'terminal.ansiWhite': '#e3e3dd', 'terminal.ansiYellow': '#b3b42b', 'titleBar.activeBackground': '#1e1f1c', 'widget.shadow': '#000000' }, 'rules': [{ 'token': 'meta.embedded', 'foreground': '#F8F8F2' }, { 'token': 'source.groovy.embedded', 'foreground': '#F8F8F2' }, { 'token': 'comment', 'foreground': '#88846F' }, { 'token': 'string', 'foreground': '#E6DB74' }, { 'token': 'punctuation.definition.template-expression', 'foreground': '#F92672' }, { 'token': 'punctuation.section.embedded', 'foreground': '#F92672' }, { 'token': 'meta.template.expression', 'foreground': '#F8F8F2' }, { 'token': 'constant.numeric', 'foreground': '#AE81FF' }, { 'token': 'constant.language', 'foreground': '#AE81FF' }, { 'token': 'constant.character', 'foreground': '#AE81FF' }, { 'token': 'constant.other', 'foreground': '#AE81FF' }, { 'token': 'variable', 'foreground': '#F8F8F2', 'fontStyle': '' }, { 'token': 'keyword', 'foreground': '#F92672' }, { 'token': 'storage', 'foreground': '#F92672', 'fontStyle': '' }, { 'token': 'storage.type', 'foreground': '#66D9EF', 'fontStyle': 'italic' }, { 'token': 'entity.name.type', 'foreground': '#A6E22E', 'fontStyle': 'underline' }, { 'token': 'entity.name.class', 'foreground': '#A6E22E', 'fontStyle': 'underline' }, { 'token': 'entity.name.namespace', 'foreground': '#A6E22E', 'fontStyle': 'underline' }, { 'token': 'entity.name.scope-resolution', 'foreground': '#A6E22E', 'fontStyle': 'underline' }, { 'token': 'entity.other.inherited-class', 'foreground': '#A6E22E', 'fontStyle': 'italic underline' }, { 'token': 'entity.name.function', 'foreground': '#A6E22E', 'fontStyle': '' }, { 'token': 'variable.parameter', 'foreground': '#FD971F', 'fontStyle': 'italic' }, { 'token': 'entity.name.tag', 'foreground': '#F92672', 'fontStyle': '' }, { 'token': 'entity.other.attribute-name', 'foreground': '#A6E22E', 'fontStyle': '' }, { 'token': 'support.function', 'foreground': '#66D9EF', 'fontStyle': '' }, { 'token': 'support.constant', 'foreground': '#66D9EF', 'fontStyle': '' }, { 'token': 'support.type', 'foreground': '#66D9EF', 'fontStyle': 'italic' }, { 'token': 'support.class', 'foreground': '#66D9EF', 'fontStyle': 'italic' }, { 'token': 'support.other.variable', 'fontStyle': '' }, { 'token': 'invalid', 'foreground': '#F8F8F0', 'fontStyle': '' }, { 'token': 'invalid.deprecated', 'foreground': '#F8F8F0' }, { 'token': 'meta.structure.dictionary.json string.quoted.double.json', 'foreground': '#CFCFC2' }, { 'token': 'meta.diff', 'foreground': '#75715E' }, { 'token': 'meta.diff.header', 'foreground': '#75715E' }, { 'token': 'markup.deleted', 'foreground': '#F92672' }, { 'token': 'markup.inserted', 'foreground': '#A6E22E' }, { 'token': 'markup.changed', 'foreground': '#E6DB74' }, { 'token': 'constant.numeric.line-number.find-in-files - match', 'foreground': '#AE81FFA0' }, { 'token': 'entity.name.filename.find-in-files', 'foreground': '#E6DB74' }, { 'token': 'markup.quote', 'foreground': '#F92672' }, { 'token': 'markup.list', 'foreground': '#E6DB74' }, { 'token': 'markup.bold', 'foreground': '#66D9EF' }, { 'token': 'markup.italic', 'foreground': '#66D9EF' }, { 'token': 'markup.inline.raw', 'foreground': '#FD971F', 'fontStyle': '' }, { 'token': 'markup.heading', 'foreground': '#A6E22E' }, { 'token': 'markup.heading.setext', 'foreground': '#A6E22E', 'fontStyle': 'bold' }, { 'token': 'markup.heading.markdown', 'fontStyle': 'bold' }, { 'token': 'markup.quote.markdown', 'foreground': '#75715E', 'fontStyle': 'italic' }, { 'token': 'markup.bold.markdown', 'fontStyle': 'bold' }, { 'token': 'string.other.link.title.markdown', 'foreground': '#AE81FF' }, { 'token': 'string.other.link.description.markdown', 'foreground': '#AE81FF' }, { 'token': 'markup.underline.link.markdown', 'foreground': '#E6DB74' }, { 'token': 'markup.underline.link.image.markdown', 'foreground': '#E6DB74' }, { 'token': 'markup.italic.markdown', 'fontStyle': 'italic' }, { 'token': 'markup.list.unnumbered.markdown', 'foreground': '#F8F8F2' }, { 'token': 'markup.list.numbered.markdown', 'foreground': '#F8F8F2' }, { 'token': 'punctuation.definition.list.begin.markdown', 'foreground': '#A6E22E' }, { 'token': 'token.info-token', 'foreground': '#6796E6' }, { 'token': 'token.warn-token', 'foreground': '#CD9731' }, { 'token': 'token.error-token', 'foreground': '#F44747' }, { 'token': 'token.debug-token', 'foreground': '#B267E6' }, { 'token': 'variable.language', 'foreground': '#FD971F' }, { 'token': 'postman.variable.json', 'foreground': '#F26B3A', 'fontStyle': 'italic' }, { 'token': 'postman.variable.string.json', 'foreground': '#F26B3A', 'fontStyle': 'italic' }, { 'token': 'key.identifier', 'foreground': '#ffe200' }, { 'token': 'argument.identifier', 'foreground': '#fd971f' }, { 'token': 'graphql.types', 'foreground': '#66d9ef' }] }
});

// Utils to transform the VS Code themes to Monaco Themes
// https://github.com/codesandbox/codesandbox-client/blob/master/packages/app/src/embed/components/Content/Monaco/define-theme.js

const colorsAllowed = ({ foreground, background }) => {
  if (foreground === 'inherit' || background === 'inherit') {
    return false;
  }

  return true;
};

const getTheme = (theme) => {
  const { tokenColors = [], colors = {} } = theme;
  const rules = tokenColors
    .filter((t) => t.settings && t.scope && colorsAllowed(t.settings))
    .reduce((acc, token) => {
      const settings = {
        foreground: token.settings.foreground,
        background: token.settings.background,
        fontStyle: token.settings.fontStyle
      };

      const scope =
        typeof token.scope === 'string'
          ? token.scope.split(',').map((a) => a.trim())
          : token.scope;

      scope.map((s) =>
        acc.push({
          token: s,
          ...settings
        })
      );

      return acc;
    }, []);

  const newColors = colors;
  Object.keys(colors).forEach((c) => {
    if (newColors[c]) return c;

    delete newColors[c];

    return c;
  });

  return {
    colors: newColors,
    rules,
    type: theme.type
  };
};

const getBase = (type) => {
  if (type === 'dark') {
    return 'vs-dark';
  }

  if (type === 'hc') {
    return 'hc-black';
  }

  return 'vs';
};

// VS Code and monaco themes are not directly compatible with each other.
// This function converts a given VS Code theme to Monaco supported one and adds it to  the monaco.
// Currently, it is not being referenced, but in the future if a feature is added in the text-editor
// to support custom themes, wherein user can give and VS code theme, which can be passed to this function
export const defineTheme = (monaco, name, theme) => {
  if (theme && monaco.editor.defineTheme) {
    const transformedTheme = getTheme(theme);

    try {
      monaco.editor.defineTheme(name, {
        base: getBase(transformedTheme.type),
        inherit: true,
        colors: transformedTheme.colors,
        rules: transformedTheme.rules
      });
    } catch (e) {
      _.noop();
    }
  }
};
