'use es6';

import { jsx as _jsx } from "react/jsx-runtime";
import I18n from 'I18n';
import DateTimeInput from '../../../../input/DateTimeInput';
import createReactClass from 'create-react-class';
import PropTypes from 'prop-types';
import ImmutableRenderMixin from 'react-immutable-render-mixin';
import SyntheticEvent from 'UIComponents/core/SyntheticEvent';
import * as tasksDateHelpers from '../../../../tasks/helpers/tasksDateHelpers';
var PropertyTaskInputDate = createReactClass({
  displayName: 'PropertyTaskInputDate',
  mixins: [ImmutableRenderMixin],
  propTypes: {
    onChange: PropTypes.func,
    value: PropTypes.oneOfType([PropTypes.number, PropTypes.string])
  },
  focus: function focus() {
    return this.refs.input.focus();
  },
  onChange: function onChange(value) {
    return this.props.onChange(SyntheticEvent(value));
  },
  render: function render() {
    var value = this.props.value;

    if (!value) {
      value = tasksDateHelpers.setToDefaultDueDate(I18n.moment.userTz()).valueOf();
    }

    return /*#__PURE__*/_jsx(DateTimeInput, {
      value: Number(value),
      handleInputChange: this.onChange,
      ref: "property-input-date"
    });
  }
});
export default PropertyTaskInputDate;