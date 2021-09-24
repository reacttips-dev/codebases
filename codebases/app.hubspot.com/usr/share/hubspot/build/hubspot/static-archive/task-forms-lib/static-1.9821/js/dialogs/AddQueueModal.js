'use es6';

import _classCallCheck from "@babel/runtime/helpers/esm/classCallCheck";
import _createClass from "@babel/runtime/helpers/esm/createClass";
import _possibleConstructorReturn from "@babel/runtime/helpers/esm/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/esm/getPrototypeOf";
import _assertThisInitialized from "@babel/runtime/helpers/esm/assertThisInitialized";
import _inherits from "@babel/runtime/helpers/esm/inherits";
import { jsx as _jsx } from "react/jsx-runtime";
import { jsxs as _jsxs } from "react/jsx-runtime";
import { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { rethrowError } from 'UIComponents/core/PromiseHandlers';
import { postQueue } from '../api/QueueApi';
import SyntheticEvent from 'UIComponents/core/SyntheticEvent';
import FormattedMessage from 'I18n/components/FormattedMessage';
import H2 from 'UIComponents/elements/headings/H2';
import UIAlert from 'UIComponents/alert/UIAlert';
import UIButton from 'UIComponents/button/UIButton';
import UIDialogBody from 'UIComponents/dialog/UIDialogBody';
import UIDialogCloseButton from 'UIComponents/dialog/UIDialogCloseButton';
import UIDialogFooter from 'UIComponents/dialog/UIDialogFooter';
import UIDialogHeader from 'UIComponents/dialog/UIDialogHeader';
import UIForm from 'UIComponents/form/UIForm';
import UIFormControl from 'UIComponents/form/UIFormControl';
import UITextInput from 'UIComponents/input/UITextInput';
import UIModal from 'UIComponents/dialog/UIModal';

var AddQueueModal = /*#__PURE__*/function (_PureComponent) {
  _inherits(AddQueueModal, _PureComponent);

  function AddQueueModal(props) {
    var _this;

    _classCallCheck(this, AddQueueModal);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(AddQueueModal).call(this, props));
    _this.state = {
      queueName: '',
      saveError: false,
      fieldError: false
    };
    _this.handleChange = _this.handleChange.bind(_assertThisInitialized(_this));
    _this.handleSave = _this.handleSave.bind(_assertThisInitialized(_this));
    return _this;
  }

  _createClass(AddQueueModal, [{
    key: "handleChange",
    value: function handleChange(_ref) {
      var value = _ref.target.value;
      this.setState({
        queueName: value,
        fieldError: !value || value.length === 0
      });
    }
  }, {
    key: "handleSetTaskQueueId",
    value: function handleSetTaskQueueId(queue) {
      this.props.onTaskChange('hs_queue_membership_ids', SyntheticEvent(queue.id));
    }
  }, {
    key: "handleSave",
    value: function handleSave(event) {
      var _this2 = this;

      var _this$props = this.props,
          ownerId = _this$props.ownerId,
          handleQueueAdded = _this$props.handleQueueAdded,
          onClose = _this$props.onClose;
      var queueName = this.state.queueName;

      if (!queueName || queueName.length === 0) {
        this.setState({
          fieldError: true
        });
        return;
      }

      event.preventDefault();
      postQueue(ownerId, queueName).then(function (queue) {
        handleQueueAdded(queue);

        _this2.handleSetTaskQueueId(queue);

        onClose();
      }, function (err) {
        _this2.setState({
          saveError: true
        });

        rethrowError(err);
      }).done();
    }
  }, {
    key: "render",
    value: function render() {
      var _this$state = this.state,
          queueName = _this$state.queueName,
          saveError = _this$state.saveError,
          fieldError = _this$state.fieldError;
      return /*#__PURE__*/_jsxs(UIModal, {
        "data-selenium-test": "add-queue-modal",
        children: [/*#__PURE__*/_jsxs(UIDialogHeader, {
          children: [/*#__PURE__*/_jsx(UIDialogCloseButton, {
            onClick: this.props.onClose
          }), /*#__PURE__*/_jsx(H2, {
            children: /*#__PURE__*/_jsx(FormattedMessage, {
              message: "taskFormsLib.addQueue.title"
            })
          })]
        }), /*#__PURE__*/_jsxs(UIForm, {
          onSubmit: this.handleSave,
          children: [/*#__PURE__*/_jsxs(UIDialogBody, {
            children: [saveError && /*#__PURE__*/_jsx(UIAlert, {
              type: "danger",
              className: "m-bottom-2",
              children: /*#__PURE__*/_jsx(FormattedMessage, {
                message: "taskFormsLib.addQueue.errorSaving"
              })
            }), /*#__PURE__*/_jsx(UIFormControl, {
              label: /*#__PURE__*/_jsx(FormattedMessage, {
                message: "taskFormsLib.addQueue.label"
              }),
              children: /*#__PURE__*/_jsx(UITextInput, {
                "data-selenium-test": "add-queue-modal__queue-name",
                onChange: this.handleChange,
                value: queueName,
                error: fieldError
              })
            })]
          }), /*#__PURE__*/_jsxs(UIDialogFooter, {
            children: [/*#__PURE__*/_jsx(UIButton, {
              onClick: this.handleSave,
              disabled: !(queueName && queueName.length),
              use: "primary",
              "data-selenium-test": "add-queue-modal__create-queue-button",
              children: /*#__PURE__*/_jsx(FormattedMessage, {
                message: "taskFormsLib.addQueue.save"
              })
            }), /*#__PURE__*/_jsx(UIButton, {
              onClick: this.props.onClose,
              children: /*#__PURE__*/_jsx(FormattedMessage, {
                message: "taskFormsLib.addQueue.cancel"
              })
            })]
          })]
        })]
      });
    }
  }]);

  return AddQueueModal;
}(PureComponent);

AddQueueModal.propTypes = {
  ownerId: PropTypes.number.isRequired,
  onClose: PropTypes.func.isRequired,
  handleQueueAdded: PropTypes.func,

  /** @deprecated Do not use. Dispatch the task changed event from handleQueueAdded instead. */
  onTaskChange: PropTypes.func
};
AddQueueModal.defaultProps = {
  handleQueueAdded: function handleQueueAdded() {},
  onTaskChange: function onTaskChange() {}
};
export { AddQueueModal as default };