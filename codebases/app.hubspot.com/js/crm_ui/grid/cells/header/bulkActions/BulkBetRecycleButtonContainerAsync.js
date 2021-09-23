'use es6';

import { jsx as _jsx } from "react/jsx-runtime";
import { AsyncComponentErrorHandler } from 'customer-data-sidebar/async';
import AsyncComponent from 'customer-data-ui-utilities/component/AsyncComponent';

function requirement(done) {
  import(
  /* webpackChunkName: "bet-BulkBETRecycleButton" */
  'BizOpsCrmUIComponents/components/bulkActions/button/BulkBETRecycleButton').then(function (mod) {
    return mod.default;
  }).then(done, AsyncComponentErrorHandler('bizops-bulk-bet-recycle'));
}

export default function BulkBetRecycleButtonContainerAsync(props) {
  return /*#__PURE__*/_jsx(AsyncComponent, {
    props: props,
    requirement: requirement
  });
}