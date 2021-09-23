import React, { useCallback, useEffect, useRef } from 'react';
import { Box } from '@chakra-ui/react';
import { runIfFn } from '@chakra-ui/utils';
import { Picker } from 'emoji-mart';
import { useToggle } from '../hooks/useToggle';
import { Popover, PopoverBody, PopoverContentNoAnimate, PopoverTrigger, } from '../Popover/Popover';
export const pickerStyle = {
    display: 'block',
    border: 'none',
};
const staticProps = {
    modifiers: [
        {
            name: 'offset',
            options: {
                offset: [-10, 20],
            },
        },
    ],
};
export const EmojiPicker = ({ children, onSelect, shouldShow, }) => {
    const pickerRef = useRef();
    const [isOpen, toggle, open, close] = useToggle(false);
    const onEmojiSelect = useCallback(emoji => {
        onSelect === null || onSelect === void 0 ? void 0 : onSelect(emoji);
        close();
    }, [onSelect]);
    useEffect(() => {
        if (typeof shouldShow === 'boolean') {
            if (shouldShow) {
                open();
            }
            else {
                close();
            }
        }
    }, [shouldShow]);
    return (React.createElement(Popover, { isOpen: isOpen, onClose: close, closeOnBlur: true, returnFocusOnClose: false, variant: "responsive", isLazy: true, placement: "bottom-start", modifiers: staticProps.modifiers },
        React.createElement(Box, null,
            React.createElement(PopoverTrigger, null,
                React.createElement(Box, { cursor: "pointer", onClick: open }, runIfFn(children, { isOpen, toggle }))),
            React.createElement(PopoverContentNoAnimate, null,
                React.createElement(PopoverBody, { "data-testid": "emoji-picker-popover", p: 0, whiteSpace: "normal" },
                    React.createElement(Picker
                    // TODO autoFocus causes page to scroll to top when picker opens
                    // autoFocus
                    , { 
                        // TODO autoFocus causes page to scroll to top when picker opens
                        // autoFocus
                        native: true, onSelect: onEmojiSelect, ref: pickerRef, set: "apple", showSkinTones: false, showPreview: false, style: pickerStyle }))))));
};
//# sourceMappingURL=EmojiPicker.js.map