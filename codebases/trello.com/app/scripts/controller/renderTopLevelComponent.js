import BluebirdPromise from 'bluebird';
import { renderComponent } from 'app/src/components/ComponentWrapper';
import { getSpinner } from 'app/src/getSpinner';

/**
 * Renders a top-level component, suitable for rendering an entire page of
 * React content from a Controller method.
 *
 * - Any previous top-level view (either React or Backbone) will be safely
 *   disposed of first.
 * - You can provide an optional `loader` Promise that will cause the spinner
 *   to continue showing while any async tasks (data fetching, etc.) are
 *   completed.
 *
 * @param {React.Element} component The React component to be rendered
 * @param {BluebirdPromise} loader An optional Promise to wait for while showing the spinner
 * @returns {BluebirdPromise} A promise that resolves after the component has been rendered
 *
 * @example
 * import { renderTopLevelComponent } from 'app/scripts/controller/renderTopLevelComponent'
 * // Add a route handler
 * routes: [
 *   '/some-path', 'someRouteHandler'
 * ],
 *
 * someRouteHandler() {
 *   // Render a top-level React tree!
 *   renderTopLevelComponent(<SomeComponent />);
 *
 *   // If you need to show the spinner while some additional work happens,
 *   // pass a Promise that resolves when the async work is done
 *   renderTopLevelComponent(<SomeComponent />, new Promise((resolve, reject) => {
 *     // Let's pretend this is data fetching
 *     setTimeout(resolve, 2000);
 *   });
 * }
 */
export const renderTopLevelComponent = (
  component,
  loader = BluebirdPromise.resolve(),
) => {
  // Dependency required at call site to avoid import cycles, do not lift to top of module
  const { ModelLoader } = require('app/scripts/db/model-loader');
  // Dependency required at call site to avoid import cycles, do not lift to top of module
  const { Controller } = require('app/scripts/controller');

  return new BluebirdPromise((resolve, reject) => {
    BluebirdPromise.using(getSpinner(), () => {
      return BluebirdPromise.all([ModelLoader.await('headerData'), loader])
        .catch(reject)
        .then(() => {
          try {
            Controller.clearPreviousView({ isNextViewReact: true });
            Controller.showHeader();
            renderComponent(component, document.getElementById('content'));
          } catch (e) {
            return reject(e);
          }

          resolve();
        });
    });
  });
};
