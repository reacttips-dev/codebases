'use es6';

import http from 'hub-http/clients/apiClient';
import { CALL_META_PROPERTIES, CALL_ENGAGEMENT_PROPERTIES } from 'calling-client-interface/records/engagement/Engagement';
import { getEngagementPropertyValue } from 'calling-client-interface/records/engagement/getters';
import plainTextFromHTML from '../../utils/plainTextFromHTML';
export function requestFn(_ref) {
  var engagementId = _ref.engagementId,
      engagement = _ref.engagement;
  var savableProperties = [CALL_META_PROPERTIES.body, CALL_META_PROPERTIES.disposition, CALL_META_PROPERTIES.unknownVisitorConversation, CALL_ENGAGEMENT_PROPERTIES.activityType, CALL_ENGAGEMENT_PROPERTIES.followUpAction, CALL_ENGAGEMENT_PROPERTIES.productName, CALL_ENGAGEMENT_PROPERTIES.atMentionedOwnerIds].map(function (name) {
    var value = getEngagementPropertyValue(name, engagement) || null;

    if (value && name === CALL_META_PROPERTIES.body) {
      var textContent = plainTextFromHTML(value);
      value = textContent ? value : null;
    }

    return {
      name: name,
      value: value
    };
  });
  return http.put("engagements/v2/engagements/" + engagementId, {
    data: {
      properties: savableProperties
    },
    headers: {
      'X-Properties-Source': 'CRM_UI' // required for @mentions

    }
  });
}