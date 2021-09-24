'use es6';

import { HEADING_WEIGHT7 } from 'HubStyleTokens/misc';
import { HEADING7 } from 'HubStyleTokens/sizes';
import styled from 'styled-components';
import { FONT_FAMILIES, setFontSize } from '../../utils/Styles';
import Heading from '../Heading';
var H7 = styled(Heading).withConfig({
  displayName: "H7",
  componentId: "sc-1cek12-0"
})(["", ";", ";"], FONT_FAMILIES[HEADING_WEIGHT7], setFontSize(HEADING7));
H7.propTypes = Heading.propTypes;
H7.defaultProps = Object.assign({}, Heading.defaultProps, {
  tagName: 'h2'
});
H7.displayName = 'H7';
export default H7;