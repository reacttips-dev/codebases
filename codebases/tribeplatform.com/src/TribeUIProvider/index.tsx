import React from 'react';
import { extendTheme, ChakraProvider } from '@chakra-ui/react';
import Color from 'color';
import set from 'lodash.set';
import { ResponsiveProvider } from '../ResponsiveProvider';
import { theme } from '../theme';
export const TribeUIProvider = ({ resetCSS = true, children, themeSettings, isPreview = false, userAgent, }) => {
    // TODO: Reenable color modes
    const themeSettingsFormatted = formatThemeSettings(themeSettings);
    // const formattedThemeSettings = null;
    // Merged in the order of precendence: theme < theme settings
    const mergedTheme = extendTheme({
        config: isPreview
            ? {
                cssVarPrefix: 'preview',
            }
            : undefined,
        ...themeSettingsFormatted,
    }, theme);
    return (React.createElement(ChakraProvider, { theme: mergedTheme, resetCSS: resetCSS },
        React.createElement(ResponsiveProvider, { userAgent: userAgent }, children)));
};
const formatThemeSettings = (themeSettings) => {
    if (!themeSettings)
        return null;
    const dynamicThemeSettings = applyDynamicTheme(themeSettings);
    const formattedThemeSettings = {};
    Object.entries(dynamicThemeSettings).forEach(([settingKey, themeTokens]) => {
        if (Array.isArray(themeTokens)) {
            themeTokens.forEach(themeToken => {
                set(formattedThemeSettings, `${settingKey}.${themeToken.key}`, themeToken.value);
            });
        }
    });
    return formattedThemeSettings;
};
const applyDynamicTheme = (themeSettings) => {
    const dynamicThemeSettings = {};
    Object.entries(themeSettings).forEach(([settingKey, themeTokens]) => {
        if (Array.isArray(themeTokens) && settingKey === 'colors') {
            const dynamicThemeTokens = [];
            themeTokens.forEach(themeToken => {
                const newColorSettings = getColorSchema(themeToken);
                if (newColorSettings != null) {
                    dynamicThemeTokens.push(...newColorSettings);
                }
            });
            dynamicThemeSettings[settingKey] = themeTokens.concat(dynamicThemeTokens);
        }
        else {
            dynamicThemeSettings[settingKey] = themeTokens;
        }
    });
    return dynamicThemeSettings;
};
const getColorSchema = (themeToken) => {
    try {
        // catch the event if Color is invalid
        const color = Color(themeToken.value);
        switch (themeToken.key) {
            case 'accent.base': {
                const accentHoverColor = color.saturate(-0.2).lighten(-0.2);
                return [
                    {
                        key: 'accent.hover',
                        value: accentHoverColor.hex(),
                    },
                    {
                        key: 'accent.pressed',
                        value: accentHoverColor
                            .saturate(-0.2)
                            .lighten(-0.2)
                            .hex(),
                    },
                    {
                        key: 'accent.lite',
                        value: color.lightness(95).hex(),
                    },
                ];
            }
            case 'bg.base':
                return [
                    {
                        key: 'border.base',
                        value: color.isLight()
                            ? color.darken(0.15).hex()
                            : color.lightness(40).hex(),
                    },
                    {
                        key: 'border.lite',
                        value: color.isLight()
                            ? color.darken(0.08).hex()
                            : color.lightness(25).hex(),
                    },
                ];
            default:
                return null;
        }
    }
    catch {
        return null;
    }
};
//# sourceMappingURL=index.js.map