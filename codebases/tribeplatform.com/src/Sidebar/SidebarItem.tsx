import React, { memo, useCallback } from 'react';
import { Box, Flex, Spacer, useMultiStyleConfig, } from '@chakra-ui/react';
import { forwardRef } from '@chakra-ui/system';
import { useResponsive } from '../hooks/useResponsive';
import { Icon } from '../Icon';
import { Link } from '../Link';
import { Text } from '../Text';
export const SidebarItemIcon = ({ icon, active, variant, ...rest }) => {
    const styles = useMultiStyleConfig('Sidebar', { variant, active });
    return (React.createElement(Icon, Object.assign({ sx: styles.icon, as: icon, title: "sidebar-icon" }, (active && { 'data-highlighted': active }), rest)));
};
export const StyledSidebarItem = forwardRef(({ icon, children, active, variant, ...props }, ref) => {
    const styles = useMultiStyleConfig('Sidebar', { variant });
    const itemStyles = {
        display: 'flex',
        justifyContent: 'flex-start',
        alignItems: 'center',
        ...styles.item,
    };
    return (React.createElement(Flex, Object.assign({ sx: itemStyles }, props, (active && { 'data-highlighted': active }), { ref: ref }),
        icon && (React.createElement(SidebarLeftElement, null,
            React.createElement(SidebarItemIcon, { icon: icon, active: active, variant: variant }))),
        children));
});
export const SidebarItem = memo(forwardRef(({ href, onClick, as, ...props }, ref) => {
    const { toggleSidebar, isMobile, isSidebarOpen } = useResponsive();
    const onItemClick = useCallback(e => {
        if (isSidebarOpen && isMobile) {
            toggleSidebar();
        }
        onClick === null || onClick === void 0 ? void 0 : onClick(e);
    }, [toggleSidebar, isSidebarOpen, isMobile, onClick]);
    return (React.createElement(Link, { href: href || '#', onClick: onItemClick, variant: "unstyled", display: "block", mx: -3, as: as },
        React.createElement(StyledSidebarItem, Object.assign({}, props, { ref: ref }))));
}));
export const SidebarLabel = props => {
    const styles = useMultiStyleConfig('Sidebar', {});
    return React.createElement(Text, Object.assign({ isTruncated: true }, styles.label, props));
};
export const SidebarLeftElement = props => {
    return React.createElement(Box, Object.assign({ marginEnd: "0.5rem" }, props));
};
export const SidebarRightElement = props => {
    return (React.createElement(React.Fragment, null,
        React.createElement(Spacer, null),
        React.createElement(Box, Object.assign({ marginStart: "0.5rem" }, props))));
};
//# sourceMappingURL=SidebarItem.js.map