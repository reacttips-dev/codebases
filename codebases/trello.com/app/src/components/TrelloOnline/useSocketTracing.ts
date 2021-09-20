import { useEffect } from 'react';

import { Analytics } from '@trello/atlassian-analytics';
import { featureFlagClient } from '@trello/feature-flag-client';
import { analyticsUpdaterClient } from 'app/scripts/network/analytics-updater-client';
import { LiveUpdate } from 'app/scripts/init/live-updater';

interface TracedUpdate {
  delta: {
    traceId?: string;
    spanId?: string;
    type: string;
  };
}

const markAnalyticsTaskSucceeded = (update: LiveUpdate & TracedUpdate) => {
  const { typeName, delta } = update;

  if (
    featureFlagClient.get('dataeng.vitalstats-send-message', false) &&
    delta.traceId
  ) {
    Analytics.taskSucceeded({
      taskName: 'send-message',
      traceId: delta.traceId,
      spanId: delta.spanId,
      source: 'appStartup',
      attributes: {
        id: delta.id,
        actionType: delta.type,
        typeName,
      },
    });
  }
};

export const useSocketTracing = () => {
  useEffect(() => {
    analyticsUpdaterClient.subscribe(markAnalyticsTaskSucceeded);
  }, []);
};
