'use es6';

import _slicedToArray from "@babel/runtime/helpers/esm/slicedToArray";
import _toConsumableArray from "@babel/runtime/helpers/esm/toConsumableArray";
import _defineProperty from "@babel/runtime/helpers/esm/defineProperty";
import { jsx as _jsx } from "react/jsx-runtime";

var _unique = function _unique(definitions) {
  var names = {};
  return definitions.filter(function (definition) {
    if (definition.kind !== 'FragmentDefinition') {
      return true;
    }

    var name = definition.name.value;

    if (names[name]) {
      return false;
    } else {
      names[name] = true;
      return true;
    }
  });
};

import { useCallback, useMemo } from 'react';
import PropTypes from 'prop-types';
import fromJS from 'transmute/fromJS';
import getIn from 'transmute/getIn';
import get from 'transmute/get';
import StageChangeDialog from 'customer-data-properties/dialog/StageChangeDialog';
import RevenueStageChangeDialog from 'customer-data-properties/revenue/RevenueStageChangeDialog';
import { useProperties } from '../../properties/hooks/useProperties';
import { denormalizeTypeId } from '../../utils/denormalizeTypeId';
import { useGetPropertyPermission } from '../../fieldLevelPermissions/hooks/useGetPropertyPermission';
import { useModalData } from '../../overlay/hooks/useModalData';
import { getPropertyInputResolver } from 'customer-data-properties/resolvers/PropertyInputResolvers';
import PropertyInput from 'customer-data-properties/input/PropertyInput';
import { useModalActions } from '../../overlay/hooks/useModalActions';
import { useCrmObjectsActions } from '../../crmObjects/hooks/useCrmObjectsActions';
import { objectEntries } from '../../objectUtils/objectEntries';
import { CrmObjectFragment } from '../../crmSearch/hooks/useCrmSearchQuery';
import { useObjectTypeDefinitions } from '../../../crmObjects/hooks/useObjectTypeDefinitions';
import { useQuery } from '@apollo/client';
import { useCurrentPipeline } from '../../pipelines/hooks/useCurrentPipeline';
import { DEAL_TYPE_ID } from 'customer-data-objects/constants/ObjectTypeIds';
import { useHasAllScopes } from '../../auth/hooks/useHasAllScopes';
import { usePortalSetting } from '../../portalSettings/hooks/usePortalSetting';
import { makeLegacyObjectRecord } from '../../crmSearch/utils/makeLegacyObjectRecord';
import { alertFailure } from '../../utils/alerts';
import FormattedMessage from 'I18n/components/FormattedMessage';
import { useQueryProperties } from '../../searchQuery/hooks/useQueryProperties';
import ObjectTypeIdType from 'customer-data-objects-ui-components/propTypes/ObjectTypeIdType';
import { getPortalSettingsKeys } from '../../portalSettings/constants/PortalSettingsKeys';

var doFailureAlert = function doFailureAlert() {
  return alertFailure({
    title: /*#__PURE__*/_jsx(FormattedMessage, {
      message: "index.alerts.bulkEdit.failure.title",
      options: {
        count: 1
      }
    })
  });
}; // HACK: This modal only supports the single object case for now. To support the bulk case
// we'll need to make some upgrades to the wrapped component itself, so we have not
// made any effort to code for the bulk case here.


