import setPopoutChildState from '../actions/setPopoutChildState';
import { parseMessage, PopoutMessageType, postMessage } from './crossWindowMessenger';
import { PopoutChildState } from '../store/schema/PopoutChildStore';
import { getStore } from '../store/childStore';

let internalContinueGetData: () => void;
let bypassContinueGetDataFromParentWindow: boolean = false;

export function continueGetDataFromParentWindow() {
    setPopoutChildState(PopoutChildState.Loading);
    if (internalContinueGetData) {
        internalContinueGetData();
    } else {
        // continueGetDataFromParentWindow was called before getDataFromParentWindow.
        // In this case, set the bypassContinueGetDataFromParentWindow flag so that getDataFromParentWindow
        // knows that it does not need to await for continueGetDataFromParentWindow() to be called
        bypassContinueGetDataFromParentWindow = true;
    }
}

export default async function getDataFromParentWindow<T>(
    deserializer?: (source: string) => T
): Promise<T> {
    if (!bypassContinueGetDataFromParentWindow) {
        await new Promise<void>(resolve => {
            internalContinueGetData = () => {
                resolve();
            };
        });
    }

    return getStore().isPopoutV2
        ? new Promise<T>((resolve, reject) => {
              let onMessage = (e: MessageEvent) => {
                  let message = parseMessage(e);

                  if (message && message.type == PopoutMessageType.SetData) {
                      window.removeEventListener('message', onMessage);
                      let data: T;

                      try {
                          data = deserializer
                              ? deserializer(message.serializedData)
                              : (JSON.parse(message.serializedData) as T);
                      } catch {}

                      resolve(data);
                  }
              };

              window.addEventListener('message', onMessage);

              try {
                  let w = window.opener;
                  postMessage(w, PopoutMessageType.PopoutReady, null);
              } catch {
                  resolve(null);
              }
          })
        : Promise.resolve(null);
}
