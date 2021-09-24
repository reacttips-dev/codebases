import React from 'react';
import { Drawer as ChakraDrawer, DrawerBody as ChakraDrawerBody, DrawerContent as ChakraDrawerContent, DrawerOverlay as ChakraDrawerOverlay, DrawerHeader as ChakraDrawerHeader, DrawerFooter as ChakraDrawerFooter, DrawerCloseButton as ChakraDrawerCloseButton, } from '@chakra-ui/react';
export const Drawer = (props) => React.createElement(ChakraDrawer, Object.assign({}, props));
export const DrawerBody = (props) => (React.createElement(ChakraDrawerBody, Object.assign({}, props)));
export const DrawerContent = (props) => (React.createElement(ChakraDrawerContent, Object.assign({}, props)));
export const DrawerHeader = props => React.createElement(ChakraDrawerHeader, Object.assign({}, props));
export const DrawerFooter = props => React.createElement(ChakraDrawerFooter, Object.assign({}, props));
export const DrawerOverlay = props => React.createElement(ChakraDrawerOverlay, Object.assign({}, props));
export const DrawerCloseButton = props => React.createElement(ChakraDrawerCloseButton, Object.assign({}, props));
export default Drawer;
//# sourceMappingURL=index.js.map