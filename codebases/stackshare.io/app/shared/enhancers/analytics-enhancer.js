const log = require('debug')('analytics');
import React, {useContext} from 'react';

const DEFAULT_PAYLOAD = {};
export const AnalyticsContext = React.createContext(DEFAULT_PAYLOAD);

function internalSendAnalyticsEvent(name, payload, depth = 0) {
  log(name, payload);
  if (typeof window !== 'undefined') {
    if (typeof window.trackEvent === 'function') {
      window.trackEvent(name, payload);
    } else {
      if (depth < 30) {
        // try again in 1 sec; this allows segment to fully bootstrap
        setTimeout(() => internalSendAnalyticsEvent(name, payload, depth + 1), 1000);
      } else {
        // eslint-disable-next-line no-console
        console.warn('internalSendAnalyticsEvent backoff limit reached', name, payload);
      }
    }
  }
}

function merge(p1 = {}, p2 = {}) {
  return {
    ...p1,
    ...p2
  };
}

export function withSendAnalyticsEvent(Component) {
  return function AnalyticsSendEvent(props) {
    return (
      <AnalyticsContext.Consumer>
        {parentPayload => (
          <Component
            {...props}
            sendAnalyticsEvent={(name, payload = {}) =>
              internalSendAnalyticsEvent(name, merge(parentPayload, payload))
            }
          />
        )}
      </AnalyticsContext.Consumer>
    );
  };
}

export const useSendAnalyticsEvent = () => {
  const parentPayload = useContext(AnalyticsContext);
  return (name, payload = {}) => internalSendAnalyticsEvent(name, merge(parentPayload, payload));
};

export function withAnalyticsPayload(payload) {
  return function(Component) {
    return function AnalyticsPayload(props) {
      return (
        <AnalyticsContext.Consumer>
          {parentPayload => (
            <AnalyticsContext.Provider
              value={merge(parentPayload, merge(payload, props.analyticsPayload))} // eslint-disable-line react/prop-types
            >
              <Component {...props} />
            </AnalyticsContext.Provider>
          )}
        </AnalyticsContext.Consumer>
      );
    };
  };
}
