'use es6';

import styled from 'styled-components';
import Heading from '../Heading';
var H1 = styled(Heading).withConfig({
  displayName: "H1",
  componentId: "sc-6bynp1-0"
})([""]);
H1.propTypes = Heading.propTypes;
H1.defaultProps = Object.assign({}, Heading.defaultProps, {
  tagName: 'h1'
});
H1.displayName = 'H1';
export default H1;