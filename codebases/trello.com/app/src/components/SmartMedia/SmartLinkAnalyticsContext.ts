import { createContext, useContext } from 'react';
import { SmartLinkAnalyticsContextType } from './types';

const defaultContext: SmartLinkAnalyticsContextType = {
  source: 'unknown',
};

const SmartLinkAnalyticsContext = createContext<SmartLinkAnalyticsContextType>(
  defaultContext,
);

const SmartLinkAnalyticsContextProvider = SmartLinkAnalyticsContext.Provider;
const SmartLinkAnalyticsContextConsumer = SmartLinkAnalyticsContext.Consumer;

const useSmartLinkAnalyticsContext = () =>
  useContext(SmartLinkAnalyticsContext);

export {
  SmartLinkAnalyticsContext,
  SmartLinkAnalyticsContextProvider,
  SmartLinkAnalyticsContextConsumer,
  useSmartLinkAnalyticsContext,
};
