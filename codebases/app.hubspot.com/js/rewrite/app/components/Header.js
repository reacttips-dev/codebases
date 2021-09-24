'use es6';

import { Fragment as _Fragment } from "react/jsx-runtime";
import { jsxs as _jsxs } from "react/jsx-runtime";
import { jsx as _jsx } from "react/jsx-runtime";
import styled from 'styled-components';
import PropTypes from 'prop-types';
import UIHeader from 'UIComponents/layout/UIHeader';
import ViewTabsWrapper from '../../views/components/ViewTabsWrapper';
import UIFlex from 'UIComponents/layout/UIFlex';
import Small from 'UIComponents/elements/Small';
import { ObjectSwitcher } from '../../../header/objectSwitcher';
import CompactObjectCount from '../../filters/components/CompactObjectCount';
import HeaderActionsWrapper from './HeaderActionsWrapper';
import { useHasBoardView } from '../../board/hooks/useHasBoardView';
import { useCurrentViewId } from '../../views/hooks/useCurrentViewId';
import PageTypeSelector from './PageTypeSelector';
import { useCurrentPageType } from '../../views/hooks/useCurrentPageType';
import ViewSelectorDropdown from '../../../header/ViewSelectorDropdown';
import { BOARD } from '../../views/constants/PageType';
import UIBox from 'UIComponents/layout/UIBox';
import { useNavigate } from '../../navigation/hooks/useNavigate';
import { useModalActions } from '../../overlay/hooks/useModalActions';
import PipelineSwitcher from '../../pipelines/components/PipelineSwitcher';
var StyledBox = styled(UIBox).withConfig({
  displayName: "Header__StyledBox",
  componentId: "sc-1hkutc-0"
})(["margin-left:12px;min-width:80px;max-width:200px;"]);
var StyledTitleDetails = styled(Small).attrs({
  tagName: 'div'
}).withConfig({
  displayName: "Header__StyledTitleDetails",
  componentId: "sc-1hkutc-1"
})(["white-space:nowrap;"]);

var Header = function Header(_ref) {
  var onToggleViewSelectorPage = _ref.onToggleViewSelectorPage;
  var hasBoardView = useHasBoardView();
  var pageType = useCurrentPageType();
  var isBoardView = pageType === BOARD;
  var viewId = useCurrentViewId();
  var navigate = useNavigate();

  var _useModalActions = useModalActions(),
      openCreateViewModal = _useModalActions.openCreateViewModal;

  return /*#__PURE__*/_jsx(UIHeader, {
    title: /*#__PURE__*/_jsxs(UIFlex, {
      align: "center",
      justify: "start",
      direction: "row",
      wrap: "nowrap",
      children: [/*#__PURE__*/_jsxs("div", {
        className: "m-right-5",
        children: [/*#__PURE__*/_jsx(ObjectSwitcher, {}), !isBoardView && /*#__PURE__*/_jsx(StyledTitleDetails, {
          children: /*#__PURE__*/_jsx(CompactObjectCount, {})
        })]
      }), hasBoardView && /*#__PURE__*/_jsxs(_Fragment, {
        children: [/*#__PURE__*/_jsx(PageTypeSelector, {}), /*#__PURE__*/_jsx(StyledBox, {
          grow: 1,
          children: /*#__PURE__*/_jsx(PipelineSwitcher, {})
        }), isBoardView && /*#__PURE__*/_jsx(StyledBox, {
          grow: 1,
          children: /*#__PURE__*/_jsx(ViewSelectorDropdown, {
            viewId: viewId,
            onChangeView: function onChangeView(nextViewId) {
              return navigate({
                viewId: nextViewId
              });
            },
            onCreateView: openCreateViewModal,
            onOpenViewSelectorPage: onToggleViewSelectorPage
          })
        })]
      })]
    }),
    tabs: !isBoardView && /*#__PURE__*/_jsx(ViewTabsWrapper, {
      onToggleViewSelectorPage: onToggleViewSelectorPage
    }),
    children: /*#__PURE__*/_jsx(HeaderActionsWrapper, {})
  });
};

Header.propTypes = {
  onToggleViewSelectorPage: PropTypes.func.isRequired
};
export default Header;