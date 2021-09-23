'use es6';

import { jsx as _jsx } from "react/jsx-runtime";
import EmptyState from '../Components/EmptyState';
import PropTypes from 'prop-types';
import { memo } from 'react';
import UILink from 'UIComponents/link/UILink';

var EmailCell = function EmailCell(_ref) {
  var value = _ref.value,
      external = _ref.external;

  if (!value) {
    return /*#__PURE__*/_jsx(EmptyState, {});
  }

  var mailto = "mailto:" + value;
  return /*#__PURE__*/_jsx(UILink, {
    className: "text-left truncate-text",
    external: external,
    href: mailto,
    children: value
  });
};

EmailCell.propTypes = {
  external: PropTypes.bool,
  value: PropTypes.string
};
export default /*#__PURE__*/memo(EmailCell);