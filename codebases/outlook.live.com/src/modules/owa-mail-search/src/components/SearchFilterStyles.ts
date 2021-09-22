import type { IButtonStyles } from '@fluentui/react/lib/Button';
import { getPalette } from 'owa-theme';
import { FontWeights } from '@fluentui/style-utilities';
import { getDensityModeString } from 'owa-fabric-theme';
import { isFeatureEnabled } from 'owa-feature-flags';

export function getFilterButtonStyles(): IButtonStyles {
    const palette = getPalette();
    const isMonDensitiesEnabled = isFeatureEnabled('mon-densities');

    return {
        root: {
            border: '1px solid ' + palette.neutralTertiaryAlt,
            padding: '0 4px',
            marginRight: '12px',
            borderRadius: '15px',
            minWidth: '0px',
            color: palette.neutralSecondary,
            height: isMonDensitiesEnabled ? heightDensityValues(getDensityModeString()) : undefined,
        },
        rootCheckedHovered: {
            border: '1px solid ' + palette.themeDarkAlt,
            color: palette.white,
            backgroundColor: palette.themeDark,
        },
        rootHovered: {
            border: '1px solid ' + palette.neutralDark,
            backgroundColor: palette.neutralLighter,
            color: palette.neutralPrimary,
        },
        rootChecked: {
            border: '1px solid ' + palette.themeDarkAlt,
            color: palette.white,
            backgroundColor: palette.themePrimary,
        },
        rootCheckedPressed: {
            border: '1px solid ' + palette.themeDarkAlt,
            color: palette.white,
            backgroundColor: palette.themeDarker,
        },
        label: {
            fontWeight: FontWeights.regular,
        },
    };
}

const heightDensityValues = (densityName: string) => {
    switch (densityName) {
        case 'full':
            return '32px';
        case 'medium':
            return '28px';
        case 'compact':
            return '24px';
        default:
            return undefined;
    }
};

export function getMoreFiltersButtonStyles(): IButtonStyles {
    const palette = getPalette();
    const isMonDensitiesEnabled = isFeatureEnabled('mon-densities');

    return {
        root: {
            color: palette.themePrimary,
            padding: '0px',
            left: '-4px', // Move advanced search left to account for fluent button padding while maintaining 12px distance to leftmost filter
            height: isMonDensitiesEnabled ? heightDensityValues(getDensityModeString()) : undefined,
        },
    };
}
