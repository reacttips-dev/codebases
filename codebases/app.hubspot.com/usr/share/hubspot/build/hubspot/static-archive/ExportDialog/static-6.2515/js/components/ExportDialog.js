'use es6';

import _objectWithoutProperties from "@babel/runtime/helpers/esm/objectWithoutProperties";
import _classCallCheck from "@babel/runtime/helpers/esm/classCallCheck";
import _possibleConstructorReturn from "@babel/runtime/helpers/esm/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/esm/getPrototypeOf";
import _assertThisInitialized from "@babel/runtime/helpers/esm/assertThisInitialized";
import _createClass from "@babel/runtime/helpers/esm/createClass";
import _inherits from "@babel/runtime/helpers/esm/inherits";
import { jsxs as _jsxs } from "react/jsx-runtime";
import { jsx as _jsx } from "react/jsx-runtime";
import PropTypes from 'prop-types';
import { Component } from 'react';
import { Map as ImmutableMap } from 'immutable';
import { callIfPossible } from 'UIComponents/core/Functions';
import EmailAddressPattern from 'PatternValidationJS/patterns/EmailAddress';
import FormattedMessage from 'I18n/components/FormattedMessage';
import FormattedHTMLMessage from 'I18n/components/FormattedHTMLMessage';
import Small from 'UIComponents/elements/Small';
import UIModal from 'UIComponents/dialog/UIModal';
import UIDialogCloseButton from 'UIComponents/dialog/UIDialogCloseButton';
import UIDialogHeader from 'UIComponents/dialog/UIDialogHeader';
import UIDialogBody from 'UIComponents/dialog/UIDialogBody';
import UIDialogFooter from 'UIComponents/dialog/UIDialogFooter';
import UIButton from 'UIComponents/button/UIButton';
import UITooltip from 'UIComponents/tooltip/UITooltip';
import UIIcon from 'UIComponents/icon/UIIcon';
import UIForm from 'UIComponents/form/UIForm';
import UIBox from 'UIComponents/layout/UIBox';
import UIFlex from 'UIComponents/layout/UIFlex';
import UIWizard from 'UIComponents/dialog/UIWizard';
import UIWizardHeaderWithOverview from 'UIComponents/dialog/UIWizardHeaderWithOverview';
import UIWizardStep from 'UIComponents/dialog/UIWizardStep';
import UILoadingSpinner from 'UIComponents/loading/UILoadingSpinner';
import PortalIdParser from 'PortalIdParser';
import { fetchPreferences } from '../apiClients/ExportPreferencesClient';
import { DefaultFieldKeys, EmailValidationStates, ExportStates, FailureReasons, Formats, PreferenceState, ExportPreferences, Urls } from 'ExportDialog/Constants';
import createFormField from 'ExportDialog/components/formFields/FormField';
import EmailField from 'ExportDialog/components/formFields/EmailField';
import FormatField from 'ExportDialog/components/formFields/FormatField';
import H2 from 'UIComponents/elements/headings/H2';

