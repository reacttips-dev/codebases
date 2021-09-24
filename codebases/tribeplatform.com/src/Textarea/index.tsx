import React from 'react';
import { Textarea as ChakraTextarea, } from '@chakra-ui/react';
export const Textarea = React.forwardRef((props, ref) => React.createElement(ChakraTextarea, Object.assign({ ref: ref }, props)));
export default Textarea;
//# sourceMappingURL=index.js.map