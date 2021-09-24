'use es6';

import { jsx as _jsx } from "react/jsx-runtime";
import VizExLoadingSpinner from 'visitor-ui-component-library/loading/VizExLoadingSpinner';
import styled from 'styled-components';
import { useDelayedRender } from '../util/useDelayedRender';
export var WidgetBodyDiv = styled.div.withConfig({
  displayName: "WidgetPlaceholder__WidgetBodyDiv",
  componentId: "sc-1pmn3lq-0"
})(["display:flex;flex-direction:column;height:100%;align-items:center;justify-content:center;"]);

var WidgetPlaceholder = function WidgetPlaceholder() {
  var finished = useDelayedRender(200);
  return /*#__PURE__*/_jsx(WidgetBodyDiv, {
    "data-test-id": "chat-widget-wrapper",
    children: finished && /*#__PURE__*/_jsx(VizExLoadingSpinner, {
      size: "sm"
    })
  });
};

WidgetPlaceholder.displayName = 'WidgetPlaceholder';
export default WidgetPlaceholder;