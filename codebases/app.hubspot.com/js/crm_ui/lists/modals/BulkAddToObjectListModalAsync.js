'use es6';

import { jsx as _jsx } from "react/jsx-runtime";
import AsyncComponent from 'customer-data-ui-utilities/component/AsyncComponent';
import { AsyncComponentErrorHandler } from 'customer-data-sidebar/async';

function requirement(done) {
  import(
  /* webpackChunkName: "add-to-list" */
  'crm-index-ui/crm_ui/lists/modals/BulkAddToObjectListModal').then(function (mod) {
    return mod.default;
  }).then(done, AsyncComponentErrorHandler('add-to-list'));
}

export default function BulkAddToObjectListModalAsync(props) {
  return /*#__PURE__*/_jsx(AsyncComponent, {
    props: props,
    requirement: requirement
  });
}