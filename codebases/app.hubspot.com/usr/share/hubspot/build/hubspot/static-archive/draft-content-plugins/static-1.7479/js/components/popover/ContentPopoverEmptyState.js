'use es6';

import { jsx as _jsx } from "react/jsx-runtime";
import { jsxs as _jsxs } from "react/jsx-runtime";
import FormattedMessage from 'I18n/components/FormattedMessage';
import PropTypes from 'prop-types';
import UIButton from 'UIComponents/button/UIButton';
import Big from 'UIComponents/elements/Big';
import UIIllustration from 'UIComponents/image/UIIllustration';
import UIFlex from 'UIComponents/layout/UIFlex';

var ContentPopoverEmptyState = function ContentPopoverEmptyState(_ref) {
  var image = _ref.image,
      title = _ref.title,
      description = _ref.description,
      buttonLabel = _ref.buttonLabel,
      buttonLink = _ref.buttonLink;
  return /*#__PURE__*/_jsxs(UIFlex, {
    direction: "column",
    align: "center",
    className: "p-all-2",
    children: [image && /*#__PURE__*/_jsx(UIIllustration, {
      name: image,
      width: 150,
      className: "m-bottom-3"
    }), /*#__PURE__*/_jsx("h5", {
      className: "m-bottom-5 text-center",
      children: /*#__PURE__*/_jsx(FormattedMessage, {
        message: title
      })
    }), /*#__PURE__*/_jsx(Big, {
      className: "m-bottom-5 text-center",
      children: /*#__PURE__*/_jsx(FormattedMessage, {
        message: description
      })
    }), /*#__PURE__*/_jsx(UIButton, {
      use: "tertiary",
      external: true,
      href: buttonLink,
      children: /*#__PURE__*/_jsx(FormattedMessage, {
        message: buttonLabel
      })
    })]
  });
};

ContentPopoverEmptyState.propTypes = {
  image: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  buttonLabel: PropTypes.string.isRequired,
  buttonLink: PropTypes.string.isRequired
};
export default ContentPopoverEmptyState;