'use es6';

import { getMostRecentlyUsedPageType } from '../../app/utils/mostRecentlyUsedPageType';
import { loadBoardColumn } from '../../board/components/AsyncBoardColumn';
import { loadTable } from '../../table/components/AsyncTable';
import { BOARD, LIST } from '../../views/constants/PageType';
import { parseObjectTypeIdFromPath } from './parseObjectTypeIdFromPath';
/**
 * This function looks at the current pathname and makes a guess about which pageType is about to be loaded.
 * It also checks the most recently used pageType in localstorage. Using this information, it preloads
 * the code that will most likely be used on that path. This is only ever called in App when the rewrite is enabled.
 *
 * @param {string} path - window.location.pathname. The default parameter is meant to be used in real code,
 * it is only provided for testing purposes.
 */

export var preloadCodeSplits = function preloadCodeSplits() {
  var path = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : window.location.pathname;
  var pathMatchesBoard = path.match("/" + BOARD);
  var pathMatchesList = path.match("/" + LIST);
  var objectTypeId = parseObjectTypeIdFromPath(path);
  var recentlyUsedPageType = getMostRecentlyUsedPageType(objectTypeId);

  if (pathMatchesBoard || !pathMatchesList && recentlyUsedPageType === BOARD) {
    loadBoardColumn();
  } else {
    loadTable();
  }
};