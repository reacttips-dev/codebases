import React, { useCallback, useRef } from 'react';
import { Picker } from 'emoji-mart-virtualized';
import data from 'emoji-mart/data/apple.json';
import { useResponsive } from '../../hooks';
import staticProps from '../staticProps';
const ImagePickerDropdownTabEmojiPicker = ({ close, onEmojiSelect, }) => {
    const { isMobile } = useResponsive();
    const pickerRef = useRef();
    const handleEmojiSelect = useCallback((emoji) => {
        onEmojiSelect === null || onEmojiSelect === void 0 ? void 0 : onEmojiSelect(emoji);
        close();
    }, [close, onEmojiSelect]);
    return (React.createElement(Picker, { data: data, native: true, onSelect: handleEmojiSelect, ref: pickerRef, set: "apple", showSkinTones: false, showPreview: false, perLine: isMobile ? 10 : 11, style: staticProps.picker }));
};
export default ImagePickerDropdownTabEmojiPicker;
//# sourceMappingURL=ImagePickerDropdownTabEmojiPicker.js.map