'use es6';

import Loadable from 'UIComponents/decorators/Loadable';
var AsyncViewSelectorPage = Loadable({
  loader: function loader() {
    return import(
    /* webpackChunkName: "view-selector-page" */
    '../../../viewSelectorPage/ViewSelectorPage').then(function (mod) {
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
export default AsyncViewSelectorPage;