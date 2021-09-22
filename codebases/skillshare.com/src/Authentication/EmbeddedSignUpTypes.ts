import { createStyles, makeStyles } from '@material-ui/core';
export var monolithMStart = 376;
export var monolithEmbeddedStarts = 541;
export var monolithLStarts = 990;
export var useEmbeddedSignUpStyles = makeStyles(function (_a) {
    var _b, _c, _d, _e, _f, _g;
    var spacing = _a.spacing, typography = _a.typography, breakpoints = _a.breakpoints;
    return createStyles({
        form: (_b = {},
            _b["@media (min-width:" + monolithMStart + "px)"] = {
                width: 330,
            },
            _b["@media (min-width:" + monolithEmbeddedStarts + "px)"] = {
                width: '100%',
            },
            _b),
        formMui: (_c = {
                width: 330
            },
            _c[breakpoints.up('sm')] = {
                width: '100%',
            },
            _c),
        marketing: (_d = {
                display: 'none',
                fontFamily: ['"Kumlien Pro"', 'serif'].join(','),
                textAlign: 'center',
                marginBottom: spacing(0.5)
            },
            _d["@media (min-width:" + monolithEmbeddedStarts + "px)"] = {
                display: 'block',
            },
            _d),
        subTitle: (_e = {
                textAlign: 'center'
            },
            _e["@media (min-width:" + monolithEmbeddedStarts + "px)"] = {
                fontSize: typography.body2.fontSize,
                lineHeight: typography.body2.lineHeight,
                fontWeight: typography.body2.fontWeight,
            },
            _e),
        'subTitle-gr_locd_atf': (_f = {
                textAlign: 'center'
            },
            _f["@media (min-width:" + monolithEmbeddedStarts + "px)"] = {
                fontSize: typography.h3.fontSize,
                lineHeight: typography.h3.lineHeight,
                fontWeight: typography.h3.fontWeight,
            },
            _f),
        formContainer: {
            marginTop: spacing(3),
        },
        iconContainer: (_g = {
                display: 'flex',
                justifyContent: 'center',
                marginTop: spacing(3.25)
            },
            _g[breakpoints.up('sm')] = {
                display: 'none',
            },
            _g),
    });
});
export var useEmbeddedSignUpCardStyles = makeStyles(function (_a) {
    var _b, _c;
    var spacing = _a.spacing, breakpoints = _a.breakpoints, palette = _a.palette;
    return createStyles({
        root: (_b = {
                alignItems: 'center',
                backgroundColor: function (props) { var _a, _b; return (_b = (_a = props.config) === null || _a === void 0 ? void 0 : _a.backgroundColor) !== null && _b !== void 0 ? _b : palette.common.white; },
                borderRadius: 0,
                boxShadow: 'none',
                boxSizing: 'border-box',
                display: 'flex',
                flexDirection: 'column',
                padding: spacing(4, 3),
                width: '100%',
                '& .MuiButton-startIcon': {
                    marginRight: spacing(6.75),
                },
                '& .form-separator > p': {
                    backgroundColor: function (props) { var _a, _b; return (_b = (_a = props.config) === null || _a === void 0 ? void 0 : _a.backgroundColor) !== null && _b !== void 0 ? _b : palette.common.white; },
                }
            },
            _b["@media (min-width:" + monolithEmbeddedStarts + "px)"] = {
                borderRadius: spacing(2),
                boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',
                width: 346,
                '& .MuiButton-startIcon': {
                    marginRight: spacing(4.875),
                },
            },
            _b["@media (min-width:" + monolithLStarts + "px)"] = {
                width: 407,
                '& .MuiButton-startIcon': {
                    marginRight: spacing(8.75),
                },
            },
            _b),
        cardMui: (_c = {
                boxShadow: 'none',
                borderRadius: 0,
                width: '100%',
                '& .MuiButton-startIcon': {
                    marginRight: spacing(6.75),
                }
            },
            _c[breakpoints.up('sm')] = {
                width: 346,
                boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',
                borderRadius: spacing(2),
                '& .MuiButton-startIcon': {
                    marginRight: spacing(4.875),
                },
            },
            _c[breakpoints.up('lg')] = {
                width: 407,
                '& .MuiButton-startIcon': {
                    marginRight: spacing(8.75),
                },
            },
            _c),
    });
});
//# sourceMappingURL=EmbeddedSignUpTypes.js.map