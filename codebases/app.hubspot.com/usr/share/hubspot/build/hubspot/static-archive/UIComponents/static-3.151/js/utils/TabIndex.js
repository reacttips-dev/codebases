'use es6';
/**
 * Determine the proper tabIndex based on the `disabled` and `tabIndex` props. Note that `tabIndex`
 * should not have a default value; it should only be non-null to override normal tabbing behavior.
 */

export var getTabIndex = function getTabIndex(disabled, tabIndex) {
  var disabledValue = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : -1;
  if (typeof tabIndex === 'number') return tabIndex;
  return disabled ? disabledValue : 0;
};