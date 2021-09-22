import { createStyles, makeStyles } from '@material-ui/core';
export var useSocialButtonStyles = makeStyles(function (_a) {
    var spacing = _a.spacing, palette = _a.palette, typography = _a.typography;
    return createStyles({
        root: {
            height: spacing(5),
            width: '100%',
            border: spacing(0.125),
            backgroundColor: palette.common.white,
            borderStyle: 'solid',
            borderColor: palette.border.main,
            borderRadius: spacing(0.5),
            letterSpacing: spacing(0.025),
            fontWeight: typography.fontWeightBold,
            fontFamily: typography.fontFamily,
            fontSize: typography.fontSize * 1.07,
            '&.Mui-disabled': {
                cursor: 'default',
                color: palette.common.white,
                borderStyle: 'none',
                backgroundColor: '#dcdee1',
            },
        },
        label: {
            justifyContent: 'flex-start',
        },
        startIcon: {
            marginRight: spacing(5.875),
        },
        startIconDisabled: {
            marginRight: spacing(14.375),
        },
    });
});
//# sourceMappingURL=SocialButtonStyles.js.map