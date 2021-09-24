'use es6';

import _classCallCheck from "@babel/runtime/helpers/esm/classCallCheck";
import _createClass from "@babel/runtime/helpers/esm/createClass";
import _possibleConstructorReturn from "@babel/runtime/helpers/esm/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/esm/getPrototypeOf";
import _inherits from "@babel/runtime/helpers/esm/inherits";
import { jsx as _jsx } from "react/jsx-runtime";
import styled from 'styled-components';
import partial from 'transmute/partial';
import memoize from 'transmute/memoize';
import ViewActionsDropdownLegacy from './ViewActionsDropdown';
import PureComponent from 'customer-data-ui-utilities/component/PureComponent';
import PropTypes from 'prop-types';
import UISideNavItem from 'UIComponents/nav/UISideNavItem';
import ViewType from 'customer-data-objects-ui-components/propTypes/ViewType';
import UITruncateString from 'UIComponents/text/UITruncateString';
import { IsRewriteEnabledContext } from '../rewrite/init/context/IsRewriteEnabledContext';
import ViewActionsDropdown from '../rewrite/views/components/ViewActionsDropdown';
var NoWrapSpan = styled.span.withConfig({
  displayName: "ViewColumnItem__NoWrapSpan",
  componentId: "sc-10wjd7h-0"
})(["white-space:nowrap;"]);

var ViewColumnItem = /*#__PURE__*/function (_PureComponent) {
  _inherits(ViewColumnItem, _PureComponent);

  function ViewColumnItem() {
    var _this;

    _classCallCheck(this, ViewColumnItem);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(ViewColumnItem).call(this));

    _this.handleHover = function (isHovering) {
      _this.setState(function (prevState) {
        return {
          isHovering: prevState.preventClose || isHovering
        };
      });
    };

    _this.onActionTaken = function () {
      _this.setState({
        isHovering: false,
        preventClose: false
      });
    };

    _this.handleOnOpenChange = function (evt) {
      var value = evt.target.value;

      _this.setState(function (prevState) {
        return {
          preventClose: value,
          isHovering: value ? prevState.isHovering : true
        };
      });
    };

    _this.renderDropdown = function () {
      var isRewriteEnabled = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;
      var _this$props = _this.props,
          view = _this$props.view,
          objectType = _this$props.objectType,
          openViewActionModal = _this$props.openViewActionModal,
          onChangeView = _this$props.onChangeView;
      var isHovering = _this.state.isHovering;

      if (!isHovering) {
        return null;
      }

      var Component = isRewriteEnabled ? ViewActionsDropdown : ViewActionsDropdownLegacy;
      return /*#__PURE__*/_jsx(Component, {
        eventScreen: "FilterViewSelectorPage",
        objectType: objectType,
        view: view,
        onActionTaken: _this.onActionTaken,
        handleOnOpenChange: _this.handleOnOpenChange,
        openViewActionModal: openViewActionModal,
        onSelectView: _this.partial(onChangeView, view)
      });
    };

    _this.state = {
      isHovering: false,
      preventClose: false
    }; // In new code, please use ES6 spread args rather than partials
    // for easier debugging and readability:
    // (...args) => myFunction('partiallyAppliedParam', ...args)

    _this.partial = memoize(partial);
    return _this;
  }

  _createClass(ViewColumnItem, [{
    key: "render",
    value: function render() {
      var _this$props2 = this.props,
          onChangeView = _this$props2.onChangeView,
          view = _this$props2.view;
      var isRewriteEnabled = this.context;
      return /*#__PURE__*/_jsx(UISideNavItem, {
        "data-selenium-test": "viewListingItem",
        "data-selenium-info": view.id,
        onClick: this.partial(onChangeView, view),
        onMouseEnter: this.partial(this.handleHover, true),
        onMouseLeave: this.partial(this.handleHover, false),
        itemClassName: "m-left-2",
        title: /*#__PURE__*/_jsx(UITruncateString, {
          useFlex: true,
          fixedChildren: /*#__PURE__*/_jsx(NoWrapSpan, {
            className: "m-left-auto",
            children: this.renderDropdown(isRewriteEnabled)
          }),
          children: view.name || view.id
        })
      }, view.value);
    }
  }]);

  return ViewColumnItem;
}(PureComponent);

ViewColumnItem.contextType = IsRewriteEnabledContext;
ViewColumnItem.propTypes = {
  objectType: PropTypes.string.isRequired,
  onChangeView: PropTypes.func.isRequired,
  openViewActionModal: PropTypes.func.isRequired,
  view: ViewType.isRequired
};
export default ViewColumnItem;