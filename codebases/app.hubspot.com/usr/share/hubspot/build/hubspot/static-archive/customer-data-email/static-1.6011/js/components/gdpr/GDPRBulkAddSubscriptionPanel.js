'use es6';

import _defineProperty from "@babel/runtime/helpers/esm/defineProperty";
import _classCallCheck from "@babel/runtime/helpers/esm/classCallCheck";
import _createClass from "@babel/runtime/helpers/esm/createClass";
import _possibleConstructorReturn from "@babel/runtime/helpers/esm/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/esm/getPrototypeOf";
import _inherits from "@babel/runtime/helpers/esm/inherits";
import { jsxs as _jsxs } from "react/jsx-runtime";
import { jsx as _jsx } from "react/jsx-runtime";
import FormattedMessage from 'I18n/components/FormattedMessage';
import PureComponent from 'customer-data-ui-utilities/component/PureComponent';
import PropTypes from 'prop-types';
import UIButton from 'UIComponents/button/UIButton';
import UICheckbox from 'UIComponents/input/UICheckbox';
import UIDialogCloseButton from 'UIComponents/dialog/UIDialogCloseButton';
import UIHelpIcon from 'UIComponents/icon/UIHelpIcon';
import UIModalPanel from 'UIComponents/dialog/UIModalPanel';
import UIDialogBody from 'UIComponents/dialog/UIDialogBody';
import UIDialogFooter from 'UIComponents/dialog/UIDialogFooter';
import UIDialogHeader from 'UIComponents/dialog/UIDialogHeader';
import partial from 'transmute/partial';
import memoize from 'transmute/memoize';
import PromptablePropInterface from 'UIComponents/decorators/PromptablePropInterface';
import I18n from 'I18n';
import LawfulBasisSelect from 'ui-gdpr-components/components/LawfulBasisSelect';
import SubscriptionTypeSelect from 'ui-gdpr-components/components/SubscriptionTypeSelect';
import UIFormControl from 'UIComponents/form/UIFormControl';
import UITextArea from 'UIComponents/input/UITextArea';
import Promptable from 'UIComponents/decorators/Promptable';
import UITooltip from 'UIComponents/tooltip/UITooltip';
import UIRadioInput from 'UIComponents/input/UIRadioInput';
import H2 from 'UIComponents/elements/headings/H2';
var propTypes = Object.assign({}, PromptablePropInterface, {
  subTitle: PropTypes.node,
  multiSelect: PropTypes.bool,
  hideIds: PropTypes.array,
  gdprEnabled: PropTypes.bool
});
var langKey = 'customerDataEmail.GDPR';

