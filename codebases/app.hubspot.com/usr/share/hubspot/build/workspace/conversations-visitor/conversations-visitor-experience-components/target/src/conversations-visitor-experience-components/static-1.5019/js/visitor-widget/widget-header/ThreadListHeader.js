'use es6';

import _classCallCheck from "@babel/runtime/helpers/esm/classCallCheck";
import _createClass from "@babel/runtime/helpers/esm/createClass";
import _possibleConstructorReturn from "@babel/runtime/helpers/esm/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/esm/getPrototypeOf";
import _inherits from "@babel/runtime/helpers/esm/inherits";
import { jsx as _jsx } from "react/jsx-runtime";
import { jsxs as _jsxs } from "react/jsx-runtime";
import PropTypes from 'prop-types';
import { PureComponent } from 'react';
import I18n from 'I18n';
import FormattedMessage from 'I18n/components/FormattedMessage';
import styled from 'styled-components';
import { OLAF } from 'HubStyleTokens/colors';
import VizExIcon from 'visitor-ui-component-library/icon/VizExIcon';
import SVGCompose from 'visitor-ui-component-library-icons/icons/SVGCompose';
import VizExIconButton from 'visitor-ui-component-library/button/VizExIconButton';
export var HeaderWrapper = styled.div.withConfig({
  displayName: "ThreadListHeader__HeaderWrapper",
  componentId: "wyc7sa-0"
})(["align-items:center;display:flex;justify-content:space-between;width:100%;"]);

var ThreadListHeader = /*#__PURE__*/function (_PureComponent) {
  _inherits(ThreadListHeader, _PureComponent);

  function ThreadListHeader() {
    _classCallCheck(this, ThreadListHeader);

    return _possibleConstructorReturn(this, _getPrototypeOf(ThreadListHeader).apply(this, arguments));
  }

  _createClass(ThreadListHeader, [{
    key: "render",
    value: function render() {
      var _this$props = this.props,
          createNewThread = _this$props.createNewThread,
          customHeaderText = _this$props.customHeaderText,
          showCreateThreadButton = _this$props.showCreateThreadButton,
          textColor = _this$props.textColor;
      return /*#__PURE__*/_jsxs(HeaderWrapper, {
        children: [/*#__PURE__*/_jsx("h4", {
          style: {
            textAlign: 'center',
            color: textColor
          },
          className: "m-bottom-0",
          children: customHeaderText || /*#__PURE__*/_jsx(FormattedMessage, {
            message: "conversations-visitor-experience-components.visitorWidget.header.threadListTitle"
          })
        }), showCreateThreadButton ? /*#__PURE__*/_jsx(VizExIconButton, {
          onClick: createNewThread,
          "aria-label": I18n.text('conversations-visitor-experience-components.visitorExperienceAriaLabels.createNewThread'),
          "data-test-id": "new-thread-button",
          use: "transparent-on-primary",
          className: "selenium-test-marker-new-thread-button",
          children: /*#__PURE__*/_jsx(VizExIcon, {
            icon: /*#__PURE__*/_jsx(SVGCompose, {})
          })
        }) : null]
      });
    }
  }]);

  return ThreadListHeader;
}(PureComponent);

ThreadListHeader.propTypes = {
  createNewThread: PropTypes.func.isRequired,
  customHeaderText: PropTypes.node,
  showCreateThreadButton: PropTypes.bool.isRequired,
  textColor: PropTypes.string.isRequired
};
ThreadListHeader.defaultProps = {
  mobile: false,
  textColor: OLAF,
  customHeaderText: undefined
};
ThreadListHeader.displayName = 'ThreadListHeader';
export default ThreadListHeader;