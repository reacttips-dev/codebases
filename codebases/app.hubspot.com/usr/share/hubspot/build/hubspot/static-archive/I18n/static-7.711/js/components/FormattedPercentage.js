'use es6';

import { jsx as _jsx } from "react/jsx-runtime";
import PropTypes from 'prop-types';
import createReactClass from 'create-react-class';
import FormattedNumber from './FormattedNumber';
import NumberTypes from '../constants/NumberTypes';
export default createReactClass({
  displayName: "FormattedPercentage",
  propTypes: {
    precision: PropTypes.number,
    stripInsignificantZeros: PropTypes.bool,
    value: PropTypes.number.isRequired
  },
  render: function render() {
    return /*#__PURE__*/_jsx(FormattedNumber, Object.assign({
      style: NumberTypes.PERCENTAGE
    }, this.props));
  }
});