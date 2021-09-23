'use es6';

import { Fragment as _Fragment } from "react/jsx-runtime";
import { jsx as _jsx } from "react/jsx-runtime";
import { jsxs as _jsxs } from "react/jsx-runtime";
import * as PageTypes from 'customer-data-objects/view/PageTypes';
import styled from 'styled-components';
import { AnyCrmObjectTypePropType } from 'customer-data-objects-ui-components/propTypes/CrmObjectTypes';
import ViewObjectCount from '../views/components/ViewObjectCount';
import PageTypeSelector from './PageTypeSelector';
import PipelineSelector from './PipelineSelector';
import ViewTabs from './tabs/ViewTabs';
import ViewSelectorDropdown from './ViewSelectorDropdown';
import PageType from 'customer-data-objects-ui-components/propTypes/PageType';
import PropTypes from 'prop-types';
import Small from 'UIComponents/elements/Small';
import { ObjectSwitcher } from './objectSwitcher';
import UIBox from 'UIComponents/layout/UIBox';
import UIFlex from 'UIComponents/layout/UIFlex';
import UIHeader from 'UIComponents/layout/UIHeader';
import ViewType from 'customer-data-objects-ui-components/propTypes/ViewType';
import HeaderActions from './actions/HeaderActions';
import { temporarilyIncludeId } from '../crm_ui/flux/grid/GridUIActions';
var StyledTitleDetails = styled(Small).attrs({
  tagName: 'div'
}).withConfig({
  displayName: "Header__StyledTitleDetails",
  componentId: "eek9l5-0"
})(["white-space:nowrap;"]);
var StyledBox = styled(UIBox).withConfig({
  displayName: "Header__StyledBox",
  componentId: "eek9l5-1"
})(["margin-left:12px;min-width:80px;max-width:200px;"]);

var Header = function Header(_ref) {
  var addButtonDisabled = _ref.addButtonDisabled,
      isCrmObject = _ref.isCrmObject,
      isPipelineable = _ref.isPipelineable,
      objectType = _ref.objectType,
      onChangePipeline = _ref.onChangePipeline,
      onChangeView = _ref.onChangeView,
      onCreateView = _ref.onCreateView,
      onOpenObjectBuilderPanel = _ref.onOpenObjectBuilderPanel,
      onOpenViewSelectorPage = _ref.onOpenViewSelectorPage,
      pageType = _ref.pageType,
      pipelineId = _ref.pipelineId,
      view = _ref.view,
      hideHeaderTabs = _ref.hideHeaderTabs;
  var viewId = "" + view.id;
  var isBoardView = pageType === PageTypes.BOARD;

  var addCreatedObjectIdToGrid = function addCreatedObjectIdToGrid(evt) {
    temporarilyIncludeId(evt.objectId);
  };

  var title = /*#__PURE__*/_jsxs(UIFlex, {
    align: "center",
    justify: "start",
    direction: "row",
    wrap: "nowrap",
    children: [/*#__PURE__*/_jsxs("div", {
      className: "m-right-5",
      children: [/*#__PURE__*/_jsx(ObjectSwitcher, {}), !isBoardView && /*#__PURE__*/_jsx(StyledTitleDetails, {
        children: /*#__PURE__*/_jsx(ViewObjectCount, {
          compact: true,
          isCrmObject: isCrmObject,
          isPipelineable: isPipelineable,
          objectType: objectType,
          pipelineId: pipelineId,
          view: view
        })
      })]
    }), isPipelineable && /*#__PURE__*/_jsxs(_Fragment, {
      children: [/*#__PURE__*/_jsx(PageTypeSelector, {
        objectType: objectType,
        pageType: pageType,
        viewId: viewId
      }), /*#__PURE__*/_jsx(StyledBox, {
        grow: 1,
        children: /*#__PURE__*/_jsx(PipelineSelector, {
          objectType: objectType,
          onChange: onChangePipeline,
          pageType: pageType,
          pipelineId: pipelineId,
          viewId: viewId
        })
      }), isBoardView && /*#__PURE__*/_jsx(StyledBox, {
        grow: 1,
        children: /*#__PURE__*/_jsx(ViewSelectorDropdown, {
          objectType: objectType,
          onChangeView: onChangeView,
          onCreateView: onCreateView,
          onOpenViewSelectorPage: onOpenViewSelectorPage,
          viewId: viewId
        })
      })]
    })]
  });

  var shouldShowTabs = !isBoardView && !hideHeaderTabs;
  return /*#__PURE__*/_jsx(UIHeader, {
    title: title,
    tabs: shouldShowTabs && /*#__PURE__*/_jsx(ViewTabs, {
      currentView: view,
      objectType: objectType,
      onOpenViewSelectorPage: onOpenViewSelectorPage,
      onChangeView: onChangeView,
      onCreateView: onCreateView
    }),
    children: /*#__PURE__*/_jsx(HeaderActions, {
      addButtonDisabled: addButtonDisabled,
      objectType: objectType,
      viewId: viewId,
      pageType: pageType,
      pipelineId: pipelineId,
      isCrmObject: isCrmObject,
      onOpenObjectBuilderPanel: onOpenObjectBuilderPanel,
      onLegacyCreateSuccess: addCreatedObjectIdToGrid
    })
  });
};

Header.propTypes = {
  addButtonDisabled: PropTypes.bool,
  isCrmObject: PropTypes.bool.isRequired,
  isPipelineable: PropTypes.bool.isRequired,
  objectType: AnyCrmObjectTypePropType.isRequired,
  onChangePipeline: PropTypes.func.isRequired,
  onChangeView: PropTypes.func.isRequired,
  onCreateView: PropTypes.func.isRequired,
  onOpenObjectBuilderPanel: PropTypes.func.isRequired,
  onOpenViewSelectorPage: PropTypes.func.isRequired,
  pageType: PageType.isRequired,
  pipelineId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  view: ViewType.isRequired,
  hideHeaderTabs: PropTypes.bool
};
export default Header;