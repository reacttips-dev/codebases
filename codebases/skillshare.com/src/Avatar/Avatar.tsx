import React from 'react';
import { Avatar as MuiAvatar, makeStyles } from '@material-ui/core';
export var AvatarSizes;
(function (AvatarSizes) {
    AvatarSizes["XXSmall"] = "xxs";
    AvatarSizes["XSmall"] = "xs";
    AvatarSizes["Small"] = "small";
    AvatarSizes["Medium"] = "medium";
    AvatarSizes["Large"] = "large";
    AvatarSizes["XLarge"] = "xl";
})(AvatarSizes || (AvatarSizes = {}));
var useStyles = makeStyles(function (_a) {
    var spacing = _a.spacing;
    return ({
        xss: {
            width: spacing(2.5),
            height: spacing(2.5),
        },
        xs: {
            width: spacing(3),
            height: spacing(3),
        },
        small: {
            width: spacing(4),
            height: spacing(4),
        },
        medium: {
            width: spacing(6),
            height: spacing(6),
        },
        large: {
            width: spacing(9),
            height: spacing(9),
        },
        xl: {
            width: spacing(18),
            height: spacing(18),
        },
    });
});
var sizeToPx = {
    xss: {
        width: 20,
        height: 20,
    },
    xs: {
        width: 24,
        height: 24,
    },
    small: {
        width: 32,
        height: 32,
    },
    medium: {
        width: 48,
        height: 48,
    },
    large: {
        width: 72,
        height: 72,
    },
    xl: {
        width: 144,
        height: 144,
    },
};
export function Avatar(props) {
    var classes = useStyles();
    return (React.createElement(MuiAvatar, { imgProps: { width: sizeToPx[props.size].width, height: sizeToPx[props.size].height }, className: classes[props.size], src: props.src, "aria-label": props.alt, alt: props.alt }));
}
//# sourceMappingURL=Avatar.js.map