'use es6';

import { jsx as _jsx } from "react/jsx-runtime";
import PropTypes from 'prop-types';
import I18n from 'I18n';
import UITooltip from 'UIComponents/tooltip/UITooltip';

var Timestamp = function Timestamp(props) {
  return /*#__PURE__*/_jsx(UITooltip, {
    title: I18n.moment.portalTz(props.value).format('lll'),
    children: /*#__PURE__*/_jsx("span", {
      className: "timestamp",
      children: I18n.moment.portalTz(props.value).fromNow()
    })
  });
};

Timestamp.propTypes = {
  value: PropTypes.number.isRequired
};
export default Timestamp;