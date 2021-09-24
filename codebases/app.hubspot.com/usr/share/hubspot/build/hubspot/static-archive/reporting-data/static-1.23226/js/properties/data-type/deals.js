'use es6';

import _slicedToArray from "@babel/runtime/helpers/esm/slicedToArray";
import _defineProperty from "@babel/runtime/helpers/esm/defineProperty";
import _toConsumableArray from "@babel/runtime/helpers/esm/toConsumableArray";
import unescapedText from 'I18n/utils/unescapedText';
import { fromJS, List, Map as ImmutableMap } from 'immutable';
import { DEALS } from '../../constants/dataTypes';
import { DEFAULT_NULL_VALUES } from '../../constants/defaultNullValues';
import dealModule from '../../dataTypeDefinitions/inboundDb/deals';
import prefix from '../../lib/prefix';
import { Promise } from '../../lib/promise';
import { slug } from '../../lib/slug';
import { generatePipelineStageLabel } from '../../references/pipelineStage/index';
import overridePropertyTypes from '../../retrieve/inboundDb/common/overridePropertyTypes';
import getRemoteProperties from '../../retrieve/inboundDb/common/properties';
import { get as getPipelines } from '../../retrieve/inboundDb/pipelines';
import createPropertiesGetterFromGroups from '../createPropertiesGetterFromGroups';
import { mergeProperties } from '../mergeProperties';
import conversionProperty from '../partial/conversion-property';
import countProperty from '../partial/count-property';
import getQuotasProperties from '../partial/quotas';
var translate = prefix('reporting-data.properties.deals');

var unescapeTranslate = function unescapeTranslate(key) {
  var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  return unescapedText("reporting-data.properties.deals." + key, options);
};

var translateGroup = prefix('reporting-data.groups.deals');
var translateCommon = prefix('reporting-data.properties.common');

var booleanOptions = function booleanOptions() {
  return [{
    value: 'YES',
    label: translateCommon('buckets.included')
  }, {
    value: 'NO',
    label: translateCommon('buckets.excluded')
  }];
};

export var getDealCreateStage = function getDealCreateStage() {
  return {
    value: 'create',
    label: translate('stage.create'),
    displayOrder: -1
  };
};

var getDealStageOptions = function getDealStageOptions() {
  return getPipelines(DEALS).then(function (pipelines) {
    return pipelines.reduce(function (options, _ref) {
      var label = _ref.label,
          stages = _ref.stages;
      return [].concat(_toConsumableArray(options), _toConsumableArray(stages.map(function (stage) {
        return {
          label: generatePipelineStageLabel(fromJS({
            label: stage.label,
            pipelineLabel: label
          }), stage.stageId),
          displayOrder: stage.displayOrder,
          value: stage.stageId,
          metadata: stage.metadata
        };
      })));
    }, [getDealCreateStage()]);
  });
};

var createEnteredProperty = function createEnteredProperty(stageId) {
  return "dealstages." + slug(stageId) + "_entered";
};

var createEnteredCountProperty = function createEnteredCountProperty(stageId) {
  return "BUCKET_" + createEnteredProperty(stageId) + "_enteredCount";
};

var getStageDurationProperties = function getStageDurationProperties(stages) {
  return stages.reduce(function (acc, _ref2) {
    var _Object$assign;

    var label = _ref2.label,
        metadata = _ref2.metadata;

    if (!metadata) {
      return acc;
    }

    var dateEnteredStagePropertyName = metadata.dateEnteredStagePropertyName,
        timeInStagePropertyName = metadata.timeInStagePropertyName,
        dateExitedStagePropertyName = metadata.dateExitedStagePropertyName;
    return Object.assign({}, acc, (_Object$assign = {}, _defineProperty(_Object$assign, dateEnteredStagePropertyName, {
      name: dateEnteredStagePropertyName,
      label: unescapeTranslate('hs_date_entered', {
        stageName: label
      })
    }), _defineProperty(_Object$assign, dateExitedStagePropertyName, {
      name: dateExitedStagePropertyName,
      label: unescapeTranslate('hs_date_exited', {
        stageName: label
      })
    }), _defineProperty(_Object$assign, timeInStagePropertyName, {
      name: timeInStagePropertyName,
      label: unescapeTranslate('hs_time_in', {
        stageName: label
      })
    }), _Object$assign));
  }, {});
};