var ExportDialog = /*#__PURE__*/function (_Component) {
  _inherits(ExportDialog, _Component);

  _createClass(ExportDialog, null, [{
    key: "propTypes",
    get: function get() {
      return {
        // The API client to use needs to implement these methods.
        client: PropTypes.shape({
          export: PropTypes.func.isRequired
        }).isRequired,
        // The form fields to be displayed. They must be wrapped by `createFormField`.
        formFields: PropTypes.arrayOf(PropTypes.func).isRequired,
        // The contents of the header at the top of the dialog.
        headerContents: PropTypes.node.isRequired,
        // Navigation bar at the top of the dialog
        topNavBar: PropTypes.node,
        // Additional content at the top of the dialog body.
        topBodyContents: PropTypes.node,
        // Additional content at the bottom of the dialog body.
        bottomBodyContents: PropTypes.node,
        // Tells the parent to unmount the dialog.
        onClose: PropTypes.func.isRequired,
        // Lets the parent display a failure message.
        onFailure: PropTypes.func,
        // Lets the parent display a success message.
        onSuccess: PropTypes.func,
        // The email of the user requesting the export.
        userEmail: PropTypes.string.isRequired,
        // The type of export dialog to render.
        use: PropTypes.oneOf(['WIZARD', 'DIALOG']).isRequired,
        // Props that are passed to the first step in the UIWizard
        firstStepProps: PropTypes.object,
        // Used as the rest of the steps in UIWizard
        children: PropTypes.node,
        // Extra options passed from the parent to the export call.
        exportOptions: PropTypes.object,
        // EmailFieldAndNotificationHelpText at the top of the dialog
        emailFieldAndNotificationHelpText: PropTypes.func,
        onReject: PropTypes.func,
        // Lets the parent know a field has changed.
        onFieldChange: PropTypes.func,
        // Manually disable the export primary action
        disableExportButton: PropTypes.bool,
        // To provide the disabled button tooltip props
        disabledExportButtonTooltipProps: PropTypes.object,
        // Default values for fields
        defaultFormat: PropTypes.string
      };
    }
  }]);

  function ExportDialog(props) {
    var _this;

    _classCallCheck(this, ExportDialog);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(ExportDialog).call(this));
    _this.state = {
      exportPreferences: [],
      isNotificationOff: false,
      preferenceState: PreferenceState.NOT_REQUESTED,
      exportState: ExportStates.NOT_REQUESTED,
      formState: new ImmutableMap({
        email: props.userEmail,
        format: props.defaultFormat || Formats.CSV
      })
    };
    _this.handleFieldChange = _this.handleFieldChange.bind(_assertThisInitialized(_this));
    _this.startExport = _this.startExport.bind(_assertThisInitialized(_this));
    _this.export = _this.export.bind(_assertThisInitialized(_this));
    _this.succeedExporting = _this.succeedExporting.bind(_assertThisInitialized(_this));
    _this.failExporting = _this.failExporting.bind(_assertThisInitialized(_this));
    _this.handlePreferenceFetch = _this.handlePreferenceFetch.bind(_assertThisInitialized(_this));
    _this.handlePreferenceFetchFailed = _this.handlePreferenceFetchFailed.bind(_assertThisInitialized(_this));
    return _this;
  }

  _createClass(ExportDialog, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      if (this.state.preferenceState === PreferenceState.NOT_REQUESTED) {
        fetchPreferences().then(this.handlePreferenceFetch).catch();
      }
    }
  }, {
    key: "handlePreferenceFetch",
    value: function handlePreferenceFetch(exportPreferences) {
      var EXPORTS_GENERAL = exportPreferences.userPreferences.EXPORT.EXPORTS_GENERAL;
      this.setState({
        exportPreferences: EXPORTS_GENERAL,
        preferenceState: PreferenceState.SUCCEEDED,
        isNotificationOff: EXPORTS_GENERAL.EMAIL === ExportPreferences.DO_NOT_SEND && EXPORTS_GENERAL.NOTIFICATION_SIDEBAR === ExportPreferences.DO_NOT_SEND
      });
    }
  }, {
    key: "handlePreferenceFetchFailed",
    value: function handlePreferenceFetchFailed(err) {
      this.setState({
        preferenceState: PreferenceState.FAILED
      });
      this.failExporting(err);
    }
  }, {
    key: "handleFieldChange",
    value: function handleFieldChange(key, value) {
      var onFieldChange = this.props.onFieldChange;
      var formState = this.state.formState;
      var newFormState = formState.set(key, value);
      this.setState({
        formState: newFormState
      });

      if (onFieldChange) {
        onFieldChange(newFormState);
      }
    }
  }, {
    key: "isExportDisabled",
    value: function isExportDisabled() {
      var exportState = this.state.exportState;
      return exportState === ExportStates.PENDING || exportState === ExportStates.FAILED;
    }
  }, {
    key: "getEmailValidationState",
    value: function getEmailValidationState() {
      var formState = this.state.formState;
      var email = formState.get(DefaultFieldKeys.EMAIL).trim();

      if (!EmailAddressPattern.test(email)) {
        return EmailValidationStates.INVALID;
      }

      return EmailValidationStates.VALID;
    }
  }, {
    key: "getBody",
    value: function getBody() {
      var use = this.props.use;
      var loading = this.isfetchingPreferences();

      if (loading) {
        return /*#__PURE__*/_jsx(UILoadingSpinner, {
          grow: true,
          minHeight: 200
        });
      }

      if (this.state.isNotificationOff) {
        return this.renderNotificationsOffModal();
      }

      if (use === 'WIZARD') {
        return this.renderWizard();
      }

      return this.renderModal();
    } //
    // Export event handler & API interaction.
    //

  }, {
    key: "isfetchingPreferences",
    value: function isfetchingPreferences() {
      return this.state.preferenceState !== PreferenceState.SUCCEEDED || this.state.exportPreferences == null;
    }
  }, {
    key: "startExport",
    value: function startExport() {
      if (this.isExportDisabled()) {
        return;
      }

      this.export();
    }
  }, {
    key: "export",
    value: function _export() {
      var _this2 = this;

      var _this$props = this.props,
          client = _this$props.client,
          exportOptions = _this$props.exportOptions;
      var formState = this.state.formState;
      var options = Object.assign({}, formState.toJS(), {}, exportOptions);
      return client.export(options).then(this.succeedExporting, function () {
        var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
            _ref$xhr = _ref.xhr,
            xhr = _ref$xhr === void 0 ? {} : _ref$xhr;

        var failureReason = xhr.status === 0 ? FailureReasons.NO_NETWORK : FailureReasons.UNKNOWN;

        _this2.failExporting(failureReason, xhr);
      });
    }
  }, {
    key: "succeedExporting",
    value: function succeedExporting() {
      var _this$props2 = this.props,
          onClose = _this$props2.onClose,
          onSuccess = _this$props2.onSuccess;
      this.setState({
        exportState: ExportStates.SUCCEEDED
      }, function () {
        onClose();
        callIfPossible(onSuccess);
      });
    }
  }, {
    key: "failExporting",
    value: function failExporting() {
      var failureReason = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : FailureReasons.UNKNOWN;
      var xhr = arguments.length > 1 ? arguments[1] : undefined;
      var _this$props3 = this.props,
          onClose = _this$props3.onClose,
          onFailure = _this$props3.onFailure;
      this.setState({
        exportState: ExportStates.FAILED
      }, function () {
        onClose();
        callIfPossible(onFailure, failureReason, xhr);
      });
    } //
    // Rendering methods.
    //

  }, {
    key: "renderFormFields",
    value: function renderFormFields() {
      var _this3 = this;

      var formFields = this.props.formFields;
      var _this$state = this.state,
          formState = _this$state.formState,
          exportPreferences = _this$state.exportPreferences;
      return formFields.map(function (Field) {
        var value = formState.get(Field.key);
        var additionalProps = {};

        if (Field.key === DefaultFieldKeys.EMAIL) {
          additionalProps.validationState = _this3.getEmailValidationState();
        }

        return /*#__PURE__*/_jsx(Field, Object.assign({
          value: value,
          onChange: _this3.handleFieldChange,
          preferences: exportPreferences
        }, additionalProps), Field.key);
      });
    }
  }, {
    key: "renderEmailFieldAndNotificationHelpText",
    value: function renderEmailFieldAndNotificationHelpText() {
      var emailFieldAndNotificationHelpText = this.props.emailFieldAndNotificationHelpText;
      var Field = emailFieldAndNotificationHelpText;
      var _this$state2 = this.state,
          formState = _this$state2.formState,
          exportPreferences = _this$state2.exportPreferences;
      var value = formState.get(emailFieldAndNotificationHelpText.key);
      var additionalProps = {};
      additionalProps.validationState = this.getEmailValidationState();
      return /*#__PURE__*/_jsx(Field, Object.assign({
        value: value,
        onChange: this.handleFieldChange,
        preferences: exportPreferences
      }, additionalProps), emailFieldAndNotificationHelpText.key);
    }
  }, {
    key: "renderEmailHelpText",
    value: function renderEmailHelpText() {
      return /*#__PURE__*/_jsx("p", {
        children: /*#__PURE__*/_jsxs(Small, {
          use: "help",
          children: [/*#__PURE__*/_jsx(FormattedHTMLMessage, {
            message: "exportDialog.allowlistHelpText",
            options: {
              allowlistUrl: Urls.allowlistUrl,
              notificationUrl: Urls.notificationUrl
            }
          }), /*#__PURE__*/_jsx(UIIcon, {
            name: "externalLink"
          })]
        })
      });
    }
  }, {
    key: "renderWizard",
    value: function renderWizard() {
      var _this$props4 = this.props,
          onReject = _this$props4.onReject,
          children = _this$props4.children,
          firstStepProps = _this$props4.firstStepProps;
      var hasValidEmail = this.getEmailValidationState() === EmailValidationStates.VALID;
      return /*#__PURE__*/_jsxs(UIWizard, {
        cancellable: true,
        defaultHeading: /*#__PURE__*/_jsx(FormattedHTMLMessage, {
          message: "exportWizard.title"
        }),
        headerComponent: UIWizardHeaderWithOverview,
        onReject: onReject,
        onConfirm: this.startExport,
        disablePrimaryButton: !hasValidEmail || this.isExportDisabled(),
        children: [/*#__PURE__*/_jsx(UIWizardStep, Object.assign({
          name: /*#__PURE__*/_jsx(FormattedHTMLMessage, {
            message: "exportWizard.details"
          })
        }, firstStepProps, {
          children: /*#__PURE__*/_jsx(UIFlex, {
            justify: "center",
            children: /*#__PURE__*/_jsxs(UIBox, {
              basis: "650px",
              children: [/*#__PURE__*/_jsx(UIForm, {
                className: "m-bottom-6",
                children: this.renderFormFields()
              }), this.renderEmailHelpText()]
            })
          })
        })), children]
      });
    }
  }, {
    key: "renderModal",
    value: function renderModal() {
      var _this$props5 = this.props,
          onClose = _this$props5.onClose,
          topBodyContents = _this$props5.topBodyContents,
          topNavBar = _this$props5.topNavBar,
          bottomBodyContents = _this$props5.bottomBodyContents,
          disableExportButton = _this$props5.disableExportButton,
          disabledExportButtonTooltipProps = _this$props5.disabledExportButtonTooltipProps,
          emailFieldAndNotificationHelpText = _this$props5.emailFieldAndNotificationHelpText;
      var hasValidEmail = this.getEmailValidationState() === EmailValidationStates.VALID;
      return /*#__PURE__*/_jsxs("div", {
        children: [/*#__PURE__*/_jsxs(UIDialogBody, {
          children: [topNavBar, emailFieldAndNotificationHelpText && this.renderEmailFieldAndNotificationHelpText(), topBodyContents, /*#__PURE__*/_jsx(UIForm, {
            className: "m-bottom-6",
            children: this.renderFormFields()
          }), bottomBodyContents, !emailFieldAndNotificationHelpText && this.renderEmailHelpText()]
        }), /*#__PURE__*/_jsxs(UIDialogFooter, {
          children: [/*#__PURE__*/_jsx(UITooltip, Object.assign({
            disabled: !disableExportButton || disabledExportButtonTooltipProps === null
          }, disabledExportButtonTooltipProps, {
            children: /*#__PURE__*/_jsx(UIButton, {
              "data-selenium-test": "ExportDialog-submit-button",
              use: "primary",
              onClick: this.startExport,
              disabled: !hasValidEmail || this.isExportDisabled() || disableExportButton,
              children: /*#__PURE__*/_jsx(FormattedMessage, {
                message: "exportDialog.exportCta"
              })
            })
          })), /*#__PURE__*/_jsx(UIButton, {
            "data-selenium-test": "ExportDialog-cancel-button",
            use: "secondary",
            onClick: onClose,
            children: /*#__PURE__*/_jsx(FormattedMessage, {
              message: "exportDialog.cancel"
            })
          })]
        })]
      });
    }
  }, {
    key: "renderNotificationsOffModal",
    value: function renderNotificationsOffModal() {
      var onClose = this.props.onClose;
      return /*#__PURE__*/_jsxs("div", {
        children: [/*#__PURE__*/_jsxs(UIDialogBody, {
          children: [/*#__PURE__*/_jsx("h2", {
            children: /*#__PURE__*/_jsx(FormattedMessage, {
              message: "exportDialog.preference.notificationsOffHeading"
            })
          }), /*#__PURE__*/_jsx(FormattedMessage, {
            message: "exportDialog.preference.notificationsOffText"
          })]
        }), /*#__PURE__*/_jsxs(UIDialogFooter, {
          children: [/*#__PURE__*/_jsx(UIButton, {
            use: "primary",
            href: "/user-preferences/" + PortalIdParser.get() + "/global-preferences",
            external: true,
            onClick: onClose,
            children: /*#__PURE__*/_jsx(FormattedMessage, {
              message: "exportDialog.preference.notificationCta"
            })
          }), /*#__PURE__*/_jsx(UIButton, {
            onClick: onClose,
            children: /*#__PURE__*/_jsx(FormattedMessage, {
              message: "exportDialog.cancel"
            })
          })]
        })]
      });
    }
  }, {
    key: "render",
    value: function render() {
      var _this$props6 = this.props,
          onClose = _this$props6.onClose,
          headerContents = _this$props6.headerContents,
          use = _this$props6.use,
          otherProps = _objectWithoutProperties(_this$props6, ["onClose", "headerContents", "use"]);

      return /*#__PURE__*/_jsxs(UIModal, Object.assign({
        "data-selenium-test": "export-dialog",
        use: use === 'WIZARD' ? 'fullscreen' : 'default'
      }, otherProps, {
        children: [/*#__PURE__*/_jsxs(UIDialogHeader, {
          children: [/*#__PURE__*/_jsx(UIDialogCloseButton, {
            onClick: onClose
          }), /*#__PURE__*/_jsx(H2, {
            children: headerContents
          })]
        }), this.getBody()]
      }));
    }
  }], [{
    key: "defaultProps",
    get: function get() {
      return {
        formFields: [createFormField(FormatField, DefaultFieldKeys.FORMAT), createFormField(EmailField, DefaultFieldKeys.EMAIL)],
        headerContents: /*#__PURE__*/_jsx(FormattedMessage, {
          message: "exportDialog.dialogHeading"
        }),
        use: 'DIALOG',
        exportOptions: {},
        disableExportButton: false,
        disabledExportButtonTooltipProps: null
      };
    }
  }]);

  return ExportDialog;
}(Component);

export default ExportDialog;