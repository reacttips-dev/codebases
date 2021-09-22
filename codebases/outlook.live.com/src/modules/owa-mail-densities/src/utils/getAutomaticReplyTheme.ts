import type { PartialTheme } from '@fluentui/theme';

export function getAutomaticReplyTheme(densityModeString: string): PartialTheme {
    switch (densityModeString) {
        case 'compact':
            return automaticReplyTheme('2px 6px', '12px');
            break;
        case 'medium':
            return automaticReplyTheme('2px 10px', '12px');
            break;
        case 'full':
            return automaticReplyTheme('2px 12px', '16px');
            break;
        default:
            return {};
    }
}

const automaticReplyTheme = (padding: string, fontSize: string) => {
    return {
        components: {
            Icon: {
                styles: {
                    root: {
                        padding: padding,
                        fontSize: fontSize,
                    },
                },
            },
        },
    };
};
