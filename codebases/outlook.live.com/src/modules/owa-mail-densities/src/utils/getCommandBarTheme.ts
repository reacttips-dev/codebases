import { mediumCommandBarDensity } from '../components/commandbar/mediumCommandBar';
import { fullCommandBarDensity } from '../components/commandbar/fullCommandBar';
import { compactCommandBarDensity } from '../components/commandbar/compactCommandBar';
import type { PartialTheme } from '@fluentui/theme';

export function getCommandBarTheme(densityModeString: string): PartialTheme {
    if (densityModeString === 'compact') {
        return compactCommandBarDensity;
    } else if (densityModeString === 'medium') {
        return mediumCommandBarDensity;
    } else {
        return fullCommandBarDensity;
    }
}

export function getNewMessageButtonTheme(
    densityModeString: string,
    isSplitButton: boolean
): PartialTheme {
    if (densityModeString === 'compact') {
        return newMessageButtonMargin('4px', isSplitButton);
    } else if (densityModeString === 'medium') {
        return newMessageButtonMargin('6px', isSplitButton);
    } else {
        return newMessageButtonMargin('8px', isSplitButton);
    }
}

const newMessageButtonMargin = (marginRight: string, isSplitButton: boolean) => {
    // For now, the split button just change margin right and left, since we need to change
    // the outter container for split button scenarios.
    if (isSplitButton) {
        return {
            components: {
                CommandBarButton: {
                    styles: { root: { margin: '0px ' + marginRight + ' 0px 12px' } },
                },
            },
        };
    }
    return {
        components: {
            CommandBarButton: {
                styles: { root: { margin: '6px ' + marginRight + ' 6px 12px' } },
            },
        },
    };
};
