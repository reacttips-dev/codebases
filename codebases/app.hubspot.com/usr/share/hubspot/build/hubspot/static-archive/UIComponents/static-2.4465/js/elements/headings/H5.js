'use es6';

import styled from 'styled-components';
import Heading from '../Heading';
var H5 = styled(Heading).withConfig({
  displayName: "H5",
  componentId: "pfnd4a-0"
})([""]);
H5.propTypes = Heading.propTypes;
H5.defaultProps = Object.assign({}, Heading.defaultProps, {
  tagName: 'h5'
});
H5.displayName = 'H5';
export default H5;