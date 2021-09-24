import React, { useContext } from 'react';
import { FormLabel } from '@chakra-ui/react';
import CameraLineIcon from 'remixicon-react/CameraLineIcon';
import { Trans } from 'tribe-translation';
import { Button } from '../Button';
import { IMAGE_TYPES } from '../ImageUpload';
import { Input } from '../Input';
import { bannerContext } from './BannerProvider';
export const BannerAddImage = () => {
    const { image, onImageSelect } = useContext(bannerContext);
    if (image)
        return null;
    return (React.createElement(Button, { variant: "solid", size: "sm", borderRadius: "md", bg: "bg.secondary", color: "label.primary", cursor: "pointer", leftIcon: React.createElement(CameraLineIcon, { cursor: "pointer", size: "16px" }), as: FormLabel, mr: 0, mb: 0 },
        React.createElement(Input, { type: "file", onChange: onImageSelect, accept: IMAGE_TYPES, display: "none", "data-testid": "banner-image-upload-input" }),
        React.createElement(Trans, { i18nKey: "space.banner.upload_button", defaults: "Add cover image" })));
};
//# sourceMappingURL=BannerAddImage.js.map