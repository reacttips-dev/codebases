'use es6';

import _toConsumableArray from "@babel/runtime/helpers/esm/toConsumableArray";
import _slicedToArray from "@babel/runtime/helpers/esm/slicedToArray";
import { jsx as _jsx } from "react/jsx-runtime";
import { jsxs as _jsxs } from "react/jsx-runtime";
import { Fragment, useState, useRef } from 'react';
import PropTypes from 'prop-types';
import setIn from 'transmute/setIn';
import AddQueueModal from '../dialogs/AddQueueModal';

function getDisplayName(WrappedComponent) {
  return WrappedComponent.displayName || WrappedComponent.name || 'Component';
}

export default (function (TaskFormComponent) {
  var FormWithTaskQueueDialog = function FormWithTaskQueueDialog(props) {
    var _handleQueueAdded = props.handleQueueAdded,
        ownerId = props.ownerId,
        fieldProps = props.fieldProps;

    var _useState = useState(false),
        _useState2 = _slicedToArray(_useState, 2),
        dialogIsOpen = _useState2[0],
        setDialogIsOpen = _useState2[1];

    var _useState3 = useState([]),
        _useState4 = _slicedToArray(_useState3, 2),
        queueOptions = _useState4[0],
        setQueueOptions = _useState4[1];

    var onTaskChangeCallback = useRef(function () {
      return null;
    });
    var fieldPropsWithOptions = setIn(['hs_queue_membership_ids', 'options'], queueOptions, fieldProps);
    return /*#__PURE__*/_jsxs(Fragment, {
      children: [dialogIsOpen && /*#__PURE__*/_jsx(AddQueueModal, {
        ownerId: ownerId,
        onClose: function onClose() {
          return setDialogIsOpen(false);
        },
        handleQueueAdded: function handleQueueAdded(queue) {
          _handleQueueAdded(queue);

          setQueueOptions([].concat(_toConsumableArray(queueOptions), [{
            value: String(queue.id),
            text: queue.name
          }]));
        },
        onTaskChange: onTaskChangeCallback.current
      }), /*#__PURE__*/_jsx(TaskFormComponent, Object.assign({}, props, {
        fieldProps: fieldPropsWithOptions,
        onOpenAddQueueDialog: function onOpenAddQueueDialog(onTaskChange) {
          setDialogIsOpen(true);
          onTaskChangeCallback.current = onTaskChange;
        }
      }))]
    });
  };

  FormWithTaskQueueDialog.displayName = "WithTaskQueueDialog(" + getDisplayName(TaskFormComponent) + ")";
  FormWithTaskQueueDialog.propTypes = {
    fieldProps: PropTypes.object,
    ownerId: PropTypes.number.isRequired,
    handleQueueAdded: PropTypes.func
  };
  FormWithTaskQueueDialog.defaultProps = {
    fieldProps: {},
    handleQueueAdded: function handleQueueAdded() {}
  };
  return FormWithTaskQueueDialog;
});