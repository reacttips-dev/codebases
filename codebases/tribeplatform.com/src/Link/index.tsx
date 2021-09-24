import React, { forwardRef } from 'react';
import { Link as ChakraLink, } from '@chakra-ui/react';
export const Link = forwardRef((props, ref) => React.createElement(ChakraLink, Object.assign({ ref: ref }, props)));
export default Link;
//# sourceMappingURL=index.js.map