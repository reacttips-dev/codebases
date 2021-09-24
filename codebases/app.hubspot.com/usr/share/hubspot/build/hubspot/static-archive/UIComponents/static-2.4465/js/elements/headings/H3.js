'use es6';

import styled from 'styled-components';
import Heading from '../Heading';
var H3 = styled(Heading).withConfig({
  displayName: "H3",
  componentId: "tk02wq-0"
})([""]);
H3.propTypes = Heading.propTypes;
H3.defaultProps = Object.assign({}, Heading.defaultProps, {
  tagName: 'h3'
});
H3.displayName = 'H3';
export default H3;