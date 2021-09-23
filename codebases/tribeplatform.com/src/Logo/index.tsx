import React from 'react';
import { Box } from '@chakra-ui/layout';
import Image from '../Image';
import Text from '../Text';
export const Logo = React.forwardRef(({ src, name, ...rest }, ref) => {
    return (React.createElement(Box, Object.assign({ maxWidth: "200px", maxHeight: "32px", display: "block" }, rest, { ref: ref }), src ? (React.createElement(Image, { src: src, maxHeight: "100%", maxWidth: "100%", height: "32px", objectFit: "contain", alt: name })) : (React.createElement(Text, null, name))));
});
export default Logo;
//# sourceMappingURL=index.js.map