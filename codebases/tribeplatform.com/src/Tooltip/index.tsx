import React from 'react';
import { Tooltip as ChakraTooltip } from '@chakra-ui/react';
import { useResponsive } from '../hooks/useResponsive';
export const Tooltip = React.forwardRef((props, ref) => {
    const { isPortable } = useResponsive();
    return (React.createElement(ChakraTooltip, Object.assign({ ref: ref, placement: "top", bg: "label.primary", borderRadius: "md", hasArrow: true, maxW: "200px", color: "label.button", py: "6px", px: "8px", offset: [0, 10], arrowSize: 8, closeOnClick: true, isDisabled: isPortable }, props)));
});
//# sourceMappingURL=index.js.map