import React from 'react';
import { Spinner as ChakraSpinner } from '@chakra-ui/react';
export const Spinner = props => {
    return (React.createElement(ChakraSpinner, Object.assign({ mr: "5px", color: "accent.base", thickness: "4px", speed: "0.65s", emptyColor: "bg.secondary", size: "md" }, props)));
};
export default Spinner;
//# sourceMappingURL=index.js.map