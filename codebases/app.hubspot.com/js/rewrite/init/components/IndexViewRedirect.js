'use es6';

import { jsx as _jsx } from "react/jsx-runtime";
import { BOARD } from '../../views/constants/PageType';
import { useCurrentPageType } from '../../views/hooks/useCurrentPageType';
import { useCurrentViewId } from '../../views/hooks/useCurrentViewId';
import { useDoesViewExist } from '../../views/hooks/useDoesViewExist';
import { useHasBoardView } from '../../board/hooks/useHasBoardView';
import RedirectToTargetView from './RedirectToTargetView';
import IndexPageContainer from './IndexPageContainer';

var IndexViewRedirect = function IndexViewRedirect() {
  var currentViewId = useCurrentViewId();
  var currentPageType = useCurrentPageType();
  var hasBoardView = useHasBoardView();
  var isBoard = currentPageType === BOARD;
  var doesCurrentViewExist = useDoesViewExist(currentViewId);

  if (!doesCurrentViewExist || !currentPageType || isBoard && !hasBoardView) {
    return /*#__PURE__*/_jsx(RedirectToTargetView, {
      targetViewId: currentViewId
    });
  }

  return /*#__PURE__*/_jsx(IndexPageContainer, {});
};

export default IndexViewRedirect;