'use es6';

import { OLAF, SLINKY } from 'HubStyleTokens/colors';
import AvatarWrapper from './AvatarWrapper';
import styled from 'styled-components';
export default styled(AvatarWrapper).withConfig({
  displayName: "AvatarWrapperOverlay",
  componentId: "sc-1ququ9b-0"
})(["& .overlay-content{align-items:center;background:", ";color:", ";cursor:pointer;display:flex;font-family:sans-serif;height:0;hyphens:auto;justify-content:center;left:0;opacity:0;overflow:visible;padding:calc(50%);position:absolute;text-align:center;top:0;transition:opacity 300ms ease;width:0;}&:hover .overlay-content,&.hover-test .overlay-content{opacity:0.85;}"], SLINKY, OLAF);