'use es6';

import { jsx as _jsx } from "react/jsx-runtime";
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { OLAF } from 'HubStyleTokens/colors';
import { MAJOR, MINOR, NORMAL } from 'draft-smart-detections/rules/lib/suggestionDegrees';
import UIFlex from 'UIComponents/layout/UIFlex';
import UIIcon from 'UIComponents/icon/UIIcon';

var SuggestionsDot = function SuggestionsDot(_ref) {
  var degree = _ref.degree,
      _ref$size = _ref.size,
      size = _ref$size === void 0 ? 0 : _ref$size,
      _ref$use = _ref.use,
      use = _ref$use === void 0 ? 'large' : _ref$use;
  var isSmall = use === 'small';
  var isLarge = use === 'large';
  var className = classNames('smart-detections__suggestion-dot', degree === MAJOR && "red", degree === MINOR && "yellow", degree === NORMAL && "green", isSmall && "small", isLarge && "large");
  var innerDot = '';

  if (isLarge) {
    innerDot = size > 0 ? size : /*#__PURE__*/_jsx(UIIcon, {
      name: "success",
      color: OLAF,
      size: 12,
      className: "m-top-1",
      style: {
        paddingBottom: 2
      }
    });
  }

  return /*#__PURE__*/_jsx(UIFlex, {
    align: "center",
    justify: "center",
    className: className,
    direction: "column",
    children: innerDot
  });
};

SuggestionsDot.propTypes = {
  degree: PropTypes.number.isRequired,
  use: PropTypes.string,
  size: PropTypes.number
};
export default SuggestionsDot;