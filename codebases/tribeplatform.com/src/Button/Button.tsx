import React, { forwardRef } from 'react';
import { Button as ChakraButton, } from '@chakra-ui/react';
export const Button = forwardRef((props, ref) => {
    const { buttonType, ...rest } = props;
    let colorScheme;
    let variant;
    switch (buttonType) {
        case 'primary':
            variant = 'solid';
            colorScheme = 'accent';
            break;
        case 'secondary':
            variant = 'solid';
            colorScheme = 'gray';
            break;
        case 'danger':
            variant = 'solid';
            colorScheme = 'red';
            break;
        case 'quiet':
            variant = 'ghost';
            colorScheme = 'gray';
            break;
        case 'base':
        default:
            variant = 'outline';
            colorScheme = 'gray';
    }
    return (React.createElement(ChakraButton, Object.assign({ ref: ref, variant: variant, colorScheme: colorScheme }, rest)));
});
export default Button;
//# sourceMappingURL=Button.js.map