import React from 'react';
import { Alert as ChakraAlert, AlertIcon as ChakraAlertIcon, AlertTitle as ChakraAlertTitle, AlertDescription as ChakraAlertDescription, } from '@chakra-ui/alert';
export const Alert = (props) => React.createElement(ChakraAlert, Object.assign({}, props));
export const AlertIcon = (props) => (React.createElement(ChakraAlertIcon, Object.assign({}, props)));
export const AlertTitle = (props) => (React.createElement(ChakraAlertTitle, Object.assign({}, props)));
export const AlertDescription = (props) => (React.createElement(ChakraAlertDescription, Object.assign({}, props)));
export default Alert;
//# sourceMappingURL=index.js.map