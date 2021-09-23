'use es6';

import { jsx as _jsx } from "react/jsx-runtime";
import { jsxs as _jsxs } from "react/jsx-runtime";
import I18n from 'I18n';
import { Map as ImmutableMap } from 'immutable';
import createReactClass from 'create-react-class';
import PropTypes from 'prop-types';
import UIDropdown from 'UIComponents/dropdown/UIDropdown';
import UIList from 'UIComponents/list/UIList';
import UIButton from 'UIComponents/button/UIButton';
import PermissionTooltip from 'customer-data-objects-ui-components/permissions/PermissionTooltip';
import links from 'crm-legacy-links/links';
import IsUngatedStore from 'crm_data/gates/IsUngatedStore';
import ScopesContainer from '../../containers/ScopesContainer';
import { COMPANY, CONTACT, DEAL, TASK, TICKET, VISIT } from 'customer-data-objects/constants/ObjectTypes';
import { AnyCrmObjectTypePropType } from 'customer-data-objects-ui-components/propTypes/CrmObjectTypes';
import { CrmLogger } from 'customer-data-tracking/loggers';
import ManageColumnsDialog from '../../crm_ui/dialog/grid/ManageColumnsDialog';
import UIColumn from 'UIComponents/column/UIColumn';
import * as PromiseHandlers from 'UIComponents/core/PromiseHandlers';
import UILockedFeature from 'ui-addon-upgrades/decorators/UILockedFeature';
import UILock from 'ui-addon-upgrades/icons/UILock';
import PageType from 'customer-data-objects-ui-components/propTypes/PageType';
import * as PageTypes from 'customer-data-objects/view/PageTypes';
import ViewsStore from '../../crm_ui/flux/views/ViewsStore';
import DealPipelineStore from 'crm_data/deals/DealPipelineStore';
import TicketsPipelinesStore from 'crm_data/tickets/TicketsPipelinesStore';
import getPipelineIdFromView from '../../crm_ui/utils/getPipelineIdFromView';
import { connect } from 'general-store';
import FormattedReactMessage from 'I18n/components/FormattedReactMessage';
import FormattedHTMLMessage from 'I18n/components/FormattedHTMLMessage';
import FormattedMessage from 'I18n/components/FormattedMessage';
import { isWordPress } from 'hubspot-plugin-common';
import { isScoped } from '../../containers/ScopeOperators';
var LegacyActionsDropdown = createReactClass({
  displayName: 'LegacyActionsDropdown',
  propTypes: {
    // HACK: Used for testing because promptable makes it impossible to mock
    Dialog: PropTypes.func,
    isBoard: PropTypes.bool,
    isCrmObject: PropTypes.bool,
    objectType: AnyCrmObjectTypePropType.isRequired,
    onChangeColumns: PropTypes.func,
    viewId: PropTypes.string.isRequired,
    pageType: PageType.isRequired,
    hasTicketsFree: PropTypes.bool,
    pipelineId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    showRecycleBinButton: PropTypes.bool
  },
  getDefaultProps: function getDefaultProps() {
    return {
      isBoard: false,
      isCrmObject: false
    };
  },
  getInitialState: function getInitialState() {
    return {
      hasClosedDuplicatesShepherd: false,
      shepherdSettingSaved: false
    };
  },
  getHasMultiplePipelines: function getHasMultiplePipelines() {
    if (this.props.objectType === TICKET) {
      if (this.props.hasTicketsFree) {
        return isScoped(ScopesContainer.get(), 'crm-multiple-pipelines-tickets');
      }

      return isScoped(ScopesContainer.get(), 'crm-multiple-pipelines');
    }

    return isScoped(ScopesContainer.get(), 'crm-multiple-pipelines-deals');
  },
  getHasDealAutomation: function getHasDealAutomation() {
    var scopes = ScopesContainer.get();
    return isScoped(scopes, 'workflows-access') && isScoped(scopes, 'embedded-deal-automation-access');
  },
  getHasTicketAutomation: function getHasTicketAutomation() {
    var scopes = ScopesContainer.get();
    return isScoped(scopes, 'workflows-access') && isScoped(scopes, 'embedded-ticket-automation-access');
  },
  getHasForecastAccess: function getHasForecastAccess() {
    var scopes = ScopesContainer.get();
    return IsUngatedStore.get('Sales:Forecasting') && (isScoped(scopes, 'forecasting-edit') || isScoped(scopes, 'forecasting-access'));
  },
  onEditProperties: function onEditProperties() {
    CrmLogger.log('indexInteractions', {
      action: 'open edit properties modal',
      type: this.props.objectType
    });
  },
  onChangeColumns: function onChangeColumns() {
    var _this$props = this.props,
        objectType = _this$props.objectType,
        onChangeColumns = _this$props.onChangeColumns,
        viewId = _this$props.viewId;
    var Dialog = this.props.Dialog || ManageColumnsDialog;
    CrmLogger.log('indexUsage', {
      action: 'use manage columns',
      type: objectType
    });
    Dialog({
      viewId: viewId,
      objectType: objectType,
      title: I18n.text('crm_components.PropertyListEditor.title.columns')
    }).then(onChangeColumns, PromiseHandlers.rethrowError).done();
  },
  onRestoreClick: function onRestoreClick() {
    CrmLogger.log('indexInteractions', {
      action: 'open restore records'
    });
  },
  onDropdownClick: function onDropdownClick() {
    var hasClosedDuplicatesShepherd = this.state.hasClosedDuplicatesShepherd;
    CrmLogger.log('indexInteractions', {
      action: 'open actions dropdown'
    });

    if (!hasClosedDuplicatesShepherd) {
      this.setState({
        hasClosedDuplicatesShepherd: true
      });
    }
  },
  renderItems: function renderItems() {
    var _this$props2 = this.props,
        isBoard = _this$props2.isBoard,
        objectType = _this$props2.objectType,
        pageType = _this$props2.pageType,
        pipelineId = _this$props2.pipelineId,
        isCrmObject = _this$props2.isCrmObject,
        showRecycleBinButton = _this$props2.showRecycleBinButton;
    var items = [];
    var objectTypeHasPipelines = objectType === DEAL || objectType === TICKET;
    var isLegacyIndexPage = objectType === TASK || objectType === VISIT;

    if (pageType !== PageTypes.BOARD && isLegacyIndexPage) {
      items.push({
        onClick: this.onChangeColumns,
        key: 'topbarContents.editColumnsSelector',
        seleniumKey: 'edit-columns-option'
      });
    }

    var hasPropertySettings = [CONTACT, COMPANY, DEAL, TICKET].includes(objectType) || isCrmObject;

    if (pageType !== PageTypes.BOARD && hasPropertySettings && !isWordPress) {
      items.push({
        onClick: this.onEditProperties,
        href: links.propertySettings(objectType),
        key: 'topbarContents.editPropertiesSelector',
        disabled: !ScopesContainer.get()['crm-property-settings'] && !ScopesContainer.get()['manage-users-access'],
        tooltipKey: 'editPropertiesDisabled',
        seleniumKey: 'edit-properties-link'
      });
    }

    if (objectTypeHasPipelines && !this.getHasMultiplePipelines()) {
      var contentMessage = objectType === DEAL ? 'SalesProPQL.multiplePipelines.button' : 'ServiceProPQL.multiplePipelines.button';
      var salesUpgradeProduct = 'sales-starter';
      var serviceUpgradeProduct = 'service-starter';
      items.push({
        key: 'multiple-pipelines-pql',
        content: /*#__PURE__*/_jsxs("span", {
          children: [/*#__PURE__*/_jsx(FormattedHTMLMessage, {
            message: "crm_components." + contentMessage
          }), ' ', /*#__PURE__*/_jsx(UILock, {})]
        }),
        upgradeData: {
          app: 'crm_ui',
          screen: isBoard ? PageTypes.BOARD : PageTypes.INDEX,
          upgradeProduct: objectType === DEAL ? salesUpgradeProduct : serviceUpgradeProduct,
          uniqueId: objectType === DEAL ? 'deal-multiple-pipelines' : 'ticket-multiple-pipelines'
        },
        pqlModalKey: objectType === DEAL ? 'crm-sales-pro-multiple-pipelines' : 'crm-service-pro-multiple-pipelines'
      });
    }

    var hasDuplicatesScope = ScopesContainer.get()['duplicates-write'];
    var hasDuplicatesAccess = ScopesContainer.get()['super-admin'] || ScopesContainer.get()['crm-edit-all'];

    if (!isWordPress && [CONTACT, COMPANY].includes(objectType)) {
      if (!hasDuplicatesAccess) {
        items.push({
          disabled: true,
          tooltipKey: "duplicatesCenterNoPermissions." + objectType,
          key: 'topbarContents.duplicatesCenter'
        });
      } else {
        if (hasDuplicatesScope) {
          items.push({
            external: false,
            href: links.duplicatesCenter(objectType),
            key: 'topbarContents.duplicatesCenter'
          });
        } else {
          items.push({
            key: 'records-dedupe',
            content: /*#__PURE__*/_jsxs("span", {
              children: [/*#__PURE__*/_jsx(FormattedHTMLMessage, {
                message: "topbarContents.duplicatesCenter",
                useGap: true
              }), /*#__PURE__*/_jsx(UILock, {})]
            }),
            upgradeData: {
              app: 'crm_ui',
              screen: isBoard ? PageTypes.BOARD : PageTypes.INDEX,
              upgradeProduct: 'marketing-pro',
              uniqueId: 'records-dedupe'
            },
            pqlModalKey: 'records-dedupe'
          });
        }
      }
    }

    if ([CONTACT, COMPANY, DEAL, TICKET].includes(objectType) || showRecycleBinButton) {
      items.push({
        onClick: this.onRestoreClick,
        external: true,
        href: links.recyclingBin(objectType),
        key: "topbarContents.recyclingBinNav." + (isCrmObject ? 'object' : objectType),
        disabled: !ScopesContainer.get()['crm-recycling-bin-access'],
        tooltipKey: "restoreObjectsDisabled." + (isCrmObject ? 'object' : objectType)
      });
    }

    if (objectType === DEAL) {
      if (this.getHasDealAutomation()) {
        items.push({
          key: 'topbarContents.addPipelineAutomation',
          href: links.dealPipeline(pipelineId, true),
          external: true
        });
      } else {
        items.push({
          key: 'workflows-add-deal-pipeline-automation-pql',
          content: /*#__PURE__*/_jsxs("span", {
            children: [/*#__PURE__*/_jsx(FormattedHTMLMessage, {
              message: "crm_components.SalesStarterPQL.pipelineAutomation.button"
            }), ' ', /*#__PURE__*/_jsx(UILock, {})]
          }),
          upgradeData: {
            app: 'crm_ui',
            screen: this.props.isBoard ? PageTypes.BOARD : PageTypes.INDEX,
            upgradeProduct: 'sales-starter',
            uniqueId: 'workflows-sales-pipeline-automation'
          },
          pqlModalKey: 'workflows-sales-pipeline-automation'
        });
      }
    }

    if (objectType === TICKET) {
      if (this.getHasTicketAutomation()) {
        items.push({
          key: 'topbarContents.addPipelineAutomation',
          href: links.ticketPipeline(pipelineId, true),
          external: true
        });
      } else {
        items.push({
          key: 'workflows-add-ticket-pipeline-automation-pql',
          content: /*#__PURE__*/_jsxs("span", {
            children: [/*#__PURE__*/_jsx(FormattedHTMLMessage, {
              message: "crm_components.ServiceStarterPQL.pipelineAutomation.button"
            }), ' ', /*#__PURE__*/_jsx(UILock, {})]
          }),
          upgradeData: {
            app: 'crm_ui',
            screen: this.props.isBoard ? PageTypes.BOARD : PageTypes.INDEX,
            upgradeProduct: 'service-starter',
            uniqueId: 'workflows-service-pipeline-automation'
          },
          pqlModalKey: 'workflows-service-pipeline-automation'
        });
      }
    }

    if (objectType === DEAL && isScoped(ScopesContainer.get(), 'reports-sales-pro-access') && IsUngatedStore.get('RA:SalesExplorerBeta')) {
      items.push({
        key: 'topbarContents.salesAnalytics',
        external: true,
        href: links.salesAnalytics(objectType),
        seleniumKey: 'sales-analytics-link'
      });
    }

    if (objectType === DEAL && this.getHasForecastAccess()) {
      items.push({
        key: 'topbarContents.goToForecast',
        external: true,
        href: links.forecast()
      });
    }

    return items.map(function (item) {
      var option = item.pqlModalKey && item.upgradeData ? /*#__PURE__*/_jsx(UILockedFeature, {
        isDropdownOption: true,
        modalMountDelay: 0,
        modalKey: item.pqlModalKey,
        upgradeData: item.upgradeData,
        children: /*#__PURE__*/_jsx(UIButton, {
          disabled: item.disabled,
          external: item.external,
          href: item.href,
          use: "link",
          children: item.content || /*#__PURE__*/_jsx(FormattedReactMessage, {
            message: item.key
          })
        })
      }) : /*#__PURE__*/_jsx(UIButton, {
        onClick: item.onClick,
        "data-selenium-test": item.seleniumKey,
        disabled: item.disabled,
        external: item.external,
        href: item.href,
        use: "link",
        children: item.content || /*#__PURE__*/_jsx(FormattedReactMessage, {
          message: item.key
        })
      });
      return /*#__PURE__*/_jsx(PermissionTooltip, {
        disabled: !item.disabled || !item.tooltipKey,
        placement: "left",
        tooltipKey: item.tooltipKey,
        children: option
      }, item.key);
    });
  },
  render: function render() {
    return /*#__PURE__*/_jsx(UIColumn, {
      className: "m-left-3",
      children: /*#__PURE__*/_jsx(UIDropdown, {
        buttonSize: "small",
        buttonText: /*#__PURE__*/_jsx(FormattedMessage, {
          message: "topbarContents.actions"
        }),
        buttonUse: "secondary",
        closeOnMenuClick: false,
        "data-selenium-test": "index-topbar-dropdown",
        menuWidth: "auto",
        onClick: this.onDropdownClick,
        children: /*#__PURE__*/_jsx(UIList, {
          children: this.renderItems()
        })
      })
    });
  }
});
export default connect({
  pipelineId: {
    stores: [DealPipelineStore, TicketsPipelinesStore],
    deref: function deref(props) {
      if (props.objectType !== DEAL && props.objectType !== TICKET) {
        return undefined;
      }

      var viewKey = ViewsStore.getViewKey(props);
      var view = ViewsStore.get(viewKey);
      var pipelineStore = props.objectType === DEAL ? DealPipelineStore : TicketsPipelinesStore;
      var pipelines = pipelineStore.get() || ImmutableMap();
      var pipeline = pipelines.first();
      return view && pipelines.size > 0 ? getPipelineIdFromView(view, pipeline.get('pipelineId'), props.objectType) : null;
    }
  },
  hasTicketsFree: {
    stores: [IsUngatedStore],
    deref: function deref() {
      return IsUngatedStore.get('CRM:MakeTicketsFree') === true;
    }
  }
})(LegacyActionsDropdown);