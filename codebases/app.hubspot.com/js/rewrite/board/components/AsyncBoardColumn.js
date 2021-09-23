'use es6';

import Loadable from 'UIComponents/decorators/Loadable';
export var loadBoardColumn = function loadBoardColumn() {
  return import(
  /* webpackChunkName: "index-page-board-column" */
  '../../../crm_ui/board/BoardColumn').then(function (mod) {
    return mod.default;
  });
};
var AsyncBoardColumn = Loadable({
  loader: loadBoardColumn,
  LoadingComponent: function LoadingComponent() {
    return null;
  },
  ErrorComponent: function ErrorComponent() {
    return null;
  }
});
export default AsyncBoardColumn;