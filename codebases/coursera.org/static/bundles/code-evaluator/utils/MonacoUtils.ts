import type monaco from 'monaco-editor';

export const getMonacoEditorInputElement = (
  editor: monaco.editor.IStandaloneCodeEditor | null
): HTMLInputElement | null => {
  // TODO(wbowers): Is there a better way to get the editor's input element?
  return editor?.getDomNode()?.querySelector('.inputarea') || null;
};

export const isMonacoEditorFocused = (editor: monaco.editor.IStandaloneCodeEditor | null): boolean => {
  return getMonacoEditorInputElement(editor) === document.activeElement;
};
