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
import React from 'react';
import { Typography } from '@material-ui/core';
import { createStyles, makeStyles } from '@material-ui/core/styles';
import { getProfileUrl, UserIdentityTypes } from '../UserIdentity';
var useStyles = makeStyles(function (_a) {
    var typography = _a.typography, palette = _a.palette, spacing = _a.spacing;
    return createStyles({
        root: __assign({}, typography.body1),
        name: { marginRight: spacing(0.5) },
        userLink: {
            color: 'inherit',
            textDecoration: 'none',
        },
        followLink: {
            '&:focus': {
                outline: 'none',
            },
            backgroundColor: 'transparent',
            border: 'none',
            color: palette.tertiary.main,
            cursor: 'pointer',
            fontWeight: 'bold',
            marginLeft: spacing(0.5),
            padding: 0,
            textDecoration: 'none',
        },
    });
});
function FollowButton(props) {
    var viewer = props.viewer, user = props.user, onFollowClick = props.onFollowClick, redirectTo = props.redirectTo, viewerisFollowing = props.viewerisFollowing;
    var classes = useStyles();
    var className = classes.followLink + " user-identity-follow-btn";
    var text = viewerisFollowing ? 'Following' : 'Follow';
    if (viewer === null || viewer === void 0 ? void 0 : viewer.uid) {
        if (viewer.uid !== user.uid) {
            return (React.createElement(React.Fragment, null,
                "\u00B7",
                React.createElement("button", { className: className, onClick: function () {
                        onFollowClick(user, viewerisFollowing);
                    } }, text)));
        }
    }
    else {
        return (React.createElement(React.Fragment, null,
            "\u00B7",
            React.createElement("a", { className: className, href: redirectTo }, text)));
    }
    return null;
}
export function Title(props) {
    var type = props.type, user = props.user, via = props.via;
    var classes = useStyles();
    return (React.createElement("div", { className: classes.root },
        React.createElement("a", { className: classes.userLink, href: getProfileUrl(user, via), target: "_blank", rel: "noreferrer" },
            React.createElement(Typography, { className: classes.name, variant: "h5", component: "span" }, user.name)),
        type === UserIdentityTypes.Main && React.createElement(FollowButton, __assign({}, props))));
}
//# sourceMappingURL=Title.js.map