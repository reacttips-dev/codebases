import type { PartialTheme } from '@fluentui/theme';
import { getPaletteAsRawColors } from 'owa-theme';

export function getIconBarTheme(densityModeString: string): PartialTheme {
    if (!densityModeString) {
        return {};
    }
    if (densityModeString === 'compact') {
        return getIconBarStyle('16px', '2px', '7px');
    }
    if (densityModeString === 'medium') {
        return getIconBarStyle('16px', '2px', '7px');
    }
    return getIconBarStyle('20px', '4px 2px', '11px');
}

const getIconBarStyle = (fontSize: string, margin: string, spaceBetweenIcons: string) => {
    return {
        components: {
            IconButton: {
                styles: {
                    root: {
                        height: 'auto',
                        width: 'auto',
                        marginLeft: spaceBetweenIcons,
                    },
                    icon: {
                        // The fluent icon height automatically assigns a line height which we need to override.
                        lineHeight: 'normal',
                        fontSize: fontSize,
                        alignItems: 'center',
                        display: 'flex',
                        margin,
                    },
                    flexContainer: {
                        height: 'auto',
                    },
                },
            },
            Icon: {
                styles: {
                    root: {
                        fontSize: fontSize,
                        margin,
                        textAlign: 'center',
                        alignItems: 'center',
                        display: 'flex',
                        color: getPaletteAsRawColors().neutralSecondary,
                        paddingLeft: spaceBetweenIcons,
                    },
                },
            },
        },
    };
};
