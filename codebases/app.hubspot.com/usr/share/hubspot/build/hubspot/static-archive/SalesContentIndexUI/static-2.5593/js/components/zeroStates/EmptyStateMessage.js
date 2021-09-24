'use es6';

import { jsxs as _jsxs } from "react/jsx-runtime";
import { jsx as _jsx } from "react/jsx-runtime";
import PropTypes from 'prop-types';
import FormattedMessage from 'I18n/components/FormattedHTMLMessage';
import Big from 'UIComponents/elements/Big';
import UIIllustration from 'UIComponents/image/UIIllustration';
import UIEmptyState from 'UIComponents/empty/UIEmptyState';

var translateEmptyStateMessage = function translateEmptyStateMessage(contentType) {
  return {
    subText: "salesContentIndexUI.emptyState.search." + contentType + ".subText",
    titleText: "salesContentIndexUI.emptyState.search." + contentType + ".titleText"
  };
};

var EmptyStateMessage = function EmptyStateMessage(_ref) {
  var _ref$illustrationWidt = _ref.illustrationWidth,
      illustrationWidth = _ref$illustrationWidt === void 0 ? 200 : _ref$illustrationWidt,
      reversed = _ref.reversed,
      _ref$secondaryContent = _ref.secondaryContentWidth,
      secondaryContentWidth = _ref$secondaryContent === void 0 ? 200 : _ref$secondaryContent,
      children = _ref.children,
      contentType = _ref.contentType;

  var _translateEmptyStateM = translateEmptyStateMessage(contentType),
      subText = _translateEmptyStateM.subText,
      titleText = _translateEmptyStateM.titleText;

  var secondaryContent = /*#__PURE__*/_jsx(UIIllustration, {
    name: "empty-state-charts",
    width: illustrationWidth
  });

  var primaryContent = /*#__PURE__*/_jsxs("span", {
    children: [/*#__PURE__*/_jsx(Big, {
      tagName: "p",
      use: "help",
      children: /*#__PURE__*/_jsx(FormattedMessage, {
        message: subText
      })
    }), children]
  });

  var emptyState = /*#__PURE__*/_jsx(UIEmptyState, {
    flush: true,
    primaryContent: primaryContent,
    reverseOrder: reversed,
    secondaryContent: secondaryContent,
    secondaryContentWidth: secondaryContentWidth,
    titleText: /*#__PURE__*/_jsx(FormattedMessage, {
      message: titleText
    })
  });

  return /*#__PURE__*/_jsx("div", {
    style: {
      paddingTop: '48px'
    },
    className: "empty-state-message",
    "data-selenium-test": "EmptyStateMessage",
    children: /*#__PURE__*/_jsx("div", {
      className: "m-x-auto",
      children: emptyState
    })
  });
};

EmptyStateMessage.propTypes = {
  children: PropTypes.node,
  illustrationWidth: PropTypes.number,
  reversed: PropTypes.bool,
  secondaryContentWidth: PropTypes.number,
  contentType: PropTypes.string.isRequired
};
EmptyStateMessage.defaultProps = {
  reversed: false
};
export default EmptyStateMessage;