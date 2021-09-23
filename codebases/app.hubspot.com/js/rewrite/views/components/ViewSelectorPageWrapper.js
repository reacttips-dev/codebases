'use es6';

import _slicedToArray from "@babel/runtime/helpers/esm/slicedToArray";
import { jsx as _jsx } from "react/jsx-runtime";
import PropTypes from 'prop-types';
import { useCallback, useEffect, useState } from 'react';
import { useSelectedObjectTypeId } from '../../../objectTypeIdContext/hooks/useSelectedObjectTypeId';
import { useNavigate } from '../../navigation/hooks/useNavigate';
import { delayUntilIdle } from '../../../crm_ui/utils/delayUntilIdle';
import emptyFunction from 'react-utils/emptyFunction';
import AsyncViewSelectorPage from './AsyncViewSelectorPage';

var ViewSelectorPageWrapper = function ViewSelectorPageWrapper(_ref) {
  var isOpen = _ref.isOpen,
      onToggleViewSelectorPage = _ref.onToggleViewSelectorPage;
  var objectTypeId = useSelectedObjectTypeId();
  var navigate = useNavigate(); // This code split won't load until either the browser is idle or a user
  // has tried to open the page. For perf reasons the view selector page is always rendered
  // (but hidden by css), but we'd still like to delay loading the code if possible.

  var _useState = useState(false),
      _useState2 = _slicedToArray(_useState, 2),
      isInitialized = _useState2[0],
      setIsInitialized = _useState2[1];

  useEffect(function () {
    delayUntilIdle(function () {
      return setIsInitialized(true);
    });
  }, []);
  useEffect(function () {
    if (isOpen && !isInitialized) {
      setIsInitialized(true);
    }
  }, [isInitialized, isOpen]);
  var handleChangeView = useCallback(function (viewId) {
    navigate({
      viewId: viewId
    });
    onToggleViewSelectorPage();
  }, [navigate, onToggleViewSelectorPage]);
  return isInitialized && /*#__PURE__*/_jsx(AsyncViewSelectorPage, {
    isOpen: isOpen,
    objectType: objectTypeId,
    onChangeView: handleChangeView,
    onCloseViewSelectorPage: onToggleViewSelectorPage // HACK: This prop is unused in IKEA, but should still be required in the legacy version of the app.
    ,
    openViewActionModal: emptyFunction
  });
};

ViewSelectorPageWrapper.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onToggleViewSelectorPage: PropTypes.func.isRequired
};
export default ViewSelectorPageWrapper;