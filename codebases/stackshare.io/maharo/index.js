const log = require('debug')('ssr');
import renderComponents from './render';

// @see bootstrap.js for definition of window.renderComponent
// This is split out to be included in the head of the page so inline pre-rendered
// components can be registered before the bundles are loaded over the network

document.addEventListener(
  'DOMContentLoaded',
  renderComponents(() => window.__COMPONENT_RENDER_LIST__ || [], () => window.__COMPONENT_CONTEXT__)
);

// todo: consider wrapping tail args into a generic context object
export default function registerComponents(
  components,
  resolvers = {},
  defaults = {},
  middleware = []
) {
  if (typeof window.__COMPONENT_CONTEXT__ === 'undefined') {
    log('Initializing component context...');
    window.__COMPONENT_CONTEXT__ = [];
  }

  log('Setting component context for', Object.keys(components));
  window.__COMPONENT_CONTEXT__.push({components, resolvers, defaults, middleware});
}
