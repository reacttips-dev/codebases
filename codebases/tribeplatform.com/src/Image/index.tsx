import React, { useMemo } from 'react';
import { Image as ChakraImage, } from '@chakra-ui/react';
import { getMediaURL } from '../utils/getMedia';
export const Image = React.memo(React.forwardRef(({ src, alt, size, ...props }, ref) => {
    const mediaURL = useMemo(() => {
        // If `src` is a Media object
        if (src instanceof Object && src.constructor === Object) {
            return getMediaURL(src, { size: size });
        }
        return src;
    }, [size, src]);
    return (React.createElement(ChakraImage, Object.assign({ ignoreFallback: true, alt: alt, src: mediaURL }, props, { ref: ref })));
}));
export default Image;
//# sourceMappingURL=index.js.map