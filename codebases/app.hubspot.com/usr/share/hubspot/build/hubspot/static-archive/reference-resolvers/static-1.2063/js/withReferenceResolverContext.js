'use es6';

import { jsx as _jsx } from "react/jsx-runtime";
import ReferenceResolversContext from './ReferenceResolversContext';
export default (function (Component) {
  var ComponentWithContext = function ComponentWithContext(props) {
    return /*#__PURE__*/_jsx(ReferenceResolversContext.Consumer, {
      children: function children(context) {
        return /*#__PURE__*/_jsx(Component, Object.assign({}, props, {
          referenceResolverContext: context
        }));
      }
    });
  };

  return ComponentWithContext;
});