/**
 * Initialize the Fluxible app.
 *
 * Takes care of the following:
 *   1. If there is an existing fluxible context on the page, use that
 *   2. If there is not an existing fluxible context on the page, create
 *      a new one.
 *
 * Usage:
 *
 * const SomeStore = require('path/to/SomeStore');
 * const SomeOtherStore = require('path/to/SomeOtherStore');
 *
 * module.exports = (fluxibleContext) => {
 * 	 return setupFluxibleApp(fluxibleContext, app => {
 * 	   app.registerStore(SomeStore);
 * 	   app.registerStore(SomeOtherStore);
 *
 *     return fluxibleContext;
 * 	 });
 * };
 */

import Fluxible from 'vendor/cnpm/fluxible.v0-4/index';

const setupFluxibleApp = (fluxibleContext, registerStoresFn) => {
  const existingContext = typeof fluxibleContext !== 'undefined' && !!fluxibleContext._app;
  const FluxibleApp = existingContext ? fluxibleContext._app : new Fluxible();
  let context;

  if (existingContext) {
    context = fluxibleContext;
  } else {
    context = FluxibleApp.createContext();
  }

  registerStoresFn(context._app);

  return context;
};

export default setupFluxibleApp;
