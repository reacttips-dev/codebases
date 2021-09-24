'use es6';

import { jsx as _jsx } from "react/jsx-runtime";
import createReactClass from 'create-react-class';
import PropTypes from 'prop-types';
import { fromMoment } from 'UIComponents/core/SimpleDate';
import DateTimeInputDropdown from '../components/input/DateTimeInputDropdown';
import DateTimeInputSelect from '../components/input/DateTimeInputSelect';
import ImmutableRenderMixin from 'react-immutable-render-mixin';
import I18n from 'I18n';
var propTypes = {
  disablePastDates: PropTypes.bool,
  minValue: PropTypes.number,
  use: PropTypes.string
};
var defaultProps = {
  disablePastDates: true
};
export default createReactClass({
  displayName: 'DateTimeInput',
  mixins: [ImmutableRenderMixin],
  propTypes: propTypes,
  getDefaultProps: function getDefaultProps() {
    return defaultProps;
  },
  getDatePickerMinValue: function getDatePickerMinValue() {
    var minValue = this.props.minValue;

    if (minValue) {
      return minValue;
    }

    if (!this.props.disablePastDates) {
      return undefined;
    }

    return fromMoment(I18n.moment.userTz());
  },
  render: function render() {
    if (this.props.use === 'dropdown') {
      return /*#__PURE__*/_jsx(DateTimeInputDropdown, Object.assign({}, this.props));
    } else {
      return /*#__PURE__*/_jsx(DateTimeInputSelect, Object.assign({}, this.props));
    }
  }
});