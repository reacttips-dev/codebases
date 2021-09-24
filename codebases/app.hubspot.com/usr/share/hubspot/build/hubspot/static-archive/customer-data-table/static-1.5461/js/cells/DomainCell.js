'use es6';

import { jsx as _jsx } from "react/jsx-runtime";
import EmptyState from '../Components/EmptyState';
import PropTypes from 'prop-types';
import { memo } from 'react';
import UILink from 'UIComponents/link/UILink';

var DomainCell = function DomainCell(props) {
  var truncate = props.truncate,
      value = props.value;
  var defaultProtocol = 'http';
  var validUrl = value && value.startsWith(defaultProtocol) ? value : defaultProtocol + "://" + value;

  if (!value) {
    return /*#__PURE__*/_jsx(EmptyState, {});
  }

  return /*#__PURE__*/_jsx(UILink, {
    className: "domain-name text-left",
    external: true,
    href: validUrl,
    truncate: truncate,
    children: value
  });
};

DomainCell.propTypes = {
  truncate: PropTypes.bool,
  value: PropTypes.string
};
DomainCell.defaultProps = {
  truncate: false
};
export default /*#__PURE__*/memo(DomainCell);