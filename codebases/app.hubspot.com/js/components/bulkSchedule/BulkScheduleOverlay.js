'use es6';

import _classCallCheck from "@babel/runtime/helpers/esm/classCallCheck";
import _createClass from "@babel/runtime/helpers/esm/createClass";
import _possibleConstructorReturn from "@babel/runtime/helpers/esm/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/esm/getPrototypeOf";
import _inherits from "@babel/runtime/helpers/esm/inherits";
import { jsx as _jsx } from "react/jsx-runtime";
import PropTypes from 'prop-types';
import { Component } from 'react';
import UIModal from 'UIComponents/dialog/UIModal';
import BulkScheduleDialog from './BulkScheduleDialog';
import { passPropsFor } from '../../lib/utils';

var BulkScheduleOverlay = /*#__PURE__*/function (_Component) {
  _inherits(BulkScheduleOverlay, _Component);

  function BulkScheduleOverlay() {
    _classCallCheck(this, BulkScheduleOverlay);

    return _possibleConstructorReturn(this, _getPrototypeOf(BulkScheduleOverlay).apply(this, arguments));
  }

  _createClass(BulkScheduleOverlay, [{
    key: "render",
    value: function render() {
      var bulkScheduleProps = this.props.bulkSchedule;
      return /*#__PURE__*/_jsx(UIModal, {
        className: "bulk-schedule-modal",
        width: 550,
        use: 'default',
        children: /*#__PURE__*/_jsx(BulkScheduleDialog, Object.assign({}, passPropsFor(this.props, BulkScheduleDialog), {
          bulkScheduleMessages: this.props.bulkScheduleMessages,
          loading: bulkScheduleProps.get('loading'),
          error: bulkScheduleProps.get('error')
        }))
      });
    }
  }]);

  return BulkScheduleOverlay;
}(Component);

BulkScheduleOverlay.propTypes = {
  bulkScheduleMessages: PropTypes.func,
  bulkSchedule: PropTypes.object,
  portalId: PropTypes.number.isRequired,
  closeModal: PropTypes.func,
  showBulkScheduleSuccessNotification: PropTypes.func
};
export { BulkScheduleOverlay as default };