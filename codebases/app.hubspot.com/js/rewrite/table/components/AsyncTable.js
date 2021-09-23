'use es6';

import { jsx as _jsx } from "react/jsx-runtime";
import Loadable from 'UIComponents/decorators/Loadable';
import UILoadingSpinner from 'UIComponents/loading/UILoadingSpinner';
import FullPageError from '../../../errorBoundary/FullPageError';
export var loadTable = function loadTable() {
  return import(
  /* webpackChunkName: "index-page-table" */
  '../../table/components/Table').then(function (mod) {
    return mod.default;
  });
};

var LoadingComponent = function LoadingComponent() {
  return /*#__PURE__*/_jsx(UILoadingSpinner, {
    grow: true
  });
};

var AsyncTable = Loadable({
  loader: loadTable,
  LoadingComponent: LoadingComponent,
  ErrorComponent: FullPageError
});
export default AsyncTable;