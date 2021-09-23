import React, { useContext } from 'react';
import { FormLabel, useToken } from '@chakra-ui/react';
import ArchiveLineIcon from 'remixicon-react/ArchiveLineIcon';
import CameraLineIcon from 'remixicon-react/CameraLineIcon';
import DragMove2LineIcon from 'remixicon-react/DragMove2LineIcon';
import Image2LineIcon from 'remixicon-react/Image2LineIcon';
import { Trans } from 'tribe-translation';
import { Dropdown, DropdownItem, DropdownList, DropdownButton, } from '../Dropdown';
import { IMAGE_TYPES } from '../ImageUpload';
import { Input } from '../Input';
import { bannerContext } from './BannerProvider';
export const EditButton = ({ onRemove }) => {
    const { onImageSelect, toggleEditing, isEditing } = useContext(bannerContext);
    const [buttonBorderRadius] = useToken('radiuses', ['base']);
    if (isEditing)
        return null;
    return (React.createElement(Dropdown, { placement: "bottom-end" },
        React.createElement(DropdownButton, { position: "absolute", "data-testid": "edit-cover-image-button", bottom: 4, right: { base: 5, sm: 6, '2xl': '118px' }, left: "auto", top: "auto", size: "sm", zIndex: "default", buttonType: "secondary", variant: "solid", colorScheme: "gray", bgColor: "bg.base", borderTopRadius: buttonBorderRadius, borderBottomRadius: buttonBorderRadius, border: "1px solid", borderColor: "border.base", leftIcon: React.createElement(CameraLineIcon, { cursor: "pointer", size: "16px" }) },
            React.createElement(Trans, { i18nKey: "banner.edit", defaults: "Edit cover image" })),
        React.createElement(DropdownList, { zIndex: "dropdown" },
            React.createElement(DropdownItem, { "data-testid": "upload-image-button", as: FormLabel, icon: Image2LineIcon, mr: 0, mb: 0, cursor: "pointer" },
                React.createElement(Input, { type: "file", onChange: onImageSelect, accept: IMAGE_TYPES, display: "none", id: "banner-image-upload-input" }),
                React.createElement(Trans, { i18nKey: "banner.upload", defaults: "Upload new image" })),
            React.createElement(DropdownItem, { "data-testid": "dropdown-reposition-button", icon: DragMove2LineIcon, onClick: toggleEditing },
                React.createElement(Trans, { i18nKey: "banner.reposition", defaults: "Reposition image" })),
            React.createElement(DropdownItem, { "data-testid": "remove-image-button", icon: ArchiveLineIcon, onClick: onRemove },
                React.createElement(Trans, { i18nKey: "banner.remove", defaults: "Remove image" })))));
};
//# sourceMappingURL=EditButton.js.map