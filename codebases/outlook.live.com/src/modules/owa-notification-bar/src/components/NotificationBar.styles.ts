import { getPalette } from 'owa-theme';
import type { IButtonStyles } from '@fluentui/react/lib/Button';
import { useComputedValue } from 'owa-react-hooks/lib/useComputed';

const RIGHT_PADDING = 8;

import styles from './NotificationBar.scss';

export function useActionButtonStyles(showButtonsOnBottom: boolean): IButtonStyles {
    return useComputedValue(
        () => ({
            root: {
                backgroundColor: getPalette().neutralSecondary,
                marginRight: showButtonsOnBottom ? '0px' : RIGHT_PADDING + 'px',
                borderStyle: 'solid',
                borderWidth: '1px',
                borderColor: getPalette().white,
                height: showButtonsOnBottom ? '24px' : null,
                marginBottom: showButtonsOnBottom ? '11px' : null,
                padding: showButtonsOnBottom ? '4px' : null,
            },
            rootHovered: {
                backgroundColor: getPalette().neutralPrimaryAlt,
                borderColor: getPalette().white,
            },
            rootPressed: {
                backgroundColor: getPalette().neutralDark,
                borderColor: getPalette().white,
            },
            textContainer: {
                overflow: 'hidden',
            },
            label: styles.actionButtonText,
        }),
        [showButtonsOnBottom]
    );
}

export function useDismissButtonStyles(): IButtonStyles {
    return useComputedValue(
        () => ({
            root: {
                marginRight: RIGHT_PADDING + 'px',
                color: getPalette().white,
            },
            rootHovered: {
                color: getPalette().white,
                backgroundColor: getPalette().neutralPrimaryAlt,
            },
            rootPressed: {
                color: getPalette().white,
                backgroundColor: getPalette().neutralDark,
            },
        }),
        []
    );
}
