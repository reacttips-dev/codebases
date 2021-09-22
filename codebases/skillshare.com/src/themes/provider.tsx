import React from 'react';
import { ThemeProvider as StyledComponentsThemeProvider } from 'styled-components';
import { ThemeProvider as MuiThemeProvider } from '@material-ui/core';
import { DefaultTheme } from './default';
import { DefaultTheme as DefaultMuiTheme } from './DefaultTheme';
export var ThemeProvider = function (_a) {
    var theme = _a.theme, children = _a.children;
    return (React.createElement(StyledComponentsThemeProvider, { theme: theme }, children));
};
export var DefaultThemeProvider = function (_a) {
    var children = _a.children;
    return (React.createElement(MuiThemeProvider, { theme: DefaultMuiTheme },
        React.createElement(StyledComponentsThemeProvider, { theme: DefaultTheme }, children)));
};
//# sourceMappingURL=provider.js.map