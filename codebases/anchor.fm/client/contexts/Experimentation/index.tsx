import React, { useCallback, useEffect, useState } from 'react';
import {
  createInstance,
  OptimizelyProvider,
  ReactSDKClient,
} from '@optimizely/react-sdk';
import { uuid } from 'uuidv4';

import * as serverRenderingUtils from 'helpers/serverRenderingUtils';
import { useCurrentUserCtx } from 'contexts/CurrentUser';
import { localStorage } from 'modules/Browser/localStorage';
import { AnchorAPI } from 'modules/AnchorAPI';

declare global {
  interface Window {
    __OPTIMIZELY_API_KEY__: string;
    optimizelyClientInstance: ReactSDKClient;
  }
}

// @ts-ignore
// eslint-disable-next-line no-undef
const isDevelopment = BUILD_ENVIRONMENT.startsWith('development');
const environment = isDevelopment ? 'development' : 'production';
const platform = 'web';

const optimizelySdk = createInstance({
  sdkKey: window.__OPTIMIZELY_API_KEY__,
  // @ts-ignore - Optimizely types are wrong; set logLevel to `null` to stop logging: https://docs.developers.optimizely.com/full-stack/docs/customize-logger-react
  // eslint-disable-next-line no-undef
  logLevel: isDevelopment ? 'debug' : null,
  datafileOptions: {
    autoUpdate: true,
  },
});

if (window) {
  window.optimizelyClientInstance = optimizelySdk;
}

const OPTIMIZELY_INDEXEDDB_KEY = 'optimizely_partner_id';

export const ExperimentationProvider = ({
  children,
}: {
  children: JSX.Element;
}) => {
  const {
    state: {
      partnerIds: { optimizely: optimizelyPartnerId },
    },
  } = useCurrentUserCtx();

  const [geoLocation, setGeoLocation] = useState('N/A');
  const setLocalPartnerId = useCallback(() => {
    localStorage
      .getItem(OPTIMIZELY_INDEXEDDB_KEY)
      .then(optimizelyLocalPartnerId => {
        if (optimizelyLocalPartnerId) {
          optimizelySdk.setUser({
            id: optimizelyLocalPartnerId,
            attributes: {
              userId: optimizelyLocalPartnerId,
              environment,
              userCountry: geoLocation,
              platform,
            },
          });
        } else {
          const newLocalPartnerId = uuid();
          localStorage.setItem(OPTIMIZELY_INDEXEDDB_KEY, newLocalPartnerId);
          optimizelySdk.setUser({
            id: newLocalPartnerId,
            attributes: {
              userId: newLocalPartnerId,
              environment,
              userCountry: geoLocation,
              platform,
            },
          });
        }
      });
  }, [geoLocation]);

  useEffect(() => {
    // grab geo location for geotagging
    AnchorAPI.getGeoRegion()
      .then((data: any) => {
        if (data && data.geoCountry) setGeoLocation(data.geoCountry);
        else setGeoLocation('N/A');
      })
      .catch(() => {
        setGeoLocation('N/A');
      });
  }, []);

  useEffect(() => {
    const shouldSetLocalPartnerId =
      !optimizelySdk.user.id || !optimizelySdk.user.attributes?.userCountry;

    if (optimizelyPartnerId) {
      optimizelySdk.setUser({
        id: optimizelyPartnerId,
        attributes: {
          userId: optimizelyPartnerId,
          environment,
          userCountry: geoLocation,
          platform,
        },
      });
    } else if (shouldSetLocalPartnerId) {
      // Only set local partner ID if Optimizely user or country hasn't been set
      // before (prevents user being changed during hot reload)
      setLocalPartnerId();
    }
  }, [optimizelyPartnerId, setLocalPartnerId, geoLocation]);

  if (serverRenderingUtils.windowUndefined()) return children;

  return (
    <OptimizelyProvider optimizely={optimizelySdk} timeout={5000}>
      {children}
    </OptimizelyProvider>
  );
};
