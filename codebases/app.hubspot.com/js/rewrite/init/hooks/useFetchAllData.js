'use es6';

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

import { FAILED, PENDING, SUCCEEDED, UNINITIALIZED } from '../../constants/RequestStatus';
import { useFetchPinnedViews } from '../../pinnedViews/hooks/useFetchPinnedViews';
import { useFetchProperties } from '../../properties/hooks/useFetchProperties';
import { useFetchViews } from '../../views/hooks/useFetchViews';
import { useQuery } from '@apollo/client';
import { useSelectedObjectTypeId } from '../../../objectTypeIdContext/hooks/useSelectedObjectTypeId';
import { AssociationDefinitionsFragment } from '../../associations/hooks/useAssociationsForCurrentType';
import { PipelineFragment } from '../../pipelines/hooks/usePipelines';
import { RequirementsFragment } from '../../objectRequirements/hooks/useObjectRequirements';
import { useFetchRecordCard } from '../../recordCards/hooks/useFetchRecordCard';
import { useCurrentPageType } from '../../views/hooks/useCurrentPageType';
import { BOARD } from '../../views/constants/PageType';
import { OBJECT_BOARD } from '../../recordCards/constants/RecordCardLocations';
import { setupCurrentOwnerContainer } from '../../../setup/setupCurrentOwnerContainer';
import { PortalSettingsFragment } from '../../portalSettings/hooks/usePortalSettings';
import { PropertyGroupFragment } from '../../propertyGroups/hooks/usePropertyGroups';
import { MultiCurrencyFragment } from '../../multiCurrency/hooks/useMultiCurrencySetting';
import getIn from 'transmute/getIn';
import { getPortalSettingsToFetch } from '../../portalSettings/constants/PortalSettingsKeys';
import PortalIdParser from 'PortalIdParser';
import { UserSettingsFragment } from '../../userSettings/hooks/useUserSettings';
import { getUserSettingsToFetch } from '../../userSettings/constants/UserSettingsKeys';
import { ObjectTypeDefinitionFragment } from '../../../crmObjects/hooks/useObjectTypeDefinitions';
var portalId = PortalIdParser.get(); // NOTE: This is used to prefetch required data for the page. To avoid drilling the data
// down many levels as props, we pull the data out of the cache via useQuery calls with
// a fetchPolicy of "cache-only". See usePipelines or useObjectRequirements for an example of this.
// This is why we use fragments instead of writing the entire query up here - it keeps
// the data we fetch and the data we use in sync.
// Please do not change the name of this query! It will break the graphql quick fetch
// unless you go change it there too. That file lives here:
// https://git.hubteam.com/HubSpot/CRM/blob/master/crm-index-ui/static/js/quick-fetch/graphqlQuickFetch.js

