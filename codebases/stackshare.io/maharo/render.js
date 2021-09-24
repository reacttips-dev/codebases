const log = require('debug')('ssr');
import rehydrateGlamor from './glamor';
import wrapElementWithProvider from './providers';
import {hydrate, render} from 'react-dom';
import React from 'react';

export default function renderComponents(getRenderList, getGlobalContext) {
  return () => {
    const globalContext = getGlobalContext();
    if (!globalContext) {
      log('No components registered');
      return;
    }

    const renderList = getRenderList();
    renderList.forEach(({name, domId, stateId, styleId, provider, props}) => {
      const ctx = globalContext.find(ctx => Object.keys(ctx.components).includes(name));

      if (!ctx) {
        log(`Component "${name}" not registered!`);
        return;
      }

      // TODO: abstract style rehydration (possibly use data-style attr to switch rehydrator func)
      rehydrateGlamor(name, styleId);

      const element = React.createElement(ctx.components[name], props);
      const wrapper = wrapElementWithProvider(provider, element, stateId, ctx);

      if (wrapper) {
        const mount = document.getElementById(domId);

        if (mount) {
          if (mount.hasAttribute('data-ssr')) {
            log(`Hydrating "${name}" component...`);
            hydrate(wrapper, mount);
          } else {
            log(`Rendering "${name}" component...`);
            render(wrapper, mount);
          }
        } else {
          log(`DOM mount point "${domId}" not found!`);
        }
      }
    });
  };
}