var getScriptedPropertyGroup = function getScriptedPropertyGroup() {
  return fromJS({
    name: 'dealscripted',
    displayName: translateGroup('dealscripted'),
    displayOrder: 0,
    hubspotDefined: true,
    properties: [{
      name: 'BUCKET_createdate_enteredCount',
      property: 'createdate',
      groupName: 'dealscripted',
      scripted: true,
      label: translate('BUCKET_createdate_enteredCount'),
      type: 'buckets',
      blocklistedForFiltering: true,
      options: booleanOptions()
    }, {
      name: 'BUCKET_dealProgress',
      property: 'deal.probability',
      groupName: 'dealscripted',
      scripted: true,
      label: translate('BUCKET_dealProgress'),
      blocklistedForFiltering: true,
      type: 'buckets',
      options: [{
        value: 'WON',
        label: translate('dealprogress.won')
      }, {
        value: 'OPEN',
        label: translate('dealprogress.open')
      }, {
        value: 'LOST',
        label: translate('dealprogress.lost')
      }]
    }, {
      name: 'dealstage.probability',
      groupName: 'dealscripted',
      scripted: true,
      label: translate('dealstageProbability'),
      type: 'number',
      defaultNullValue: -1,
      options: [{
        value: 'WON',
        label: translate('dealprogress.won')
      }, {
        value: 'OPEN',
        label: translate('dealprogress.open')
      }, {
        value: 'LOST',
        label: translate('dealprogress.lost')
      }]
    }, {
      name: 'days_to_close',
      groupName: 'dealscripted',
      scripted: true,
      label: translate('days_to_close'),
      type: 'number'
    }]
  });
};

var getDealStagePropertyGroup = function getDealStagePropertyGroup() {
  return getPipelines(DEALS).then(fromJS).then(function (pipelines) {
    var enteredStageDates = pipelines.map(function (pipeline) {
      return pipeline.get('stages').map(function (stage) {
        var stageId = stage.get('stageId');
        var stageLabel = stage.get('label');
        return List([ImmutableMap({
          name: createEnteredProperty(stageId),
          type: 'datetime',
          label: unescapeTranslate('enteredStage', {
            stageLabel: stageLabel
          }),
          groupName: 'dealstages',
          scripted: true,
          stageId: stageId,
          pipeline: pipeline
        }), ImmutableMap({
          name: createEnteredCountProperty(stageId),
          property: createEnteredProperty(stageId),
          type: 'buckets',
          label: unescapeTranslate('hasEnteredStage', {
            stageLabel: stageLabel
          }),
          groupName: 'dealstages',
          scripted: true,
          stageId: stageId,
          pipeline: pipeline,
          options: fromJS(booleanOptions()),
          buckets: [{
            name: 'YES',
            operator: 'GT',
            value: 0
          }, {
            name: 'NO'
          }]
        })]);
      });
    }).flatten(2);
    var timeInStageDates = pipelines.map(function (pipeline) {
      return pipeline.get('stages').map(function (stage) {
        var stageId = stage.get('stageId');
        var stageLabel = stage.get('label');
        return ImmutableMap({
          name: "dealstages." + slug(stageId) + "_duration",
          durationUnit: 'milliseconds',
          label: unescapeTranslate('timeInStage', {
            stageLabel: stageLabel
          }),
          description: translate('timeInStageDescriptions'),
          groupName: 'dealstages',
          type: 'duration',
          scripted: true,
          stageId: stageId,
          pipeline: pipeline
        });
      });
    }).flatten(1);
    return ImmutableMap({
      name: 'dealstages',
      displayName: translateGroup('dealstages'),
      displayOrder: 0,
      hubspotDefined: true,
      properties: List([ImmutableMap({
        name: 'dealstages.*_duration',
        groupName: 'dealstages',
        scripted: true,
        label: translate('timeInAllStages'),
        description: translate('timeInStageDescriptions'),
        type: 'duration',
        durationUnit: 'milliseconds',
        blocklistedForFiltering: true
      })].concat(_toConsumableArray(timeInStageDates), _toConsumableArray(enteredStageDates)))
    });
  });
};

