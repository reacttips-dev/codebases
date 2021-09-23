'use es6';

import _classCallCheck from "@babel/runtime/helpers/esm/classCallCheck";
import _createClass from "@babel/runtime/helpers/esm/createClass";
import _possibleConstructorReturn from "@babel/runtime/helpers/esm/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/esm/getPrototypeOf";
import _inherits from "@babel/runtime/helpers/esm/inherits";
import { jsx as _jsx } from "react/jsx-runtime";
import { GDPR_COMPLIANCE_ENABLED } from 'crm_data/constants/PortalSettingsKeys';
import { bulkUpdateSubscriptions } from 'crm_data/subscriptions/actions/SubscriptionsActions';
import BulkActionButton from './BulkActionButton';
import { edit } from '../../../permissions/bulkActionPermissions';
import { getObjectTypeLabel } from '../../../utils/BulkActionPropsRecord';
import BulkActionPropsType from '../../../utils/BulkActionPropsType';
import isTrue from '../../../../utils/isTrue';
import GDPRBulkAddSubscriptionPanel from 'customer-data-email/components/gdpr/GDPRBulkAddSubscriptionPanel';
import * as Alerts from 'customer-data-ui-utilities/alerts/Alerts';
import PureComponent from 'customer-data-ui-utilities/component/PureComponent';
import FormattedMessage from 'I18n/components/FormattedMessage';
import FormattedReactMessage from 'I18n/components/FormattedReactMessage';
import PropTypes from 'prop-types';
import { rethrowError } from 'UIComponents/core/PromiseHandlers';
import { CrmLogger } from 'customer-data-tracking/loggers';
import { connect } from 'general-store';
import { isLoading } from 'crm_data/flux/LoadingStatus';
import { LOADING } from 'crm_data/flux/LoadingStatus';
import SettingsStore from 'crm_data/settings/SettingsStore';
export var BulkAddGDPRSubscriptionButton = /*#__PURE__*/function (_PureComponent) {
  _inherits(BulkAddGDPRSubscriptionButton, _PureComponent);

  function BulkAddGDPRSubscriptionButton() {
    var _getPrototypeOf2;

    var _this;

    _classCallCheck(this, BulkAddGDPRSubscriptionButton);

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = _possibleConstructorReturn(this, (_getPrototypeOf2 = _getPrototypeOf(BulkAddGDPRSubscriptionButton)).call.apply(_getPrototypeOf2, [this].concat(args)));

    _this.handleUpdateSubscriptions = function (_ref) {
      var lawfulBasis = _ref.lawfulBasis,
          explanation = _ref.explanation,
          subscription = _ref.subscription,
          portalWide = _ref.portalWide,
          optState = _ref.optState;
      CrmLogger.log('saveBulkCommunicationSubscription', {
        type: optState,
        removeFromAllEmail: portalWide
      });
      var payload = {
        legalBasis: lawfulBasis,
        legalBasisExplanation: explanation,
        subscriptionIds: subscription,
        portalWide: portalWide,
        optState: optState
      };
      var bulkActionProps = _this.props.bulkActionProps;

      if (bulkActionProps.get('allSelected')) {
        payload.contactsSearch = bulkActionProps.get('query');
      } else {
        payload.vids = bulkActionProps.get('checked');
      }

      bulkUpdateSubscriptions(payload).then(function () {
        Alerts.addSuccess('topbarContents.gdprAddSubscription.alerts.inProgress', {
          count: bulkActionProps.get('selectionCount')
        });
      }).catch(_this.handleUpdateSubscriptionsError).done();
    };

    _this.handleUpdateSubscriptionsError = function (error) {
      if (error && error.responseJSON && error.responseJSON.message) {
        Alerts.addError(error.responseJSON.message);
      }
    };

    _this.handleClick = function () {
      var _this$props = _this.props,
          _this$props$Prompt = _this$props.Prompt,
          Prompt = _this$props$Prompt === void 0 ? GDPRBulkAddSubscriptionPanel : _this$props$Prompt,
          gdprEnabled = _this$props.gdprEnabled;
      CrmLogger.log('indexInteractions', {
        action: 'open bulk communication subscription editor'
      });
      Prompt({
        subTitle: /*#__PURE__*/_jsx(FormattedMessage, {
          message: 'crm_components.GDPR.dialogs.addSubscription.subTitle'
        }),
        multiSelect: true,
        gdprEnabled: gdprEnabled
      }).then(_this.handleUpdateSubscriptions, rethrowError).done();
    };

    return _this;
  }

  _createClass(BulkAddGDPRSubscriptionButton, [{
    key: "render",
    value: function render() {
      var gdprEnabled = this.props.gdprEnabled;
      var bulkActionProps = this.props.bulkActionProps;
      var canBulkEditAll = bulkActionProps.get('canBulkEditAll');
      var objectTypeLabel = getObjectTypeLabel(bulkActionProps);
      var objectType = bulkActionProps.get('objectType');

      var _edit = edit({
        canBulkEditAll: canBulkEditAll,
        objectTypeLabel: objectTypeLabel,
        objectType: objectType
      }),
          disabled = _edit.disabled,
          disabledTooltip = _edit.disabledTooltip;

      return /*#__PURE__*/_jsx(BulkActionButton, {
        disabled: disabled || isLoading(gdprEnabled),
        disabledTooltip: disabledTooltip,
        icon: "add",
        onClick: this.handleClick,
        options: this.props.options,
        title: /*#__PURE__*/_jsx(FormattedReactMessage, {
          message: "topbarContents.gdprAddSubscription.buttonTitle"
        })
      });
    }
  }]);

  return BulkAddGDPRSubscriptionButton;
}(PureComponent);
BulkAddGDPRSubscriptionButton.propTypes = {
  bulkActionProps: BulkActionPropsType.isRequired,
  options: PropTypes.object,
  gdprEnabled: PropTypes.bool,
  Prompt: PropTypes.func
};
export var deps = {
  gdprEnabled: {
    stores: [SettingsStore],
    deref: function deref(_ref2) {
      var bulkActionProps = _ref2.bulkActionProps;

      // The != here is load-bearing to catch both null and undefined!
      // Don't change to a triple equals.
      if (bulkActionProps.gdprEnabled != null) {
        return bulkActionProps.gdprEnabled;
      }

      var setting = SettingsStore.get(GDPR_COMPLIANCE_ENABLED);

      if (isLoading(setting)) {
        return LOADING;
      }

      return isTrue(setting);
    }
  }
};
export default connect(deps)(BulkAddGDPRSubscriptionButton);