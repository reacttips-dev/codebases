import React from 'react';
import { useStyles } from '@chakra-ui/system';
import { Text } from '../Text';
export const SidebarGroup = props => {
    const styles = useStyles();
    return React.createElement(Text, Object.assign({ sx: styles.group }, props));
};
//# sourceMappingURL=SidebarGroup.js.map