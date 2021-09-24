'use es6';

import styled from 'styled-components';
import { remCalc } from 'UIComponents/core/Style';
var CampaignColorDot = styled.div.withConfig({
  displayName: "CampaignColorDot",
  componentId: "sc-1uiheg5-0"
})(["border-radius:50%;height:", ";width:", ";"], function (props) {
  return remCalc(props.size);
}, function (props) {
  return remCalc(props.size);
});
CampaignColorDot.defaultProps = {
  size: 8
};
export default CampaignColorDot;