'use es6';

import { makeGqlEarlyRequest } from 'apollo-link-hub-http/quickFetch';
import { parseObjectTypeIdFromPath } from '../rewrite/init/utils/parseObjectTypeIdFromPath';
import { isMigratedObjectTypeId } from '../rewrite/init/utils/isMigratedObjectTypeId';
import { getPortalSettingsToFetch } from '../rewrite/portalSettings/constants/PortalSettingsKeys';
import { getUserSettingsToFetch } from '../rewrite/userSettings/constants/UserSettingsKeys';
var portalId = window.quickFetch.getPortalId();
var objectTypeId = parseObjectTypeIdFromPath(window.location.pathname);

if (isMigratedObjectTypeId(objectTypeId)) {
  makeGqlEarlyRequest({
    url: window.quickFetch.getApiUrl('/graphql/crm'),
    operation: {
      operationName: 'PageDataQuery',
      query: importGql('PageDataQuery'),
      variables: {
        objectTypeId: objectTypeId,
        portalSettingsKeys: getPortalSettingsToFetch(),
        userSettingsKeys: getUserSettingsToFetch(objectTypeId, portalId)
      }
    }
  });
}