import React from 'react';
import { Flex } from '@chakra-ui/react';
import { StylesProvider, useMultiStyleConfig } from '@chakra-ui/system';
export const Sidebar = ({ variant, children, ...rest }) => {
    const styles = useMultiStyleConfig('Sidebar', { variant });
    const containerStyles = {
        flexDirection: 'column',
        flexGrow: '1',
        width: '100%',
        ...styles.container,
    };
    return (React.createElement(StylesProvider, { value: styles },
        React.createElement(Flex, Object.assign({ as: "nav", overflow: "hidden auto" }, rest, { sx: containerStyles }), children)));
};
//# sourceMappingURL=Sidebar.js.map