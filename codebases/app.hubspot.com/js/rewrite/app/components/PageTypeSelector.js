'use es6';

import { jsx as _jsx } from "react/jsx-runtime";
import { jsxs as _jsxs } from "react/jsx-runtime";
import { useCallback, useMemo } from 'react';
import { useGenerateLocation } from '../../navigation/hooks/useGenerateLocation';
import { LIST, BOARD } from '../../views/constants/PageType';
import { useSelectedObjectTypeId } from '../../../objectTypeIdContext/hooks/useSelectedObjectTypeId';
import { denormalizeTypeId } from '../../utils/denormalizeTypeId';
import { CrmLogger } from 'customer-data-tracking/loggers';
import UIButtonGroup from 'UIComponents/button/UIButtonGroup';
import UIIcon from 'UIComponents/icon/UIIcon';
import UIRouterIconButton from 'ui-addon-react-router-dom/UIRouterIconButton';

var PageTypeSelector = function PageTypeSelector() {
  var objectTypeId = useSelectedObjectTypeId();
  var generateLocation = useGenerateLocation();
  var listLocation = useMemo(function () {
    return generateLocation({
      pageType: LIST
    });
  }, [generateLocation]);
  var boardLocation = useMemo(function () {
    return generateLocation({
      pageType: BOARD
    });
  }, [generateLocation]);
  var handleClick = useCallback(function (nextPageType) {
    CrmLogger.log('indexInteractions', {
      action: 'changed view type',
      subAction: nextPageType === BOARD ? 'Selected Board' : 'Selected Table',
      type: denormalizeTypeId(objectTypeId)
    });
  }, [objectTypeId]);
  var handleListClick = useCallback(function () {
    return handleClick(LIST);
  }, [handleClick]);
  var handleBoardClick = useCallback(function () {
    return handleClick(BOARD);
  }, [handleClick]);
  return /*#__PURE__*/_jsxs(UIButtonGroup, {
    style: {
      flexShrink: 0
    },
    children: [/*#__PURE__*/_jsx(UIRouterIconButton, {
      "data-test-id": "page-type-list-button",
      size: "small",
      use: "tertiary-light",
      onClick: handleListClick,
      to: listLocation,
      children: /*#__PURE__*/_jsx(UIIcon, {
        name: "listView"
      })
    }), /*#__PURE__*/_jsx(UIRouterIconButton, {
      "data-test-id": "page-type-board-button",
      size: "small",
      use: "tertiary-light",
      onClick: handleBoardClick,
      to: boardLocation,
      children: /*#__PURE__*/_jsx(UIIcon, {
        name: "grid"
      })
    })]
  });
};

export default PageTypeSelector;