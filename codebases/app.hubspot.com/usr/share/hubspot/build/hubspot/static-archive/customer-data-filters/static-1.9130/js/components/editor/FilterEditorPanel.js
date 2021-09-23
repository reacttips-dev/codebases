'use es6';

import _objectWithoutProperties from "@babel/runtime/helpers/esm/objectWithoutProperties";
import _classCallCheck from "@babel/runtime/helpers/esm/classCallCheck";
import _createClass from "@babel/runtime/helpers/esm/createClass";
import _possibleConstructorReturn from "@babel/runtime/helpers/esm/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/esm/getPrototypeOf";
import _inherits from "@babel/runtime/helpers/esm/inherits";
import { jsxs as _jsxs } from "react/jsx-runtime";
import { jsx as _jsx } from "react/jsx-runtime";
import { DATE, DATE_TIME } from 'customer-data-objects/property/PropertyTypes';
import { ESC } from 'UIComponents/constants/KeyCodes';
import { isValidOperator } from 'customer-data-filters/filterQueryFormat/operator/Operator';
import FilterEditorTimezoneWarning from './FilterEditorTimezoneWarning';
import FilterOperatorType from 'customer-data-filters/components/propTypes/FilterOperatorType';
import FormattedMessage from 'I18n/components/FormattedMessage';
import PropTypes from 'prop-types';
import { Component } from 'react';
import UIBackButton from 'UIComponents/nav/UIBackButton';
import UIButton from 'UIComponents/button/UIButton';
import UIExpandableText from 'UIComponents/text/UIExpandableText';
import UIForm from 'UIComponents/form/UIForm';
import UIIcon from 'UIComponents/icon/UIIcon';
import UIIconButton from 'UIComponents/button/UIIconButton';
import UILink from 'UIComponents/link/UILink';
import UIScrollContainer from 'UIComponents/scroll/UIScrollContainer';
import getIn from 'transmute/getIn';
import isString from 'transmute/isString';
import styled, { css } from 'styled-components';
var wrapperComponentMixin = css(["display:flex;flex-direction:column;flex-grow:1;overflow-y:hidden;height:0;max-height:'100%';"]);
var WrapperComponentBase = styled.div.withConfig({
  displayName: "FilterEditorPanel__WrapperComponentBase",
  componentId: "l0zst7-0"
})(["", ";"], wrapperComponentMixin);
var WrapperComponentAsForm = styled(UIForm).withConfig({
  displayName: "FilterEditorPanel__WrapperComponentAsForm",
  componentId: "l0zst7-1"
})(["", ""], wrapperComponentMixin);
var StyledUIScrollContainer = styled(UIScrollContainer).withConfig({
  displayName: "FilterEditorPanel__StyledUIScrollContainer",
  componentId: "l0zst7-2"
})(["display:flex;flex-direction:column;flex:", ";overflow:hidden;"], function (_ref) {
  var isBodyHeightFixed = _ref.isBodyHeightFixed;
  return isBodyHeightFixed ? 1 : undefined;
});
StyledUIScrollContainer.propTypes = {
  isBodyHeightFixed: PropTypes.bool.isRequired
};
var StyledUIScrollContainerInner = styled(UIScrollContainer.defaultProps.ScrollContainer).withConfig({
  displayName: "FilterEditorPanel__StyledUIScrollContainerInner",
  componentId: "l0zst7-3"
})(["display:flex;flex-direction:column;padding:0 1px;"]);

