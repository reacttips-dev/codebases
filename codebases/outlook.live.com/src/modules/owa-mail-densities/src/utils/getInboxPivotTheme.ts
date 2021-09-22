import type { PartialTheme } from '@fluentui/theme';

export function getInboxPivotTheme(densityModeString: string): PartialTheme {
    if (!densityModeString) {
        return {};
    }
    if (densityModeString === 'full') {
        return inboxPivotTheme('16px', '6px', '5px');
    }
    if (densityModeString === 'medium') {
        return inboxPivotTheme('14px', '-1px', '5px');
    }

    return inboxPivotTheme('12px', '-4px', '0px');
}

const inboxPivotTheme = (fontSize: string, textMarginBottom: string, rootMarginTop: string) => {
    return {
        components: {
            Pivot: {
                styles: {
                    text: {
                        fontSize: fontSize,
                        marginBottom: textMarginBottom,
                    },
                    root: {
                        marginTop: rootMarginTop,
                    },
                },
            },
        },
    };
};
