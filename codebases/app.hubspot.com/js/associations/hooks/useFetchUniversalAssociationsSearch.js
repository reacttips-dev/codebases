'use es6';

import { useMemo } from 'react';
import { useQuery } from '@apollo/client';
import { OrderedMap, Map as ImmutableMap } from 'immutable';
import { universalAssociationOptionComparator, parseUniversalEngagementAssociations } from 'universal-associations-select/helpers/parseUniversalEngagementAssociations';
import { CALL } from 'customer-data-objects/engagement/EngagementTypes';
import { ObjectTypeFromIds } from 'customer-data-objects/constants/ObjectTypeIds';
import { TICKET } from 'customer-data-objects/constants/ObjectTypes';
import { FETCH_UNIVERSAL_ENGAGEMENT_ASSOCIATIONS } from '../../graphQL/queries/fetchCommunicatorEngagementAssociations'; // TODO: add current callee association info if the callee isn't present in the initial response

export function useFetchUniversalEngagementAssociations(_ref) {
  var engagementId = _ref.engagementId,
      objectTypeId = _ref.objectTypeId,
      subjectId = _ref.subjectId,
      isUngatedForViewCommunicatePermissions = _ref.isUngatedForViewCommunicatePermissions;

  var _useQuery = useQuery(FETCH_UNIVERSAL_ENGAGEMENT_ASSOCIATIONS, {
    fetchPolicy: 'cache-and-network',
    partialRefetch: true,
    variables: {
      engagementExists: !!engagementId,
      engagementObjectId: engagementId || 0,
      engagementObjectTypeId: engagementId ? '0-48' : CALL,
      isTicket: ObjectTypeFromIds[objectTypeId] === TICKET,
      subjectObjectId: subjectId,
      subjectObjectTypeId: objectTypeId
    }
  }),
      data = _useQuery.data,
      loading = _useQuery.loading,
      error = _useQuery.error,
      variables = _useQuery.variables;

  var parsedAssociations = useMemo(function () {
    var parsedRecords = data && parseUniversalEngagementAssociations({
      data: data,
      variables: variables,
      isUngatedForViewCommunicatePermissions: isUngatedForViewCommunicatePermissions
    });

    if (!parsedRecords || !parsedRecords.size) {
      return OrderedMap();
    }

    return parsedRecords.map(function (record) {
      var defaultOptions = record.get('associationOptionRecords');
      var sortedDefaults = defaultOptions.sort(universalAssociationOptionComparator);
      return record.set('associationOptionRecords', sortedDefaults);
    });
  }, [data, variables, isUngatedForViewCommunicatePermissions]);
  var associations = useMemo(function () {
    return ImmutableMap({
      associations: parsedAssociations,
      loading: loading,
      error: error
    });
  }, [error, loading, parsedAssociations]);
  return associations;
}