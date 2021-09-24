import defaultProvider from './default';
import apolloProvider from './apollo';

export const PROVIDER_DEFAULT = 'default';
export const PROVIDER_APOLLO = 'apollo';

export default function wrapElementWithProvider(provider, element, stateId, ctx) {
  switch (provider) {
    case PROVIDER_DEFAULT:
      return defaultProvider(element, stateId, ctx);
    case PROVIDER_APOLLO:
      return apolloProvider(element, stateId, ctx);
    default:
      return null;
  }
}
