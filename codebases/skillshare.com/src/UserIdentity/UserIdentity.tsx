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
var _a, _b;
import React from 'react';
import { CardHeader, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { Avatar, AvatarSizes } from '../Avatar';
import { TeacherBadge } from '../badges/TeacherBadge';
import { Title } from './Title';
export var UserIdentityTypes;
(function (UserIdentityTypes) {
    UserIdentityTypes["Main"] = "main";
    UserIdentityTypes["Comment"] = "comment";
    UserIdentityTypes["Reply"] = "reply";
    UserIdentityTypes["Popover"] = "popover";
})(UserIdentityTypes || (UserIdentityTypes = {}));
var UserIdentityTypeToSize = (_a = {},
    _a[UserIdentityTypes.Main] = AvatarSizes.Large,
    _a[UserIdentityTypes.Popover] = AvatarSizes.Large,
    _a[UserIdentityTypes.Comment] = AvatarSizes.Small,
    _a[UserIdentityTypes.Reply] = AvatarSizes.XSmall,
    _a);
var UserIdentityTypeToAligment = (_b = {},
    _b[UserIdentityTypes.Main] = 'center',
    _b[UserIdentityTypes.Popover] = 'center',
    _b[UserIdentityTypes.Comment] = 'unset',
    _b[UserIdentityTypes.Reply] = 'unset',
    _b);
var renderTeacherBadge = function (props) {
    var typeClassName = props.type || UserIdentityTypes.Main;
    return (React.createElement("div", { className: "user-identity-badge " + typeClassName },
        React.createElement(TeacherBadge, { isTopTeacher: props.user.isTopTeacher })));
};
export var getProfileUrl = function (user, via) {
    var url = new URL(user.profileUrl);
    var queryParams = new URLSearchParams(url.search);
    var profileUrl = user.profileUrl;
    if (via) {
        queryParams.append('via', via);
        profileUrl = url.toString() + "?" + queryParams.toString();
    }
    return profileUrl;
};
var useStyles = makeStyles(function (_a) {
    var spacing = _a.spacing, palette = _a.palette;
    return ({
        root: function (_a) {
            var type = _a.type;
            return {
                padding: 0,
                alignItems: UserIdentityTypeToAligment[type],
                '& .MuiCardHeader-avatar': {
                    marginRight: spacing(1),
                },
            };
        },
        subHeaderText: {
            color: palette.border.main,
            fontWeight: 400,
            marginBottom: spacing(0.5),
        },
    });
});
export function UserIdentity(props) {
    var type = props.type, user = props.user, via = props.via;
    var classes = useStyles({ type: type });
    var avatarSize = UserIdentityTypeToSize[type];
    var isTeacher = user.isTopTeacher || user.isTeacher;
    return (React.createElement(CardHeader, { className: classes.root + " user-identity-wrapper", title: React.createElement(Title, __assign({}, props)), subheader: React.createElement(React.Fragment, null,
            React.createElement(Typography, { className: classes.subHeaderText, variant: "h6" }, user.headline),
            isTeacher && renderTeacherBadge(props)), avatar: React.createElement("a", { href: getProfileUrl(user, via), target: "_blank", rel: "noreferrer" },
            React.createElement(Avatar, { src: user.img, alt: user.name, size: avatarSize })) }));
}
//# sourceMappingURL=UserIdentity.js.map