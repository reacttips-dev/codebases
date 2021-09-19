import bootstrapOnClient from 'entrypoints/bootstrapOnClient';
import ApplicationRoot from 'containers/Root';
import { makeRoutes, storeOptions } from 'ecommerce/ecommerceAppConfig';
import { loadPolyfills } from 'helpers/polyfills';

loadPolyfills().then(() => bootstrapOnClient(ApplicationRoot, makeRoutes, { storeOptions }));

if (module.hot) {
  module.hot.accept();
}
