/* eslint-disable import/prefer-default-export */

// state.editor.xxx
export const selectCompletions = state => state.editor.get('completions')

export const selectEditorCategoryIds = (state, props) =>
  state.editor.getIn([props.editorId, 'categoryIds'], [])

