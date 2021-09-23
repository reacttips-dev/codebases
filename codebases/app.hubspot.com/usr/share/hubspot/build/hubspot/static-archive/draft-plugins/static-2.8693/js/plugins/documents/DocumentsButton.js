'use es6';

import { jsx as _jsx } from "react/jsx-runtime";
import { jsxs as _jsxs } from "react/jsx-runtime";
import PropTypes from 'prop-types';
import createReactClass from 'create-react-class';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import I18n from 'I18n';
import UIIcon from 'UIComponents/icon/UIIcon';
import UIDropdownCaret from 'UIComponents/dropdown/UIDropdownCaret';
import UIButton from 'UIComponents/button/UIButton';
var DocumentButton = createReactClass({
  displayName: "DocumentButton",
  mixins: [PureRenderMixin],
  render: function render() {
    var _this$props = this.props,
        togglePopover = _this$props.togglePopover,
        className = _this$props.className;
    return /*#__PURE__*/_jsxs(UIButton, {
      use: "link",
      "data-test-id": "documents",
      onClick: togglePopover,
      className: className,
      children: [/*#__PURE__*/_jsx(UIIcon, {
        name: "documents",
        className: "m-right-1"
      }), I18n.text('draftPlugins.documents.document'), /*#__PURE__*/_jsx(UIDropdownCaret, {})]
    });
  }
});
DocumentButton.propTypes = {
  togglePopover: PropTypes.func,
  className: PropTypes.string
}; // TODO: react-16 instead of wrapping this with another component, use useMemo

export default function DocumentButtonWrapper(_ref) {
  var togglePopover = _ref.togglePopover,
      className = _ref.className;
  return /*#__PURE__*/_jsx(DocumentButton, {
    togglePopover: togglePopover,
    className: className
  });
}