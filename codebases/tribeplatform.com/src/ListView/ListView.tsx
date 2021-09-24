import React, { forwardRef, memo } from 'react';
import { Button, List, ListIcon, Popover, PopoverBody, PopoverContent, PopoverTrigger, StylesProvider, useMultiStyleConfig, useStyles, } from '@chakra-ui/react';
import { createContext } from '@chakra-ui/react-utils';
import { runIfFn } from '@chakra-ui/utils';
const [ListViewProvider, useListViewContext] = createContext({
    name: 'ListViewContext',
});
export const useListView = useListViewContext;
export const ListView = ({ children, isOpen, popoverProps, }) => {
    const styles = useMultiStyleConfig('Dropdown', {});
    return (React.createElement(Popover, Object.assign({ placement: "auto", isOpen: isOpen, autoFocus: false, closeOnBlur: true, closeOnEsc: true, flip: true }, popoverProps), ({ isOpen, onClose }) => (React.createElement(ListViewProvider, { value: { isOpen } },
        React.createElement(StylesProvider, { value: styles }, runIfFn(children, { isOpen, onClose }))))));
};
export const ListViewTrigger = forwardRef((props, ref) => {
    const styles = useStyles();
    return (React.createElement(PopoverTrigger, null,
        React.createElement(Button, Object.assign({ ref: ref }, props, { sx: styles.button }))));
});
export const ListViewContent = memo(forwardRef(({ children, popoverBodyProps, popoverContentProps, ...props }, ref) => {
    const styles = useStyles();
    return (React.createElement(PopoverContent, Object.assign({}, popoverContentProps),
        React.createElement(PopoverBody, Object.assign({ overflow: "hidden", borderRadius: "sm", boxShadow: "md" }, popoverBodyProps),
            React.createElement(List, Object.assign({ ref: ref, maxW: "xs", maxH: "3xs", sx: {
                    ...styles.list,
                    p: 2,
                } }, props), children))));
}));
export const ListViewIcon = ListIcon;
//# sourceMappingURL=ListView.js.map