var PageDataQuery = ("__gql__", "{\"kind\":\"Document\",\"definitions\":[{\"kind\":\"OperationDefinition\",\"operation\":\"query\",\"name\":{\"kind\":\"Name\",\"value\":\"PageDataQuery\"},\"variableDefinitions\":[{\"kind\":\"VariableDefinition\",\"variable\":{\"kind\":\"Variable\",\"name\":{\"kind\":\"Name\",\"value\":\"objectTypeId\"}},\"type\":{\"kind\":\"NonNullType\",\"type\":{\"kind\":\"NamedType\",\"name\":{\"kind\":\"Name\",\"value\":\"String\"}}}},{\"kind\":\"VariableDefinition\",\"variable\":{\"kind\":\"Variable\",\"name\":{\"kind\":\"Name\",\"value\":\"portalSettingsKeys\"}},\"type\":{\"kind\":\"NonNullType\",\"type\":{\"kind\":\"ListType\",\"type\":{\"kind\":\"NonNullType\",\"type\":{\"kind\":\"NamedType\",\"name\":{\"kind\":\"Name\",\"value\":\"String\"}}}}}},{\"kind\":\"VariableDefinition\",\"variable\":{\"kind\":\"Variable\",\"name\":{\"kind\":\"Name\",\"value\":\"userSettingsKeys\"}},\"type\":{\"kind\":\"NonNullType\",\"type\":{\"kind\":\"ListType\",\"type\":{\"kind\":\"NonNullType\",\"type\":{\"kind\":\"NamedType\",\"name\":{\"kind\":\"Name\",\"value\":\"String\"}}}}}}],\"selectionSet\":{\"kind\":\"SelectionSet\",\"selections\":[{\"kind\":\"Field\",\"name\":{\"kind\":\"Name\",\"value\":\"viewer\"},\"selectionSet\":{\"kind\":\"SelectionSet\",\"selections\":[{\"kind\":\"Field\",\"name\":{\"kind\":\"Name\",\"value\":\"ownerId\"}}]}},{\"kind\":\"Field\",\"name\":{\"kind\":\"Name\",\"value\":\"allObjectTypes\"},\"selectionSet\":{\"kind\":\"SelectionSet\",\"selections\":[{\"kind\":\"FragmentSpread\",\"name\":{\"kind\":\"Name\",\"value\":\"ObjectTypeDefinitionFragment\"}}]}},{\"kind\":\"Field\",\"name\":{\"kind\":\"Name\",\"value\":\"homeCurrency\"},\"selectionSet\":{\"kind\":\"SelectionSet\",\"selections\":[{\"kind\":\"FragmentSpread\",\"name\":{\"kind\":\"Name\",\"value\":\"MultiCurrencyFragment\"}}]}},{\"kind\":\"Field\",\"name\":{\"kind\":\"Name\",\"value\":\"allPropertyGroups\"},\"arguments\":[{\"kind\":\"Argument\",\"name\":{\"kind\":\"Name\",\"value\":\"type\"},\"value\":{\"kind\":\"Variable\",\"name\":{\"kind\":\"Name\",\"value\":\"objectTypeId\"}}}],\"selectionSet\":{\"kind\":\"SelectionSet\",\"selections\":[{\"kind\":\"FragmentSpread\",\"name\":{\"kind\":\"Name\",\"value\":\"PropertyGroupFragment\"}}]}},{\"kind\":\"Field\",\"name\":{\"kind\":\"Name\",\"value\":\"allPipelines\"},\"arguments\":[{\"kind\":\"Argument\",\"name\":{\"kind\":\"Name\",\"value\":\"objectType\"},\"value\":{\"kind\":\"Variable\",\"name\":{\"kind\":\"Name\",\"value\":\"objectTypeId\"}}}],\"selectionSet\":{\"kind\":\"SelectionSet\",\"selections\":[{\"kind\":\"FragmentSpread\",\"name\":{\"kind\":\"Name\",\"value\":\"PipelineFragment\"}}]}},{\"kind\":\"Field\",\"name\":{\"kind\":\"Name\",\"value\":\"allCrmObjectRequirements\"},\"arguments\":[{\"kind\":\"Argument\",\"name\":{\"kind\":\"Name\",\"value\":\"objectTypeId\"},\"value\":{\"kind\":\"Variable\",\"name\":{\"kind\":\"Name\",\"value\":\"objectTypeId\"}}}],\"selectionSet\":{\"kind\":\"SelectionSet\",\"selections\":[{\"kind\":\"FragmentSpread\",\"name\":{\"kind\":\"Name\",\"value\":\"RequirementsFragment\"}}]}},{\"kind\":\"Field\",\"name\":{\"kind\":\"Name\",\"value\":\"allAssociationTypesFromObjectType\"},\"arguments\":[{\"kind\":\"Argument\",\"name\":{\"kind\":\"Name\",\"value\":\"objectType\"},\"value\":{\"kind\":\"Variable\",\"name\":{\"kind\":\"Name\",\"value\":\"objectTypeId\"}}}],\"selectionSet\":{\"kind\":\"SelectionSet\",\"selections\":[{\"kind\":\"FragmentSpread\",\"name\":{\"kind\":\"Name\",\"value\":\"AssociationDefinitionsFragment\"}}]}},{\"kind\":\"Field\",\"name\":{\"kind\":\"Name\",\"value\":\"hubSettingValues\"},\"arguments\":[{\"kind\":\"Argument\",\"name\":{\"kind\":\"Name\",\"value\":\"names\"},\"value\":{\"kind\":\"Variable\",\"name\":{\"kind\":\"Name\",\"value\":\"portalSettingsKeys\"}}}],\"selectionSet\":{\"kind\":\"SelectionSet\",\"selections\":[{\"kind\":\"FragmentSpread\",\"name\":{\"kind\":\"Name\",\"value\":\"PortalSettingsFragment\"}}]}},{\"kind\":\"Field\",\"name\":{\"kind\":\"Name\",\"value\":\"userAttributeValues\"},\"arguments\":[{\"kind\":\"Argument\",\"name\":{\"kind\":\"Name\",\"value\":\"keys\"},\"value\":{\"kind\":\"Variable\",\"name\":{\"kind\":\"Name\",\"value\":\"userSettingsKeys\"}}}],\"selectionSet\":{\"kind\":\"SelectionSet\",\"selections\":[{\"kind\":\"FragmentSpread\",\"name\":{\"kind\":\"Name\",\"value\":\"UserSettingsFragment\"}}]}}]}}]}", {
  id: null,
  kind: "Document",
  definitions: _unique([{
    kind: "OperationDefinition",
    operation: "query",
    name: {
      kind: "Name",
      value: "PageDataQuery"
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
          value: "portalSettingsKeys"
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
          value: "userSettingsKeys"
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
    }],
    selectionSet: {
      kind: "SelectionSet",
      selections: [{
        kind: "Field",
        name: {
          kind: "Name",
          value: "viewer"
        },
        selectionSet: {
          kind: "SelectionSet",
          selections: [{
            kind: "Field",
            name: {
              kind: "Name",
              value: "ownerId"
            }
          }]
        }
      }, {
        kind: "Field",
        name: {
          kind: "Name",
          value: "allObjectTypes"
        },
        selectionSet: {
          kind: "SelectionSet",
          selections: [{
            kind: "FragmentSpread",
            name: {
              kind: "Name",
              value: "ObjectTypeDefinitionFragment"
            }
          }]
        }
      }, {
        kind: "Field",
        name: {
          kind: "Name",
          value: "homeCurrency"
        },
        selectionSet: {
          kind: "SelectionSet",
          selections: [{
            kind: "FragmentSpread",
            name: {
              kind: "Name",
              value: "MultiCurrencyFragment"
            }
          }]
        }
      }, {
        kind: "Field",
        name: {
          kind: "Name",
          value: "allPropertyGroups"
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
        }],
        selectionSet: {
          kind: "SelectionSet",
          selections: [{
            kind: "FragmentSpread",
            name: {
              kind: "Name",
              value: "PropertyGroupFragment"
            }
          }]
        }
      }, {
        kind: "Field",
        name: {
          kind: "Name",
          value: "allPipelines"
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
        }],
        selectionSet: {
          kind: "SelectionSet",
          selections: [{
            kind: "FragmentSpread",
            name: {
              kind: "Name",
              value: "PipelineFragment"
            }
          }]
        }
      }, {
        kind: "Field",
        name: {
          kind: "Name",
          value: "allCrmObjectRequirements"
        },
        arguments: [{
          kind: "Argument",
          name: {
            kind: "Name",
            value: "objectTypeId"
          },
          value: {
            kind: "Variable",
            name: {
              kind: "Name",
              value: "objectTypeId"
            }
          }
        }],
        selectionSet: {
          kind: "SelectionSet",
          selections: [{
            kind: "FragmentSpread",
            name: {
              kind: "Name",
              value: "RequirementsFragment"
            }
          }]
        }
      }, {
        kind: "Field",
        name: {
          kind: "Name",
          value: "allAssociationTypesFromObjectType"
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
        }],
        selectionSet: {
          kind: "SelectionSet",
          selections: [{
            kind: "FragmentSpread",
            name: {
              kind: "Name",
              value: "AssociationDefinitionsFragment"
            }
          }]
        }
      }, {
        kind: "Field",
        name: {
          kind: "Name",
          value: "hubSettingValues"
        },
        arguments: [{
          kind: "Argument",
          name: {
            kind: "Name",
            value: "names"
          },
          value: {
            kind: "Variable",
            name: {
              kind: "Name",
              value: "portalSettingsKeys"
            }
          }
        }],
        selectionSet: {
          kind: "SelectionSet",
          selections: [{
            kind: "FragmentSpread",
            name: {
              kind: "Name",
              value: "PortalSettingsFragment"
            }
          }]
        }
      }, {
        kind: "Field",
        name: {
          kind: "Name",
          value: "userAttributeValues"
        },
        arguments: [{
          kind: "Argument",
          name: {
            kind: "Name",
            value: "keys"
          },
          value: {
            kind: "Variable",
            name: {
              kind: "Name",
              value: "userSettingsKeys"
            }
          }
        }],
        selectionSet: {
          kind: "SelectionSet",
          selections: [{
            kind: "FragmentSpread",
            name: {
              kind: "Name",
              value: "UserSettingsFragment"
            }
          }]
        }
      }]
    }
  }].concat(ObjectTypeDefinitionFragment.definitions, MultiCurrencyFragment.definitions, PropertyGroupFragment.definitions, PipelineFragment.definitions, RequirementsFragment.definitions, AssociationDefinitionsFragment.definitions, PortalSettingsFragment.definitions, UserSettingsFragment.definitions))
}); // HACK: GlobalCurrentOwnerContainer is used in the legacy object creator and the
// "create tasks" bulk action. Both live in crm_ui and the usage is deeply nested,
// so it's not really possible to make this a prop. If/when those are both refactored
// to a modern style, this setup step can be removed.

