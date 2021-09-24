import React, { useRef } from 'react';
import { Box, useStyleConfig, useOutsideClick, } from '@chakra-ui/react';
export const Cover = ({ children, onClick, isMobile, isOpen, ...rest }) => {
    const styles = useStyleConfig('Cover', {});
    const mobileListRef = useRef();
    const handleOutsideClick = (e) => {
        if (isMobile && isOpen && onClick) {
            e.stopPropagation();
            e.preventDefault();
            onClick(e);
        }
    };
    useOutsideClick({
        ref: mobileListRef,
        handler: handleOutsideClick,
    });
    return (React.createElement(Box, Object.assign({ sx: styles }, rest),
        React.createElement("div", { ref: mobileListRef }, children)));
};
export default Cover;
//# sourceMappingURL=index.js.map