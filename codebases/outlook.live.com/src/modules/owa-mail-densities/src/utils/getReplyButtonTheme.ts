import type { PartialTheme } from '@fluentui/theme';

export function getReplyButtonTheme(densityModeString: string): PartialTheme {
    switch (densityModeString) {
        case 'compact':
            return replyButtonTheme('16px', '24px', '12px');
        case 'medium':
            return replyButtonTheme('16px', '28px', '12px');
        case 'full':
            return replyButtonTheme('20px', '32px', '14px');
        default:
            return {};
    }
}

const replyButtonTheme = (iconSize: string, dimension: string, fontSize: string) => {
    return {
        components: {
            CommandBarButton: {
                styles: {
                    root: {
                        width: dimension,
                        height: dimension,
                        fontSize: fontSize,
                    },
                    icon: {
                        display: 'flex',
                        fontSize: iconSize,
                        height: 'auto',
                    },
                },
            },
            ActionButton: {
                styles: {
                    root: {
                        height: dimension,
                        fontSize: fontSize,
                    },
                    icon: {
                        display: 'flex',
                        fontSize: iconSize,
                        height: 'auto',
                    },
                },
            },
        },
    };
};
