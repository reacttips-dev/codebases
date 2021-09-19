import { TABBABLE_ELEMENTS_SELECTOR } from 'constants/selectors';
import { trackEvent } from 'helpers/analytics';

// pass event from click of an anchor tag linking to a #id of a container
export const handleAccessibilityAnchorsFocus = (e, name) => {
  e.preventDefault();
  trackEvent('TE_SKIP_LINK_CLICK', `linkName:${name}`);
  const id = e.target && e.target.href ? e.target.getAttribute('href') : null;
  const containerEl = id ? document.querySelector(`${id}`) : null;
  if (containerEl) {

    const listOfElements = Array.from(containerEl.querySelectorAll(TABBABLE_ELEMENTS_SELECTOR));
    if (containerEl.matches(TABBABLE_ELEMENTS_SELECTOR)) {
      listOfElements.unshift(containerEl);
    }

    for (const el of listOfElements) {
      el.focus();
      const successfullyFocused = document.activeElement === el;
      if (successfullyFocused) {
        el.scrollIntoView(false);
        break;
      }
    }
  }
};

/*
  Likely used in tandem with 'focusout' event.
 * @param  {Element} container  The container element we want to maintain focus inside of.
 * @param  {Element} target     The element we just focused out of
*/
export const handleLockingTabbableFocusInContainer = (container, target) => {
  // Need to wrap in setTimeout so we can reliably get document.activeElement, ugh
  setTimeout(() => {
    const listOfFocusableEls = container.querySelectorAll(TABBABLE_ELEMENTS_SELECTOR);
    if (listOfFocusableEls.length) {
      const arr = Array.prototype.slice.call(listOfFocusableEls); // Convert nodelist to array
      const index = arr.indexOf(target); // The index of your element that has left focus
      const curEl = document.activeElement; // Current/new focused element
      const isFocusedOutOfContainer = arr.indexOf(curEl) === -1; // Did we focus outside of the container?

      // Last item in container focus, let's go back to the first focusable item
      if (isFocusedOutOfContainer && index === arr.length - 1) {
        arr[0].focus();
      }
      // Shift+tabbing up past the first item in the list, let's go to the last focusable item
      if (isFocusedOutOfContainer && index === 0) {
        arr[arr.length - 1].focus();
      }
    }
  }, 1);
};
