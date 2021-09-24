'use es6';

import _defineProperty from "@babel/runtime/helpers/esm/defineProperty";
import { jsxs as _jsxs } from "react/jsx-runtime";
import { jsx as _jsx } from "react/jsx-runtime";
import { LOADING } from 'crm_data/constants/LoadingStatus';
import DealPipelineStore from 'crm_data/deals/DealPipelineStore';
import DealStageStore from 'crm_data/deals/DealStageStore';
import PropertiesStore from 'crm_data/properties/PropertiesStore';
import PropertyGroupsStore from 'crm_data/properties/PropertyGroupsStore';
import PropTypes from 'prop-types';
import TicketsPipelinesStagesStore from 'crm_data/tickets/TicketsPipelinesStagesStore';
import TicketsPipelinesStore from 'crm_data/tickets/TicketsPipelinesStore';
import UserStore from 'crm_data/user/UserStore';
import links from 'crm-legacy-links/links';
import { join } from '../../dependencies/PropertyGroupsDependency';
import batchMutatePropertiesBlacklistBET from '../../BET/config/batchMutatePropertiesBlacklistBET';
import PropertyInput from 'crm-ui-legacy-property-input';
import batchMutatePropertiesBlacklist from '../../config/batchMutatePropertiesBlacklist';
import transformBatchMutateProperties from '../../config/transformBatchMutateProperties';
import ViewsStore from '../../flux/views/ViewsStore';
import { getObjectTypeLabel } from '../../grid/utils/BulkActionPropsRecord';
import BulkActionPropsType from '../../grid/utils/BulkActionPropsType';
import getPipelineIdFromView from '../../utils/getPipelineIdFromView';
import { DEAL, TICKET } from 'customer-data-objects/constants/ObjectTypes';
import * as PropertyIdentifier from 'customer-data-objects/property/PropertyIdentifier';
import { CLOSED } from 'customer-data-objects/ticket/TicketStageStatusOptions';
import * as PropertyValueDisplay from 'customer-data-property-utils/PropertyValueDisplay';
import { CrmLogger } from 'customer-data-tracking/loggers';
import BaseDialog from 'customer-data-ui-utilities/dialog/BaseDialog';
import { connect } from 'general-store';
import I18n from 'I18n';
import FormattedHTMLMessage from 'I18n/components/FormattedHTMLMessage';
import { fromJS, Map as ImmutableMap } from 'immutable';
import { propertyDescriptionTranslator, propertyLabelTranslator } from 'property-translator/propertyTranslator';
import createReactClass from 'create-react-class';
import { MULTI_CURRENCY_CURRENCY_CODE } from 'reference-resolvers/constants/ReferenceObjectTypes';
import ProvideReferenceResolvers from 'reference-resolvers/ProvideReferenceResolvers';
import MultiCurrencyCurrencyCodeResolver from 'reference-resolvers/resolvers/MultiCurrencyCurrencyCodeResolver';
import { getGuidLabel, isKnownGuid } from 'reporting-data/lib/guids';
import PromptablePropInterface from 'UIComponents/decorators/PromptablePropInterface';
import UIForm from 'UIComponents/form/UIForm';
import UICheckbox from 'UIComponents/input/UICheckbox';
import UIRadioInput from 'UIComponents/input/UIRadioInput';
import UIToggleGroup from 'UIComponents/input/UIToggleGroup';
import UIMatchTextArea from 'UIComponents/input/UIMatchTextArea';
import UIFormControl from 'UIComponents/form/UIFormControl';
import UITooltip from 'UIComponents/tooltip/UITooltip';
import { buildGetPropertyPermissionFromObjectType } from '../../property/fieldLevelPermissionsUIDependencies';
import { isEditable, getCanEditPropertyAndDependents } from '../../property/fieldLevelPermissionsUIDependencies';
import FormattedMessage from 'I18n/components/FormattedMessage';
import UISelect from 'UIComponents/input/UISelect';
import { getPipelineProperty } from '../../pipelines/getPipelineProperty';
import { getStageProperty } from '../../pipelines/getStageProperty';
import IsUngatedStore from 'crm_data/gates/IsUngatedStore';
import FieldLevelPermissionsStore from 'crm_data/properties/FieldLevelPermissionsStore';
import PipelinePermissionsStore from 'crm_data/pipelinePermissions/PipelinePermissionsStore';
import { HIDDEN } from 'crm_data/pipelinePermissions/pipelinePermissionsConstants';
import UIIcon from 'UIComponents/icon/UIIcon';
import { EERIE } from 'HubStyleTokens/colors';
import PropertyRecord from 'customer-data-objects/property/PropertyRecord';
import { ObjectTypesToIds } from 'customer-data-objects/constants/ObjectTypeIds';
import get from 'transmute/get';
export var getPipelineIdDependency = {
  stores: [ViewsStore, DealPipelineStore, TicketsPipelinesStore, PipelinePermissionsStore],
  deref: function deref(_ref) {
    var bulkActionProps = _ref.bulkActionProps;
    var objectType = bulkActionProps.get('objectType');
    var viewId = bulkActionProps.get('viewId');

    if (objectType !== DEAL && objectType !== TICKET) {
      return null;
    }

    var viewKey = ViewsStore.getViewKey({
      objectType: objectType,
      viewId: viewId
    });
    var view = ViewsStore.get(viewKey);
    var pipelines = objectType === DEAL ? DealPipelineStore.get() : TicketsPipelinesStore.get();
    var permissions = PipelinePermissionsStore.get(ObjectTypesToIds[objectType] || objectType);
    var defaultPipeline = pipelines.find(function (pipelineValue) {
      var pipelineId = get('pipelineId', pipelineValue);
      return get(pipelineId, permissions) !== HIDDEN;
    });
    var defaultPipelineId = defaultPipeline ? defaultPipeline.get('pipelineId') : null;

    if (view) {
      var pipelineIdFromView = getPipelineIdFromView(view);
      var canUsePipelineIdFromView = pipelineIdFromView && get(pipelineIdFromView, permissions) !== HIDDEN;
      return canUsePipelineIdFromView ? pipelineIdFromView : defaultPipelineId;
    }

    return null;
  }
};
var readOnlySourceData = {
  isKnownGuid: isKnownGuid,
  getGuidLabel: getGuidLabel
};

