import React, { useCallback, useContext, useRef, useState } from 'react';
import { Box } from '@chakra-ui/react';
import { Image } from '../Image';
import { bannerContext } from './BannerProvider';
import { getTransform } from './utils';
export const BannerImage = () => {
    const { image, imageCrop, cropSize } = useContext(bannerContext);
    const [transform, setTransform] = useState('');
    const [visibility, setVisibility] = useState('hidden');
    const bannerRef = useRef();
    const onLoad = useCallback(() => {
        const imageTag = bannerRef.current;
        if (imageTag) {
            setTransform(getTransform({
                cropY: imageCrop.cropY,
                cropHeight: imageCrop.cropHeight,
                cropAreaHeight: cropSize.height,
                imageHeight: imageTag.height,
                zoomX: 1,
            }));
            setVisibility('visible');
        }
    }, [cropSize.height, imageCrop.cropHeight, imageCrop.cropY]);
    if (!image)
        return null;
    return (React.createElement(React.Fragment, null,
        React.createElement(Box, { w: "full", h: "full" },
            React.createElement(Image, { src: image, "data-testid": "banner-image", ref: bannerRef, transform: transform, 
                // Temp data images don't trigger onLoad
                visibility: image.includes('data:image') ? 'visible' : visibility, width: "full", onLoad: onLoad, pointerEvents: "none" }))));
};
//# sourceMappingURL=Image.js.map