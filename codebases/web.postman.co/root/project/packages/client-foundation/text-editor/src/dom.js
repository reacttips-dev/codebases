/**
 * Create dom node to host overflowing monaco widgets
 */
export function createOverflowingWidgetsContainerNode () {
  if (!document.querySelector('#monaco-overflowing-widgets-container')) {
    let overflowingWidgetsContainer = document.createElement('div');
    overflowingWidgetsContainer.id = 'monaco-overflowing-widgets-container';

    // the `monaco-editor` class is required as all of the styles of the overflowing
    // widgets are scoped under the aforementioned class-name
    overflowingWidgetsContainer.classList.add('monaco-editor');
    document.querySelector('body').appendChild(overflowingWidgetsContainer);
  }
}
