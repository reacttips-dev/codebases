'use es6';

import { jsx as _jsx } from "react/jsx-runtime";
import Loadable from 'UIComponents/decorators/Loadable';
import UILoadingSpinner from 'UIComponents/loading/UILoadingSpinner';
import FullPageError from '../../../errorBoundary/FullPageError';

var LoadingComponent = function LoadingComponent() {
  return /*#__PURE__*/_jsx(UILoadingSpinner, {
    grow: true,
    minHeight: 200
  });
};

export var loadBoard = function loadBoard() {
  return import(
  /* webpackChunkName: "index-page-board" */
  './IndexPageBoard').then(function (mod) {
    return mod.default;
  });
};
var AsyncIndexPageBoard = Loadable({
  loader: loadBoard,
  LoadingComponent: LoadingComponent,
  ErrorComponent: FullPageError
});
export default AsyncIndexPageBoard;