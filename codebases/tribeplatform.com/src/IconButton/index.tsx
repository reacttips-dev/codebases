import React, { forwardRef, isValidElement, cloneElement } from 'react';
import { __DEV__ } from '@chakra-ui/utils';
import { Button } from '../Button';
const staticProps = {
    _highlighted: {
        bg: 'bg.secondary',
    },
};
export const IconButton = forwardRef((props, ref) => {
    const { icon, children, isRound, 'aria-label': ariaLabel, highlighted, ...rest } = props;
    /**
     * Passing the icon as prop or children should work
     */
    const element = icon || children;
    const _children = isValidElement(element)
        ? cloneElement(element, {
            'aria-hidden': true,
            focusable: false,
        })
        : null;
    return (React.createElement(Button, Object.assign({ borderRadius: isRound ? 'full' : 'lg', ref: ref, "aria-label": ariaLabel, border: 0 }, (highlighted && { 'data-highlighted': true }), staticProps, rest), _children));
});
if (__DEV__) {
    IconButton.displayName = 'IconButton';
}
//# sourceMappingURL=index.js.map