var FilterEditorPanel = /*#__PURE__*/function (_Component) {
  _inherits(FilterEditorPanel, _Component);

  function FilterEditorPanel() {
    var _getPrototypeOf2;

    var _this;

    _classCallCheck(this, FilterEditorPanel);

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = _possibleConstructorReturn(this, (_getPrototypeOf2 = _getPrototypeOf(FilterEditorPanel)).call.apply(_getPrototypeOf2, [this].concat(args)));

    _this.handleKeyUp = function (evt) {
      var _this$props = _this.props,
          handleGoBack = _this$props.handleGoBack,
          isBackButtonDisabled = _this$props.isBackButtonDisabled;

      if (!isBackButtonDisabled && evt.keyCode === ESC) {
        evt.stopPropagation();
        handleGoBack(evt);
      }
    };

    return _this;
  }

  _createClass(FilterEditorPanel, [{
    key: "renderFixedHeader",
    value: function renderFixedHeader() {
      var _this$props2 = this.props,
          handleGoBack = _this$props2.handleGoBack,
          isBackButtonDisabled = _this$props2.isBackButtonDisabled,
          isXoEnabled = _this$props2.isXoEnabled;
      return !isBackButtonDisabled ? /*#__PURE__*/_jsx(UIBackButton, {
        className: 'flex-shrink-0' + (!isXoEnabled ? " m-bottom-3" : ""),
        children: /*#__PURE__*/_jsx(UILink, {
          onClick: handleGoBack,
          children: /*#__PURE__*/_jsx(FormattedMessage, {
            message: "customerDataFilters.FilterEditorPanel.back"
          })
        })
      }) : null;
    }
  }, {
    key: "renderInnerHeader",
    value: function renderInnerHeader() {
      var _this$props3 = this.props,
          description = _this$props3.description,
          editorSubtitle = _this$props3.editorSubtitle,
          isTimezoneWarningDisabled = _this$props3.isTimezoneWarningDisabled,
          isXoEnabled = _this$props3.isXoEnabled,
          onEditFieldClick = _this$props3.onEditFieldClick,
          renderFieldLink = _this$props3.renderFieldLink,
          showEditField = _this$props3.showEditField,
          title = _this$props3.title,
          url = _this$props3.url,
          value = _this$props3.value;
      var editorTitle = isXoEnabled && showEditField ? /*#__PURE__*/_jsxs("span", {
        children: [title, /*#__PURE__*/_jsx(UIIconButton, {
          className: "p-left-2",
          onClick: onEditFieldClick,
          placement: "right",
          tooltip: /*#__PURE__*/_jsx(FormattedMessage, {
            message: "customerDataFilters.FilterEditorPanel.changeCriteria"
          }),
          use: "link",
          children: /*#__PURE__*/_jsx(UIIcon, {
            name: "edit"
          })
        })]
      }) : title;
      var valueType = getIn(['field', 'type'], value) || '';
      return /*#__PURE__*/_jsxs("span", {
        className: "m-bottom-3",
        children: [!isXoEnabled && editorSubtitle && /*#__PURE__*/_jsx("span", {
          className: "flex-shrink-0",
          children: editorSubtitle
        }), /*#__PURE__*/_jsx("h5", {
          className: "m-bottom-0",
          children: editorTitle
        }), isXoEnabled && description && /*#__PURE__*/_jsx(UIExpandableText, {
          children: /*#__PURE__*/_jsx("p", {
            className: "m-bottom-0",
            children: description
          })
        }), isXoEnabled && isString(url) ? renderFieldLink({
          url: url,
          value: value
        }) : null, !isTimezoneWarningDisabled && [DATE, DATE_TIME].includes(valueType) && /*#__PURE__*/_jsx(FilterEditorTimezoneWarning, {})]
      });
    }
  }, {
    key: "renderFixedFooter",
    value: function renderFixedFooter() {
      var _this$props4 = this.props,
          isXoEnabled = _this$props4.isXoEnabled,
          saveLabel = _this$props4.saveLabel,
          value = _this$props4.value;
      return /*#__PURE__*/_jsx("footer", {
        className: "flex-shrink-0 align-baseline m-top-3 m-bottom-4",
        children: /*#__PURE__*/_jsx(UIButton, {
          block: !isXoEnabled,
          className: isXoEnabled ? 'flex-shrink-0' : "",
          "data-selenium-test": "apply-filter-btn",
          disabled: !isValidOperator(value),
          size: "small",
          type: "submit",
          use: "tertiary",
          children: saveLabel
        })
      });
    }
  }, {
    key: "render",
    value: function render() {
      var _this$props5 = this.props,
          children = _this$props5.children,
          __description = _this$props5.description,
          __editorSubtitle = _this$props5.editorSubtitle,
          __handleGoBack = _this$props5.handleGoBack,
          __isBackButtonDisabled = _this$props5.isBackButtonDisabled,
          __isTimezoneWarningDisabled = _this$props5.isTimezoneWarningDisabled,
          isBodyHeightFixed = _this$props5.isBodyHeightFixed,
          isXoEnabled = _this$props5.isXoEnabled,
          __onEditFieldClick = _this$props5.onEditFieldClick,
          onSubmit = _this$props5.onSubmit,
          __renderFieldLink = _this$props5.renderFieldLink,
          __saveLabel = _this$props5.saveLabel,
          __showEditField = _this$props5.showEditField,
          style = _this$props5.style,
          __title = _this$props5.title,
          __url = _this$props5.url,
          value = _this$props5.value,
          rest = _objectWithoutProperties(_this$props5, ["children", "description", "editorSubtitle", "handleGoBack", "isBackButtonDisabled", "isTimezoneWarningDisabled", "isBodyHeightFixed", "isXoEnabled", "onEditFieldClick", "onSubmit", "renderFieldLink", "saveLabel", "showEditField", "style", "title", "url", "value"]);

      var WrapperComponent = typeof onSubmit === 'function' ? WrapperComponentAsForm : WrapperComponentBase;
      return /*#__PURE__*/_jsxs(WrapperComponent, Object.assign({}, rest, {
        onKeyUp: this.handleKeyUp,
        onSubmit: onSubmit,
        style: Object.assign({
          marginRight: isXoEnabled ? undefined : '-12px'
        }, style),
        children: [this.renderFixedHeader(), /*#__PURE__*/_jsxs(StyledUIScrollContainer, {
          isBodyHeightFixed: isBodyHeightFixed,
          ScrollContainer: StyledUIScrollContainerInner,
          scrollDirection: isBodyHeightFixed ? 'none' : 'vertical',
          children: [this.renderInnerHeader(), children]
        }), value && this.renderFixedFooter()]
      }));
    }
  }]);

  return FilterEditorPanel;
}(Component);

export { FilterEditorPanel as default };
FilterEditorPanel.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
  description: PropTypes.string,
  editorSubtitle: PropTypes.node,
  handleGoBack: PropTypes.func.isRequired,
  isBackButtonDisabled: PropTypes.bool,
  isBodyHeightFixed: PropTypes.bool.isRequired,
  isTimezoneWarningDisabled: PropTypes.bool,
  isXoEnabled: PropTypes.bool,
  onEditFieldClick: PropTypes.func,
  onSubmit: PropTypes.func,
  renderFieldLink: PropTypes.func.isRequired,
  saveLabel: PropTypes.node.isRequired,
  showEditField: PropTypes.bool.isRequired,
  style: PropTypes.object,
  // eslint-disable-line react/forbid-prop-types
  title: PropTypes.node.isRequired,
  url: PropTypes.string,
  value: FilterOperatorType
};
FilterEditorPanel.defaultProps = {
  isBodyHeightFixed: false,
  isXoEnabled: false,
  showEditField: false
};