import React from 'react';
import { TribeUIProvider } from '../../TribeUIProvider';
export const withTheme = (Component) => (props) => {
    const componentProps = { ...props };
    componentProps === null || componentProps === void 0 ? true : delete componentProps.themeSettings;
    return (React.createElement(TribeUIProvider, { themeSettings: props === null || props === void 0 ? void 0 : props.themeSettings },
        React.createElement(Component, Object.assign({}, componentProps))));
};
//# sourceMappingURL=withTheme.js.map