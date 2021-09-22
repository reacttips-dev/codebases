import React from 'react';

import createEmotionCache from '@core/theme/createEmotionCache';

import EmotionCacheProvider from './EmotionCacheProvider';

const ClientSideEmotionCacheProvider: React.FC<{
  direction?: 'ltr' | 'rtl';
}> = ({ direction, children }) => {
  if (typeof window === 'undefined') {
    return <React.Fragment>{children}</React.Fragment>;
  }

  const { cache } = createEmotionCache(direction);
  return <EmotionCacheProvider value={cache}>{children}</EmotionCacheProvider>;
};

export default ClientSideEmotionCacheProvider;