var PropertyOption = function PropertyOption(_ref2) {
  var children = _ref2.children,
      option = _ref2.option;
  return /*#__PURE__*/_jsx(UITooltip, {
    placement: "left",
    title: /*#__PURE__*/_jsx(FormattedMessage, {
      message: "fieldLevelPermissions.READ_ONLY"
    }),
    disabled: !option.disabled,
    children: /*#__PURE__*/_jsx("div", {
      "data-option-value": option.value,
      children: children
    })
  });
};

var _canSave = function canSave(_ref3) {
  var selectedProperty = _ref3.selectedProperty,
      countIsMatched = _ref3.countIsMatched,
      applyToAllIsChecked = _ref3.applyToAllIsChecked,
      objectType = _ref3.objectType,
      draft = _ref3.draft,
      getPropertyPermission = _ref3.getPropertyPermission;

  if (!draft || !selectedProperty) {
    return false;
  }

  var pipelineProperty = getPipelineProperty(objectType);
  var stageProperty = getStageProperty(objectType); // Pipeline properties should only disable save if you cannot also edit pipeline stage properties

  var isPipeline = selectedProperty.name === pipelineProperty;

  if (!isPipeline && !isEditable(getPropertyPermission(selectedProperty.name))) {
    return false;
  }

  if (countIsMatched !== false && applyToAllIsChecked !== false) {
    if (isPipeline) {
      return draft.get(pipelineProperty) != null && draft.get(stageProperty) != null && isEditable(getPropertyPermission(stageProperty));
    }

    return draft.get(selectedProperty.name) != null;
  }

  return false;
};

