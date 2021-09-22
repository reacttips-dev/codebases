import React from 'react';

import { EmotionCache } from '@emotion/cache';
import { CacheProvider } from '@emotion/react';

/**
 * Provide custom cache for emotion based on locale. The RTL cache includes
 * the RTL plugin https://github.com/styled-components/stylis-plugin-rtl
 * for automatically flipping rules for right-to-left locales.
 */
const EmotionCacheProvider: React.FC<{ value: EmotionCache }> = ({
  value,
  children,
}) => <CacheProvider value={value}>{children}</CacheProvider>;

export default EmotionCacheProvider;
