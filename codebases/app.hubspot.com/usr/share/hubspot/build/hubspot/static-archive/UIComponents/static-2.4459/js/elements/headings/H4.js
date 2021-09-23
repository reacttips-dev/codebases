'use es6';

import styled from 'styled-components';
import Heading from '../Heading';
var H4 = styled(Heading).withConfig({
  displayName: "H4",
  componentId: "sc-1qm2ap1-0"
})([""]);
H4.propTypes = Heading.propTypes;
H4.defaultProps = Object.assign({}, Heading.defaultProps, {
  tagName: 'h4'
});
H4.displayName = 'H4';
export default H4;