'use es6';

import { jsx as _jsx } from "react/jsx-runtime";
import AsyncComponent from 'customer-data-ui-utilities/component/AsyncComponent';
import { AsyncComponentErrorHandler } from 'customer-data-sidebar/async';
import UILoadingSpinner from 'UIComponents/loading/UILoadingSpinner';

function requirement(done) {
  import(
  /* webpackChunkName: "data-grid" */
  'crm-index-ui/crm_ui/grid/QueryDataGridContainer').then(function (mod) {
    return mod.default;
  }).then(done, AsyncComponentErrorHandler('data-grid'));
}

export default function QueryDataGridContainerAsync(props) {
  return /*#__PURE__*/_jsx(AsyncComponent, {
    loadingContent: /*#__PURE__*/_jsx(UILoadingSpinner, {
      grow: true,
      "data-reason": "QueryDataGridContainerAsync: code split"
    }),
    props: props,
    requirement: requirement
  });
}
export var WEBPACK_3_FORCE_MODULE_IMPORT = 1;