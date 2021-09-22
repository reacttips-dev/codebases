import Q from 'q';
import URI from 'jsuri';
import API from 'js/lib/api';

import { ChannelId } from 'bundles/realtime-messaging/types';

const RESOURCE_NAME = 'realtimeNotificationsInitializations.v1';

export const queryForInitializationData = (
  courseSlug: string
): Q.Promise<{ appKey: string; cluster: string; channels: Array<{ name: string; id: ChannelId }> }> => {
  const api = API(`/api/${RESOURCE_NAME}/`, { type: 'rest' });
  const uri = new URI().addQueryParam('action', 'queryForInitializationData');

  return Q(
    api.post(uri.toString(), {
      data: {
        courseSlug,
      },
    })
  ).then((response) => {
    const { channels, providerInitializationData } = response;
    const { appKey, cluster } = providerInitializationData[
      'org.coursera.realtime.notifications.init.PusherInitializationData'
    ];

    return { appKey, cluster, channels };
  });
};

export const authenticateWithRealtimeAPI = (socketId: string, channelName: string): Q.Promise<{ auth: string }> => {
  const api = API(`/api/${RESOURCE_NAME}/`, { type: 'rest' });
  const uri = new URI().addQueryParam('action', 'authenticate');

  /* eslint-disable camelcase */
  return Q(
    api.post(uri.toString(), {
      data: {
        socket_id: socketId,
        channel_name: channelName,
      },
    })
  );
  /* eslint-enable camelcase */
};
