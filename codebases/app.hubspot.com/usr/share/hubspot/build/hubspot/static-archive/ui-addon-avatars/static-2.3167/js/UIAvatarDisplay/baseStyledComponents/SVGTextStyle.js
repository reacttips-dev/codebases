'use es6';

import { jsx as _jsx } from "react/jsx-runtime";
import styled from 'styled-components';

var SVGTextBase = function SVGTextBase(props) {
  return /*#__PURE__*/_jsx("text", Object.assign({
    x: "50",
    width: "100%"
  }, props));
};

export default styled(SVGTextBase).withConfig({
  displayName: "SVGTextStyle",
  componentId: "sc-29pwk0-0"
})(["alignment-baseline:middle;dominant-baseline:middle;text-transform:uppercase;user-select:none;"]);