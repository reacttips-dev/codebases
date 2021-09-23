'use es6';

import { jsx as _jsx } from "react/jsx-runtime";
import Loadable from 'UIComponents/decorators/Loadable';
import SkeletonRTE from 'calling-lifecycle-internal/skeleton-states/components/SkeletonRTE';
import Error from './RTEErrorComponent';
var AsyncRTE = Loadable({
  loader: function loader() {
    return import(
    /* webpackChunkName: "rich-text-editor" */
    './RTEWithErrorBoundary');
  },
  LoadingComponent: function LoadingComponent() {
    return /*#__PURE__*/_jsx(SkeletonRTE, {});
  },
  ErrorComponent: function ErrorComponent(props) {
    return /*#__PURE__*/_jsx(Error, Object.assign({
      errorMessage: "unable to load chunk rich-text-editor"
    }, props));
  }
});
export default AsyncRTE;