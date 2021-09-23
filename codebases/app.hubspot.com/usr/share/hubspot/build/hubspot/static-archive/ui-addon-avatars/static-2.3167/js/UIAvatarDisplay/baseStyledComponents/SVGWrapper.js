'use es6';

import styled from 'styled-components';
import { EERIE, OLAF, OBSIDIAN } from 'HubStyleTokens/colors';
import SVGBase from './SVGBase';
import { AVATAR_SIZES } from '../../Constants';
export default styled(SVGBase).withConfig({
  displayName: "SVGWrapper",
  componentId: "sc-1qrf1yz-0"
})(["background-size:cover;background-position:center;display:block;fill:", ";font-family:'Avenir Next W02',Helvetica,Arial,sans-serif;font-size:", "%;text-anchor:middle;width:100%;height:", ";", ";", ";"], function (props) {
  return props._isHasMore ? OBSIDIAN : 'currentColor';
}, function (props) {
  return props._isHasMore ? '340' : '290';
}, function (props) {
  return props.size && props.size !== AVATAR_SIZES.responsive ? AVATAR_SIZES[props.size] + "px" : 'inherit';
}, function (props) {
  return props.src ? "background-image: url('" + props.src + "');" : "background-color: " + (props._isHasMore ? OLAF : EERIE) + ";";
}, function (props) {
  return /hubfs\/defaults\/company\.png/.test(props.src) && props._isReversed && 'background-position: -2px;';
});