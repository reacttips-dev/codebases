'use es6';

import styled from 'styled-components';
import Heading from '../Heading';
var H2 = styled(Heading).withConfig({
  displayName: "H2",
  componentId: "umo8b3-0"
})([""]);
H2.propTypes = Heading.propTypes;
H2.defaultProps = Object.assign({}, Heading.defaultProps, {
  tagName: 'h2'
});
H2.displayName = 'H2';
export default H2;