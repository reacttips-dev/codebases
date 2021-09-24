'use es6';

import { freeze } from 'immer';
import { createSelectorCreator, defaultMemoize } from 'reselect';
/**
 * @name createFrozenSelector
 *
 * This utility alters the default memoization behavior of createSelector to deeply freeze the selector's output before memoizing.
 * It uses {@link https://immerjs.github.io/immer/docs/api freeze} ({@link https://github.com/immerjs/immer/blob/7faa7b47df78f30fced650c323f6b53b5e62e160/src/utils/common.ts#L190-L198 src}) from immer under the hood, so it will not try to double-freeze objects that are already frozen.
 * This wrapper is necessary to ensure that selector outputs cannot be mutated, either in selectors or in components.
 *
 * Note: This is meant to be used for POJO or immer-enhanced redux reducers only. Using this with immutable.js is unsupported and will probably result in some weird behavior.
 *
 * Motivation: https://git.hubteam.com/HubSpot/CRM/pull/25465#discussion_r1255678
 *
 * @param  {...any} args The same args that would be passed to createSelector
 *
 * @return {Function} A selector that deeply freezes its output values with the same behavior as freeze (linked above).
 */

export var frozenMemoize = function frozenMemoize(selectorFunc) {
  return defaultMemoize(function () {
    return freeze(selectorFunc.apply(void 0, arguments), true);
  });
};
export var createFrozenSelector = createSelectorCreator(frozenMemoize);