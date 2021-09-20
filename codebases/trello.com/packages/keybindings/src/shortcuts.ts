import { isTouch } from '@trello/browser';
import { getKey } from './keyboard';
import {
  Key,
  RegisterShortcutHandlerOptions,
  RegisterShortcutOptions,
  Scope,
  ShortcutEvent,
  ShortcutHandler,
} from './types';

interface Handler {
  callback: ShortcutHandler;
  key?: Key;
}

let initialized: boolean = false;
let isPaused: boolean = false;

const HandlerMap = new Map<Scope, Handler[]>();

export const pauseShortcuts = () => {
  isPaused = true;
};

export const resumeShortcuts = () => {
  isPaused = false;
};

/**
 * Determine whether the element is an input that the user is typing into.
 * In that case, we do not want to trigger a shortcut. Due to some nonsense
 * behavior in Safari, sometimes a focused input that is hidden via Javascript
 * can still be the activeElement, so ensure the target element is also visible
 *
 * Equivalent to original jQuery method:
 * `$(element).is('textarea:visible,input:visible,select:visible,[contenteditable]:visible');`
 * See https://github.com/jquery/jquery/blob/master/src/css/hiddenVisibleSelectors.js
 */
const isInputElement = (element: HTMLElement | null | undefined): boolean => {
  if (!element) {
    return false;
  }

  const isInput = element.matches('textarea,input,select,[contenteditable]');
  const isVisible = !!(
    element.offsetWidth ||
    element.offsetHeight ||
    element.getClientRects().length
  );

  return isInput && isVisible;
};

/**
 * We don't want to trigger keyboard shortcuts if:
 *  - The user is on a touch device
 *  - The user is typing into an input or have a select highlighted
 *      (an exception for this is made for the Escape key)
 *  - We do not recognize the key being pressed
 *  - The user is composing (process key)
 *  - A modifier key is held down
 *      (so as to not conflict with browser or OS key commands)
 */
const isKeyEligible = (e: ShortcutEvent): boolean => {
  const key = getKey(e);

  return !(
    isTouch() ||
    isPaused ||
    key === Key.Unknown ||
    key === Key.Process ||
    (key !== Key.Escape && isInputElement(e.target as HTMLElement)) ||
    e.ctrlKey ||
    e.metaKey ||
    e.altKey
  );
};

/**
 * Get all registered shortcut handlers, sorted by scope, and filtered
 * top-down so that if there are modal-scoped handlers registered, nothing
 * below those scopes will be returned. In this way, we prevent global
 * shortcut handlers from firing when popovers/overlays/dialogs are present
 */
export const getScopedHandlers = (): Handler[] => {
  const sortedRegistrars = [...HandlerMap.entries()].sort(
    (a, b) => b[0] - a[0],
  );
  let results: Handler[] = [];
  for (const [scope, handlers] of sortedRegistrars) {
    results = results.concat(handlers);
    if (handlers.length && scope >= Scope.Dialog) {
      break;
    }
  }

  return results;
};

/**
 * On `keydown` and `keypress`, if the key event is eligible for shortcuts,
 * walk through the handlers and execute their callbacks. Once any handler
 * in the list prevents default on the event, stop walking through the stack
 */
export const onKeyboardEvent = (event: ShortcutEvent): void => {
  if (!isKeyEligible(event)) {
    return;
  }

  for (const { callback, key } of getScopedHandlers()) {
    if (!key) {
      callback(event);
    } else if (key && getKey(event) === key) {
      callback(event);
      event.preventDefault();
      event.stopPropagation();
    }
    if (event.defaultPrevented) {
      break;
    }
  }
};

/**
 * Add and remove document event listeners. Use `initialize` to
 * track whether the listeners have been added or removed from
 * the page.
 */
const addEventListeners = () => {
  document.addEventListener('keydown', onKeyboardEvent);
  document.addEventListener('keypress', onKeyboardEvent);
  initialized = true;
};

const removeEventListeners = () => {
  document.removeEventListener('keydown', onKeyboardEvent);
  document.removeEventListener('keypress', onKeyboardEvent);
  initialized = false;
};

interface AddHandlerParams {
  callback: ShortcutHandler;
  scope: Scope;
  key?: Key;
  clearScope?: boolean;
}

const addHandler = ({ callback, scope, clearScope, key }: AddHandlerParams) => {
  if (!initialized) {
    addEventListeners();
  }
  let handlers: Handler[] = [];
  if (!clearScope && HandlerMap.has(scope)) {
    handlers = HandlerMap.get(scope)!;
  }

  handlers.unshift({ callback, key });
  HandlerMap.set(scope, handlers);
};

/**
 * Adds a shortcut handler for a specific scope
 */
export const registerShortcutHandler = (
  callback: ShortcutHandler,
  options?: RegisterShortcutHandlerOptions,
) => {
  const { scope = Scope.Default, clearScope = false } = options || {};
  addHandler({ callback, scope, clearScope });
};

/**
 * Remove a shortcut handler
 */
export const unregisterShortcutHandler = (callback: ShortcutHandler) => {
  for (const [scope, handlers] of HandlerMap.entries()) {
    HandlerMap.set(
      scope,
      handlers.filter((handler) => handler.callback !== callback),
    );
  }
};

/**
 * Adds a shortcut handler for a specific scope AND specific key
 */
export const registerShortcut = (
  callback: ShortcutHandler,
  options: RegisterShortcutOptions,
) => {
  const { scope = Scope.Default, clearScope = false, key } = options;
  addHandler({ scope, clearScope, callback, key });
};

/**
 * Mirrored unregister shorthand for API symmetry
 */
export const unregisterShortcut = unregisterShortcutHandler;

/**
 * Reset to empty state. Useful for testing
 */
export const clearShortcuts = () => {
  HandlerMap.clear();
  removeEventListeners();
};
