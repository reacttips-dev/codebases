import React from 'react';
import { Center, VStack } from '@chakra-ui/react';
import { Text } from '../Text';
export const NonIdealState = ({ title, description, icon, children, ...rest }) => {
    return (React.createElement(Center, Object.assign({}, rest),
        React.createElement(VStack, { spacing: 6 },
            icon,
            React.createElement(VStack, { maxW: "sm", spacing: "4" },
                title && (React.createElement(Text, { textStyle: "semibold/xlarge", textAlign: "center" }, title)),
                React.createElement(Text, { textStyle: "regular/medium", color: "label.secondary", textAlign: "center" }, description),
                children))));
};
//# sourceMappingURL=NonIdealState.js.map