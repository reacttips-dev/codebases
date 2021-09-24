import React, { forwardRef } from 'react';
import { Tag as ChakraTag, TagCloseButton as ChakraTagCloseButton, TagLabel as ChakraTagLabel, TagLeftIcon as ChakraTagLeftIcon, TagRightIcon as ChakraTagRightIcon, } from '@chakra-ui/tag';
export const Tag = forwardRef((props, ref) => React.createElement(ChakraTag, Object.assign({ ref: ref }, props)));
export const TagLabel = forwardRef((props, ref) => (React.createElement(ChakraTagLabel, Object.assign({ ref: ref }, props))));
export const TagCloseButton = (props) => (React.createElement(ChakraTagCloseButton, Object.assign({}, props)));
export const TagLeftIcon = props => React.createElement(ChakraTagLeftIcon, Object.assign({}, props));
export const TagRightIcon = props => React.createElement(ChakraTagRightIcon, Object.assign({}, props));
//# sourceMappingURL=Tag.js.map