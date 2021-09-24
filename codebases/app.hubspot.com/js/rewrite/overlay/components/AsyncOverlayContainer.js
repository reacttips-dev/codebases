'use es6';

import Loadable from 'UIComponents/decorators/Loadable';
var AsyncOverlayContainer = Loadable({
  loader: function loader() {
    return import(
    /* webpackChunkName: "overlay-container" */
    './OverlayContainer').then(function (mod) {
      return mod.default;
    });
  },
  LoadingComponent: function LoadingComponent() {
    return null;
  },
  ErrorComponent: function ErrorComponent() {
    return null;
  }
});
export default AsyncOverlayContainer;