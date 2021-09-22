import { FontSizes, FontWeights } from '@fluentui/style-utilities';
import type {
    ReadWriteCommonWellItemStyleProps,
    ReadWriteCommonWellItemStyles,
} from './ReadWriteCommonWellItem.types';

export const getStyles = (
    props: ReadWriteCommonWellItemStyleProps
): ReadWriteCommonWellItemStyles => {
    const {
        theme,
        isSmallSize,
        isRegularSize,
        isItemAligned,
        isSelected,
        isValid,
        isExpandable,
        isExpanding,
        isFadedOut,
        maxItemWidth,
    } = props;
    const { palette } = theme;
    const wellItemSmallSize = 24;
    const wellItemRegularSize = 32;

    const fadedOutOpacity = 0.2;

    return {
        wellItem: [
            {
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                whiteSpace: 'nowrap',
                opacity: isFadedOut ? fadedOutOpacity : 1,
            },
        ],
        removeWellItemButton: [
            {
                borderRadius: '50%',
                display: 'inline-block',
            },
            isSmallSize && {
                height: wellItemSmallSize,
                width: wellItemSmallSize,
            },
            isRegularSize && {
                height: wellItemRegularSize,
                width: wellItemRegularSize,
            },
        ],
        wellItemImage: [
            {
                display: 'inline-block',
                verticalAlign: 'top',
            },
        ],
        wellItemText: [
            'ReadWriteCommonWell-wellItemText',
            {
                margin: '0 8px',
                fontWeight: FontWeights.regular,
                color: palette.themeDark,
                fontSize: FontSizes.medium,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
            },
            !isValid && {
                color: palette.red,
            },
            isSelected && {
                color: palette.white,
            },
            isSmallSize && {
                display: 'inline-block',
                maxWidth: '240px',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
            },
            isRegularSize && {
                padding: '8px 0',
                lineHeight: '1em',
            },
        ],
        copyInput: [
            {
                // Taken from http://stackoverflow.com/questions/400212/how-do-i-copy-to-the-clipboard-in-javascript
                position: 'fixed',
                top: '0',
                left: '0',
                width: '2em',
                height: '2em',
                padding: '0',
                border: 'none',
                outline: 'none',
                boxShadow: 'none',
                background: 'transparent',
            },
        ],
        expandGroupButton: [
            {
                borderRadius: '15px 0 0 15px',
                width: '48px',
                display: 'none',
                textAlign: 'center',
                position: 'absolute',
                left: '0',
                opacity: isFadedOut ? fadedOutOpacity : 1,
            },
            isSmallSize && {
                height: wellItemSmallSize,
                lineHeight: wellItemSmallSize,
                paddingRight: wellItemSmallSize / 2,
            },
            isRegularSize && {
                height: wellItemRegularSize,
                lineHeight: '1em',
                paddingRight: wellItemRegularSize / 2,
            },
            isExpandable && {
                display: 'inline-block',
            },
        ],
        actionButtonHovered: [
            !isExpanding && {
                backgroundColor: palette.themeLight,
            },
            !isExpanding &&
                isSelected && {
                    backgroundColor: palette.themeDark,
                },
        ],
        actionButtonPressed: [
            {
                backgroundColor: palette.themeDark,
            },
        ],
        actionButtonIcon: [
            'ReadWriteCommonWell-actionButtonIcon',
            {
                fontSize: FontSizes.medium,
            },
            {
                color: palette.themeDark,
            },
            isSelected && {
                color: palette.white,
            },
        ],
        wellItemBox: [
            {
                backgroundColor: palette.themeLighterAlt,
                borderRadius: '16px',
                position: 'relative',
                display: 'inline-block',
                verticalAlign: 'bottom',
            },
            isSelected && {
                backgroundColor: palette.themePrimary,
            },
            isSmallSize && {
                margin: '2px',
            },
            isRegularSize &&
                !isItemAligned && {
                    margin: '10px 4px 0 4px',
                },
            isRegularSize &&
                isItemAligned && {
                    margin: '10px 4px 0 0',
                },
            isExpandable && {
                paddingLeft: '30px',
            },
            [
                !isSelected && {
                    selectors: {
                        ':hover': {
                            backgroundColor: palette.themeLighter,
                        },
                        ':active': {
                            backgroundColor: palette.themePrimary,
                        },
                        ':active .ReadWriteCommonWell-wellItemText': {
                            color: palette.white,
                        },
                        ':active .ReadWriteCommonWell-actionButtonIcon': {
                            color: palette.white,
                        },
                    },
                },
            ],
        ],
        personaInfoWrapper: [
            {
                display: 'flex',
                alignItems: 'center',
                maxWidth: maxItemWidth,
            },
        ],
        // we need to have this style to override fabric WellItemBox :active when the focused/active element
        // is inside wellItemBox, instead of using "focus-within" selector which is not supported by Edge/IE
        // for location pills, text color of palette.white is not readable in dark mode
        focusedWellItemBox: [
            {
                backgroundColor: palette.themePrimary,
                selectors: {
                    '.ReadWriteCommonWell-wellItemText': {
                        color: 'white',
                    },
                    ':hover .ReadWriteCommonWell-wellItemText': {
                        color: palette.themeDark,
                    },
                    ':active .ReadWriteCommonWell-wellItemText': {
                        color: 'white',
                    },
                    '.ReadWriteCommonWell-actionButtonIcon': {
                        color: 'white',
                    },
                    ':hover .ReadWriteCommonWell-actionButtonIcon': {
                        color: palette.themeDark,
                    },
                    ':active .ReadWriteCommonWell-actionButtonIcon': {
                        color: 'white',
                    },
                },
            },
        ],
    };
};
