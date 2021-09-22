/**
 * Focus a textarea/input/content editable div and place the cursor at the end.
 * @param  {HTMLElement} el Textarea/input/content-editable DOM Node
 */

/* eslint-disable */
const placeCaretAtEnd = (el) => {
  const tagName = el.tagName.toLowerCase();
  el.focus();

  if (tagName === 'textarea' || tagName === 'input') {
    // http://davidwalsh.name/caret-end
    if (typeof el.selectionStart === 'number') {
      el.selectionStart = el.selectionEnd = el.value.length;
    } else if (typeof el.createTextRange !== 'undefined') {
      const range = el.createTextRange();
      range.collapse(false);
      range.select();
    }
  } else {
    // http://stackoverflow.com/questions/4233265/contenteditable-set-caret-at-the-end-of-the-text-cross-browser
    if (typeof window.getSelection !== 'undefined' && typeof document.createRange !== 'undefined') {
      const range = document.createRange();
      range.selectNodeContents(el);
      range.collapse(false);
      const sel = window.getSelection();
      sel.removeAllRanges();
      sel.addRange(range);
    } else if (typeof document.body.createTextRange != 'undefined') {
      const textRange = document.body.createTextRange();
      textRange.moveToElementText(el);
      textRange.collapse(false);
      textRange.select();
    }
  }
};

export default placeCaretAtEnd;
