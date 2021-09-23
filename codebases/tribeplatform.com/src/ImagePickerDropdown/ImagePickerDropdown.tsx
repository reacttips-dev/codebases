import React, { useState } from 'react';
import { Box, Portal } from '@chakra-ui/react';
import { Trans, useTranslation } from 'tribe-translation';
import { useToggle } from '../hooks/useToggle';
import { Popover, PopoverBody, PopoverContentNoAnimate, PopoverTrigger, } from '../Popover';
import Spinner from '../Spinner';
import { Tab, TabList, TabPanels, Tabs, TabPanel } from '../Tabs';
import { Tooltip } from '../Tooltip';
import ImagePickerDropdownImage from './components/ImagePickerDropdownImage';
import ImagePickerDropdownTabEmojiPicker from './components/ImagePickerDropdownTabEmojiPicker';
import ImagePickerDropdownTabImageUpload from './components/ImagePickerDropdownTabImageUpload';
import ImagePickerDropdownTabLinkUpload from './components/ImagePickerDropdownTabLinkUpload';
import staticProps, { TABS_MOBILE_HEIGHT } from './staticProps';
const ImagePickerDropdown = ({ emojiSize = '2xs', image, imageBoxSize = 5, isDisabled = false, isLoading = false, offset = [0, 0], onEmojiSelect, onFileUpload, onLinkUpload, }) => {
    const [activeTabIndex, setActiveTabIndex] = useState(0);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [isOpen, toggle, open, close] = useToggle(false);
    const { t } = useTranslation();
    const shouldDisplayEmojiPicker = typeof onEmojiSelect === 'function';
    const shouldDisplayImageUpload = typeof onFileUpload === 'function';
    const shouldDisplayLinkUpload = typeof onLinkUpload === 'function';
    if (isDisabled ||
        (!shouldDisplayEmojiPicker &&
            !shouldDisplayImageUpload &&
            !shouldDisplayLinkUpload)) {
        return (React.createElement(Box, { "data-testid": "image-picker-dropdown", display: "inline-block", width: imageBoxSize, height: imageBoxSize, overflow: "hidden" },
            React.createElement(ImagePickerDropdownImage, { emojiSize: emojiSize, image: image, imageBoxSize: imageBoxSize })));
    }
    return (React.createElement(Popover, { closeOnBlur: true, isLazy: true, isOpen: isOpen, modifiers: [
            {
                name: 'offset',
                options: {
                    offset,
                },
            },
        ], onClose: close, placement: "bottom-start", returnFocusOnClose: false, size: "xmd" },
        React.createElement(PopoverTrigger, null,
            React.createElement(Box, { cursor: "pointer", "data-testid": "image-picker-dropdown", display: "inline-block", height: imageBoxSize, onClick: open, overflow: "hidden", width: imageBoxSize }, isLoading ? (React.createElement(Spinner, { height: imageBoxSize, width: imageBoxSize, thickness: 2 })) : (React.createElement(Tooltip, { label: t('common:changeIcon', 'Change icon'), placement: "auto-start", textAlign: "center" },
                React.createElement("span", null,
                    React.createElement(ImagePickerDropdownImage, { emojiSize: emojiSize, image: image, imageBoxSize: imageBoxSize })))))),
        React.createElement(Portal, null,
            React.createElement(PopoverContentNoAnimate, { onTitleArrowClick: close, title: t('common:spaceIcon', 'Space icon') },
                React.createElement(PopoverBody, { padding: 0, boxShadow: "base", borderRadius: "base" },
                    React.createElement(Tabs, { height: {
                            base: TABS_MOBILE_HEIGHT,
                            sm: 'auto',
                        }, index: activeTabIndex, onChange: setActiveTabIndex },
                        React.createElement(TabList, null,
                            shouldDisplayEmojiPicker && (React.createElement(Tab, null,
                                React.createElement(Trans, { i18nKey: "common:emoji", defaults: "Emoji" }))),
                            shouldDisplayImageUpload && (React.createElement(Tab, null,
                                React.createElement(Trans, { i18nKey: "common:uploadAnImage", defaults: "Upload an image" }))),
                            shouldDisplayLinkUpload && (React.createElement(Tab, null,
                                React.createElement(Trans, { i18nKey: "common:link", defaults: "Link" })))),
                        React.createElement(TabPanels, null,
                            shouldDisplayEmojiPicker && (React.createElement(TabPanel, { "data-testid": "emoji-picker-tab", sx: staticProps.emojiPickerTab.sx },
                                React.createElement(ImagePickerDropdownTabEmojiPicker, { close: close, onEmojiSelect: onEmojiSelect }))),
                            shouldDisplayImageUpload && (React.createElement(TabPanel, { padding: 6, "data-testid": "image-upload-tab" },
                                React.createElement(ImagePickerDropdownTabImageUpload, { close: close, onFileUpload: onFileUpload }))),
                            shouldDisplayLinkUpload && (React.createElement(TabPanel, { padding: 6, "data-testid": "link-upload-tab" },
                                React.createElement(ImagePickerDropdownTabLinkUpload, { close: close, onLinkUpload: onLinkUpload }))))))))));
};
export default ImagePickerDropdown;
//# sourceMappingURL=ImagePickerDropdown.js.map