// Retaining same shortcut trigger as ace editor's shortcut
// refer https://github.com/ajaxorg/ace/wiki/Default-Keyboard-Shortcuts

const macOSKeyMaps = {
  handleFoldAll: 'mod+alt+0',
  handleUnfoldAll: 'mod+alt+shift+0',
  handleFoldSelection: ['mod+alt+l', 'mod+f1'],
  handleUnfoldSelection: ['mod+alt+shift+l', 'mod+shift+f1'],
  handleJumpToMatchingBracket: 'ctrl+p',
  handleFormatDocument: 'mod+b',
  handleDeleteLine: 'mod+d',
  handleDuplicateSelection: 'mod+shift+d',
  handleToUpperCase: 'ctrl+u',
  handleToLowerCase: 'ctrl+shift+u',
  handleSelectionToBracket: 'ctrl+shift+p',
  handleToggleComment: 'mod+/'
};

const windowsLinuxKeyMaps = {
  handleFoldAll: 'alt+0',
  handleUnfoldAll: 'alt+shift+0',
  handleFoldSelection: ['alt+l', 'mod+f1'],
  handleUnfoldSelection: ['alt+shift+l', 'mod+shift+f1'],
  handleJumpToMatchingBracket: 'mod+p',
  handleFormatDocument: 'mod+b',
  handleDeleteLine: 'mod+d',
  handleDuplicateSelection: 'mod+shift+d',
  handleToUpperCase: 'ctrl+u',
  handleToLowerCase: 'ctrl+shift+u',
  handleSelectionToBracket: 'ctrl+shift+p',
  handleToggleComment: 'mod+/'
};

/**
 * Return the shortcut map for TextEditor
 */
export default () => {
  return global.process.platform === 'darwin' ? macOSKeyMaps : windowsLinuxKeyMaps;
};
