import React, { forwardRef } from 'react';
import { Switch as ChakraSwitch, useStyleConfig, } from '@chakra-ui/react';
export const Switch = forwardRef((props, ref) => {
    const styles = useStyleConfig('Switch', {});
    return React.createElement(ChakraSwitch, Object.assign({ sx: styles }, props, { ref: ref }));
});
export default Switch;
//# sourceMappingURL=Switch.js.map