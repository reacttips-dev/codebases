'use es6';

export default (function () {
  return import(
  /* webpackChunkName: "bulk-enroll-in-sequence-prompt" */
  'crm-index-ui/crm_ui/sequences/BulkEnrollInSequencePrompt').then(function (mod) {
    return mod.default;
  });
});