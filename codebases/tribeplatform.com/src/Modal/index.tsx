import React, { useEffect, useState } from 'react';
import { Modal as ChakraModal, ModalBody as ChakraModalBody, ModalCloseButton as ChakraModalCloseButton, ModalContent as ChakraModalContent, ModalFooter as ChakraModalFooter, ModalHeader as ChakraModalHeader, ModalOverlay as ChakraModalOverlay, useMultiStyleConfig, } from '@chakra-ui/react';
import { useResponsive } from '../hooks/useResponsive';
import { isIOS } from '../utils/ios';
const IPHONE_KEYBOARD_HEIGHT = '260px';
export const Modal = (props) => {
    const { isPortable } = useResponsive();
    return React.createElement(ChakraModal, Object.assign({}, props, { size: isPortable ? 'full' : props.size }));
};
export const ModalOverlay = (props) => (React.createElement(ChakraModalOverlay, Object.assign({}, props)));
export const ModalContent = ({ fullSizeOniPhone, ...props }) => {
    const { isPhone } = useResponsive();
    const [isIOSKeyboardVisible, setIOSKeyboardVisible] = useState(false);
    // Handles editor's height on iOS devices
    // when keyboard appears and disappears
    useEffect(() => {
        if (!fullSizeOniPhone || !isIOS())
            return;
        const checkForFieldFocus = () => {
            setTimeout(() => {
                const node = document.activeElement;
                if (node) {
                    const tag = node.tagName.toLowerCase();
                    const input = node;
                    const div = node;
                    const isTextarea = tag === 'textarea';
                    const isInputField = tag === 'input' &&
                        (input.type === 'text' || input.type === 'number');
                    // React quill's editable node is just a `div` with `contenteditable="true"`.
                    // These kinds of elements also trigger the keyboard
                    const isEditableDIV = tag === 'div' && div.contentEditable === 'true';
                    // Fix scroll positioning
                    window.scrollTo(0, 0);
                    // If this is not a focusable tag, hence it won't
                    // cause in keyboard being shown, set the max height
                    // possible to fill the whole page
                    if (isTextarea || isInputField || isEditableDIV) {
                        setIOSKeyboardVisible(true);
                        return;
                    }
                }
                setIOSKeyboardVisible(false);
            }, 500);
        };
        // Set the correct height for the initial focus
        checkForFieldFocus();
        document.addEventListener('focusin', checkForFieldFocus);
        document.addEventListener('focusout', checkForFieldFocus);
        return () => {
            document.removeEventListener('focusin', checkForFieldFocus);
            document.removeEventListener('focusout', checkForFieldFocus);
        };
    }, [fullSizeOniPhone]);
    return (React.createElement(ChakraModalContent, Object.assign({ pb: fullSizeOniPhone && isIOSKeyboardVisible ? IPHONE_KEYBOARD_HEIGHT : 0, bg: "bg.base", borderRadius: [0, 'md'] }, props, (fullSizeOniPhone &&
        isPhone && {
        mb: 0,
        mt: 0,
        position: 'fixed',
        h: 'full',
        // Fallback for the property below
        minH: '100vh',
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        // eslint-disable-next-line react/jsx-no-duplicate-props
        minH: '-webkit-fill-available',
    }))));
};
export const ModalHeader = ({ variant = 'default', ...props }) => {
    const { header } = useMultiStyleConfig('Modal', { variant });
    return React.createElement(ChakraModalHeader, Object.assign({ sx: header }, props));
};
export const ModalFooter = props => React.createElement(ChakraModalFooter, Object.assign({}, props));
export const ModalBody = props => (React.createElement(ChakraModalBody, Object.assign({ display: "flex", flexGrow: 1, flexDirection: "column" }, props)));
export const ModalCloseButton = props => React.createElement(ChakraModalCloseButton, Object.assign({}, props));
export default Modal;
//# sourceMappingURL=index.js.map