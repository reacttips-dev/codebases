'use es6';

import { jsxs as _jsxs } from "react/jsx-runtime";
import { Fragment as _Fragment } from "react/jsx-runtime";
import { jsx as _jsx } from "react/jsx-runtime";
import { connect } from 'general-store';
import ViewRecord from 'customer-data-objects/view/ViewRecord';
import PropertiesStore from 'crm_data/properties/PropertiesStore';
import getLangLocale from 'I18n/utils/getLangLocale';
import GridUIStore from '../../flux/grid/GridUIStore';
import ElasticSearchStore from 'crm_data/elasticSearch/ElasticSearchStore';
import { Set as ImmutableSet } from 'immutable';
import * as ExportQueueClient from '../../api/ExportQueueClient';
import createReactClass from 'create-react-class';
import PropTypes from 'prop-types';
import FormattedMessage from 'I18n/components/FormattedMessage';
import FormattedJSXMessage from 'I18n/components/FormattedJSXMessage';
import FormattedHTMLMessage from 'I18n/components/FormattedHTMLMessage';
import HubSpotLanguageSelect from 'ui-addon-i18n/components/HubSpotLanguageSelect';
import UIList from 'UIComponents/list/UIList';
import PromptablePropInterface from 'UIComponents/decorators/PromptablePropInterface';
import UIRadioInput from 'UIComponents/input/UIRadioInput';
import UIFormControl from 'UIComponents/form/UIFormControl';
import UICheckbox from 'UIComponents/input/UICheckbox';
import UIInlineLabel from 'UIComponents/form/UIInlineLabel';
import UIFlex from 'UIComponents/layout/UIFlex';
import UIAlert from 'UIComponents/alert/UIAlert';
import UILink from 'UIComponents/link/UILink';
import H7 from 'UIComponents/elements/headings/H7';
import UIHelpIcon from 'UIComponents/icon/UIHelpIcon';
import { AnyCrmObjectTypePropType } from 'customer-data-objects-ui-components/propTypes/CrmObjectTypes';
import ExportDialog from 'ExportDialog/components/ExportDialog';
import createFormField from 'ExportDialog/components/formFields/FormField';
import FormatField from 'ExportDialog/components/formFields/FormatField';
import EmailFieldAndNotificationHelpText from 'ExportDialog/components/formFields/EmailFieldAndNotificationHelpText';
import partial from 'transmute/partial';
import getIn from 'transmute/getIn';
import isNumber from 'transmute/isNumber';
import UserStore from 'crm_data/user/UserStore';
import { SUCCEEDED } from '../../../rewrite/constants/RequestStatus';
import { EXPORT_PAGE_TYPES } from '../../../rewrite/views/constants/ExportPageTypes';
export var ViewExportDialog = createReactClass({
  displayName: 'ViewExportDialog',
  propTypes: Object.assign({
    ownerEmail: PropTypes.string.isRequired,
    options: PropTypes.shape({
      objectType: PropTypes.string,
      saveSuggested: PropTypes.bool,
      view: PropTypes.instanceOf(ViewRecord),
      exportPageType: PropTypes.oneOf(Object.values(EXPORT_PAGE_TYPES))
    }).isRequired,
    objectType: AnyCrmObjectTypePropType,
    viewObjectCount: PropTypes.number
  }, PromptablePropInterface),
  getDefaultProps: function getDefaultProps() {
    return {
      ownerEmail: ''
    };
  },
  getInitialState: function getInitialState() {
    return {
      includeAdditionalEmails: false,
      includeAdditionalDomains: false,
      language: getLangLocale()
    };
  },
  getIsLoaded: function getIsLoaded() {
    return this.props.propertiesArray !== undefined;
  },
  getFormFields: function getFormFields() {
    var fields = [createFormField(FormatField, 'format')];
    return fields.concat(createFormField(this.renderPropertyPicker, 'includeAllColumns'));
  },
  getChangeHandlers: function getChangeHandlers(handler) {
    if (!this._changeHandlers) {
      this._changeHandlers = {
        true: partial(handler, true),
        false: partial(handler, false)
      };
    }

    return this._changeHandlers;
  },
  toggleIncludeAdditionalEmailsCheckbox: function toggleIncludeAdditionalEmailsCheckbox() {
    this.setState({
      includeAdditionalEmails: !this.state.includeAdditionalEmails
    });
  },
  toggleIncludeAdditionalDomainsCheckbox: function toggleIncludeAdditionalDomainsCheckbox() {
    this.setState({
      includeAdditionalDomains: !this.state.includeAdditionalDomains
    });
  },
  handleLanguageChange: function handleLanguageChange(language) {
    this.setState({
      language: language
    });
  },
  renderCheckBox: function renderCheckBox() {
    var objectType = this.props.objectType;

    if (objectType === 'CONTACT') {
      return /*#__PURE__*/_jsx(UIFormControl, {
        label: /*#__PURE__*/_jsx(FormattedMessage, {
          message: "filterSidebar.exportView.contactsWithMultipleEmailAddresses"
        }),
        children: /*#__PURE__*/_jsx(UICheckbox, {
          checked: this.state.includeAdditionalEmails,
          onChange: this.toggleIncludeAdditionalEmailsCheckbox,
          children: /*#__PURE__*/_jsx(FormattedMessage, {
            message: "filterSidebar.exportView.includeAllEmailAddresses"
          })
        })
      });
    }

    if (objectType === 'COMPANY') {
      return /*#__PURE__*/_jsx(UIFormControl, {
        label: /*#__PURE__*/_jsx(FormattedMessage, {
          message: "filterSidebar.exportView.companiesWithMultipleDomains"
        }),
        children: /*#__PURE__*/_jsx(UICheckbox, {
          checked: this.state.includeAdditionalDomains,
          onChange: this.toggleIncludeAdditionalDomainsCheckbox,
          children: /*#__PURE__*/_jsx(FormattedMessage, {
            message: "filterSidebar.exportView.includeAllCompanyDomains"
          })
        })
      });
    }

    return null;
  },
  renderPropertyPicker: function renderPropertyPicker(_ref) {
    var onChange = _ref.onChange,
        value = _ref.value;
    var changeHandlers = this.getChangeHandlers(onChange);
    return /*#__PURE__*/_jsxs(_Fragment, {
      children: [/*#__PURE__*/_jsx(UIFormControl, {
        label: /*#__PURE__*/_jsx(FormattedMessage, {
          message: "filterSidebar.exportView.propertiesIncludedInExport"
        }),
        children: /*#__PURE__*/_jsxs(UIList, {
          children: [/*#__PURE__*/_jsx("label", {
            children: /*#__PURE__*/_jsx(UIRadioInput, {
              name: "properties",
              checked: !value,
              onChange: changeHandlers.false,
              children: /*#__PURE__*/_jsx(FormattedMessage, {
                message: "filterSidebar.exportView.exportOnlyPropertiesInTheView"
              })
            })
          }), /*#__PURE__*/_jsx("label", {
            children: /*#__PURE__*/_jsx(UIRadioInput, {
              name: "properties",
              checked: !!value,
              onChange: changeHandlers.true,
              children: /*#__PURE__*/_jsx(FormattedMessage, {
                message: "filterSidebar.exportView.exportAllPropertiesOnRecords"
              })
            })
          })]
        })
      }), this.renderCheckBox()]
    });
  },
  renderTopBodyContents: function renderTopBodyContents() {
    var _this$props = this.props,
        options = _this$props.options,
        viewObjectCount = _this$props.viewObjectCount;
    var readableViewObjectCount = isNumber(viewObjectCount) ? viewObjectCount : '--';
    var HIGH_ROW_COUNT = 375000; // threshold for showing the banner -> Files approaching 500k rows may take hours to receive.

    var showAlert = readableViewObjectCount >= HIGH_ROW_COUNT;
    return /*#__PURE__*/_jsxs(UIFlex, {
      align: "start",
      justify: "start",
      direction: "column",
      wrap: "wrap",
      children: [/*#__PURE__*/_jsx("div", {
        children: /*#__PURE__*/_jsx(H7, {
          children: /*#__PURE__*/_jsx(FormattedMessage, {
            message: "filterSidebar.exportView.prepareExportFile"
          })
        })
      }), /*#__PURE__*/_jsx("div", {
        children: /*#__PURE__*/_jsx(UIInlineLabel, {
          label: /*#__PURE__*/_jsx(FormattedMessage, {
            message: "filterSidebar.exportView.exporting"
          }),
          children: /*#__PURE__*/_jsx(FormattedHTMLMessage, {
            message: "filterSidebar.exportView.fileTitleAndSize",
            options: {
              fileName: options.view.name,
              rowCount: readableViewObjectCount
            }
          })
        })
      }), showAlert && /*#__PURE__*/_jsx(UIAlert, {
        className: "m-y-3",
        titleText: /*#__PURE__*/_jsx(FormattedMessage, {
          message: "filterSidebar.exportView.alertMessageTitle"
        }),
        type: "warning",
        use: "inline",
        children: /*#__PURE__*/_jsx(FormattedMessage, {
          message: "filterSidebar.exportView.alertMessageBody"
        })
      })]
    });
  },
  renderBottomBodyContents: function renderBottomBodyContents() {
    var _this = this;

    return /*#__PURE__*/_jsx(UIFormControl, {
      label: /*#__PURE__*/_jsx(UIHelpIcon, {
        title: /*#__PURE__*/_jsx(FormattedJSXMessage, {
          message: "filterSidebar.exportView.selectExportLanguageHelpText_jsx",
          elements: {
            UILink: UILink
          },
          options: {
            href: 'https://knowledge.hubspot.com/crm-setup/export-contacts-companies-deals-or-tickets'
          }
        }),
        children: /*#__PURE__*/_jsx(FormattedMessage, {
          message: "filterSidebar.exportView.selectExportLanguageLabel"
        })
      }),
      children: /*#__PURE__*/_jsx(HubSpotLanguageSelect, {
        value: this.state.language,
        onChange: function onChange(_ref2) {
          var language = _ref2.language;
          return _this.handleLanguageChange(language);
        }
      })
    });
  },
  render: function render() {
    var _this$props2 = this.props,
        options = _this$props2.options,
        ownerEmail = _this$props2.ownerEmail,
        onSuccess = _this$props2.onSuccess,
        onFailure = _this$props2.onFailure,
        onReject = _this$props2.onReject,
        propertiesArray = _this$props2.propertiesArray,
        userId = _this$props2.userId;
    var hydratedQueryStatus = options.hydratedQueryStatus;
    return /*#__PURE__*/_jsx(ExportDialog, {
      bottomBodyContents: this.renderBottomBodyContents(),
      client: ExportQueueClient.ViewsExportQueueClient(Object.assign({}, options, {
        properties: propertiesArray,
        userId: userId,
        includeAdditionalEmails: this.state.includeAdditionalEmails,
        includeAdditionalDomains: this.state.includeAdditionalDomains,
        language: this.state.language
      })),
      defaultFormat: "xlsx",
      disableExportButton: hydratedQueryStatus && hydratedQueryStatus !== SUCCEEDED,
      emailFieldAndNotificationHelpText: createFormField(EmailFieldAndNotificationHelpText, 'email'),
      formFields: this.getFormFields(),
      headerContents: /*#__PURE__*/_jsx(FormattedMessage, {
        message: "filterSidebar.exportView.header"
      }),
      onSuccess: onSuccess,
      onFailure: onFailure,
      onClose: onReject,
      topBodyContents: this.renderTopBodyContents(),
      userEmail: ownerEmail,
      width: 650
    });
  }
});
var deps = {
  propertiesArray: {
    stores: [PropertiesStore],
    deref: function deref(_ref3) {
      var objectType = _ref3.objectType;
      var properties = PropertiesStore.get(objectType);

      if (!properties) {
        return [];
      }

      var exportableProperties = properties.filter(function (property) {
        return !property.get('hidden');
      });
      return exportableProperties.toList().toJS();
    }
  },
  userId: {
    stores: [UserStore],
    deref: function deref() {
      return UserStore.get('user_id');
    }
  },
  viewObjectCount: {
    stores: [ElasticSearchStore, GridUIStore],
    deref: function deref(props) {
      var objectType = props.objectType,
          options = props.options;
      var view = options.view;
      var searchResults = ElasticSearchStore.get({
        objectType: objectType,
        viewId: "" + view.id
      });

      if (!searchResults) {
        return undefined;
      }

      var searchResultsCount = getIn(['total'], searchResults) || 0;
      var temporaryIds = GridUIStore.get('temporaryIds');
      var includedIds = getIn(['include'], temporaryIds) || ImmutableSet();
      var excludedIds = getIn(['exclude'], temporaryIds) || ImmutableSet();
      return searchResultsCount + includedIds.subtract(excludedIds).size;
    }
  }
};
export default connect(deps)(ViewExportDialog);