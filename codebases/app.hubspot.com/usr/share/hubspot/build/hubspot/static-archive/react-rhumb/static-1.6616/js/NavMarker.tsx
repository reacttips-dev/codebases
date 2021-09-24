import { jsx as _jsx } from "react/jsx-runtime";
import { jsxs as _jsxs } from "react/jsx-runtime";
import { Fragment } from 'react';
import PropTypes from 'prop-types';
import useNavMarker from './useNavMarker';

var NavMarkerImpl = function NavMarkerImpl(_ref) {
  var name = _ref.name;
  useNavMarker(name);
  return null;
};

if (process.env.NODE_ENV !== 'production') {
  NavMarkerImpl.propTypes = {
    name: PropTypes.string.isRequired
  };
}

var NavMarker = function NavMarker(_ref2) {
  var children = _ref2.children,
      name = _ref2.name,
      _ref2$active = _ref2.active,
      active = _ref2$active === void 0 ? true : _ref2$active;
  return /*#__PURE__*/_jsxs(Fragment, {
    children: [children, active && /*#__PURE__*/_jsx(NavMarkerImpl, {
      name: name
    })]
  });
};

if (process.env.NODE_ENV !== 'production') {
  NavMarker.propTypes = {
    name: PropTypes.string.isRequired,
    children: PropTypes.node,
    active: PropTypes.bool
  };
}

export default NavMarker;