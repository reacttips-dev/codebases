'use es6';

import Loadable from 'UIComponents/decorators/Loadable';
export var loadBulkActionsContainer = function loadBulkActionsContainer() {
  return import(
  /* webpackChunkName: "bulk-actions-container" */
  './BulkActionsContainer').then(function (mod) {
    return mod.default;
  });
};
var AsyncBulkActionsContainer = Loadable({
  loader: loadBulkActionsContainer,
  LoadingComponent: function LoadingComponent() {
    return null;
  },
  ErrorComponent: function ErrorComponent() {
    return null;
  }
});
export default AsyncBulkActionsContainer;