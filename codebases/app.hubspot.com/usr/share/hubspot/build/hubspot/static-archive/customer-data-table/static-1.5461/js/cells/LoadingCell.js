'use es6';

import { jsx as _jsx } from "react/jsx-runtime";
import { GYPSUM } from 'HubStyleTokens/colors';
import styled from 'styled-components';
var LoadingTextSkeleton = styled.div.withConfig({
  displayName: "LoadingCell__LoadingTextSkeleton",
  componentId: "sc-1su1nq8-0"
})(["display:block;height:20px;min-width:100px;background-color:", ";margin:1em;"], GYPSUM);

var LoadingCell = function LoadingCell(__) {
  return /*#__PURE__*/_jsx(LoadingTextSkeleton, {
    className: "loading",
    "data-selenium-test": "data-table-loading-cell"
  });
};

export default LoadingCell;