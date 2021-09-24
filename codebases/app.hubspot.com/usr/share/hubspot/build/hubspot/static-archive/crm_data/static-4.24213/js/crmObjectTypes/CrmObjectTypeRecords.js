'use es6';

import _classCallCheck from "@babel/runtime/helpers/esm/classCallCheck";
import _createClass from "@babel/runtime/helpers/esm/createClass";
import _possibleConstructorReturn from "@babel/runtime/helpers/esm/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/esm/getPrototypeOf";
import _inherits from "@babel/runtime/helpers/esm/inherits";
import { Record, List } from 'immutable';
import { ObjectTypeFromIds } from 'customer-data-objects/constants/ObjectTypeIds';
import Raven from 'Raven';

var CrmObjectTypeRecord = /*#__PURE__*/function (_Record) {
  _inherits(CrmObjectTypeRecord, _Record);

  function CrmObjectTypeRecord() {
    _classCallCheck(this, CrmObjectTypeRecord);

    return _possibleConstructorReturn(this, _getPrototypeOf(CrmObjectTypeRecord).apply(this, arguments));
  }

  _createClass(CrmObjectTypeRecord, [{
    key: "isHubspotDefined",
    value: function isHubspotDefined() {
      return this.metaTypeId === 0;
    }
  }, {
    key: "isIntegrationDefined",
    value: function isIntegrationDefined() {
      return this.metaTypeId === 1;
    }
  }, {
    key: "isPortalDefined",
    value: function isPortalDefined() {
      return this.metaTypeId === 2;
    }
  }, {
    key: "isCustomObject",
    value: function isCustomObject() {
      return this.isPortalDefined() || this.isIntegrationDefined();
    }
  }]);

  return CrmObjectTypeRecord;
}(Record( // Adapted from: custom-object-settings/CustomObjectRecord
{
  id: undefined,
  objectTypeId: undefined,
  name: '',
  singularForm: '',
  pluralForm: '',
  metaType: undefined,
  metaTypeId: undefined,
  hasCustomProperties: true,
  hasDefaultProperties: true,
  hasPipelines: false,
  hasOwners: false,
  hasExternalObjectIds: false,
  restorable: true,
  indexedForFiltersAndReports: false,
  defaultSearchPropertyNames: List(),
  requiredProperties: List(),
  primaryDisplayLabelPropertyName: undefined,
  // must also be a required property
  secondaryDisplayLabelPropertyNames: List(),
  createDatePropertyName: 'hs_createdate',
  lastModifiedPropertyName: 'hs_lastmodifieddate',
  pipelineCloseDatePropertyName: 'hs_pipeline_closedate',
  pipelinePropertyName: 'hs_pipeline',
  pipelineStagePropertyName: 'hs_pipeline_stage',
  pipelineTimeToClosePropertyName: 'hs_pipeline_time_to_close',
  integrationAppId: undefined,
  ownerPortalId: undefined,
  janusGroup: undefined,
  scopeMappings: [],
  fullyQualifiedName: undefined,
  error: false
}, 'CrmObjectType'));

var UnknownObjectType = /*#__PURE__*/function (_CrmObjectTypeRecord) {
  _inherits(UnknownObjectType, _CrmObjectTypeRecord);

  function UnknownObjectType() {
    _classCallCheck(this, UnknownObjectType);

    return _possibleConstructorReturn(this, _getPrototypeOf(UnknownObjectType).apply(this, arguments));
  }

  _createClass(UnknownObjectType, [{
    key: "error",
    get: function get() {
      return true;
    }
  }]);

  return UnknownObjectType;
}(CrmObjectTypeRecord);

var LegacyCrmObjectType = /*#__PURE__*/function (_CrmObjectTypeRecord2) {
  _inherits(LegacyCrmObjectType, _CrmObjectTypeRecord2);

  function LegacyCrmObjectType() {
    _classCallCheck(this, LegacyCrmObjectType);

    return _possibleConstructorReturn(this, _getPrototypeOf(LegacyCrmObjectType).apply(this, arguments));
  }

  return LegacyCrmObjectType;
}(CrmObjectTypeRecord);

function getRecordType(typeDef) {
  var metaTypeId = typeDef.metaTypeId;

  switch (metaTypeId) {
    case 0:
    case 1:
    case 2:
      return Object.prototype.hasOwnProperty.call(ObjectTypeFromIds, typeDef.objectTypeId) ? LegacyCrmObjectType : CrmObjectTypeRecord;

    default:
      Raven.captureException(new Error("[CrmObjectTypeRecords] expected metaTypeId to be 0|1|2, got: " + metaTypeId), {
        extra: typeDef
      });
      return UnknownObjectType;
  }
}

function normalize(rawData) {
  var defaultSearchPropertyNames = rawData.defaultSearchPropertyNames,
      requiredProperties = rawData.requiredProperties,
      secondaryDisplayLabelPropertyNames = rawData.secondaryDisplayLabelPropertyNames;
  return Object.assign({}, rawData, {
    defaultSearchPropertyNames: List(defaultSearchPropertyNames),
    requiredProperties: List(requiredProperties),
    secondaryDisplayLabelPropertyNames: List(secondaryDisplayLabelPropertyNames)
  });
}

CrmObjectTypeRecord.fromJSON = function (rawData) {
  var normalizedData = normalize(rawData);
  var RecordType = getRecordType(rawData);
  return new RecordType(normalizedData);
};

export { normalize // Primary Record type that holds all data & functionality
, CrmObjectTypeRecord // Nominal records for use in utils/protocols
, LegacyCrmObjectType, UnknownObjectType };