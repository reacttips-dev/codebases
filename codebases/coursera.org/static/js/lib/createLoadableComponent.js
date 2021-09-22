// Small utility to make it easier to interop between `react-loadable` and the `lazy!` module loader.
// `react-loadable` expects a Promise for a module, which is difficult to keep working between both Require.JS and Webpack
// Webpack allows you to use the `import()` syntax, but that is not supported by Require.JS

import loadable from 'react-loadable';
import deferToClientSideRender from 'js/lib/deferToClientSideRender';

export default function createLoadableComponent(lazyComponentFactory, LoadingComponent) {
  let loader;
  // support createLoadableComponent(() => import('path'))
  if (typeof lazyComponentFactory === 'function' && lazyComponentFactory.length === 0) {
    // For calls like `createLoadableComponent(() => import('module-name'))`, absolves the caller of calling `.default` on the returned module.
    // However, this means we lose references to named exports from this component.
    loader = async () => (await lazyComponentFactory()).default;
    // throw error for incorrect usage
  } else if (lazyComponentFactory.then) {
    throw new Error(
      'Should not pass in a raw import(...) statement to `createLoadableComponent` as ' +
        'it will not lazily load the code! ' +
        'Please pass in a promise factory like `() => import(...) instead.'
    );
  } else {
    // support createLoadableComponent(require('lazy!path'))
    loader = () =>
      new Promise((resolve, reject) => {
        try {
          lazyComponentFactory((resolvedComponent) => {
            if (resolvedComponent.default) {
              resolve(resolvedComponent.default);
            } else {
              resolve(resolvedComponent);
            }
          });
        } catch (e) {
          reject(e);
        }
      });
  }
  return deferToClientSideRender(
    loadable({
      loader,
      loading: LoadingComponent || (() => null),
      // how long to wait until showing loading component
      delay: 100,
    })
  );
}