export var getPropertyGroups = function getPropertyGroups() {
  return Promise.all([getRemoteProperties(DEALS), getDealStagePropertyGroup(), getDealStageOptions()]).then(function (_ref3) {
    var _ref4 = _slicedToArray(_ref3, 3),
        remoteGroups = _ref4[0],
        dealStagePropertyGroup = _ref4[1],
        dealStageOptions = _ref4[2];

    return mergeProperties(List([].concat(_toConsumableArray(remoteGroups), [getScriptedPropertyGroup(), dealStagePropertyGroup])), 'dealinformation', Object.assign({
      'associations.company': {
        name: 'associations.company',
        label: translateCommon('associatedCompanies'),
        type: 'enumeration'
      },
      'associations.contact': {
        name: 'associations.contact',
        label: translateCommon('associatedContacts'),
        type: 'enumeration'
      },
      dealstage: {
        options: dealStageOptions
      },
      amount: {
        name: 'amount',
        type: 'currency',
        label: translate('amount')
      },
      hubspot_team_id: {
        referencedObjectType: 'TEAM'
      },
      hs_closed_amount: {
        name: 'hs_closed_amount',
        type: 'currency',
        label: translate('hs_closed_amount'),
        scripted: true,
        hidden: false
      },
      hs_projected_amount: {
        name: 'hs_projected_amount',
        type: 'currency',
        label: translate('hs_projected_amount'),
        scripted: true,
        hidden: false
      },
      amount_in_home_currency: {
        name: 'amount_in_home_currency',
        type: 'currency',
        label: translate('amount_in_home_currency')
      },
      projectedAmount: {
        name: 'projectedAmount',
        type: 'currency',
        label: translate('projectedAmount'),
        scripted: true,
        hidden: true
      },
      closedAmount: {
        name: 'closedAmount',
        type: 'currency',
        label: translate('closedAmount'),
        scripted: true,
        hidden: true
      },
      closedAmountInHomeCurrency: {
        name: 'closedAmountInHomeCurrency',
        type: 'currency',
        label: translate('closedAmountInHomeCurrency'),
        scripted: true,
        hidden: true
      },
      projectedAmountInHomeCurrency: {
        name: 'projectedAmountInHomeCurrency',
        type: 'currency',
        label: translate('projectedAmountInHomeCurrency'),
        scripted: true,
        hidden: true
      },
      hs_projected_amount_in_home_currency: {
        name: 'hs_projected_amount_in_home_currency',
        type: 'currency',
        label: translate('hs_projected_amount_in_home_currency'),
        scripted: true,
        hidden: false
      },
      hs_closed_amount_in_home_currency: {
        name: 'hs_closed_amount_in_home_currency',
        type: 'currency',
        label: translate('hs_closed_amount_in_home_currency'),
        scripted: true,
        hidden: false
      },
      '_inbounddbio.importid_': {
        name: '_inbounddbio.importid_',
        label: translateCommon('inboundDbImport'),
        type: 'enumeration',
        hidden: false,
        blocklistedForAggregation: true
      },
      hs_deal_stage_probability: {
        type: 'percent'
      },
      hs_created_by_user_id: {
        defaultNullValue: DEFAULT_NULL_VALUES.NUMBER,
        reportingOverwrittenNumericType: true
      }
    }, getStageDurationProperties(dealStageOptions)));
  });
};
export var getProperties = function getProperties() {
  return Promise.all([createPropertiesGetterFromGroups(getPropertyGroups)(), getDealStageOptions()]).then(function (_ref5) {
    var _ref6 = _slicedToArray(_ref5, 2),
        properties = _ref6[0],
        stages = _ref6[1];

    return properties.merge(countProperty(DEALS)).merge(conversionProperty()).merge(getQuotasProperties()).merge(fromJS({
      dealId: {
        name: 'dealId',
        label: translate('deal'),
        type: 'string'
      },
      'funnel.dealstage': {
        name: 'funnel.dealstage',
        label: translate('dealStage'),
        type: 'enumeration',
        options: stages,
        blocklistedForGrouping: true
      },
      'pipeline.dealstage': {
        name: 'pipeline.dealstage',
        label: translate('dealStage'),
        type: 'enumeration',
        options: stages,
        blocklistedForGrouping: true
      },
      'associations.company': {
        name: 'associations.company',
        label: translateCommon('associatedCompanies'),
        type: 'enumeration'
      },
      'associations.contact': {
        name: 'associations.contact',
        label: translateCommon('associatedContacts'),
        type: 'enumeration'
      },
      snapshotDate: {
        name: 'snapshotDate',
        type: 'date',
        hidden: true,
        blocklistedForAggregation: true,
        blocklistedForFiltering: true
      }
    }));
  }).then(overridePropertyTypes(dealModule.getInboundSpec()));
};