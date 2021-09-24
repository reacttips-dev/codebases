'use es6';

import { jsx as _jsx } from "react/jsx-runtime";
import { jsxs as _jsxs } from "react/jsx-runtime";
import PropTypes from 'prop-types';
import createReactClass from 'create-react-class';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import I18n from 'I18n';
import classNames from 'classnames';
import UIButton from 'UIComponents/button/UIButton';
import UIIcon from 'UIComponents/icon/UIIcon';
import UIDropdownCaret from 'UIComponents/dropdown/UIDropdownCaret';
import MeetingsLinkPopover from './MeetingsLinkPopover';
var MeetingsLinkButton = createReactClass({
  displayName: "MeetingsLinkButton",
  propTypes: {
    togglePopover: PropTypes.func.isRequired,
    className: PropTypes.string
  },
  mixins: [PureRenderMixin],
  render: function render() {
    var _this$props = this.props,
        className = _this$props.className,
        togglePopover = _this$props.togglePopover;
    return /*#__PURE__*/_jsxs(UIButton, {
      use: "link",
      "data-test-id": "meetings",
      onClick: togglePopover,
      className: classNames('template-editor__meetings-button', className),
      children: [/*#__PURE__*/_jsx(UIIcon, {
        name: "date",
        className: "m-right-1"
      }), I18n.text('draftPlugins.meetings.button'), /*#__PURE__*/_jsx(UIDropdownCaret, {})]
    });
  }
}); // TODO: react-16 instead of wrapping this with another component, use useMemo

function MeetingsLinkButtonWrapper(_ref) {
  var togglePopover = _ref.togglePopover,
      className = _ref.className;
  return /*#__PURE__*/_jsx(MeetingsLinkButton, {
    togglePopover: togglePopover,
    className: className
  });
}

export default MeetingsLinkPopover(MeetingsLinkButtonWrapper);