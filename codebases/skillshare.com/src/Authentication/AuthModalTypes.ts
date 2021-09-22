import { createStyles, makeStyles } from '@material-ui/core';
export var useDialogStyles = makeStyles(function (_a) {
    var _b;
    var spacing = _a.spacing, breakpoints = _a.breakpoints;
    return createStyles({
        root: {
            '& .MuiBackdrop-root': {
                backgroundColor: 'rgba(0, 0, 0, 0.8)',
            },
        },
        paper: {
            borderRadius: 3,
        },
        paperWidthSm: (_b = {
                maxWidth: spacing(83.5),
                width: spacing(83.5)
            },
            _b[breakpoints.down('sm')] = {
                maxWidth: 'calc(100% - 16px)',
                width: 'calc(100% - 16px)',
                margin: spacing(1),
                top: 0,
                position: 'absolute',
            },
            _b),
    });
});
export var useDialogContentStyles = makeStyles(function (_a) {
    var _b, _c, _d;
    var palette = _a.palette, spacing = _a.spacing, breakpoints = _a.breakpoints;
    return createStyles({
        root: {
            padding: spacing(0),
            overflow: 'hidden',
            '&:first-child': {
                paddingTop: spacing(0),
            },
        },
        leftPane: (_b = {
                display: 'flex',
                backgroundColor: palette.secondary.main
            },
            _b[breakpoints.down('xs')] = {
                width: '100%',
            },
            _b['& .content'] = (_c = {
                    padding: spacing(3.75),
                    minWidth: spacing(34.75)
                },
                _c[breakpoints.down('xs')] = {
                    padding: spacing(4, 4, 3),
                    width: '100%',
                },
                _c),
            _b['& .header-text, .sub-header-text, h4'] = {
                color: palette.common.white,
            },
            _b['& .sub-header-text, h4'] = {
                fontWeight: 'normal',
            },
            _b['& .divider'] = {
                width: spacing(12.5),
                margin: spacing(3, 0),
                borderRadius: spacing(1),
                border: spacing(0.5),
                borderColor: palette.primary.main,
                borderStyle: 'solid',
            },
            _b['& .name'] = {
                color: palette.common.white,
                fontWeight: 'bold',
            },
            _b),
        rightPane: {
            '& .content': (_d = {
                    padding: spacing(7, 5, 5)
                },
                _d[breakpoints.down('xs')] = {
                    padding: spacing(6, 3, 4),
                    width: '100%',
                },
                _d),
        },
    });
});
export var useDialogCloseButtonStyles = makeStyles(function (_a) {
    var _b;
    var palette = _a.palette, spacing = _a.spacing, breakpoints = _a.breakpoints;
    return createStyles({
        root: {
            position: 'absolute',
            right: spacing(2),
            top: spacing(2),
            padding: 0,
            '&:hover': {
                backgroundColor: 'transparent',
            },
            '& svg': (_b = {},
                _b[breakpoints.down('xs')] = {
                    fill: palette.common.white,
                },
                _b),
        },
    });
});
//# sourceMappingURL=AuthModalTypes.js.map