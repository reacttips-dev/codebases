'use es6';

import _objectWithoutProperties from "@babel/runtime/helpers/esm/objectWithoutProperties";
import { jsx as _jsx } from "react/jsx-runtime";
import { useSelectedObjectTypeDef } from '../../crmObjects/hooks/useSelectedObjectTypeDef';
import { useHasAllScopes } from '../../rewrite/auth/hooks/useHasAllScopes';
import { useHasAllGates } from '../../rewrite/auth/hooks/useHasAllGates';

var BehaviorRenderer = function BehaviorRenderer(_ref) {
  var Component = _ref.Component,
      rest = _objectWithoutProperties(_ref, ["Component"]);

  var typeDef = useSelectedObjectTypeDef();
  var hasAllScopes = useHasAllScopes();
  var hasAllGates = useHasAllGates();
  return /*#__PURE__*/_jsx(Component, Object.assign({}, rest, {
    typeDef: typeDef,
    hasAllScopes: hasAllScopes,
    hasAllGates: hasAllGates
  }));
};

export default BehaviorRenderer;