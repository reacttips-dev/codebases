'use es6';

import prefetchChunks from './prefetchChunks';
export default prefetchChunks([function () {
  return import(
  /* webpackChunkName: "index-bundle" */
  'SequencesUI/containers/SequencesIndexContainer');
}, function () {
  return import(
  /* webpackChunkName: "builder-bundle" */
  'SequencesUI/components/create/SequenceCreate');
}, function () {
  return import(
  /* webpackChunkName: "builder-bundle" */
  'SequencesUI/containers/SequenceBuilderContainer');
}, function () {
  return import(
  /* webpackChunkName: "summary-bundle" */
  'SequencesUI/containers/SequenceSummarySearchContainer');
}, function () {
  return import(
  /* webpackChunkName: "draft-sales-modal-bundle" */
  'sales-modal/roots/SequenceEnrollmentRoot');
}, function () {
  return import(
  /* webpackChunkName: "draft-sales-modal-bundle" */
  'sales-modal/roots/SequenceEnrollmentRootDeprecated');
}, function () {
  return import(
  /* webpackChunkName: "draft-sales-modal-bundle" */
  'SequencesUI/components/edit/cards/ReadOnlyEditor');
}]);