export var EditStagePropertiesModal = function EditStagePropertiesModal(_ref) {
  var objectTypeId = _ref.objectTypeId,
      objectId = _ref.objectId,
      stageId = _ref.stageId,
      data = _ref.data;
  var typeDefs = useObjectTypeDefinitions();
  var pipelineStagePropertyName = getIn([objectTypeId, 'pipelineStagePropertyName'], typeDefs);
  var subject = useMemo(function () {
    return makeLegacyObjectRecord(objectTypeId, get('crmObject', data));
  }, [objectTypeId, data]);
  var prevStageId = useMemo(function () {
    return getIn(['properties', pipelineStagePropertyName, 'value'], subject);
  }, [pipelineStagePropertyName, subject]);
  var pipeline = useCurrentPipeline();
  var prevStage = useMemo(function () {
    return fromJS(pipeline.stages.find(function (stage) {
      return stage.stageId === prevStageId;
    }));
  }, [pipeline.stages, prevStageId]);
  var nextStage = useMemo(function () {
    return fromJS(pipeline.stages.find(function (stage) {
      return stage.stageId === stageId;
    }));
  }, [pipeline.stages, stageId]);
  var propertyRequirements = useMemo(function () {
    return fromJS(getIn(['pipelineStage', 'propertyValueRequirements'], data) || []);
  }, [data]);
  var prevProperties = useMemo(function () {
    return fromJS(_defineProperty({}, pipelineStagePropertyName, prevStageId));
  }, [pipelineStagePropertyName, prevStageId]);
  var nextProperties = useMemo(function () {
    return fromJS(propertyRequirements.reduce(function (acc, requirement) {
      var value = getIn(['propertyValueForObject', 'value'], requirement);
      var property = getIn(['property'], requirement);

      if (value) {
        acc[property] = value;
      }

      return acc;
    }, {}));
  }, [propertyRequirements]); // This is a portal setting that changes the lifecycle stage of associated contacts and companies when deals move through
  // a pipeline. It appears to be the only setting that either of these modals care about.
  // See https://git.hubteam.com/HubSpot/customer-data-properties/blob/36535503c8524bea61ce4bc62aaca657262d6f35/static/js/dialog/StageChangeDialog.js#L39
  // See https://git.hubteam.com/HubSpot/customer-data-properties/blob/36535503c8524bea61ce4bc62aaca657262d6f35/static/js/revenue/RevenueStageChangeDialog.js#L50

  var lifecycleSyncSettingsKey = getPortalSettingsKeys().LIFECYCLE_CONTACT_SYNC;
  var lifecycleSyncSetting = usePortalSetting(lifecycleSyncSettingsKey);
  var settings = useMemo(function () {
    return fromJS(_defineProperty({}, lifecycleSyncSettingsKey, lifecycleSyncSetting));
  }, [lifecycleSyncSetting, lifecycleSyncSettingsKey]);
  var properties = useProperties();
  var getPropertyPermission = useGetPropertyPermission();

  var _useModalActions = useModalActions(),
      closeModal = _useModalActions.closeModal;

  var _useCrmObjectsActions = useCrmObjectsActions(),
      updateCrmObjects = _useCrmObjectsActions.updateCrmObjects;

  var handleConfirm = useCallback(function (propertyUpdates) {
    var values = [].concat(_toConsumableArray(objectEntries(propertyUpdates).map(function (_ref2) {
      var _ref3 = _slicedToArray(_ref2, 2),
          name = _ref3[0],
          value = _ref3[1];

      return {
        name: name,
        value: value
      };
    })), [{
      name: pipelineStagePropertyName,
      value: stageId
    }]);
    return updateCrmObjects({
      objectIds: [objectId],
      propertyValues: values,
      bypassStagePropertyRequirements: true
    }).then(closeModal).catch(doFailureAlert);
  }, [closeModal, objectId, pipelineStagePropertyName, stageId, updateCrmObjects]);
  var hasAllScopes = useHasAllScopes();
  var shouldUseRevenueDialog = objectTypeId === DEAL_TYPE_ID && hasAllScopes('revenue-deal-stage-change-dialog');
  var Dialog = shouldUseRevenueDialog ? RevenueStageChangeDialog : StageChangeDialog;
  return /*#__PURE__*/_jsx(Dialog, {
    objectType: denormalizeTypeId(objectTypeId),
    subject: subject,
    subjectProperties: properties,
    properties: propertyRequirements,
    prevStage: prevStage,
    nextStage: nextStage,
    prevProperties: prevProperties,
    nextProperties: nextProperties,
    settings: settings,
    getPropertyPermission: getPropertyPermission,
    getPropertyInputResolver: getPropertyInputResolver,
    PropertyInput: PropertyInput,
    onReject: closeModal,
    onConfirm: handleConfirm
  });
};
EditStagePropertiesModal.propTypes = {
  objectTypeId: ObjectTypeIdType.isRequired,
  objectId: PropTypes.string.isRequired,
  stageId: PropTypes.string.isRequired,
  data: PropTypes.shape({
    crmObject: PropTypes.object.isRequired,
    pipelineStage: PropTypes.object.isRequired
  })
};
export var GetDataForStagePropertiesModal = ("__gql__", "{\"kind\":\"Document\",\"definitions\":[{\"kind\":\"OperationDefinition\",\"operation\":\"query\",\"name\":{\"kind\":\"Name\",\"value\":\"GetDataForStagePropertiesModal\"},\"variableDefinitions\":[{\"kind\":\"VariableDefinition\",\"variable\":{\"kind\":\"Variable\",\"name\":{\"kind\":\"Name\",\"value\":\"objectTypeId\"}},\"type\":{\"kind\":\"NonNullType\",\"type\":{\"kind\":\"NamedType\",\"name\":{\"kind\":\"Name\",\"value\":\"String\"}}}},{\"kind\":\"VariableDefinition\",\"variable\":{\"kind\":\"Variable\",\"name\":{\"kind\":\"Name\",\"value\":\"objectId\"}},\"type\":{\"kind\":\"NonNullType\",\"type\":{\"kind\":\"NamedType\",\"name\":{\"kind\":\"Name\",\"value\":\"Long\"}}}},{\"kind\":\"VariableDefinition\",\"variable\":{\"kind\":\"Variable\",\"name\":{\"kind\":\"Name\",\"value\":\"properties\"}},\"type\":{\"kind\":\"NonNullType\",\"type\":{\"kind\":\"ListType\",\"type\":{\"kind\":\"NonNullType\",\"type\":{\"kind\":\"NamedType\",\"name\":{\"kind\":\"Name\",\"value\":\"String\"}}}}}},{\"kind\":\"VariableDefinition\",\"variable\":{\"kind\":\"Variable\",\"name\":{\"kind\":\"Name\",\"value\":\"stageId\"}},\"type\":{\"kind\":\"NonNullType\",\"type\":{\"kind\":\"NamedType\",\"name\":{\"kind\":\"Name\",\"value\":\"String\"}}}}],\"selectionSet\":{\"kind\":\"SelectionSet\",\"selections\":[{\"kind\":\"Field\",\"name\":{\"kind\":\"Name\",\"value\":\"crmObject\"},\"arguments\":[{\"kind\":\"Argument\",\"name\":{\"kind\":\"Name\",\"value\":\"type\"},\"value\":{\"kind\":\"Variable\",\"name\":{\"kind\":\"Name\",\"value\":\"objectTypeId\"}}},{\"kind\":\"Argument\",\"name\":{\"kind\":\"Name\",\"value\":\"id\"},\"value\":{\"kind\":\"Variable\",\"name\":{\"kind\":\"Name\",\"value\":\"objectId\"}}}],\"selectionSet\":{\"kind\":\"SelectionSet\",\"selections\":[{\"kind\":\"FragmentSpread\",\"name\":{\"kind\":\"Name\",\"value\":\"CrmObjectFragment\"}}]}},{\"kind\":\"Field\",\"name\":{\"kind\":\"Name\",\"value\":\"pipelineStage\"},\"arguments\":[{\"kind\":\"Argument\",\"name\":{\"kind\":\"Name\",\"value\":\"objectType\"},\"value\":{\"kind\":\"Variable\",\"name\":{\"kind\":\"Name\",\"value\":\"objectTypeId\"}}},{\"kind\":\"Argument\",\"name\":{\"kind\":\"Name\",\"value\":\"stageId\"},\"value\":{\"kind\":\"Variable\",\"name\":{\"kind\":\"Name\",\"value\":\"stageId\"}}}],\"selectionSet\":{\"kind\":\"SelectionSet\",\"selections\":[{\"kind\":\"Field\",\"name\":{\"kind\":\"Name\",\"value\":\"stageId\"}},{\"kind\":\"Field\",\"name\":{\"kind\":\"Name\",\"value\":\"propertyValueRequirements\"},\"selectionSet\":{\"kind\":\"SelectionSet\",\"selections\":[{\"kind\":\"Field\",\"alias\":{\"kind\":\"Name\",\"value\":\"property\"},\"name\":{\"kind\":\"Name\",\"value\":\"propertyName\"}},{\"kind\":\"Field\",\"alias\":{\"kind\":\"Name\",\"value\":\"required\"},\"name\":{\"kind\":\"Name\",\"value\":\"isValueRequired\"}},{\"kind\":\"Field\",\"name\":{\"kind\":\"Name\",\"value\":\"propertyValueForObject\"},\"arguments\":[{\"kind\":\"Argument\",\"name\":{\"kind\":\"Name\",\"value\":\"objectId\"},\"value\":{\"kind\":\"Variable\",\"name\":{\"kind\":\"Name\",\"value\":\"objectId\"}}}],\"selectionSet\":{\"kind\":\"SelectionSet\",\"selections\":[{\"kind\":\"Field\",\"name\":{\"kind\":\"Name\",\"value\":\"id\"}},{\"kind\":\"Field\",\"name\":{\"kind\":\"Name\",\"value\":\"name\"}},{\"kind\":\"Field\",\"name\":{\"kind\":\"Name\",\"value\":\"value\"}}]}}]}}]}}]}}]}", {
  id: null,
  kind: "Document",
  definitions: _unique([{
    kind: "OperationDefinition",
    operation: "query",
    name: {
      kind: "Name",
      value: "GetDataForStagePropertiesModal"
    },
    variableDefinitions: [{
      kind: "VariableDefinition",
      variable: {
        kind: "Variable",
        name: {
          kind: "Name",
          value: "objectTypeId"
        }
      },
      type: {
        kind: "NonNullType",
        type: {
          kind: "NamedType",
          name: {
            kind: "Name",
            value: "String"
          }
        }
      }
    }, {
      kind: "VariableDefinition",
      variable: {
        kind: "Variable",
        name: {
          kind: "Name",
          value: "objectId"
        }
      },
      type: {
        kind: "NonNullType",
        type: {
          kind: "NamedType",
          name: {
            kind: "Name",
            value: "Long"
          }
        }
      }
    }, {
      kind: "VariableDefinition",
      variable: {
        kind: "Variable",
        name: {
          kind: "Name",
          value: "properties"
        }
      },
      type: {
        kind: "NonNullType",
        type: {
          kind: "ListType",
          type: {
            kind: "NonNullType",
            type: {
              kind: "NamedType",
              name: {
                kind: "Name",
                value: "String"
              }
            }
          }
        }
      }
    }, {
      kind: "VariableDefinition",
      variable: {
        kind: "Variable",
        name: {
          kind: "Name",
          value: "stageId"
        }
      },
      type: {
        kind: "NonNullType",
        type: {
          kind: "NamedType",
          name: {
            kind: "Name",
            value: "String"
          }
        }
      }
    }],
    selectionSet: {
      kind: "SelectionSet",
      selections: [{
        kind: "Field",
        name: {
          kind: "Name",
          value: "crmObject"
        },
        arguments: [{
          kind: "Argument",
          name: {
            kind: "Name",
            value: "type"
          },
          value: {
            kind: "Variable",
            name: {
              kind: "Name",
              value: "objectTypeId"
            }
          }
        }, {
          kind: "Argument",
          name: {
            kind: "Name",
            value: "id"
          },
          value: {
            kind: "Variable",
            name: {
              kind: "Name",
              value: "objectId"
            }
          }
        }],
        selectionSet: {
          kind: "SelectionSet",
          selections: [{
            kind: "FragmentSpread",
            name: {
              kind: "Name",
              value: "CrmObjectFragment"
            }
          }]
        }
      }, {
        kind: "Field",
        name: {
          kind: "Name",
          value: "pipelineStage"
        },
        arguments: [{
          kind: "Argument",
          name: {
            kind: "Name",
            value: "objectType"
          },
          value: {
            kind: "Variable",
            name: {
              kind: "Name",
              value: "objectTypeId"
            }
          }
        }, {
          kind: "Argument",
          name: {
            kind: "Name",
            value: "stageId"
          },
          value: {
            kind: "Variable",
            name: {
              kind: "Name",
              value: "stageId"
            }
          }
        }],
        selectionSet: {
          kind: "SelectionSet",
          selections: [{
            kind: "Field",
            name: {
              kind: "Name",
              value: "stageId"
            }
          }, {
            kind: "Field",
            name: {
              kind: "Name",
              value: "propertyValueRequirements"
            },
            selectionSet: {
              kind: "SelectionSet",
              selections: [{
                kind: "Field",
                alias: {
                  kind: "Name",
                  value: "property"
                },
                name: {
                  kind: "Name",
                  value: "propertyName"
                }
              }, {
                kind: "Field",
                alias: {
                  kind: "Name",
                  value: "required"
                },
                name: {
                  kind: "Name",
                  value: "isValueRequired"
                }
              }, {
                kind: "Field",
                name: {
                  kind: "Name",
                  value: "propertyValueForObject"
                },
                arguments: [{
                  kind: "Argument",
                  name: {
                    kind: "Name",
                    value: "objectId"
                  },
                  value: {
                    kind: "Variable",
                    name: {
                      kind: "Name",
                      value: "objectId"
                    }
                  }
                }],
                selectionSet: {
                  kind: "SelectionSet",
                  selections: [{
                    kind: "Field",
                    name: {
                      kind: "Name",
                      value: "id"
                    }
                  }, {
                    kind: "Field",
                    name: {
                      kind: "Name",
                      value: "name"
                    }
                  }, {
                    kind: "Field",
                    name: {
                      kind: "Name",
                      value: "value"
                    }
                  }]
                }
              }]
            }
          }]
        }
      }]
    }
  }].concat(CrmObjectFragment.definitions))
});
export var EditStagePropertiesModalWrapper = function EditStagePropertiesModalWrapper() {
  var queryProperties = useQueryProperties();

  var _useModalData = useModalData(),
      objectTypeId = _useModalData.objectTypeId,
      objectId = _useModalData.objectId,
      stageId = _useModalData.stageId;

  var _useQuery = useQuery(GetDataForStagePropertiesModal, {
    variables: {
      objectTypeId: objectTypeId,
      objectId: objectId,
      stageId: stageId,
      properties: queryProperties
    }
  }),
      data = _useQuery.data,
      loading = _useQuery.loading,
      error = _useQuery.error;

  if (loading || error || !data) {
    return null;
  }

  return /*#__PURE__*/_jsx(EditStagePropertiesModal, {
    objectTypeId: objectTypeId,
    objectId: objectId,
    stageId: stageId,
    data: data
  });
};
export default EditStagePropertiesModalWrapper;