'use es6';

import { jsx as _jsx } from "react/jsx-runtime";
import PropTypes from 'prop-types';
import { useLocation, Redirect, generatePath } from 'react-router-dom';
import { useCurrentPageType } from '../../views/hooks/useCurrentPageType';
import { useSelectedObjectTypeId } from '../../../objectTypeIdContext/hooks/useSelectedObjectTypeId';
import { LIST } from '../../views/constants/PageType';
import { ALL } from '../../views/constants/DefaultViews';
import { useDefaultViewId } from '../../defaultView/hooks/useDefaultViewId';
import { useDoesViewExist } from '../../views/hooks/useDoesViewExist';
import { useHasBoardView } from '../../board/hooks/useHasBoardView';
import { getMostRecentlyUsedPageType } from '../../app/utils/mostRecentlyUsedPageType';
export var getViewIdToUse = function getViewIdToUse(_ref) {
  var targetViewId = _ref.targetViewId,
      defaultViewId = _ref.defaultViewId,
      doesTargetViewExist = _ref.doesTargetViewExist,
      doesDefaultViewExist = _ref.doesDefaultViewExist;

  if (doesTargetViewExist) {
    return targetViewId;
  }

  if (doesDefaultViewExist) {
    return defaultViewId;
  }

  return ALL;
};
export var getPageTypeToUse = function getPageTypeToUse(_ref2) {
  var hasBoardView = _ref2.hasBoardView,
      currentPageType = _ref2.currentPageType,
      objectTypeId = _ref2.objectTypeId;

  // Short-circuit - always redirect to list view if user or object type does not have board
  if (!hasBoardView) {
    return LIST;
  }

  var defaultPageType = getMostRecentlyUsedPageType(objectTypeId);
  return currentPageType || defaultPageType || LIST;
};

var RedirectToTargetView = function RedirectToTargetView(_ref3) {
  var targetViewId = _ref3.targetViewId;
  var objectTypeId = useSelectedObjectTypeId();
  var defaultViewId = useDefaultViewId();
  var doesDefaultViewExist = useDoesViewExist(defaultViewId);
  var doesTargetViewExist = useDoesViewExist(targetViewId);
  var currentPageType = useCurrentPageType();
  var viewId = getViewIdToUse({
    targetViewId: targetViewId,
    defaultViewId: defaultViewId,
    doesTargetViewExist: doesTargetViewExist,
    doesDefaultViewExist: doesDefaultViewExist
  });
  var hasBoardView = useHasBoardView();
  var pageType = getPageTypeToUse({
    hasBoardView: hasBoardView,
    currentPageType: currentPageType,
    objectTypeId: objectTypeId
  });
  var currentLocation = useLocation();
  var pathname = generatePath('/objects/:objectTypeId/views/:viewId/:pageType', {
    objectTypeId: objectTypeId,
    viewId: viewId,
    pageType: pageType
  });
  return /*#__PURE__*/_jsx(Redirect, {
    to: Object.assign({}, currentLocation, {
      pathname: pathname
    })
  });
};

RedirectToTargetView.propTypes = {
  targetViewId: PropTypes.oneOfType([PropTypes.number, PropTypes.string])
};
export default RedirectToTargetView;