var GDPRBulkAddSubscriptionPanel = /*#__PURE__*/function (_PureComponent) {
  _inherits(GDPRBulkAddSubscriptionPanel, _PureComponent);

  function GDPRBulkAddSubscriptionPanel(props) {
    var _this;

    _classCallCheck(this, GDPRBulkAddSubscriptionPanel);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(GDPRBulkAddSubscriptionPanel).call(this, props));

    _this.handleSubscriptionChange = function (key, subscription) {
      var value = _this.props.multiSelect ? subscription.map(function (sub) {
        return sub.id;
      }) : subscription.id;

      _this.setState(_defineProperty({}, key, value));
    };

    _this.handleChange = function (key, _ref) {
      var value = _ref.target.value;

      _this.setState(_defineProperty({}, key, value));
    };

    _this.handlePortalWideChange = function (key, _ref2) {
      var checked = _ref2.target.checked;

      _this.setState(_defineProperty({}, key, checked));
    };

    _this.handleSave = function () {
      var subscription = _this.state.subscription;

      _this.props.onConfirm(Object.assign({}, _this.state, {
        subscription: _this.props.multiSelect ? subscription : [subscription]
      }));
    };

    _this.state = {
      subscription: null,
      lawfulBasis: null,
      explanation: null,
      portalWide: null,
      optState: null
    }; // In new code, please use ES6 spread args rather than partials
    // for easier debugging and readability:
    // (...args) => myFunction('partiallyAppliedParam', ...args)

    _this.partial = memoize(partial);
    return _this;
  }

  _createClass(GDPRBulkAddSubscriptionPanel, [{
    key: "hasChangeToSave",
    value: function hasChangeToSave() {
      return this.state.portalWide || this.props.multiSelect && Array.isArray(this.state.subscription) && this.state.subscription.length || !this.props.multiSelect && (this.state.subscription || this.props.selectedSubscriptionId);
    }
  }, {
    key: "gdprSelect",
    value: function gdprSelect() {
      if (this.props.gdprEnabled) {
        return /*#__PURE__*/_jsx(LawfulBasisSelect, {
          onChange: this.partial(this.handleChange, 'lawfulBasis'),
          formControlProps: {
            required: true,
            label: I18n.text(langKey + ".inputs.lawfulBasisSelectForAddingSubscription.label")
          }
        });
      }

      return null;
    }
  }, {
    key: "render",
    value: function render() {
      var saveDisabled = !this.hasChangeToSave() || this.props.gdprEnabled && !this.state.lawfulBasis || !this.state.explanation || !this.state.optState;
      var multiOptions = this.props.multiSelect ? {
        multi: true,
        showSelectAllFooter: true,
        anchorType: 'button'
      } : {};
      return /*#__PURE__*/_jsxs(UIModalPanel, {
        children: [/*#__PURE__*/_jsxs(UIDialogHeader, {
          children: [/*#__PURE__*/_jsx(UIDialogCloseButton, {
            onClick: this.props.onReject
          }), /*#__PURE__*/_jsx(H2, {
            children: /*#__PURE__*/_jsx(FormattedMessage, {
              message: langKey + ".dialogs.addSubscription.title"
            })
          })]
        }), /*#__PURE__*/_jsxs(UIDialogBody, {
          children: [this.props.subTitle, /*#__PURE__*/_jsx(SubscriptionTypeSelect, Object.assign({
            showInactive: false,
            value: this.state.subscription || this.props.selectedSubscriptionId,
            onChange: this.partial(this.handleSubscriptionChange, 'subscription'),
            formControlProps: {
              label: I18n.text(langKey + ".inputs.subscriptionTypeSelect.label")
            },
            hideIds: this.props.hideIds
          }, multiOptions)), this.props.gdprEnabled ? /*#__PURE__*/_jsxs("div", {
            children: [/*#__PURE__*/_jsx(UIRadioInput, {
              inline: true,
              value: "OPT_IN",
              name: "optState",
              "data-selenium-test": "gdpr-opt-in-radio",
              onChange: this.partial(this.handleChange, 'optState'),
              children: I18n.text(langKey + ".inputs.optState.optIn")
            }), /*#__PURE__*/_jsx(UIRadioInput, {
              inline: true,
              value: "NOT_OPTED",
              name: "optState",
              onChange: this.partial(this.handleChange, 'optState'),
              children: I18n.text(langKey + ".inputs.optState.notOpted")
            }), /*#__PURE__*/_jsx(UIRadioInput, {
              inline: true,
              value: "OPT_OUT",
              name: "optState",
              onChange: this.partial(this.handleChange, 'optState'),
              children: I18n.text(langKey + ".inputs.optState.optOut")
            })]
          }) : /*#__PURE__*/_jsxs("div", {
            children: [/*#__PURE__*/_jsx(UIRadioInput, {
              inline: true,
              value: "OPT_IN",
              name: "optState",
              onChange: this.partial(this.handleChange, 'optState'),
              children: I18n.text(langKey + ".inputs.optState.subscribed")
            }), /*#__PURE__*/_jsx(UIRadioInput, {
              inline: true,
              value: "OPT_OUT",
              name: "optState",
              onChange: this.partial(this.handleChange, 'optState'),
              children: I18n.text(langKey + ".inputs.optState.unsubscribed")
            })]
          }), /*#__PURE__*/_jsx(UICheckbox, {
            onChange: this.partial(this.handlePortalWideChange, 'portalWide'),
            children: /*#__PURE__*/_jsx(UIHelpIcon, {
              title: I18n.text(langKey + ".inputs.portalWide.helpText"),
              children: I18n.text(langKey + ".inputs.portalWide.label")
            })
          }), this.gdprSelect(), /*#__PURE__*/_jsx(UIFormControl, {
            label: I18n.text(langKey + ".inputs.explanation.label"),
            required: true,
            children: /*#__PURE__*/_jsx(UITextArea, {
              placeholder: I18n.text(langKey + ".inputs.explanation.label"),
              onChange: this.partial(this.handleChange, 'explanation'),
              "data-selenium-test": "gdpr-explanation-text"
            })
          })]
        }), /*#__PURE__*/_jsxs(UIDialogFooter, {
          children: [/*#__PURE__*/_jsx(UITooltip, {
            disabled: !saveDisabled,
            title: /*#__PURE__*/_jsx(FormattedMessage, {
              message: langKey + ".buttons.disabled"
            }),
            children: /*#__PURE__*/_jsx(UIButton, {
              use: "primary",
              onClick: this.handleSave,
              disabled: saveDisabled,
              "data-selenium-test": "gdpr-save-add-sub",
              children: /*#__PURE__*/_jsx(FormattedMessage, {
                message: langKey + ".buttons.save"
              })
            })
          }), /*#__PURE__*/_jsx(UIButton, {
            onClick: this.props.onReject,
            children: /*#__PURE__*/_jsx(FormattedMessage, {
              message: langKey + ".buttons.cancel"
            })
          })]
        })]
      });
    }
  }]);

  return GDPRBulkAddSubscriptionPanel;
}(PureComponent);

GDPRBulkAddSubscriptionPanel.propTypes = propTypes;
export default Promptable(GDPRBulkAddSubscriptionPanel);