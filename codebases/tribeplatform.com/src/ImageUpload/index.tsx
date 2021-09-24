import React, { useCallback, useEffect, useState } from 'react';
import { Box, useMultiStyleConfig } from '@chakra-ui/react';
import { Avatar } from '../Avatar';
import { Image } from '../Image';
import Edit from './Edit';
export const IMAGE_TYPES = 'image/x-png,image/png,image/gif,image/jpeg';
export const ImageUpload = ({ src, size, variant = 'avatar', name = '', onFileChange = null, allowedFile = IMAGE_TYPES, isSquared, ...rest }) => {
    const [preview, setPreview] = useState(src);
    useEffect(() => {
        if (src) {
            setPreview(src);
        }
    }, [src]);
    const { box, image } = useMultiStyleConfig('ImageUpload', {
        variant,
        isSquared,
    });
    const onChange = useCallback(event => {
        // eslint-disable-next-line dot-notation
        const blobInstance = window.URL || window.webkitURL || window['mozURL'];
        if (blobInstance) {
            const newPreview = blobInstance.createObjectURL(event.target.files[0]);
            setPreview(newPreview);
        }
        if (typeof onFileChange === 'function') {
            onFileChange(event.target.files);
        }
    }, [onFileChange]);
    return (React.createElement(Box, { sx: box },
        variant === 'avatar' && (React.createElement(Avatar, Object.assign({ variant: variant, name: name, src: preview, size: size }, rest))),
        preview && variant === 'logo' && (React.createElement(Image, Object.assign({ src: preview, size: size, sx: image }, rest))),
        React.createElement(Edit, { variant: variant, isEmpty: !preview, onChange: onChange, allowedFile: allowedFile })));
};
export default ImageUpload;
//# sourceMappingURL=index.js.map