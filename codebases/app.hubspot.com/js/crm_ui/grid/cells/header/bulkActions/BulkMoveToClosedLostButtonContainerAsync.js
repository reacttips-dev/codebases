'use es6';

import { jsx as _jsx } from "react/jsx-runtime";
import { AsyncComponentErrorHandler } from 'customer-data-sidebar/async';
import AsyncComponent from 'customer-data-ui-utilities/component/AsyncComponent';
import UILoadingSpinner from 'UIComponents/loading/UILoadingSpinner';

function requirement(done) {
  import(
  /* webpackChunkName: "bet-BulkMoveToClosedLostButton" */
  'BizOpsCrmUIComponents/components/bulkActions/button/BulkMoveToClosedLostButton').then(function (mod) {
    return mod.default;
  }).then(done, AsyncComponentErrorHandler('bizops-bulk-move-to-closed-lost-container'));
}

export default function BulkMoveToClosedLostButtonContainerAsync(props) {
  return /*#__PURE__*/_jsx(AsyncComponent, {
    loadingContent: /*#__PURE__*/_jsx(UILoadingSpinner, {
      grow: true
    }),
    props: props,
    requirement: requirement
  });
}