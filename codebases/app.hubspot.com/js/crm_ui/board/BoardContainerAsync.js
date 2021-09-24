'use es6';

import { jsx as _jsx } from "react/jsx-runtime";
import AsyncComponent from 'customer-data-ui-utilities/component/AsyncComponent';
import UILoadingSpinner from 'UIComponents/loading/UILoadingSpinner';
import { AsyncComponentErrorHandler } from 'customer-data-sidebar/async';

function requirement(done) {
  import(
  /* webpackChunkName: "board" */
  './BoardContainer').then(function (mod) {
    return mod.default;
  }).then(done, AsyncComponentErrorHandler('board'));
}

export default function BoardContainerAsync(props) {
  return /*#__PURE__*/_jsx(AsyncComponent, {
    loadingContent: /*#__PURE__*/_jsx(UILoadingSpinner, {
      grow: true
    }),
    props: props,
    requirement: requirement
  });
}
export var WEBPACK_3_FORCE_MODULE_IMPORT = 1;