import React, { useCallback, useEffect } from 'react';
import { Box, Flex, useDisclosure } from '@chakra-ui/react';
import { createContext } from '@chakra-ui/react-utils';
import { Collapse } from '@chakra-ui/transition';
import { StyledSidebarItem } from './SidebarItem';
const [SidebarAccordionProvider, useSidebarAccordionContext] = createContext({
    strict: true,
    name: 'SidebarAccordionContext',
});
export const SidebarAccordion = ({ children, defaultIsOpen = true, ...rest }) => {
    const { isOpen, onOpen, onClose, onToggle } = useDisclosure({
        defaultIsOpen,
    });
    useEffect(() => {
        if (defaultIsOpen) {
            onOpen();
        }
        else {
            onClose();
        }
    }, [defaultIsOpen, onClose, onOpen]);
    return (React.createElement(SidebarAccordionProvider, { value: { isOpen, onOpen, onClose, onToggle } },
        React.createElement(Flex, Object.assign({ flexDir: "column", mx: -3 }, rest), children)));
};
/**
 * SidebarAccordionButton is used expands and collapses an accordion item.
 * It must be a child of `SidebarAccordion`.
 */
export const SidebarAccordionButton = ({ children, collapseIcon, expandIcon, hideArrow = false, onArrowClick, ...props }) => {
    const { isOpen, onToggle } = useSidebarAccordionContext();
    const buttonStyles = {
        display: 'flex',
        alignItems: 'center',
        width: '100%',
        transition: 'all 0.2s',
        outline: 0,
    };
    const onItemClick = useCallback(e => {
        e.stopPropagation();
        if (typeof onArrowClick === 'function') {
            onArrowClick(!isOpen);
        }
        onToggle();
    }, [isOpen, onArrowClick, onToggle]);
    return (React.createElement(StyledSidebarItem, Object.assign({}, props, buttonStyles),
        children,
        !hideArrow && (React.createElement(Box, { zIndex: "default", onClick: onItemClick, p: 2, mr: -2, justifySelf: "end", cursor: "pointer" }, isOpen ? expandIcon : collapseIcon))));
};
export const SidebarAccordionPanel = ({ children }) => {
    const { isOpen } = useSidebarAccordionContext();
    return (React.createElement(Collapse, { in: isOpen },
        React.createElement(Box, { mx: 3 }, children)));
};
//# sourceMappingURL=SidebarAccordion.js.map