'use es6';

import styled from 'styled-components';
import { GYPSUM, OLAF } from 'HubStyleTokens/colors';
var WidgetSettingsWrapper = styled.div.withConfig({
  displayName: "WidgetSettingsWrapper",
  componentId: "sc-1lbnko3-0"
})(["display:flex;background-color:", ";border-top:1px solid ", ";min-height:80px;flex-direction:column;justify-content:center;width:100%;"], GYPSUM, OLAF);
export default WidgetSettingsWrapper;