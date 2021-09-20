import { EventEmitter } from 'events';
import { DESKTOP_EVENTS } from './desktop-events';
import { isDesktop, isWindows } from '@trello/browser';
import { desktopVersion } from '@trello/config';

export const isDesktopSpiCapable = () => isDesktop() && desktopVersion;
export const shouldHandleWindowsFrame = () =>
  isWindows() && isDesktopSpiCapable();

export enum KEYS {
  SUBSCRIPTIONS = 'subscriptions',
  MESSAGE_TARGET = 'messageTarget',
  BROWSER = 'browser',
  RENDERER = 'renderer',
}

class DesktopSpi extends EventEmitter {
  constructor() {
    super();
    if (isDesktopSpiCapable()) {
      this.subscribeToDesktopEvents();
      window.parent.addEventListener('message', this.receiveMessage, false);
    }
  }

  /**
   * Because spi-bridge.js is running as a preload script in
   * electron, messages it posts to the window will have the same origin -
   * trello.com, localhost:3000, etc. In order to prevent dispatching our
   * own events, we specifically check if there is a message_target field
   * and if the target is browser then we ignore it. If the target is
   * renderer then it is meant for this context.
   */
  validateIncoming = (message: MessageEvent): boolean => {
    const { origin, data } = message;
    if (
      origin === window.location.origin &&
      data &&
      data[KEYS.MESSAGE_TARGET] === KEYS.RENDERER
    ) {
      return true;
    }
    return false;
  };

  /**
   * Sends up a map of events to which we want to subscribe
   */
  subscribeToDesktopEvents() {
    this.sendMessage(KEYS.SUBSCRIPTIONS, DESKTOP_EVENTS);
  }

  /**
   * Post a message to the window's parent, handled in electron
   */
  //eslint-disable-next-line @typescript-eslint/no-explicit-any
  sendMessage(event: string, payload: any) {
    const message = {
      [event]: payload,
      [KEYS.MESSAGE_TARGET]: KEYS.BROWSER,
    };
    window.parent.postMessage(message, window.location.origin);
  }

  /**
   * Emits events received from the electron context, only if
   * they're valid. For example, the following message payload…
   *
   * {
   *   data: {
   *     "first-event": {
   *       "foo": "bar"
   *     },
   *     "second-event": {
   *       "baz": "buzz"
   *     }
   *   },
   *   …rest
   * }
   *
   * …will end up calling emit() twice:
   *
   * this.emit("first-event", { "foo": "bar" });
   * this.emit("second-event", { "baz": "buzz" });
   */
  receiveMessage = (message: MessageEvent) => {
    if (this.validateIncoming(message)) {
      const { data } = message;
      const { ...events } = data;
      for (const event in events) {
        if (Object.values(DESKTOP_EVENTS.TO_WEB).includes(event)) {
          this.emit(event, events[event]);
        }
      }
    }
  };
}

// export a singleton
// eslint-disable-next-line @trello/no-module-logic
export const desktopSpi = new DesktopSpi();
