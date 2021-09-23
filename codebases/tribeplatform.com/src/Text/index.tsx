import React, { forwardRef } from 'react';
import { Text as ChakraText, useStyleConfig, } from '@chakra-ui/react';
export const Text = forwardRef((props, ref) => {
    const styles = useStyleConfig('Text', props);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { ellipsis, ...elementProps } = props;
    return React.createElement(ChakraText, Object.assign({ sx: styles, ref: ref }, elementProps));
});
export default Text;
//# sourceMappingURL=index.js.map