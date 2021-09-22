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
var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
import React, { useState } from 'react';
import clsx from 'clsx';
import dompurify from 'isomorphic-dompurify';
import { padding } from 'polished';
import { Box, Card, CardActionArea, CardContent, Link, makeStyles, Typography } from '@material-ui/core';
import { Avatar, AvatarSizes } from '../../Avatar';
import { Button, ButtonSize, ButtonType } from '../../components/buttons';
import { TrackableEvents } from '../../shared';
import { getRelativeTimestamp } from '../../shared/helpers';
import { useEventTracker } from '../../shared/hooks';
var useStyles = makeStyles(function (_a) {
    var spacing = _a.spacing, palette = _a.palette;
    return ({
        root: {
            borderRadius: 8,
            boxShadow: '0 1px 2px 0 rgb(0 0 0 / 16%)',
            '&.unread': {
                borderLeft: "4px solid " + palette.tertiary.main,
                borderRadius: spacing(0.5),
            },
            '&::after': {
                borderRadius: 5,
                bottom: 0,
                boxShadow: "0 4px 8px 0 " + palette.border.disabled,
                content: "''",
                left: 0,
                opacity: 0,
                pointerEvents: 'none',
                position: 'absolute',
                right: 0,
                top: 0,
                transition: 'opacity 0.2s ease-in-out',
            },
            '&:hover::after': {
                opacity: 1,
                zIndex: 0,
            },
        },
        bottomContent: {
            alignItems: 'center',
            display: 'flex',
            justifyContent: 'space-between',
            marginTop: spacing(2),
        },
        content: __assign(__assign({}, padding(spacing(2))), { '&:last-child': {
                paddingBottom: spacing(2),
            } }),
        message: {
            '& strong': {
                fontWeight: 'bold',
            },
        },
        profileUrl: {
            '&:hover': {
                color: palette.border.main,
                textDecoration: 'none',
            },
        },
        thumbnails: {
            display: 'flex',
            '& img': {
                borderRadius: 3,
                objectFit: 'cover',
                '&.small': {
                    width: 55,
                    height: 55,
                },
                '&.large': {
                    width: 147,
                    height: 98,
                },
            },
        },
        topRow: {
            display: 'flex',
            justifyContent: 'space-between',
            minHeight: 55,
        },
        focusHighlight: {},
        actionArea: {
            '&:hover $focusHighlight': {
                opacity: 0,
            },
        },
    });
});
export function Notification(props) {
    var _a;
    var trackEvent = useEventTracker().trackEvent;
    var classes = useStyles();
    var isRead = props.isRead ? '' : 'unread';
    var actor = (_a = props.actors) === null || _a === void 0 ? void 0 : _a[0];
    var fullName = actor ? actor.firstName + " " + actor.lastName : '';
    var _b = __read(useState(false), 2), isDisabled = _b[0], setDisabled = _b[1];
    var getProfileUrl = function () {
        if (!actor) {
            return '';
        }
        if (actor === null || actor === void 0 ? void 0 : actor.vanityUsername) {
            return "/user/" + actor.vanityUsername;
        }
        else {
            return "/profile/" + actor.firstName + "-" + actor.lastName + "/" + actor.username;
        }
    };
    var onClick = function () {
        if (!isDisabled) {
            trackEvent(TrackableEvents.ClickedNotification, { id: props.id, url: props.url });
            setDisabled(true);
        }
    };
    return (React.createElement(CardActionArea, { disabled: isDisabled, classes: {
            root: classes.actionArea,
            focusHighlight: classes.focusHighlight,
        }, "data-testid": "notification-card", href: props.url, onClick: onClick },
        React.createElement(Card, { className: clsx(classes.root, isRead) },
            React.createElement(CardContent, { className: classes.content },
                React.createElement("div", { className: classes.topRow },
                    React.createElement(Box, { display: "flex" },
                        props.actors &&
                            props.actors.map(function (actor) { return (React.createElement("object", { key: actor.username },
                                React.createElement(Link, { href: getProfileUrl() },
                                    React.createElement(Box, { "data-testid": "actor-avatar" },
                                        React.createElement(Avatar, { alt: fullName, src: actor.mediumPictureUrl, size: AvatarSizes.Medium }))))); }),
                        React.createElement(Box, { marginX: 1 },
                            React.createElement(Typography, { variant: "h5" },
                                React.createElement("object", null,
                                    React.createElement(Link, { className: classes.profileUrl, href: getProfileUrl() }, fullName))),
                            React.createElement(Typography, { className: classes.message, dangerouslySetInnerHTML: { __html: dompurify.sanitize(props.message) }, variant: "body1" }))),
                    props.image && props.image.sources && (React.createElement("div", { className: classes.thumbnails }, props.image.sources.map(function (imgSource) { return (React.createElement("img", { key: imgSource.url, alt: "thumbnail", src: imgSource.url, width: props.buttonText || props.previewText ? 55 : 147, height: props.buttonText || props.previewText ? 55 : 98, className: "thumbnail " + (props.buttonText || props.previewText ? 'small' : 'large') })); })))),
                props.previewText && (React.createElement(Box, { marginTop: 1.25 },
                    React.createElement(Typography, { variant: "caption", component: "p" }, props.previewText))),
                React.createElement("div", { className: classes.bottomContent },
                    React.createElement(Typography, { "data-testid": "timestamp", variant: "caption", component: "p" }, getRelativeTimestamp(props.createdAt)),
                    props.buttonText && (React.createElement(Box, { "data-testid": "notification-button" },
                        React.createElement(Button, { text: props.buttonText, type: ButtonType.AltNavyGhost, size: ButtonSize.Small }))))))));
}
//# sourceMappingURL=Notification.js.map