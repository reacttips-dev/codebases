import * as React from 'react';
import { Box } from '@chakra-ui/layout';
import { toast, } from '@chakra-ui/react';
import { ColorModeContext, ThemeProvider, useChakra, } from '@chakra-ui/system';
import defaultTheme from '@chakra-ui/theme';
import { isFunction, noop } from '@chakra-ui/utils';
import { Alert, AlertDescription, AlertIcon, AlertTitle, } from '../Alert';
import { CloseButton } from '../Button';
const statusColorsMap = {
    success: 'success',
    warning: 'warning',
    error: 'danger',
};
const Toast = props => {
    const { status, variant, id, title, isClosable, onClose, description, icon, width, } = props;
    const colorScheme = statusColorsMap[status];
    return (React.createElement(Alert, { status: status, variant: variant, id: id, m: 3, right: 5, boxShadow: "sm", width: width || 'auto' },
        React.createElement(AlertIcon, { color: `${colorScheme}.base`, as: icon }),
        React.createElement(Box, { flex: "1" },
            title && React.createElement(AlertTitle, null, title),
            description && (React.createElement(AlertDescription, { display: "block" }, description))),
        isClosable && (React.createElement(CloseButton, { size: "sm", onClick: onClose, position: "absolute", right: 1, top: 1 }))));
};
const defaults = {
    duration: 5000,
    position: 'top-right',
    variant: 'outline',
    isClosable: true,
};
export const defaultStandaloneParam = {
    theme: defaultTheme,
    colorMode: 'light',
    toggleColorMode: noop,
    setColorMode: noop,
    defaultOptions: defaults,
};
/**
 * Create a toast from outside of React Components
 */
export function createStandaloneToast({ theme = defaultStandaloneParam.theme, colorMode = defaultStandaloneParam.colorMode, toggleColorMode = defaultStandaloneParam.toggleColorMode, setColorMode = defaultStandaloneParam.setColorMode, defaultOptions = defaultStandaloneParam.defaultOptions, } = defaultStandaloneParam) {
    const renderWithProviders = (props, options) => (React.createElement(ThemeProvider, { theme: theme },
        React.createElement(ColorModeContext.Provider, { value: { colorMode, setColorMode, toggleColorMode } }, isFunction(options.render) ? (options.render(props)) : (React.createElement(Toast, Object.assign({}, props, options))))));
    const toastImpl = (options) => {
        const opts = { ...defaultOptions, ...options };
        const Message = props => renderWithProviders(props, opts);
        return toast.notify(Message, opts);
    };
    toastImpl.close = toast.close;
    toastImpl.closeAll = toast.closeAll;
    // toasts can only be updated if they have a valid id
    toastImpl.update = (id, options) => {
        if (!id)
            return;
        const opts = { ...defaultOptions, ...options };
        toast.update(id, {
            ...opts,
            message: props => renderWithProviders(props, opts),
        });
    };
    toastImpl.isActive = toast.isActive;
    return toastImpl;
}
/**
 * React hook used to create a function that can be used
 * to show toasts in an application.
 */
export function useToast(options) {
    const { theme, setColorMode, toggleColorMode, colorMode } = useChakra();
    return React.useMemo(() => createStandaloneToast({
        theme,
        colorMode,
        setColorMode,
        toggleColorMode,
        defaultOptions: options,
    }), [theme, setColorMode, toggleColorMode, colorMode, options]);
}
export default useToast;
//# sourceMappingURL=use-toast.js.map