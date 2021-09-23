'use es6';

import { jsx as _jsx } from "react/jsx-runtime";
import { jsxs as _jsxs } from "react/jsx-runtime";
import { CrmLogger } from 'customer-data-tracking/loggers';
import { INDEX, BOARD } from 'customer-data-objects/view/PageTypes';
import ObjectTypesType from 'customer-data-objects-ui-components/propTypes/ObjectTypesType';
import PageType from 'customer-data-objects-ui-components/propTypes/PageType';
import partial from 'transmute/partial';
import PropTypes from 'prop-types';
import { memo, useCallback } from 'react';
import UIButtonGroup from 'UIComponents/button/UIButtonGroup';
import UIIcon from 'UIComponents/icon/UIIcon';
import { withRouter } from 'react-router-dom';
import { getPageTypeSelectorHrefs } from '../utils/getPageTypeSelectorHrefs';
export var checkIsNewStyleRoute = function checkIsNewStyleRoute(_ref) {
  var url = _ref.url;
  return url.includes('objects');
};
export var PageTypeSelector = function PageTypeSelector(_ref2) {
  var objectType = _ref2.objectType,
      pageType = _ref2.pageType,
      viewId = _ref2.viewId,
      match = _ref2.match;
  // TODO: Remove this when migrated fully to new URL format as part of post-FISH modernization
  // https://git.hubteam.com/HubSpot/crm-datasets-ui/issues/202
  var shouldUseNewLinkFormat = checkIsNewStyleRoute(match, objectType);

  var _getPageTypeSelectorH = getPageTypeSelectorHrefs({
    objectType: objectType,
    viewId: viewId,
    shouldUseNewLinkFormat: shouldUseNewLinkFormat
  }),
      ButtonComponent = _getPageTypeSelectorH.ButtonComponent,
      boardHrefProp = _getPageTypeSelectorH.boardHrefProp,
      tableHrefProp = _getPageTypeSelectorH.tableHrefProp;

  var handleClick = useCallback(function (newPageType) {
    CrmLogger.log('indexInteractions', {
      action: 'changed view type',
      subAction: newPageType === INDEX ? 'Selected Table' : 'Selected Board',
      type: objectType
    });
  }, [objectType]);
  var isTableView = pageType === INDEX;
  return /*#__PURE__*/_jsxs(UIButtonGroup, {
    style: {
      flexShrink: 0
    },
    children: [/*#__PURE__*/_jsx(ButtonComponent, Object.assign({
      size: "small",
      use: "tertiary-light",
      active: isTableView,
      onClick: partial(handleClick, INDEX)
    }, tableHrefProp, {
      children: /*#__PURE__*/_jsx(UIIcon, {
        name: "listView"
      })
    })), /*#__PURE__*/_jsx(ButtonComponent, Object.assign({
      size: "small",
      use: "tertiary-light",
      active: !isTableView,
      onClick: partial(handleClick, BOARD)
    }, boardHrefProp, {
      children: /*#__PURE__*/_jsx(UIIcon, {
        name: "grid"
      })
    }))]
  });
};
PageTypeSelector.propTypes = {
  objectType: ObjectTypesType.isRequired,
  viewId: PropTypes.string.isRequired,
  pageType: PageType.isRequired,
  match: PropTypes.object.isRequired
};
export default withRouter( /*#__PURE__*/memo(PageTypeSelector));