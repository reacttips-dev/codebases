'use es6';

import _objectWithoutProperties from "@babel/runtime/helpers/esm/objectWithoutProperties";
import { jsx as _jsx } from "react/jsx-runtime";
import { Map as ImmutableMap } from 'immutable';
import { DefaultDraftBlockRenderMap } from 'draft-js';
var plainDiv = {
  element: function element(props) {
    // eslint-disable-next-line react/prop-types
    var children = props.children,
        otherProps = _objectWithoutProperties(props, ["children"]);

    return /*#__PURE__*/_jsx("div", Object.assign({}, otherProps, {
      children: children
    }));
  }
};
export default ImmutableMap({
  'unstyled-align-left': plainDiv,
  'unstyled-align-center': plainDiv,
  'unstyled-align-right': plainDiv
}).merge(DefaultDraftBlockRenderMap);