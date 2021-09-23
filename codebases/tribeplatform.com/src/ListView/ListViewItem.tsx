import React, { forwardRef, useRef, memo } from 'react';
import { ListItem, useMultiStyleConfig } from '@chakra-ui/react';
export const ListViewItem = memo(forwardRef((props, ref) => {
    const styles = useMultiStyleConfig('Dropdown', {});
    const li = useRef(null);
    return (React.createElement(ListItem, Object.assign({ ref: (node) => {
            li.current = node;
            if (typeof ref === 'function') {
                ref(node);
            }
            else if (ref) {
                ref.current = node;
            }
        }, listStyleType: "none", cursor: "pointer", sx: {
            ...styles.item,
            py: 2,
            borderRadius: 'md',
        } }, props)));
}));
//# sourceMappingURL=ListViewItem.js.map