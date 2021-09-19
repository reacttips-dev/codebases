/**
 * Returns true if the event was a left click event.
 * @param  {type}  event dom event object
 * @return {Boolean}       true if it was a left click.
 */
export function isLeftClickEvent(event) {
  return event.button === 0;
}

/**
 * Returns whether or not any modifiers (cmd, alt, ctrl, shift) were active for the given event
 * @param  {Object}  event dom event Object
 * @return {Boolean}       true if any modifiers were held down when the event occurred.
 */
export function isModifiedEvent(event) {
  return !!(event.metaKey || event.altKey || event.ctrlKey || event.shiftKey);
}

/**
 * Passive event listeners are a new feature in the DOM spec that enable developers to opt-in
 * to better scroll performance by eliminating the need for scrolling to block on touch and
 * wheel event listeners. Developers can annotate touch and wheel listeners with {passive: true}
 * to indicate that they will never invoke preventDefault.
 * This feature shipped in Chrome 51, Firefox 49 and WebKit.
 *
 * In-depth: https://github.com/WICG/EventListenerOptions/blob/gh-pages/explainer.md
 * @returns {boolean}
 */
export const supportsPassiveEventListener = () => {
  let supportsPassive = false;
  try {
    const options = Object.defineProperty({}, 'passive', {
      get: () => supportsPassive = true
    });
    window.addEventListener('test', null, options);
  } catch (e) { /* safely fail support passive event listeners */ }
  return supportsPassive;
};

/**
 * Creates and tracks events for each Container/Component
 * Removes all events when componentWillUnmount is called
 * @param  {Class}  scope Container/Component scope
 * @param  {Object}  element
 * @param  {String}  event
 * @param  {Method}  callback
 * @param  {Object}  options
 * @returns {unbind: method} if you need to remove the event before unmounting
 */

export const onEvent = (el, event, callback, options = null, scope = null) => {
  el.addEventListener(event, callback, options);

  const unbindMethod = () => {
    el.removeEventListener(event, callback, options);
  };

  if (scope) {
    scope.__onEvents = scope.__onEvents || [];

    scope.__onEvents.push(unbindMethod);

    if (!scope.__originalUnmount) {
      scope.__originalUnmount = scope.componentWillUnmount || (() => {});
      scope.componentWillUnmount = () => {
        scope.__onEvents.forEach(e => e());
        scope.__originalUnmount.call(scope);
      };
    }
  }

  return { unbind: unbindMethod };
};
