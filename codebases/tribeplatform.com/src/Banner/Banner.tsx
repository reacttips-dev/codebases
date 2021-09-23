/* eslint-disable react-hooks/exhaustive-deps */
import React, { useCallback, useContext, useEffect, useState } from 'react';
import { AspectRatio, Flex } from '@chakra-ui/react';
import { getMediaURL } from '../utils/getMedia';
import { bannerContext, initialImageCrop } from './BannerProvider';
import { BANNER_RATIO } from './constants';
import { EditableImage } from './EditableImage';
import { EditButton } from './EditButton';
import { BannerImage } from './Image';
const staticProps = {
    hidden: {},
    visible: {
        display: 'flex',
    },
};
export const Banner = ({ image: initialImage, onRemove, onSave, onEdit, }) => {
    const { image, setImage, isEditing, setTempLocalImage, setImageCrop, } = useContext(bannerContext);
    const [imageVisible, setImageVisible] = useState(false);
    const imageId = initialImage === null || initialImage === void 0 ? void 0 : initialImage.id;
    useEffect(() => {
        setImage(getMediaURL(initialImage));
        setTempLocalImage(null);
        if (initialImage) {
            const { cropX, cropY, cropWidth, cropHeight, height, width, } = initialImage;
            setImageCrop({ cropX, cropY, cropWidth, cropHeight, height, width });
        }
        // We need to refresh the context state only if
        // the image itself is completely different (id has changed).
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [imageId, setImage, setImageCrop, setTempLocalImage]);
    const handleRemove = useCallback(() => {
        onRemove();
        setImage(null);
        setImageCrop(initialImageCrop);
        setTempLocalImage(null);
    }, [onRemove, setImage, setImageCrop, setTempLocalImage]);
    const showImage = useCallback(() => setImageVisible(true), []);
    const showEditButton = typeof onRemove === 'function' && typeof onSave === 'function';
    if (!image)
        return null;
    let props = staticProps.hidden;
    if (!isEditing && imageVisible) {
        props = staticProps.visible;
    }
    return (React.createElement(Flex, Object.assign({ position: "relative", align: "center", justify: "center", "data-testid": "cover-image-container" }, props),
        React.createElement(AspectRatio, { w: "full", ratio: BANNER_RATIO }, isEditing ? (React.createElement(EditableImage, { onSave: onSave, onEdit: onEdit, imageId: imageId })) : (React.createElement(BannerImage, null))),
        showEditButton && (React.createElement(EditButton, { onLoad: showImage, onRemove: handleRemove }))));
};
//# sourceMappingURL=Banner.js.map