var syncOwnerId = function syncOwnerId(data) {
  return setupCurrentOwnerContainer(undefined, // The function expects auth data but does not use it.
  getIn(['viewer', 'ownerId'], data));
};

export var useFetchAllData = function useFetchAllData() {
  var objectTypeId = useSelectedObjectTypeId();

  var _useQuery = useQuery(PageDataQuery, {
    variables: {
      objectTypeId: objectTypeId,
      portalSettingsKeys: getPortalSettingsToFetch(),
      userSettingsKeys: getUserSettingsToFetch(objectTypeId, portalId)
    },
    onCompleted: syncOwnerId
  }),
      dataQueryLoading = _useQuery.loading,
      dataQueryError = _useQuery.error;

  var propertiesFetchStatus = useFetchProperties();
  var viewsFetchStatus = useFetchViews();
  var pinnedViewsFetchStatus = useFetchPinnedViews();
  var pageType = useCurrentPageType();
  var isBoard = pageType === BOARD;
  var rawRecordCardsFetchStatus = useFetchRecordCard(OBJECT_BOARD, !isBoard);
  var recordCardsFetchStatus = isBoard ? rawRecordCardsFetchStatus : SUCCEEDED;
  var error = dataQueryError || [propertiesFetchStatus, viewsFetchStatus, pinnedViewsFetchStatus, recordCardsFetchStatus].some(function (status) {
    return status === FAILED;
  });
  var loading = dataQueryLoading || [propertiesFetchStatus, viewsFetchStatus, pinnedViewsFetchStatus, recordCardsFetchStatus].some(function (status) {
    return [UNINITIALIZED, PENDING].includes(status);
  });
  return {
    loading: loading,
    error: error,
    dataQueryError: dataQueryError
  };
};