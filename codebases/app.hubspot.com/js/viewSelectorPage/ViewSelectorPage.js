'use es6';

import _slicedToArray from "@babel/runtime/helpers/esm/slicedToArray";
import { jsxs as _jsxs } from "react/jsx-runtime";
import { jsx as _jsx } from "react/jsx-runtime";
import { useCallback, useState } from 'react';
import PropTypes from 'prop-types';
import UIHeader from 'UIComponents/layout/UIHeader';
import UIBreadcrumbs from 'UIComponents/nav/UIBreadcrumbs';
import UILink from 'UIComponents/link/UILink';
import UIFlex from 'UIComponents/layout/UIFlex';
import ViewSelectorColumn from './ViewSelectorColumn';
import UISearchInput from 'UIComponents/input/UISearchInput';
import FormattedMessage from 'I18n/components/FormattedMessage';
import UIListingPage from 'UIComponents/page/UIListingPage';
import styled from 'styled-components';
import { useStoreDependency } from 'general-store';
import { useViewsByType } from '../views/hooks/useViewsByType';
import { CrmLogger } from 'customer-data-tracking/loggers';
import globalNavHeight from 'nav-meta/global-nav-height';
import { useSelectedObjectTypeDef } from '../crmObjects/hooks/useSelectedObjectTypeDef';
import { getSingularForm } from '../crmObjects/methods/getSingularForm';
import { triggerWootricsSurvey } from '../crm_ui/utils/triggerWootricsSurvey';
import { COMPANY_TYPE_ID, CONTACT_TYPE_ID } from 'customer-data-objects/constants/ObjectTypeIds';
import { normalizeTypeId } from '../utils/normalizeTypeId';
import { isUngatedForCSATSurveyDependency } from '../pages/IndexPage';
var HEADER_HEIGHT = '125px'; // By default UIListingPage has a padding-bottom of 48px so we want to account
// for that padding and ensure the page is not larger than the view height. The
// extra two pixels round up to prevent any weird off-by-1 rounding errors that
// result in a scrollbar appearing.

var PADDING_BOTTOM_HEIGHT = '50px';
var StyledMainContentWrapper = styled(UIFlex).attrs({
  justify: 'between'
}).withConfig({
  displayName: "ViewSelectorPage__StyledMainContentWrapper",
  componentId: "sc-1y3xjo4-0"
})(["height:calc( 100vh - ", " - ", " - ", " );width:100%;"], globalNavHeight, HEADER_HEIGHT, PADDING_BOTTOM_HEIGHT);
var FixedWidthSearchContainer = styled.div.withConfig({
  displayName: "ViewSelectorPage__FixedWidthSearchContainer",
  componentId: "sc-1y3xjo4-1"
})(["max-width:450px;"]);
export var ViewSelectorPage = function ViewSelectorPage(_ref) {
  var isOpen = _ref.isOpen,
      onChangeView = _ref.onChangeView,
      onCloseViewSelectorPage = _ref.onCloseViewSelectorPage,
      openViewActionModal = _ref.openViewActionModal,
      objectType = _ref.objectType;

  var _useState = useState(''),
      _useState2 = _slicedToArray(_useState, 2),
      searchText = _useState2[0],
      setSearchText = _useState2[1];

  var isUngatedForCSATSurvey = useStoreDependency(isUngatedForCSATSurveyDependency);

  var _useViewsByType = useViewsByType(objectType, searchText),
      defaultViews = _useViewsByType.defaultViews,
      myViews = _useViewsByType.myViews,
      sharedViews = _useViewsByType.sharedViews;

  var viewCount = myViews.length + sharedViews.length + defaultViews.length;
  var objectTypeId = normalizeTypeId(objectType);
  var onViewSelected = useCallback(function (view) {
    onChangeView(view.id); // Show wootrics CSAT survey when changing saved views on the contact/company index page

    if ((objectTypeId === COMPANY_TYPE_ID || objectTypeId === CONTACT_TYPE_ID) && isUngatedForCSATSurvey) {
      triggerWootricsSurvey();
    }

    CrmLogger.log('openSavedView', {
      action: 'from all views'
    });
  }, [onChangeView, isUngatedForCSATSurvey, objectTypeId]);
  var handleSearchChange = useCallback(function (_ref2) {
    var value = _ref2.target.value;
    setSearchText(value);
  }, [setSearchText]);
  var commonColumnProps = {
    objectType: objectType,
    onViewSelected: onViewSelected,
    openViewActionModal: openViewActionModal
  };
  var typeDef = useSelectedObjectTypeDef();
  var objectName = getSingularForm(typeDef);
  return /*#__PURE__*/_jsx(UIListingPage, {
    "data-selenium-test": "viewSelectorPage",
    headerComponent: /*#__PURE__*/_jsx(UIHeader, {
      breadcrumbs: /*#__PURE__*/_jsx(UIBreadcrumbs, {
        children: /*#__PURE__*/_jsx(UILink, {
          onClick: onCloseViewSelectorPage,
          children: /*#__PURE__*/_jsx(FormattedMessage, {
            message: "indexPage.viewSelectorPage.header.backButton"
          })
        })
      }),
      title: /*#__PURE__*/_jsx(FormattedMessage, {
        message: "indexPage.viewSelectorPage.header.title",
        options: {
          count: viewCount,
          objectName: objectName
        }
      }),
      children: /*#__PURE__*/_jsx(FixedWidthSearchContainer, {
        children: /*#__PURE__*/_jsx(UISearchInput, {
          onChange: handleSearchChange,
          value: searchText
        })
      })
    }),
    pageLayout: "full-width",
    pageStyle: {
      display: isOpen ? 'flex' : 'none'
    },
    children: /*#__PURE__*/_jsxs(StyledMainContentWrapper, {
      children: [/*#__PURE__*/_jsx(ViewSelectorColumn, Object.assign({}, commonColumnProps, {
        headerTitle: "indexPage.viewSelectorPage.defaultViewsHeader",
        views: defaultViews
      })), /*#__PURE__*/_jsx(ViewSelectorColumn, Object.assign({}, commonColumnProps, {
        headerTitle: "indexPage.viewSelectorPage.myViewsHeader",
        views: myViews
      })), /*#__PURE__*/_jsx(ViewSelectorColumn, Object.assign({}, commonColumnProps, {
        headerTitle: "indexPage.viewSelectorPage.sharedViewsHeader",
        views: sharedViews
      }))]
    })
  });
};
ViewSelectorPage.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  objectType: PropTypes.string.isRequired,
  onChangeView: PropTypes.func.isRequired,
  openViewActionModal: PropTypes.func.isRequired,
  onCloseViewSelectorPage: PropTypes.func.isRequired
};
export default ViewSelectorPage;