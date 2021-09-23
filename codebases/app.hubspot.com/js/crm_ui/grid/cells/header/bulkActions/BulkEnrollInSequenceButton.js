'use es6';

import _classCallCheck from "@babel/runtime/helpers/esm/classCallCheck";
import _createClass from "@babel/runtime/helpers/esm/createClass";
import _possibleConstructorReturn from "@babel/runtime/helpers/esm/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/esm/getPrototypeOf";
import _inherits from "@babel/runtime/helpers/esm/inherits";
import { jsx as _jsx } from "react/jsx-runtime";
import ConnectedAccountsStore from 'crm_data/connectedAccount/ConnectedAccountsStore';
import PortalStore from 'crm_data/portal/PortalStore';
import UserStore from 'crm_data/user/UserStore';
import BulkActionButton from './BulkActionButton';
import BulkActionPropsType from '../../../utils/BulkActionPropsType';
import { hasSalesProSeat, hasSequencesBulkEnroll, hasSequencesEnrollmentsAccess } from 'sequences-highlight-alert-lib/SequencesPermissions';
import BulkEnrollInSequenceLockButton from '../../../../sequences/BulkEnrollInSequenceLockButton';
import bulkEnrollInSequencePrefetcher from '../../../../sequences/bulkEnrollInSequencePrefetcher';
import BulkEnrollInSequencePromptAsync from '../../../../sequences/BulkEnrollInSequencePromptAsync';
import ConnectedAccounts from 'customer-data-email/schema/connectedAccount/ConnectedAccounts';
import { CrmLogger } from 'customer-data-tracking/loggers';
import { connect } from 'general-store';
import FormattedReactMessage from 'I18n/components/FormattedReactMessage';
import PropTypes from 'prop-types';
import { PureComponent } from 'react';
import emptyFunction from 'react-utils/emptyFunction';
import { rethrowError } from 'UIComponents/core/PromiseHandlers';
import { hasConnectedAccount } from '../../../../utils/hasConnectedAccount';
var deps = {
  user: UserStore,
  portal: PortalStore,
  connectedAccounts: ConnectedAccountsStore
};
var BULK_ENROLL_LIMIT = 50;
export var BulkEnrollInSequenceButton = /*#__PURE__*/function (_PureComponent) {
  _inherits(BulkEnrollInSequenceButton, _PureComponent);

  function BulkEnrollInSequenceButton() {
    var _getPrototypeOf2;

    var _this;

    _classCallCheck(this, BulkEnrollInSequenceButton);

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = _possibleConstructorReturn(this, (_getPrototypeOf2 = _getPrototypeOf(BulkEnrollInSequenceButton)).call.apply(_getPrototypeOf2, [this].concat(args)));

    _this.isSalesProWithoutBulkEnrollPermission = function () {
      return hasSalesProSeat() && !hasSequencesBulkEnroll();
    };

    _this.getDisabledTooltip = function () {
      if (_this.isSalesProWithoutBulkEnrollPermission() && _this.getNumberOfContactsSelected() > 1) {
        return /*#__PURE__*/_jsx(FormattedReactMessage, {
          message: "topbarContents.enrollInSequenceNoPermission"
        });
      }

      if (_this.props.bulkActionProps.get('allSelected')) {
        return /*#__PURE__*/_jsx(FormattedReactMessage, {
          message: "topbarContents.enrollInSequenceAllSelected"
        });
      }

      if (_this.isOverBulkEnrollCapacity()) {
        return /*#__PURE__*/_jsx(FormattedReactMessage, {
          message: "topbarContents.enrollInSequenceBulkEnroll"
        });
      }

      if (!hasConnectedAccount(_this.props.connectedAccounts)) {
        return /*#__PURE__*/_jsx(FormattedReactMessage, {
          message: "topbarContents.enrollInSequenceNoConnectedInbox"
        });
      }

      return null;
    };

    _this.handleClick = function () {
      var _this$props = _this.props,
          user = _this$props.user,
          portal = _this$props.portal,
          bulkActionProps = _this$props.bulkActionProps,
          _this$props$Prompt = _this$props.Prompt,
          Prompt = _this$props$Prompt === void 0 ? BulkEnrollInSequencePromptAsync : _this$props$Prompt;
      var checked = bulkActionProps.get('checked').toList();
      CrmLogger.log('use-bulk-enroll-in-sequence');
      Prompt({
        user: user,
        portal: portal,
        contacts: checked
      }).then(emptyFunction, rethrowError);
    };

    _this.shouldShowPQL = function () {
      if (_this.getNumberOfContactsSelected() === 1) {
        return !hasSequencesEnrollmentsAccess();
      }

      if (_this.isSalesProWithoutBulkEnrollPermission()) {
        return false;
      }

      return !hasSequencesBulkEnroll();
    };

    return _this;
  }

  _createClass(BulkEnrollInSequenceButton, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      if (this.canOpenBulkEnrollPrompt()) {
        bulkEnrollInSequencePrefetcher();
      }
    }
  }, {
    key: "getNumberOfContactsSelected",
    value: function getNumberOfContactsSelected() {
      return this.props.bulkActionProps.get('checked').size;
    }
  }, {
    key: "canOpenBulkEnrollPrompt",
    value: function canOpenBulkEnrollPrompt() {
      return hasSequencesEnrollmentsAccess() && (hasSequencesBulkEnroll() || this.getNumberOfContactsSelected() === 1) && !this.props.bulkActionProps.get('allSelected') && !this.isOverBulkEnrollCapacity() && hasConnectedAccount(this.props.connectedAccounts);
    }
  }, {
    key: "isOverBulkEnrollCapacity",
    value: function isOverBulkEnrollCapacity() {
      return this.getNumberOfContactsSelected() > BULK_ENROLL_LIMIT;
    }
  }, {
    key: "render",
    value: function render() {
      if (this.shouldShowPQL()) {
        return /*#__PURE__*/_jsx(BulkEnrollInSequenceLockButton, {});
      }

      return /*#__PURE__*/_jsx(BulkActionButton, {
        "data-selenium-test": "bulk-action-enroll-in-sequence",
        disabled: !this.canOpenBulkEnrollPrompt(),
        disabledTooltip: this.getDisabledTooltip(),
        icon: "sequences",
        onClick: this.handleClick,
        options: this.props.options,
        title: /*#__PURE__*/_jsx(FormattedReactMessage, {
          message: "topbarContents.enrollInSequence"
        })
      });
    }
  }]);

  return BulkEnrollInSequenceButton;
}(PureComponent);
BulkEnrollInSequenceButton.propTypes = {
  bulkActionProps: BulkActionPropsType.isRequired,
  Prompt: PropTypes.func,
  connectedAccounts: PropTypes.instanceOf(ConnectedAccounts),
  options: PropTypes.object,
  portal: PropTypes.object.isRequired,
  user: PropTypes.object.isRequired
};
export default connect(deps)(BulkEnrollInSequenceButton);