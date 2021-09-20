import { loomApiKey } from '@trello/config';
import { isCypress } from '@trello/browser';
import { Analytics } from '@trello/atlassian-analytics';
import { sendErrorEvent } from '@trello/error-reporting';
import { Feature } from 'app/scripts/debug/constants';

interface SetupOptions {
  apiKey: string;
  environment?: string;
}

class RecordSDKBuilder {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  instance: any = undefined;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  promise: any = undefined;

  constructor() {
    // There seems to be an issue with the content security policy when run in
    // Cypress. If we want to test this feature in Cypress we should work with
    // the Loom team to figure out how to fix this
    if (isCypress()) {
      this.instance = {};
      return;
    }

    const setupOptions: SetupOptions = { apiKey: loomApiKey };
    // There are errors being thrown in older browsers from the Loom SDK that are
    // spiking ChunkLoadErrors due to being evaluated on import rather than use.
    // Create a new chunk / bundle for the Loom SDK to stop this.
    this.promise = import(
      /* webpackChunkName: "loom-sdk" */ '@loomhq/loom-sdk'
    ).then(({ setup, isSupported }) => {
      return isSupported().then(({ supported }) => {
        // isSupported checks browser support & if 3rd party cookies are enabled
        if (!supported) {
          return null;
        }

        return (
          setup(setupOptions)
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            .then((result: any) => {
              const { success } = result.status();
              if (!success) {
                // loom failed to load
                Analytics.sendOperationalEvent({
                  action: 'errored',
                  actionSubject: 'fetchLoomSDK',
                  source: 'videoRecordButton',
                });
              }
              return result;
            })
            .catch((err: Error) => {
              sendErrorEvent(err, {
                tags: {
                  ownershipArea: 'trello-teamplates',
                  feature: Feature.VideoRecordButton,
                },
              });
            })
        );
      });
    });
  }

  async waitOnInstance() {
    if (this.instance) {
      return this.instance;
    }

    const result = await this.promise;
    this.instance = result;
    return result;
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let recordSDK: any;
export const getRecordSDK = () => {
  if (recordSDK === undefined) {
    recordSDK = new RecordSDKBuilder();
  }

  return recordSDK;
};
