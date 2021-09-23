'use es6';

import { jsx as _jsx } from "react/jsx-runtime";
import { AsyncComponentErrorHandler } from 'customer-data-sidebar/async';
import AsyncComponent from 'customer-data-ui-utilities/component/AsyncComponent';

function requirement(done) {
  import(
  /* webpackChunkName: "bet-BulkBETAssignButton" */
  'BizOpsCrmUIComponents/components/bulkActions/button/BulkBETAssignButton').then(function (mod) {
    return mod.default;
  }).then(done, AsyncComponentErrorHandler('bizops-bulk-bet-assign'));
}

export default function BulkBetAssignButtonContainerAsync(props) {
  return /*#__PURE__*/_jsx(AsyncComponent, {
    props: props,
    requirement: requirement
  });
}