'use es6';

import { jsx as _jsx } from "react/jsx-runtime";
import { jsxs as _jsxs } from "react/jsx-runtime";
import UIBox from 'UIComponents/layout/UIBox';
import FormattedMessage from 'I18n/components/FormattedMessage';
import UISideNav from 'UIComponents/nav/UISideNav';
import ViewColumnItem from './ViewColumnItem';
import H5 from 'UIComponents/elements/headings/H5';
import UIScrollingColumn from 'UIComponents/layout/UIScrollingColumn';
import { BATTLESHIP } from 'HubStyleTokens/colors';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import ViewRecord from 'customer-data-objects/view/ViewRecord';
var StyledViewSelectorColumn = styled(UIBox).attrs({
  basis: '33%'
}).withConfig({
  displayName: "ViewSelectorColumn__StyledViewSelectorColumn",
  componentId: "j2zdhj-0"
})(["border-left:1px solid ", ";max-width:33%;word-break:break-word;height:100%;"], BATTLESHIP);

var ViewSelectorColumn = function ViewSelectorColumn(_ref) {
  var headerTitle = _ref.headerTitle,
      objectType = _ref.objectType,
      onViewSelected = _ref.onViewSelected,
      openViewActionModal = _ref.openViewActionModal,
      views = _ref.views;
  return /*#__PURE__*/_jsxs(StyledViewSelectorColumn, {
    className: "p-bottom-10 p-x-4",
    children: [/*#__PURE__*/_jsx(H5, {
      children: /*#__PURE__*/_jsx(FormattedMessage, {
        message: headerTitle
      })
    }), /*#__PURE__*/_jsx(UIScrollingColumn, {
      children: /*#__PURE__*/_jsx(UISideNav, {
        children: views.map(function (view) {
          return /*#__PURE__*/_jsx(ViewColumnItem, {
            objectType: objectType,
            onChangeView: onViewSelected,
            openViewActionModal: openViewActionModal,
            view: view
          }, view.id);
        })
      })
    })]
  });
};

ViewSelectorColumn.propTypes = {
  headerTitle: PropTypes.string.isRequired,
  objectType: PropTypes.string.isRequired,
  onViewSelected: PropTypes.func.isRequired,
  openViewActionModal: PropTypes.func.isRequired,
  views: PropTypes.arrayOf(PropTypes.instanceOf(ViewRecord)).isRequired
};
export default ViewSelectorColumn;