var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
import { createMuiTheme } from '@material-ui/core';
import { BrandColors, SupplementaryColors } from './Colors';
import { Logo } from './Logo';
var baseTheme = createMuiTheme({
    typography: {
        fontFamily: ['"GT Walsheim Pro"', 'Arial', 'sans-serif'].join(','),
        h1: {
            fontSize: 36,
            fontWeight: 'bold',
            lineHeight: 1.22,
        },
        h2: {
            fontSize: 26,
            fontWeight: 'bold',
            lineHeight: 1.23,
        },
        h3: {
            fontSize: 22,
            fontWeight: 'bold',
            lineHeight: 1.27,
        },
        h4: {
            fontSize: 18,
            fontWeight: 'bold',
            lineHeight: 1.33,
        },
        h5: {
            fontSize: 15,
            fontWeight: 'bold',
            lineHeight: 1.33,
        },
        h6: {
            fontSize: 13,
            fontWeight: 'bold',
            lineHeight: 1.38,
        },
        body1: {
            fontSize: 15,
            lineHeight: 1.33,
        },
        body2: {
            fontSize: 18,
            lineHeight: 1.33,
        },
        caption: {
            fontSize: 13,
            lineHeight: 1.38,
        },
        overline: {
            fontSize: 13,
            textTransform: 'uppercase',
            lineHeight: 1.38,
        },
        button: {
            fontSize: 13,
            textTransform: 'none',
            lineHeight: 1.38,
        },
    },
    palette: {
        primary: { main: BrandColors.WANDERGREEN },
        secondary: { main: BrandColors.NAVY },
        text: {
            primary: BrandColors.NAVY,
            secondary: SupplementaryColors.DARKCHARCOAL,
        },
    },
    shape: {
        borderRadius: 4,
    },
    props: {
        MuiButtonBase: { disableRipple: true },
        MuiModal: {
            style: {
                zIndex: 10003,
            },
        },
    },
    overrides: {
        MuiCssBaseline: {
            '@global': {
                '@keyframes pulse': {
                    from: {
                        opacity: 1,
                    },
                    to: {
                        opacity: 0,
                    },
                },
                '.ReactModal__Body--open': {
                    overflow: 'hidden',
                },
                '.grecaptcha-badge': {
                    visibility: 'hidden',
                },
            },
        },
        MuiButton: {
            containedSecondary: {
                '&:hover': {
                    backgroundColor: BrandColors.WANDERGREEN,
                },
                '&:disabled': {
                    color: BrandColors.CHARCOAL,
                },
            },
        },
        MuiCheckbox: {
            colorPrimary: {
                backgroundColor: 'transparent',
                '&:hover, &.Mui-checked:hover': {
                    backgroundColor: 'transparent !important',
                },
            },
            colorSecondary: {
                backgroundColor: 'transparent',
                '&:hover, &.Mui-checked:hover': {
                    backgroundColor: 'transparent !important',
                },
            },
        },
        MuiLink: {
            root: {
                color: BrandColors.NAVY,
            },
        },
        MuiListItem: {
            button: {
                '&:hover': {
                    backgroundColor: BrandColors.CONCRETE,
                },
            },
        },
    },
});
var augmentColor = baseTheme.palette.augmentColor;
var theme = __assign(__assign({}, baseTheme), { logo: Logo, palette: __assign(__assign({}, baseTheme.palette), { border: {
            main: BrandColors.CHARCOAL,
            disabled: BrandColors.CONCRETE,
        }, paper: { canvas: BrandColors.CANVAS }, cardShadow: augmentColor({ main: SupplementaryColors.PHILIPPINESILVER }), hardAccent: augmentColor({ main: BrandColors.RED }), lightAccent: augmentColor({ main: BrandColors.BLUE }), mediumAccent: augmentColor({ main: BrandColors.YELLOW }), tertiary: augmentColor({ main: BrandColors.VIOLET }) }) });
export var DefaultTheme = theme;
//# sourceMappingURL=DefaultTheme.js.map