// @ts-ignore ts-migrate(7016) FIXME: Could not find a declaration file for module 'push... Remove this comment to see the full error message
import Pusher, { AuthorizerGenerator } from 'pusher-js';

import { authenticateWithRealtimeAPI, queryForInitializationData } from 'bundles/realtime-messaging/realtimeAPI';
import { ChannelId, UnformattedRealtimeMessage } from 'bundles/realtime-messaging/types';

type Channel = {
  name: string;
  id: ChannelId;
};

type InitializationData = {
  channels: Channel[];
  cluster: string;
  appKey: string;
};

// @ts-ignore ts-migrate(7031) FIXME: Binding element 'string' implicitly has an 'any' t... Remove this comment to see the full error message
type PusherAuthorizationCallback = (x: boolean, { auth: string }) => void;

class RealtimeMessagingManager {
  private socket?: Pusher | null;

  private courseSlug: string;

  private initializationData?: InitializationData;

  private onConnectionCallbacks: (() => void)[];

  isConnected: boolean;

  constructor(courseSlug: string) {
    this.courseSlug = courseSlug;
    this.isConnected = false;
    this.onConnectionCallbacks = [];
  }

  private async initializePusher() {
    this.disconnect();

    const data = await queryForInitializationData(this.courseSlug);

    const pusherAuthorizer: AuthorizerGenerator = (channel: $TSFixMe) => ({
      authorize: (socketId: string, callback: PusherAuthorizationCallback) => {
        authenticateWithRealtimeAPI(socketId, channel.name).then((authInfo) => {
          callback(false, authInfo);
        });
      },
    });

    const { appKey, cluster } = data;

    this.initializationData = data;

    this.socket = new Pusher(appKey, {
      cluster,
      authorizer: pusherAuthorizer,
    });

    return new Promise<void>((resolve, reject) => {
      this.socket?.connection.bind('connected', () => {
        this.isConnected = true;
        resolve();
      });

      this.socket?.connection.bind('failed', () => {
        this.isConnected = false;
        // Note: error descriptions pulled from
        // https://pusher.com/docs/channels/using_channels/connection#available-states
        reject(new Error('Channels are not supported by the current browser.'));
      });

      this.socket?.connection.bind('unavailable', () => {
        this.isConnected = false;
        reject(
          new Error(
            'The connection is temporarily unavailable (either due to disconnected internet or Pusher-side issues)'
          )
        );
      });
    });
  }

  async init() {
    if (!this.socket || !this.initializationData) {
      await this.initializePusher();
    }
  }

  async resetSubscriptionChannels() {
    return this.initializePusher();
  }

  async subscribeToChannel(channelName: string, messageHandler: (message: UnformattedRealtimeMessage) => void) {
    if (!this.socket) {
      await this.init();
    }

    const { channels = [] } = this.initializationData ?? {};

    return Promise.all(
      channels
        .filter(({ name }) => name === channelName)
        .map(({ id }: { id: ChannelId }) => {
          const subscription = this.socket?.subscribe(id);

          return new Promise<void>((resolve, reject) => {
            subscription?.bind('pusher:subscription_succeeded', () => {
              subscription?.bind('default', messageHandler);
              resolve();
            });

            subscription?.bind('pusher:subscription_error', (statusCode: $TSFixMe) => {
              reject(new Error(`Subscription failed with status code ${statusCode}`));
            });
          });
        })
    );
  }

  unsubscribe(channelName: string) {
    if (this.socket) {
      this.socket.unsubscribe(channelName);
    }
  }

  unsubscribeFromAll() {
    const channels = this.socket?.allChannels() ?? [];
    channels.forEach((channel: $TSFixMe) => this.unsubscribe(channel.name));
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }
}

export default RealtimeMessagingManager;
