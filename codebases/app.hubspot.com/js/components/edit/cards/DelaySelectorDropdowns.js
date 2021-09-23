'use es6';

import UISelect from 'UIComponents/input/UISelect';
import styled from 'styled-components';
export var DelayOptionDropdown = styled(UISelect).attrs(function () {
  return {
    closeOnTargetLeave: true
  };
}).withConfig({
  displayName: "DelaySelectorDropdowns__DelayOptionDropdown",
  componentId: "sc-17lu0fm-0"
})(["width:225px !important;"]);