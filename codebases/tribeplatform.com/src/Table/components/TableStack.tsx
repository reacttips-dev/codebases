import React from 'react';
import { VStack } from '@chakra-ui/react';
import { Divider } from '../../Divider/Divider';
export const TableStack = ({ children, ...rest }) => (React.createElement(VStack, Object.assign({ w: "full", alignItems: "stretch", borderTopRadius: ['none', 'md'], borderBottomRadius: ['none', 'md'], bgColor: "bg.base", border: "1px solid", borderColor: "border.base", spacing: 0, divider: React.createElement(Divider, null) }, rest), children));
//# sourceMappingURL=TableStack.js.map