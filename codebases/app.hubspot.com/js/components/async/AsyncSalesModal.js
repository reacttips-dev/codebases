'use es6';

import Loadable from 'UIComponents/decorators/Loadable';
import LoadingComponent from '../loadable/LoadingComponent';
import ErrorComponent from '../loadable/ErrorComponent';
export var SequenceEnrollmentRoot = Loadable({
  loader: function loader() {
    return import(
    /* webpackChunkName: "draft-sales-modal-bundle" */
    'sales-modal/roots/SequenceEnrollmentRoot');
  },
  LoadingComponent: LoadingComponent,
  ErrorComponent: ErrorComponent
});
export var SequenceEnrollmentRootDeprecated = Loadable({
  loader: function loader() {
    return import(
    /* webpackChunkName: "draft-sales-modal-bundle" */
    'sales-modal/roots/SequenceEnrollmentRootDeprecated');
  },
  LoadingComponent: LoadingComponent,
  ErrorComponent: ErrorComponent
});
export var SequenceBulkEnrollModalRoot = Loadable({
  loader: function loader() {
    return import(
    /* webpackChunkName: "draft-sales-modal-bundle" */
    'sales-modal/roots/SequenceBulkEnrollModalRoot');
  },
  LoadingComponent: LoadingComponent,
  ErrorComponent: ErrorComponent
});