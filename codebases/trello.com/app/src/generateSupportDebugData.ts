import { client } from '@trello/graphql';
import { asString } from '@trello/browser';
import { clientVersion } from '@trello/config';
import { ModelCache } from 'app/scripts/db/model-cache';
import { featureFlagClient } from '@trello/feature-flag-client';
import { defaultStore } from 'app/gamma/src/defaultStore';
import { rpc } from 'app/scripts/network/rpc';
import { importWithRetry } from '@trello/use-lazy-component';

enum SocketEventType {
  ALL = 'all',
  CONNECT = 'connect',
  RECONNECT = 'reconnect',
  CONNECTING = 'connecting',
  RECONNECTING = 'reconnecting',
  DISCONNECT = 'disconnect',
  CONNECT_FAILED = 'connect_failed',
  RECONNECT_FAILED = 'reconnect_failed',
  ERROR = 'error',
  DATA = 'data',
}

interface SocketEvent {
  eventType: SocketEventType;
  eventTime: string;
  eventData: object | string | null;
  timeSincePageLoadInSeconds: number;
}

const optionalSocketData: {
  eventLog: SocketEvent[];
} = {
  eventLog: [],
};

function addSocketEventToLog(
  eventType: SocketEventType,
  data: object | string,
) {
  optionalSocketData.eventLog.unshift({
    eventType,
    eventTime: new Date().toString(),
    eventData: data ? data : null,
    timeSincePageLoadInSeconds: performance.now() / 1000,
  });

  // Limit the event log to 1000 items to avoid a slow memory drain.
  optionalSocketData.eventLog = optionalSocketData.eventLog.slice(0, 1000);
}

interface ErrorDetails {
  errorTime: string;
  timeSincePageLoadInSeconds: number;
  error: Pick<ErrorEvent, 'message' | 'filename' | 'lineno' | 'colno'>;
}

const optionalErrorData: {
  log: ErrorDetails[];
} = {
  log: [],
};

function addUncaughtErrorToLog(event: ErrorEvent) {
  optionalErrorData.log.unshift({
    errorTime: new Date().toString(),
    timeSincePageLoadInSeconds: performance.now() / 1000,
    error: {
      message: event.message,
      filename: event.filename,
      lineno: event.lineno,
      colno: event.colno,
    },
  });

  // Limit the event log to 1000 items to avoid a slow memory drain.
  optionalErrorData.log = optionalErrorData.log.slice(0, 1000);
}

const OPTIONAL_DEBUG_EVENTS_FLAG_KEY = 'fep.optional-debug-events';

const subscribeToAllSocketEvents = () => {
  if (rpc.isUsingSocket && rpc.rpcSocket && rpc.rpcSocket.on) {
    // From the Backbone docs: Callbacks bound to the special "all" event will be triggered when any event occurs, and
    // are passed the name of the event as the first argument.
    rpc.rpcSocket.on(SocketEventType.ALL, addSocketEventToLog);
  }
};

const unsubscribeFromAllSocketEvents = () => {
  if (rpc.isUsingSocket && rpc.rpcSocket && rpc.rpcSocket.off) {
    // By passing `null` to off(), we remover the `addEventToLog` callback for all events.
    rpc.rpcSocket.off(null, addSocketEventToLog);
  }
};

// It's worth noting that it's possible to miss the 'connect' event of the
// websocket. This happens when the LaunchDarkly feature flags aren't cached
// and the socket initializes quicker than the async resolution of the flags.
export const beginListeningForOptionalDebugEvents = () => {
  const isOptionalEventLoggingEnabled = featureFlagClient.get(
    OPTIONAL_DEBUG_EVENTS_FLAG_KEY,
    false,
  );

  if (isOptionalEventLoggingEnabled) {
    // If the websocket is already initialized at this point, then start listening to all events. Otherwise, wait for
    // the 'ready' event before we begin listening.
    if (rpc.isUsingSocket && rpc.rpcSocket && rpc.rpcSocket.on) {
      subscribeToAllSocketEvents();
    } else {
      rpc.on('ready', () => {
        subscribeToAllSocketEvents();
      });
    }

    window.addEventListener('error', addUncaughtErrorToLog);
  }

  featureFlagClient.on(OPTIONAL_DEBUG_EVENTS_FLAG_KEY, false, (nowEnabled) => {
    if (nowEnabled) {
      // If the websocket is already initialized at this point, then start listening to all events. Otherwise, wait for
      // the 'ready' event before we begin listening.
      if (rpc.isUsingSocket && rpc.rpcSocket && rpc.rpcSocket.on) {
        subscribeToAllSocketEvents();
      } else {
        rpc.on('ready', () => {
          subscribeToAllSocketEvents();
        });
      }

      window.addEventListener('error', addUncaughtErrorToLog);
    } else {
      unsubscribeFromAllSocketEvents();

      window.removeEventListener('error', addUncaughtErrorToLog);
    }
  });
};

export const generateSupportDebugData = () => {
  // Strip the "_events" property from the ModelCache because it contains
  // circular references and can't be stringified.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { _events, ...modelCacheWithoutEvents } = ModelCache as any;

  const supportDebugData = {
    meta: {
      browser: asString,
      features: featureFlagClient.all(),
      version: clientVersion,
      sessionStartTime: new Date(Date.now() - performance.now()).toString(),
      sessionDurationInSeconds: performance.now() / 1000,
      exportTime: new Date().toString(),
    },
    apolloCache: client.cache.extract(),
    modelCache: modelCacheWithoutEvents,
    reduxStore: defaultStore.getState(),
    errors: {
      ...optionalErrorData,
    },
    socket: {
      currentSubscriptions: rpc.currentSubscriptions,
      state:
        rpc.rpcSocket && rpc.rpcSocket.socket
          ? rpc.rpcSocket.socket.state
          : 'unknown',
      ...optionalSocketData,
    },
  };

  importWithRetry(
    () =>
      import(
        /* webpackChunkName: "download-support-debug-data" */ './downloadSupportDebugData'
      ),
  ).then(({ downloadSupportDebugData }) => {
    downloadSupportDebugData(supportDebugData);
  });

  return supportDebugData;
};