export { _canSave as canSave };
export var BulkEditDialog = createReactClass({
  displayName: 'BulkEditDialog',
  propTypes: Object.assign({
    bulkActionProps: BulkActionPropsType.isRequired,
    preSelectedProperty: PropTypes.instanceOf(PropertyRecord)
  }, PromptablePropInterface),
  getInitialState: function getInitialState() {
    return {
      appendMultiCheckboxValues: false,
      selectedProperty: this.props.preSelectedProperty || null,
      draft: ImmutableMap(),
      countIsMatched: this.props.bulkActionProps.get('isSelectionGreaterThanView') ? false : undefined,
      applyToAllIsChecked: this.props.bulkActionProps.get('isSelectionGreaterThanView') ? !this.shouldRenderApplyToAll() : undefined
    };
  },
  canSave: function canSave() {
    var _this$props = this.props,
        bulkActionProps = _this$props.bulkActionProps,
        getPropertyPermission = _this$props.getPropertyPermission;
    var _this$state = this.state,
        selectedProperty = _this$state.selectedProperty,
        countIsMatched = _this$state.countIsMatched,
        draft = _this$state.draft,
        applyToAllIsChecked = _this$state.applyToAllIsChecked;
    var objectType = bulkActionProps.get('objectType');
    return _canSave({
      selectedProperty: selectedProperty,
      countIsMatched: countIsMatched,
      applyToAllIsChecked: applyToAllIsChecked,
      objectType: objectType,
      draft: draft,
      getPropertyPermission: getPropertyPermission
    });
  },
  getPropertyOptions: function getPropertyOptions() {
    var _this$props2 = this.props,
        propertyGroups = _this$props2.propertyGroups,
        bulkActionProps = _this$props2.bulkActionProps,
        getPropertyPermission = _this$props2.getPropertyPermission;
    var objectType = bulkActionProps.get('objectType');

    if (!propertyGroups) {
      return [];
    }

    var blacklist = batchMutatePropertiesBlacklist[objectType] ? batchMutatePropertiesBlacklist[objectType] : [];
    var BETBlacklist = batchMutatePropertiesBlacklistBET[objectType] ? batchMutatePropertiesBlacklistBET[objectType] : [];
    blacklist = blacklist.concat(BETBlacklist);
    var reducedGroups = propertyGroups.reduce(function (list, group) {
      var properties = transformBatchMutateProperties.propertyOptions(group.get('properties'), objectType).filterNot(function (property) {
        return !property || property.get('hidden') || PropertyIdentifier.isReadOnly(property) || blacklist.includes(property.get('name'));
      }).map(function (property) {
        var propertyName = property.get('name');
        var canEdit = getCanEditPropertyAndDependents({
          objectType: objectType,
          propertyName: propertyName,
          getPropertyPermission: getPropertyPermission
        });
        return {
          text: property.hubspotDefined ? propertyLabelTranslator(property.get('label')) : property.get('label'),
          value: propertyName,
          disabled: !canEdit
        };
      }).toArray();

      if (properties.length > 0) {
        list.push({
          text: group.hubspotDefined ? propertyLabelTranslator(group.get('displayName')) : group.get('displayName'),
          options: properties,
          value: group.get('name')
        });
      }

      return list;
    }, []);

    if (reducedGroups.length === 1) {
      return reducedGroups[0].options;
    }

    return reducedGroups;
  },
  handlePropertySelect: function handlePropertySelect(_ref4) {
    var value = _ref4.target.value;
    var _this$props3 = this.props,
        properties = _this$props3.properties,
        pipelineId = _this$props3.pipelineId,
        bulkActionProps = _this$props3.bulkActionProps;
    var objectType = bulkActionProps.get('objectType');
    var propertyOptions = transformBatchMutateProperties.selectedProperties(properties, objectType);
    var property;
    var draftValue;

    if (objectType === DEAL && ['dealstage', 'pipeline'].includes(value)) {
      property = propertyOptions.get('pipeline');
      draftValue = pipelineId;
    } else if (objectType === TICKET && ['hs_pipeline_stage', 'hs_pipeline'].includes(value)) {
      property = propertyOptions.get('hs_pipeline');
      draftValue = pipelineId;
    } else {
      property = propertyOptions.get(value);
      draftValue = '';
    }

    return this.setState({
      selectedProperty: property,
      draft: fromJS(_defineProperty({}, property.name, draftValue))
    });
  },
  handleStageSelection: function handleStageSelection(syntheticEvent) {
    var draft = this.state.draft;
    var bulkActionProps = this.props.bulkActionProps;
    var objectType = bulkActionProps.get('objectType');
    var stageId = syntheticEvent.target ? syntheticEvent.target.value : undefined;
    var propertyName = objectType === DEAL ? 'dealstage' : 'hs_pipeline_stage';
    var edits = draft.set(propertyName, stageId);
    return this.setState({
      draft: edits
    });
  },
  handleChange: function handleChange(_ref5) {
    var value = _ref5.target.value;
    var _this$state2 = this.state,
        selectedProperty = _this$state2.selectedProperty,
        draft = _this$state2.draft;
    var _this$props4 = this.props,
        bulkActionProps = _this$props4.bulkActionProps,
        dealPipelines = _this$props4.dealPipelines,
        ticketPipelines = _this$props4.ticketPipelines,
        dealStages = _this$props4.dealStages,
        ticketStages = _this$props4.ticketStages,
        getPropertyPermission = _this$props4.getPropertyPermission;
    var objectType = bulkActionProps.get('objectType');
    var newValue = PropertyValueDisplay.sanitizeValue(selectedProperty, value);
    var nextDraft = draft.set(selectedProperty.name, newValue);
    var isDealPipelineSelected = objectType === DEAL && selectedProperty && selectedProperty.name === 'pipeline';
    var isTicketPipelineSelected = objectType === TICKET && selectedProperty && selectedProperty.name === 'hs_pipeline';

    if (isDealPipelineSelected || isTicketPipelineSelected) {
      var stagePropertyName = isDealPipelineSelected ? 'dealstage' : 'hs_pipeline_stage';
      var pipelinePropertyName = isDealPipelineSelected ? 'pipeline' : 'hs_pipeline';
      var stageId = draft.get(stagePropertyName);
      var stage = isDealPipelineSelected ? dealStages.get(stageId) : ticketStages.get(stageId);
      var stagePipelineId = stage ? stage.get('pipelineId') : '';
      var draftPipelineId = nextDraft.get(pipelinePropertyName);

      if (draftPipelineId && (!stage || stagePipelineId !== draftPipelineId) && getCanEditPropertyAndDependents({
        objectType: objectType,
        getPropertyPermission: getPropertyPermission,
        propertyName: stagePropertyName
      })) {
        var pipelines = isDealPipelineSelected ? dealPipelines : ticketPipelines;
        var newStageId = pipelines.getIn([draftPipelineId, 'stages', 0, 'stageId']);
        nextDraft = nextDraft.set(stagePropertyName, newStageId);
      }
    }

    return this.setState({
      draft: nextDraft
    });
  },
  handleConfirm: function handleConfirm() {
    var _this$props5 = this.props,
        ticketStages = _this$props5.ticketStages,
        userEmail = _this$props5.userEmail,
        bulkActionProps = _this$props5.bulkActionProps;
    var _this$state3 = this.state,
        draft = _this$state3.draft,
        applyToAllIsChecked = _this$state3.applyToAllIsChecked,
        appendMultiCheckboxValues = _this$state3.appendMultiCheckboxValues,
        selectedProperty = _this$state3.selectedProperty;
    var draftStageId = draft.get('hs_pipeline_stage');
    var objectType = bulkActionProps.get('objectType');
    var selectionCount = bulkActionProps.get('selectionCount');

    if (objectType === TICKET && draftStageId) {
      var draftStage = ticketStages.get(draftStageId); // to delete

      CrmLogger.logRecordInteraction(TICKET, {
        action: 'Changed ticket status',
        type: draftStage.getIn(['metadata', 'ticketState']),
        label: draftStage.get('label'),
        count: selectionCount
      });

      if (draftStage.getIn(['metadata', 'ticketState']) === CLOSED) {
        CrmLogger.log('changeTicketStatusToClosedInRecord');
        CrmLogger.log('ticketsActivation');
      } else {
        CrmLogger.log('changeTicketStatusToOpenInRecord');
      }
    }

    CrmLogger.log('bulkEditRecords', {
      subscreen2: 'bulk-edit-modal'
    });
    var selectedPropertyName = selectedProperty.get('name'); // https://hubspot.slack.com/archives/C016VNJ0B8E/p1628169781130000?thread_ts=1628099431.115600&cid=C016VNJ0B8E
    // prepending a semicolon makes the BE appends multi values instead of replacing them

    var appendMultiCheckboxValuesAdjustedDraft = draft.update(selectedPropertyName, function (value) {
      return appendMultiCheckboxValues ? ";" + value : value;
    });
    return this.props.onConfirm({
      propertyChanges: appendMultiCheckboxValuesAdjustedDraft.toJS(),
      applyToAll: applyToAllIsChecked,
      email: userEmail
    });
  },
  shouldRenderApplyToAll: function shouldRenderApplyToAll() {
    var _this$props$bulkActio = this.props.bulkActionProps,
        isSelectionGreaterThanView = _this$props$bulkActio.isSelectionGreaterThanView,
        isFilterApplied = _this$props$bulkActio.isFilterApplied;
    var selectedProperty = this.state ? this.state.selectedProperty : undefined;

    if (!isSelectionGreaterThanView || isFilterApplied) {
      return false;
    }

    return selectedProperty !== null;
  },
  shouldRenderAppendOrReplaceMultiValueCheckbox: function shouldRenderAppendOrReplaceMultiValueCheckbox() {
    return this.state.selectedProperty && PropertyIdentifier.isMultienum(this.state.selectedProperty);
  },
  renderApplyToAll: function renderApplyToAll() {
    var _this = this;

    var objectType = this.props.bulkActionProps.objectType;
    var applyToAllIsChecked = this.state.applyToAllIsChecked;
    return /*#__PURE__*/_jsx(UICheckbox, {
      checked: applyToAllIsChecked,
      onChange: function onChange(_ref6) {
        var checked = _ref6.target.checked;

        _this.setState({
          applyToAllIsChecked: checked
        });
      },
      className: "m-top-2",
      children: /*#__PURE__*/_jsx(FormattedHTMLMessage, {
        message: "topbarContents.bulkEditModal.confirmApplyToAll." + objectType
      })
    });
  },
  renderMatch: function renderMatch() {
    var _this2 = this;

    var selectedProperty = this.state.selectedProperty;
    var _this$props$bulkActio2 = this.props.bulkActionProps,
        isSelectionGreaterThanView = _this$props$bulkActio2.isSelectionGreaterThanView,
        selectionCount = _this$props$bulkActio2.selectionCount,
        objectTypeLabel = _this$props$bulkActio2.objectTypeLabel;

    if (!selectedProperty || !isSelectionGreaterThanView) {
      return null;
    }

    return /*#__PURE__*/_jsxs("div", {
      children: [/*#__PURE__*/_jsx(UIFormControl, {
        className: "m-y-4",
        label: I18n.text('topbarContents.bulkEditModal.confirmLabel'),
        children: /*#__PURE__*/_jsx(FormattedHTMLMessage, {
          message: "topbarContents.bulkEditModal.boldMove",
          options: {
            count: selectionCount,
            type: objectTypeLabel
          }
        })
      }), /*#__PURE__*/_jsx(UIMatchTextArea, {
        match: "" + selectionCount,
        onMatchedChange: function onMatchedChange(_ref7) {
          var value = _ref7.target.value;
          return _this2.setState({
            countIsMatched: value
          });
        }
      })]
    });
  },
  renderPropertyEditable: function renderPropertyEditable() {
    var getPropertyPermission = this.props.getPropertyPermission;
    var _this$state4 = this.state,
        draft = _this$state4.draft,
        selectedProperty = _this$state4.selectedProperty;
    var objectType = this.props.bulkActionProps.objectType;

    if (!selectedProperty) {
      return null;
    }

    var canEditProperty = getCanEditPropertyAndDependents({
      objectType: objectType,
      getPropertyPermission: getPropertyPermission,
      propertyName: selectedProperty.name
    });
    var draftValue = draft.get(selectedProperty.name);
    return /*#__PURE__*/_jsx(UIFormControl, {
      label: this.renderPropertyLabel(selectedProperty),
      labelTooltip: !canEditProperty && /*#__PURE__*/_jsx(FormattedMessage, {
        message: "fieldLevelPermissions.READ_ONLY"
      }),
      children: /*#__PURE__*/_jsx(PropertyInput, {
        autoFocus: true,
        baseUrl: links.contactEmail(''),
        readOnlySourceData: readOnlySourceData,
        objectType: objectType,
        property: selectedProperty,
        value: draftValue,
        onChange: this.handleChange,
        subjectId: null,
        subject: draft,
        readOnly: !canEditProperty
      }, selectedProperty.name)
    });
  },
  renderCustomSearchableSelect: function renderCustomSearchableSelect(_ref8) {
    var options = _ref8.options,
        canEditProperty = _ref8.canEditProperty,
        value = _ref8.value,
        label = _ref8.label,
        callback = _ref8.callback;
    return /*#__PURE__*/_jsx(UIFormControl, {
      label: /*#__PURE__*/_jsxs("span", {
        children: [label, !canEditProperty && /*#__PURE__*/_jsx(UIIcon, {
          name: "block",
          color: EERIE,
          className: "p-left-1"
        })]
      }),
      labelTooltip: !canEditProperty && /*#__PURE__*/_jsx(FormattedMessage, {
        message: "fieldLevelPermissions.READ_ONLY"
      }),
      children: /*#__PURE__*/_jsx(UISelect, {
        searchable: true,
        placeholder: "" // Disable default "Search" placeholder
        ,
        className: "form-control property-input",
        readOnly: !canEditProperty,
        onChange: callback,
        options: options,
        value: value
      })
    });
  },
  renderStageProperty: function renderStageProperty() {
    var _this$props6 = this.props,
        dealPipelines = _this$props6.dealPipelines,
        ticketPipelines = _this$props6.ticketPipelines,
        pipelineId = _this$props6.pipelineId,
        bulkActionProps = _this$props6.bulkActionProps,
        getPropertyPermission = _this$props6.getPropertyPermission;
    var objectType = bulkActionProps.objectType;
    var _this$state5 = this.state,
        selectedProperty = _this$state5.selectedProperty,
        draft = _this$state5.draft;
    var isDealPipelineSelected = objectType === DEAL && selectedProperty && selectedProperty.name === 'pipeline';
    var isTicketPipelineSelected = objectType === TICKET && selectedProperty && selectedProperty.name === 'hs_pipeline';

    if (!selectedProperty || !isDealPipelineSelected && !isTicketPipelineSelected) {
      return null;
    }

    var pipelinePropertyName = objectType === DEAL ? 'pipeline' : 'hs_pipeline';
    var stagePropertyName = objectType === DEAL ? 'dealstage' : 'hs_pipeline_stage';
    var pipelines = objectType === DEAL ? dealPipelines : ticketPipelines;
    var chosenPipelineId = draft.get(pipelinePropertyName) ? draft.get(pipelinePropertyName) : pipelineId;
    var stageOptions = pipelines.hasIn([chosenPipelineId, 'stageOptions']) ? pipelines.getIn([chosenPipelineId, 'stageOptions']).toJS() : [];
    return this.renderCustomSearchableSelect({
      options: stageOptions,
      canEditProperty: getCanEditPropertyAndDependents({
        objectType: objectType,
        getPropertyPermission: getPropertyPermission,
        propertyName: stagePropertyName
      }),
      value: draft.get(stagePropertyName),
      label: objectType === DEAL ? I18n.text('customCells.dealStage') : I18n.text('customCells.ticketStatus'),
      callback: this.handleStageSelection
    });
  },
  renderPropertyLabel: function renderPropertyLabel(property) {
    var _this$props7 = this.props,
        getPropertyPermission = _this$props7.getPropertyPermission,
        bulkActionProps = _this$props7.bulkActionProps;
    var objectType = bulkActionProps.objectType;
    var canEditProperty = getCanEditPropertyAndDependents({
      objectType: objectType,
      getPropertyPermission: getPropertyPermission,
      propertyName: property.name
    });
    var label = property.hubspotDefined ? propertyLabelTranslator(property.label) : property.label;

    if (property.description) {
      var description = property.hubspotDefined ? propertyDescriptionTranslator(property.label, property.description) : property.description;
      return /*#__PURE__*/_jsx(UITooltip, {
        title: description,
        disabled: !canEditProperty,
        children: /*#__PURE__*/_jsxs("span", {
          children: [label, !canEditProperty && /*#__PURE__*/_jsx(UIIcon, {
            name: "block",
            color: EERIE,
            className: "p-left-1"
          })]
        })
      });
    }

    return /*#__PURE__*/_jsx("span", {
      children: label
    });
  },
  renderAppendOrReplaceMultiValueCheckbox: function renderAppendOrReplaceMultiValueCheckbox() {
    var _this3 = this;

    return /*#__PURE__*/_jsx(UIFormControl, {
      children: /*#__PURE__*/_jsxs(UIToggleGroup, {
        name: "append-or-replace-multi-value-checkbox",
        children: [/*#__PURE__*/_jsx(UIRadioInput, {
          checked: this.state.appendMultiCheckboxValues,
          onChange: function onChange() {
            return _this3.setState({
              appendMultiCheckboxValues: true
            });
          },
          children: /*#__PURE__*/_jsx(FormattedMessage, {
            message: "index.bulkActions.appendOrReplaceMultiValues.append"
          })
        }), /*#__PURE__*/_jsx(UIRadioInput, {
          checked: !this.state.appendMultiCheckboxValues,
          onChange: function onChange() {
            return _this3.setState({
              appendMultiCheckboxValues: false
            });
          },
          children: /*#__PURE__*/_jsx(FormattedMessage, {
            message: "index.bulkActions.appendOrReplaceMultiValues.replace"
          })
        })]
      })
    });
  },
  render: function render() {
    var _this$props8 = this.props,
        bulkActionProps = _this$props8.bulkActionProps,
        preSelectedProperty = _this$props8.preSelectedProperty;
    var selectionCount = bulkActionProps.get('selectionCount');
    var objectTypeLabel = getObjectTypeLabel(bulkActionProps);
    return /*#__PURE__*/_jsx(BaseDialog, {
      title: I18n.text('topbarContents.bulkEditModal.title', {
        count: selectionCount,
        objectType: objectTypeLabel
      }),
      confirmLabel: I18n.text('topbarContents.bulkEditModal.confirm'),
      confirmDisabled: !this.canSave(),
      onConfirm: this.handleConfirm,
      onReject: this.props.onReject,
      children: /*#__PURE__*/_jsxs(UIForm, {
        className: "stacked bulk-edit-dialog",
        children: [/*#__PURE__*/_jsx(UIFormControl, {
          label: I18n.text('topbarContents.bulkEditModal.pickerLabel'),
          children: /*#__PURE__*/_jsx(UISelect, {
            searchable: true,
            onChange: this.handlePropertySelect,
            options: this.getPropertyOptions(),
            itemComponent: PropertyOption,
            className: "form-control",
            id: "bulk-edit-property-select",
            placeholder: I18n.text('topbarContents.bulkEditModal.placeholder'),
            readOnly: !!preSelectedProperty,
            value: this.state.selectedProperty && this.state.selectedProperty.name
          })
        }), this.renderPropertyEditable(), this.renderStageProperty(), this.renderMatch(), this.shouldRenderAppendOrReplaceMultiValueCheckbox() && this.renderAppendOrReplaceMultiValueCheckbox(), this.shouldRenderApplyToAll() && this.renderApplyToAll()]
      })
    });
  }
});
var deps = {
  getPropertyPermission: {
    stores: [FieldLevelPermissionsStore, IsUngatedStore],
    deref: function deref(_ref9) {
      var bulkActionProps = _ref9.bulkActionProps;
      return buildGetPropertyPermissionFromObjectType({
        objectType: bulkActionProps.objectType
      });
    }
  },
  dealStages: {
    stores: [DealStageStore],
    deref: function deref(_ref10) {
      var bulkActionProps = _ref10.bulkActionProps;
      var objectType = bulkActionProps.get('objectType');

      if (objectType !== DEAL) {
        return null;
      }

      return DealStageStore.get();
    }
  },
  dealPipelines: {
    stores: [DealPipelineStore],
    deref: function deref(_ref11) {
      var bulkActionProps = _ref11.bulkActionProps;
      var objectType = bulkActionProps.get('objectType');

      if (objectType !== DEAL) {
        return null;
      }

      return DealPipelineStore.get();
    }
  },
  ticketStages: {
    stores: [TicketsPipelinesStagesStore],
    deref: function deref(_ref12) {
      var bulkActionProps = _ref12.bulkActionProps;
      var objectType = bulkActionProps.get('objectType');

      if (objectType !== TICKET) {
        return null;
      }

      return TicketsPipelinesStagesStore.get();
    }
  },
  ticketPipelines: {
    stores: [TicketsPipelinesStore],
    deref: function deref(_ref13) {
      var bulkActionProps = _ref13.bulkActionProps;
      var objectType = bulkActionProps.get('objectType');

      if (objectType !== TICKET) {
        return null;
      }

      return TicketsPipelinesStore.get();
    }
  },
  properties: {
    stores: [PropertiesStore],
    deref: function deref(_ref14) {
      var bulkActionProps = _ref14.bulkActionProps;
      var objectType = bulkActionProps.get('objectType');
      var defaultProperties = PropertiesStore.get(objectType);

      if (!defaultProperties) {
        return null;
      }

      return defaultProperties;
    }
  },
  propertyGroups: {
    stores: [PropertiesStore, PropertyGroupsStore],
    deref: function deref(_ref15) {
      var bulkActionProps = _ref15.bulkActionProps;
      var objectType = bulkActionProps.get('objectType');
      var properties = PropertiesStore.get(objectType);
      var propertyGroups = PropertyGroupsStore.get(objectType);

      if (!properties || !propertyGroups) {
        return LOADING;
      }

      return join(propertyGroups, properties).sortBy(function (group) {
        return group.get('displayOrder');
      });
    }
  },
  pipelineId: getPipelineIdDependency,
  userEmail: {
    stores: [UserStore],
    deref: function deref() {
      return UserStore.get('email');
    }
  }
};
var provideResolvers = ProvideReferenceResolvers(_defineProperty({}, MULTI_CURRENCY_CURRENCY_CODE, MultiCurrencyCurrencyCodeResolver));
export default connect(deps)(provideResolvers(BulkEditDialog));