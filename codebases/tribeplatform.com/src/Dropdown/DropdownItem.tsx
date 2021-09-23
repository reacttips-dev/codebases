import React, { isValidElement } from 'react';
import { useMenuItem } from '@chakra-ui/menu';
import { forwardRef, Flex, useMultiStyleConfig, Box, } from '@chakra-ui/react';
import { Button } from '../Button';
import { Icon } from '../Icon';
export const DropdownItemIcon = ({ icon, iconSpacing = '0.75rem', }) => isValidElement(icon) ? (icon) : (React.createElement(Icon, { as: icon, fontSize: "16px", mr: iconSpacing }));
export const StyledDropdownItem = forwardRef((props, ref) => {
    const { type, sx, ...rest } = props;
    const styles = useMultiStyleConfig('Dropdown', {});
    /**
     * Given another component, use its type if present
     * Else, use no type to avoid invalid html, e.g. <a type="button" />
     * Else, fall back to "button"
     */
    const btnType = rest.as ? type !== null && type !== void 0 ? type : undefined : 'button';
    const buttonStyles = {
        textDecoration: 'none',
        color: 'inherit',
        userSelect: 'none',
        display: 'flex',
        width: '100%',
        alignItems: 'center',
        textAlign: 'left',
        flex: '0 0 auto',
        outline: 0,
        ...styles.item,
    };
    return (React.createElement(Button, Object.assign({ ref: ref, variant: "ghost", type: btnType }, rest, { sx: {
            ...buttonStyles,
            ...sx,
        } })));
});
export const DropdownItem = forwardRef((props, ref) => {
    const { icon, iconSpacing, children, danger, ...rest } = props;
    const dropdownItemProps = useMenuItem(rest, ref);
    const shouldWrap = !!icon;
    const _children = shouldWrap ? (React.createElement(Flex, { pointerEvents: "none" }, children)) : (children);
    return (React.createElement(StyledDropdownItem, Object.assign({ color: danger ? 'danger' : undefined }, dropdownItemProps),
        icon && React.createElement(DropdownItemIcon, { icon: icon, iconSpacing: iconSpacing }),
        _children));
});
export const DropdownItemLeftElement = props => {
    return React.createElement(Box, Object.assign({ marginEnd: "0.75rem" }, props));
};
//# sourceMappingURL=DropdownItem.js.map