'use es6';

import { jsx as _jsx } from "react/jsx-runtime";
import Loadable from 'UIComponents/decorators/Loadable';
import Error from '../components/GDPRErrorComponent';
import SkeletonGDPR from '../components/SkeletonGDPR';
var AsyncGDPRContainer = Loadable({
  loader: function loader() {
    return import(
    /* webpackChunkName: "gdpr-message" */
    './GDPRMessageContainer');
  },
  LoadingComponent: function LoadingComponent() {
    return /*#__PURE__*/_jsx(SkeletonGDPR, {});
  },
  ErrorComponent: function ErrorComponent(props) {
    return /*#__PURE__*/_jsx(Error, Object.assign({
      errorMessage: "unable to load chunk gdpr-message"
    }, props));
  }
});
export default AsyncGDPRContainer;