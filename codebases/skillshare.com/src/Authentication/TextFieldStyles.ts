import { createStyles, makeStyles } from '@material-ui/core';
export var useTextFieldStyles = makeStyles(function (_a) {
    var spacing = _a.spacing, palette = _a.palette, typography = _a.typography;
    return createStyles({
        root: {
            width: '100%',
            '& .MuiOutlinedInput-root': {
                backgroundColor: palette.common.white,
                border: 'none',
                height: spacing(5),
                color: palette.secondary.main,
                fontFamily: typography.fontFamily,
                fontSize: typography.body1.fontSize,
                '& fieldset': {
                    borderColor: palette.border.disabled,
                },
                '&:hover fieldset': {
                    borderColor: palette.border.disabled,
                },
                '&.Mui-focused fieldset': {
                    borderColor: palette.tertiary.main,
                    borderWidth: spacing(0.125),
                },
                '&.Mui-error fieldset': {
                    borderColor: palette.hardAccent.main,
                    borderWidth: spacing(0.125),
                },
                '& .bold': {
                    fontWeight: typography.fontWeightBold,
                },
                '& input': {
                    borderRadius: spacing(0.5),
                    '&::-webkit-input-placeholder': {
                        opacity: 0.8,
                    },
                },
            },
        },
    });
});
export var useTextFieldErrorStyles = makeStyles(function (_a) {
    var typography = _a.typography, palette = _a.palette, spacing = _a.spacing;
    return createStyles({
        root: {
            fontFamily: typography.fontFamily,
            fontSize: typography.caption.fontSize,
            fontWeight: typography.fontWeightBold,
            color: palette.hardAccent.main,
            marginLeft: '25px',
            padding: '15px 0px',
            position: 'relative',
            '&::before, &::after': {
                boxSizing: 'border-box',
                content: "''",
                display: 'inline-block',
                position: 'absolute',
            },
            '&::before': {
                backgroundColor: palette.hardAccent.main,
                borderRadius: '50%',
                height: spacing(2.5),
                left: spacing(3.125) * -1,
                top: spacing(1.5),
                width: spacing(2.5),
            },
            '&::after': {
                backgroundColor: palette.common.white,
                height: spacing(0.5),
                left: spacing(2.75) * -1,
                top: spacing(2.5),
                width: spacing(1.75),
            },
        },
    });
});
//# sourceMappingURL=TextFieldStyles.js.map