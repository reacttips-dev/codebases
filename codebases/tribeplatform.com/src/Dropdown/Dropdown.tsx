import React, { forwardRef } from 'react';
import { MenuDivider as ChakraMenuDivider, MenuProvider, useMenu, useMenuButton, } from '@chakra-ui/menu';
import { Box, Flex, MenuList, Portal, StylesProvider, useMenuList, useMultiStyleConfig, useStyles, } from '@chakra-ui/react';
import { createContext } from '@chakra-ui/react-utils';
import { runIfFn } from '@chakra-ui/utils';
import CloseLineIcon from 'remixicon-react/CloseLineIcon';
import MoreLineIcon from 'remixicon-react/MoreLineIcon';
import { Trans } from 'tribe-translation';
import { Button } from '../Button';
import { Cover } from '../Cover';
import { useResponsive } from '../hooks/useResponsive';
import { IconButton } from '../IconButton';
import { DropdownItem } from './DropdownItem';
const customStyles = {
    cover: { zIndex: 1501 },
};
const [DropdownProvider, useDropdownContext] = createContext({
    strict: false,
    name: 'DropdownContext',
});
export const useDropdown = useDropdownContext;
/**
 * Dropdown provides context, state, and focus management
 * to its sub-components. It doesn't render any DOM node.
 */
export const Dropdown = props => {
    const { children, isMobile: mobileRequested } = props;
    const { isMobile: mobileDetected } = useResponsive();
    const isMobile = typeof mobileRequested === 'undefined' ? mobileDetected : mobileRequested;
    const styles = useMultiStyleConfig('Dropdown', {
        isMobile,
    });
    const menuContext = useMenu(props);
    const context = React.useMemo(() => ({ ...menuContext, isMobile }), [
        isMobile,
        menuContext,
    ]);
    const { isOpen, onClose } = context;
    return (React.createElement(DropdownProvider, { value: context },
        React.createElement(MenuProvider, { value: menuContext },
            React.createElement(StylesProvider, { value: styles }, runIfFn(children, { isOpen, onClose })))));
};
/**
 * The trigger for the dropdown list. Must be a direct child of `Dropdown`.
 */
export const DropdownButton = forwardRef((props, ref) => {
    const { children, ...rest } = props;
    const styles = useStyles();
    const buttonProps = useMenuButton(rest, ref);
    return (React.createElement(Button, Object.assign({ sx: {
            display: 'inline-flex',
            appearance: 'none',
            alignItems: 'center',
            outline: 0,
            transition: 'all 250ms',
            ...styles.button,
        }, variant: "ghost", colorScheme: "gray" }, buttonProps),
        React.createElement("span", { style: {
                pointerEvents: 'none',
                flex: '1 1 auto',
                maxWidth: 'inherit',
            } }, children)));
});
/**
 * The trigger for the dropdown list. Must be a direct child of `Dropdown`.
 */
export const DropdownIconButton = forwardRef((props, ref) => {
    const { children, icon, ...rest } = props;
    const styles = useStyles();
    const buttonProps = useMenuButton(rest, ref);
    return (React.createElement(IconButton, Object.assign({ sx: {
            display: 'inline-flex',
            appearance: 'none',
            alignItems: 'center',
            outline: 0,
            transition: 'all 250ms',
            ...styles.button,
        }, variant: "ghost", colorScheme: "gray", icon: icon !== null && icon !== void 0 ? icon : React.createElement(MoreLineIcon, { size: "16px" }), "aria-label": "Dropdown", "data-testid": "dropdown-icon-button" }, buttonProps),
        React.createElement("span", { style: {
                pointerEvents: 'none',
                flex: '1 1 auto',
            } }, children)));
});
/**
 * The trigger for the dropdown list. Must be a direct child of `Dropdown`.
 */
export const DropdownBox = forwardRef((props, ref) => {
    const { children, ...rest } = props;
    let buttonProps = useMenuButton(rest, ref);
    if (props.isDisabled) {
        buttonProps = {};
    }
    return (React.createElement(Box, Object.assign({ sx: {
            display: 'inline-flex',
            appearance: 'none',
            alignItems: 'center',
            outline: 0,
            transition: 'all 250ms',
        } }, buttonProps), children));
});
export const DropdownDivider = props => {
    const styles = useStyles();
    return React.createElement(ChakraMenuDivider, Object.assign({ sx: styles.divider }, props));
};
export const DropdownList = forwardRef((props, ref) => {
    const { isMobile, isOpen, onClose } = useDropdown();
    const listProps = useMenuList(props, ref);
    const { children, ...rest } = listProps;
    const styles = useStyles();
    if (isMobile && isOpen) {
        return (React.createElement(Portal, null,
            React.createElement(Cover, { isMobile: isMobile, isOpen: isOpen, style: customStyles.cover, onClick: onClose },
                React.createElement(Box, Object.assign({ sx: styles.mobileListContainer, w: "full" }, rest),
                    React.createElement(Flex, { flexDirection: "column", sx: styles.list, ref: ref }, children),
                    React.createElement(DropdownItem, { sx: styles.cancel, onClick: onClose, icon: CloseLineIcon },
                        React.createElement(Trans, { i18nKey: "common:cancel", defaults: "Cancel" }))))));
    }
    return (React.createElement("div", null,
        React.createElement(MenuList, Object.assign({ p: 2, ref: ref }, rest), children)));
});
//# sourceMappingURL=Dropdown.js.map