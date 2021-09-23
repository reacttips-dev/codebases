'use es6';

import styled from 'styled-components';
import Heading from '../Heading';
var H6 = styled(Heading).withConfig({
  displayName: "H6",
  componentId: "sc-1an5scv-0"
})([""]);
H6.propTypes = Heading.propTypes;
H6.defaultProps = Object.assign({}, Heading.defaultProps, {
  tagName: 'h6'
});
H6.displayName = 'H6';
export default H6;