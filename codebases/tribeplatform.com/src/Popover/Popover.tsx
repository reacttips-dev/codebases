import React, { forwardRef } from 'react';
import * as ChakraPopover from '@chakra-ui/popover';
import { Box, Flex, useStyles } from '@chakra-ui/react';
import ArrowLeftLineIcon from 'remixicon-react/ArrowLeftLineIcon';
import { Icon } from '../Icon';
import { Text } from '../Text';
export const Popover = props => React.createElement(ChakraPopover.Popover, Object.assign({}, props));
export default Popover;
export const PopoverTrigger = props => (React.createElement(ChakraPopover.PopoverTrigger, Object.assign({}, props)));
export const PopoverContent = props => (React.createElement(ChakraPopover.PopoverContent, Object.assign({}, props)));
export const PopoverHeader = props => React.createElement(ChakraPopover.PopoverHeader, Object.assign({}, props));
export const PopoverBody = props => React.createElement(ChakraPopover.PopoverBody, Object.assign({}, props));
export const PopoverFooter = props => React.createElement(ChakraPopover.PopoverFooter, Object.assign({}, props));
export const PopoverCloseButton = props => (React.createElement(ChakraPopover.PopoverCloseButton, Object.assign({}, props)));
export const PopoverArrow = props => React.createElement(ChakraPopover.PopoverArrow, Object.assign({}, props));
export const PopoverContentNoAnimate = forwardRef((props, ref) => {
    const { getPopoverProps, getPopoverPositionerProps, } = ChakraPopover.usePopoverContext();
    const { onTitleArrowClick, title, ...otherProps } = props || {};
    const styles = useStyles();
    const contentStyles = {
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        ...styles.content,
    };
    const popoverProps = getPopoverProps(otherProps, ref);
    return (React.createElement(Box, Object.assign({ sx: styles.popper }, getPopoverPositionerProps()),
        title && (React.createElement(Box, { sx: styles.title },
            onTitleArrowClick && (React.createElement(Flex, { alignItems: "center", cursor: "pointer", justifyContent: "center", onClick: onTitleArrowClick, left: 5, position: "absolute", top: "22px", height: 5, width: 5 },
                React.createElement(Icon, { as: ArrowLeftLineIcon }))),
            React.createElement(Text, { textStyle: "semibold/medium" }, title))),
        React.createElement(Box, Object.assign({}, popoverProps, { sx: contentStyles }))));
});
//# sourceMappingURL=Popover.js.map