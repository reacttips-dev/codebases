import { Analytics } from '@trello/atlassian-analytics';
import { featureFlagClient } from '@trello/feature-flag-client';
import { NetworkRequestEventAttributes } from './trelloFetch.types';

export const sendNetworkRequestEvent = (
  attributes?: NetworkRequestEventAttributes,
) => {
  const requestLoggingEnabled = featureFlagClient.get(
    'fep.send_network_requests_to_gas',
    false,
  );
  if (attributes?.source === 'graphql') {
    attributes.operationType = attributes.operationType || 'query';
  }
  if (requestLoggingEnabled) {
    Analytics.sendOperationalEvent({
      source: '@trello/fetch',
      action: 'sent',
      actionSubject: 'request',
      attributes,
    });
  }
};
