'use es6';

import { jsx as _jsx } from "react/jsx-runtime";
import { jsxs as _jsxs } from "react/jsx-runtime";
import PropTypes from 'prop-types';
import { ThemeProvider } from 'styled-components';
import VizExGlobalStyle from '../global/VizExGlobalStyle';
import themePropType from '../utils/themePropType';

var VizExThemeProvider = function VizExThemeProvider(_ref) {
  var theme = _ref.theme,
      children = _ref.children;
  return /*#__PURE__*/_jsxs(ThemeProvider, {
    theme: theme,
    children: [children, /*#__PURE__*/_jsx(VizExGlobalStyle, {})]
  });
};

VizExThemeProvider.displayName = 'VizExThemeProvider';
VizExThemeProvider.propTypes = {
  children: PropTypes.node,
  theme: themePropType
};
export default VizExThemeProvider;