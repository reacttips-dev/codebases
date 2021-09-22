import createCache, { StylisPlugin, EmotionCache } from '@emotion/cache';

import { prefixer } from 'stylis';
import rtlPlugin from 'stylis-plugin-rtl';

const cacheKey = 'css';

const RTLCache = createCache({
  key: cacheKey,
  stylisPlugins: [rtlPlugin, prefixer as unknown] as Array<StylisPlugin>,
});

const LTRCache = createCache({
  key: cacheKey,
  stylisPlugins: [prefixer as unknown] as Array<StylisPlugin>,
});

export default (
  direction?: 'ltr' | 'rtl'
): { cacheKey: string; cache: EmotionCache } => {
  if (direction === 'rtl') {
    return { cache: RTLCache, cacheKey };
  }

  return { cache: LTRCache, cacheKey };
};
