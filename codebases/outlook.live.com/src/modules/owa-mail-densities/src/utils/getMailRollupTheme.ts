import type { PartialTheme } from '@fluentui/theme';

export function getMailRollupTheme(densityModeString: string): PartialTheme {
    switch (densityModeString) {
        case 'compact':
            return getIconStyle('16px', '4px 8px');
        case 'medium':
            return getIconStyle('16px', '4px 12px');
        case 'full':
            return getIconStyle('20px', '6px 14px 6px 18px');
        default:
            return {};
    }
}

const getIconStyle = (size: string, margin: string) => {
    return {
        components: {
            IconButton: {
                styles: {
                    icon: {
                        fontSize: size,
                    },
                    root: {
                        margin: margin,
                    },
                },
            },
            Icon: {
                styles: {
                    root: {
                        fontSize: size,
                    },
                },
            },
        },
    };
};
