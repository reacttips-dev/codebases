'use es6';

import { jsx as _jsx } from "react/jsx-runtime";
import AsyncComponent from 'customer-data-ui-utilities/component/AsyncComponent';
import { AsyncComponentErrorHandler } from 'customer-data-sidebar/async';
import Promptable from 'UIComponents/decorators/Promptable';

function requirement(done) {
  import(
  /* webpackChunkName: "bulk-enroll-in-sequence-prompt" */
  'crm-index-ui/crm_ui/sequences/BulkEnrollInSequencePrompt').then(function (mod) {
    return mod.default;
  }).then(done, AsyncComponentErrorHandler('bulk-enroll-in-sequence-prompt'));
}

var BulkEnrollInSequencePromptAsync = function BulkEnrollInSequencePromptAsync(props) {
  return /*#__PURE__*/_jsx(AsyncComponent, {
    props: props,
    requirement: requirement
  });
};

export default Promptable(BulkEnrollInSequencePromptAsync);