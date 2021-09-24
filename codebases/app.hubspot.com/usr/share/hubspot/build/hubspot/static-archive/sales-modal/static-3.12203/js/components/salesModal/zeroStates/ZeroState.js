'use es6';

import { jsx as _jsx } from "react/jsx-runtime";
import { jsxs as _jsxs } from "react/jsx-runtime";
import PropTypes from 'prop-types';
import FormattedMessage from 'I18n/components/FormattedMessage';
import UIButton from 'UIComponents/button/UIButton';
import UIResultsMessage from 'UIComponents/results/UIResultsMessage';

var ZeroState = function ZeroState(props) {
  var illustration = props.illustration,
      link = props.link,
      name = props.name;
  return /*#__PURE__*/_jsxs(UIResultsMessage, {
    illustration: illustration,
    illlustrationProps: {
      width: 150
    },
    children: [/*#__PURE__*/_jsx("p", {
      children: /*#__PURE__*/_jsx(FormattedMessage, {
        message: "zeroStates." + name
      })
    }), /*#__PURE__*/_jsx(UIButton, {
      use: "primary",
      onClick: function onClick() {
        return window.open(link, '_blank');
      },
      children: /*#__PURE__*/_jsx(FormattedMessage, {
        message: "zeroStates." + name + "Button"
      })
    })]
  });
};

ZeroState.propTypes = {
  illustration: PropTypes.string.isRequired,
  link: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired
};
export default ZeroState;