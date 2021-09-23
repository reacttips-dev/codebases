import React, { useCallback, createContext, useState, useMemo, } from 'react';
import { useResponsive } from '../hooks/useResponsive';
import { useToggle } from '../hooks/useToggle';
import { BANNER_MAX_HEIGHT, BANNER_RATIO, BANNER_MIN_HEIGHT } from './constants';
const SIDEBAR_WIDTH = '17rem';
export const initialImageCrop = {
    cropX: 0,
    cropY: 0,
    cropWidth: 0,
    cropHeight: 0,
    width: 0,
    height: 0,
};
const initialCropScale = { x: 1, y: 1 };
const initialZoom = { x: 1, y: 1 };
export const bannerContext = createContext(undefined);
export const BannerProvider = ({ children }) => {
    const [currentImage, setImage] = useState(null);
    const [zoom, setZoom] = useState(initialZoom);
    const [cropScale, setCropScale] = useState(initialCropScale);
    const [imageCrop, setImageCrop] = useState(initialImageCrop);
    const [newImageFile, setNewImageFile] = useState(null);
    const [tempLocalImage, setTempLocalImage] = useState(null);
    const [isEditing, toggleEditing] = useToggle(false);
    const { isMobile } = useResponsive();
    // Store the selected image temporary
    // (maybe user won't like it as a cover)
    const onImageSelect = useCallback((event) => {
        const reader = new FileReader();
        reader.onload = e => {
            setTempLocalImage(e.target.result);
            if (!isEditing)
                toggleEditing();
        };
        const file = event.target.files[0];
        setNewImageFile(file);
        reader.readAsDataURL(file);
    }, [isEditing, toggleEditing, setTempLocalImage]);
    const windowWidth = typeof window !== 'undefined' && window.innerWidth;
    const cropSize = useMemo(() => {
        if (typeof window === 'undefined') {
            return {
                width: 1000,
                height: BANNER_MAX_HEIGHT,
            };
        }
        let cropWidth = window.innerWidth;
        if (!isMobile) {
            cropWidth -=
                // It's in rems
                parseInt(SIDEBAR_WIDTH, 10) *
                    // Get 1rem in pixels
                    parseInt(window.getComputedStyle(document.body).fontSize, 10);
        }
        return {
            width: cropWidth || 0,
            height: Math.max(Math.floor(cropWidth / BANNER_RATIO), BANNER_MIN_HEIGHT) || 0,
        };
        // window.innerWidth dependency triggers the recalculation of width on resize
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isMobile, windowWidth]);
    const updateZoom = useCallback((mediaSize) => {
        // Get the actual image sizes
        setZoom({
            x: cropSize.width / mediaSize.width,
            y: cropSize.height / mediaSize.height,
        });
        setCropScale({
            y: imageCrop.cropHeight / mediaSize.height,
            x: imageCrop.cropWidth / mediaSize.width,
        });
    }, [
        cropSize.height,
        cropSize.width,
        imageCrop.cropHeight,
        imageCrop.cropWidth,
    ]);
    return (React.createElement(bannerContext.Provider, { value: {
            image: tempLocalImage || currentImage,
            setImage,
            setTempLocalImage,
            newImageFile,
            setNewImageFile,
            onImageSelect,
            isEditing,
            toggleEditing,
            imageCrop: tempLocalImage ? initialImageCrop : imageCrop,
            setImageCrop,
            cropSize,
            zoom,
            setZoom,
            cropScale,
            updateZoom,
        } }, children));
};
//# sourceMappingURL=BannerProvider.js.map