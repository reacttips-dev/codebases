'use es6';

import { jsx as _jsx } from "react/jsx-runtime";
import { jsxs as _jsxs } from "react/jsx-runtime";
import createReactClass from 'create-react-class';
import I18n from 'I18n';
import UITooltip from 'UIComponents/tooltip/UITooltip';
import UIList from 'UIComponents/list/UIList';
import H5 from 'UIComponents/elements/headings/H5';
import UITextInput from 'UIComponents/input/UITextInput';
import UIFormControl from 'UIComponents/form/UIFormControl';
import FormattedMessage from 'I18n/components/FormattedMessage';

var toI18nText = function toI18nText(name) {
  return I18n.text("draftPlugins.meetings.notMyMeetingsLinkPopover." + name);
};

export default (function (Child) {
  return createReactClass({
    getInitialState: function getInitialState() {
      return {
        isLongformOpen: false
      };
    },
    handleClose: function handleClose() {
      this.setState({
        isLongformOpen: false
      });
    },
    togglePopover: function togglePopover() {
      var isLongformOpen = this.state.isLongformOpen;
      this.setState({
        isLongformOpen: !isLongformOpen
      });
    },
    renderTitle: function renderTitle() {
      return /*#__PURE__*/_jsxs("div", {
        children: [/*#__PURE__*/_jsx(UIFormControl, {
          className: "m-bottom-6",
          label: /*#__PURE__*/_jsx(FormattedMessage, {
            message: "draftPlugins.meetings.linkTo"
          }),
          children: /*#__PURE__*/_jsx(UITextInput, {
            readOnly: true,
            value: this.props.linkURL
          })
        }), /*#__PURE__*/_jsx(H5, {
          children: toI18nText('title')
        }), /*#__PURE__*/_jsxs(UIList, {
          styled: true,
          childClassName: 'm-bottom-3',
          children: [/*#__PURE__*/_jsx("span", {
            children: toI18nText('copiedTemplate')
          }), /*#__PURE__*/_jsx("span", {
            children: toI18nText('deleteLink')
          })]
        })]
      });
    },
    render: function render() {
      var isLongformOpen = this.state.isLongformOpen;
      return /*#__PURE__*/_jsx(UITooltip, {
        use: "longform",
        open: isLongformOpen,
        placement: "bottom",
        title: this.renderTitle(),
        onClose: this.handleClose,
        maxWidth: 400,
        children: /*#__PURE__*/_jsx(UITooltip, {
          title: toI18nText('title'),
          defaultOpen: true,
          disabled: isLongformOpen,
          children: /*#__PURE__*/_jsx("span", {
            children: /*#__PURE__*/_jsx(Child, Object.assign({}, this.props, {
              disableTooltip: true,
              togglePopover: this.togglePopover
            }))
          })
        })
      });
    }
  });
});