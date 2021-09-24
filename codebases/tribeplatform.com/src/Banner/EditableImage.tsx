import React, { useContext, useCallback, useState } from 'react';
import { Box, HStack } from '@chakra-ui/react';
import { Global } from '@emotion/react';
import Cropper from 'react-easy-crop';
import DragMove2FillIcon from 'remixicon-react/DragMove2FillIcon';
import { Trans } from 'tribe-translation';
import { Button } from '../Button';
import { bannerContext } from './BannerProvider';
import { preventNavigation } from './utils';
export const styles = {
    border: 'none',
    boxShadow: 'none',
};
export const EditableImage = ({ onSave: handleSave, onEdit: handleEdit, imageId, }) => {
    const { image, setImage, setTempLocalImage, newImageFile, setNewImageFile, toggleEditing, imageCrop, setImageCrop, cropSize, cropScale, zoom, updateZoom, } = useContext(bannerContext);
    const [cropAllowed, setCropAllowed] = useState(false);
    const [crop, setCrop] = useState({
        x: Math.round(imageCrop.cropX / cropScale.x),
        y: Math.round(imageCrop.cropY / cropScale.y),
    });
    const onCancel = useCallback(() => {
        setTempLocalImage(null);
        toggleEditing();
    }, [setTempLocalImage, toggleEditing]);
    const onSave = useCallback(async () => {
        window.onbeforeunload = preventNavigation;
        try {
            const payload = {
                cropX: crop.x,
                cropY: crop.y,
                cropWidth: cropSize.width,
                cropHeight: cropSize.height,
            };
            if (newImageFile) {
                payload.imageFile = newImageFile;
                setNewImageFile(null);
            }
            else if (imageId) {
                await handleEdit(payload);
            }
            setImage(image);
            setImageCrop(payload);
            setTempLocalImage(null);
            await (handleSave === null || handleSave === void 0 ? void 0 : handleSave(payload));
            toggleEditing();
            window.onbeforeunload = null;
        }
        catch (e) {
            // eslint-disable-next-line no-console
            console.error('error updating banner', e);
        }
    }, [
        crop.x,
        crop.y,
        cropSize.height,
        cropSize.width,
        handleEdit,
        handleSave,
        image,
        imageId,
        newImageFile,
        setImage,
        setImageCrop,
        setNewImageFile,
        setTempLocalImage,
        toggleEditing,
    ]);
    const handleCropChange = useCallback(crop => {
        if (!cropAllowed)
            return;
        setCrop({ x: 0, y: Math.floor(crop.y) });
    }, [cropAllowed]);
    return (React.createElement(Box, null,
        React.createElement(HStack, { position: "absolute", zIndex: "docked", w: "full", h: 14, bgColor: "whiteAlpha", py: 2, px: { base: 5, sm: 6, '2xl': '118px' }, justify: "flex-end", top: 0 },
            React.createElement(Button, { "data-testid": "cancel-image-button", buttonType: "secondary", onClick: onCancel },
                React.createElement(Trans, { i18nKey: "cancel", defaults: "Cancel" })),
            React.createElement(Button, { "data-testid": "save-image-button", buttonType: "primary", onClick: onSave },
                React.createElement(Trans, { i18nKey: "banner.save", defaults: "Save changes" }))),
        React.createElement(Button, { buttonType: "secondary", leftIcon: React.createElement(DragMove2FillIcon, { size: "16px" }), zIndex: 1, size: "sm" },
            React.createElement(Trans, { i18nKey: "banner.drag", defaults: "Drag to reposition" })),
        React.createElement(Cropper, { image: image, crop: crop, zoom: zoom.x, showGrid: false, zoomWithScroll: false, cropSize: cropSize, 
            // Prevent banner from jumping
            onInteractionStart: () => {
                setCropAllowed(true);
            }, onCropChange: handleCropChange, onMediaLoaded: updateZoom }),
        React.createElement(Global, { styles: `
          .reactEasyCrop_CropArea {
            box-shadow: none !important;
            border-color: transparent !important;
          }
        ` })));
};
//# sourceMappingURL=EditableImage.js.map