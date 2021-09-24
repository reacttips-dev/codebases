import React from 'react';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import AtLineIcon from 'remixicon-react/AtLineIcon';
import ReplyFillIcon from 'remixicon-react/ReplyFillIcon';
import { NotificationVerb, PayloadType } from 'tribe-api';
import { Trans } from 'tribe-translation';
import { Avatar } from '../../Avatar';
import { Emoji } from '../../Emoji';
import { Icon } from '../../Icon';
import { Text } from '../../Text';
dayjs.extend(relativeTime);
const HighlightedTitle = ({ children }) => (React.createElement(Text, { d: "inline", fontWeight: "bold", fontSize: "inherit", color: "label.primary" }, children));
export const getTitle = (actor, target, object, verb) => {
    if (!actor || !(target && target.type)) {
        // eslint-disable-next-line no-console
        console.error('error - Invalid Notification Structure', actor, target);
        return null;
    }
    const actorName = actor.summary;
    switch (verb) {
        case NotificationVerb.COMMENT_CREATED:
            return (React.createElement(Trans, { i18nKey: "notification:commented", values: { actorName, target: target.type.toLowerCase() }, defaults: "<highlight>{{ actorName }}</highlight> commented on your {{target}}", components: { highlight: React.createElement(HighlightedTitle, null) } }));
        case NotificationVerb.REACTION_CREATED:
            return (React.createElement(Trans, { i18nKey: "notification:reacted", values: { actorName, target: target.type.toLowerCase() }, defaults: "<highlight>{{ actorName }}</highlight> reacted to your {{target}}", components: { highlight: React.createElement(HighlightedTitle, null) } }));
        case NotificationVerb.REPLY_CREATED:
            return (React.createElement(Trans, { i18nKey: "notification:replied", values: { actorName, target: target.type.toLowerCase() }, defaults: "<highlight>{{ actorName }}</highlight> replied to your {{target}}", components: { highlight: React.createElement(HighlightedTitle, null) } }));
        case NotificationVerb.POST_CREATED:
            return (React.createElement(Trans, { i18nKey: "notification:post.created", values: { actorName, space: target.summary }, defaults: "<highlight>{{ actorName }}</highlight> posted in <highlight>{{space}}</highlight>", components: { highlight: React.createElement(HighlightedTitle, null) } }));
        case NotificationVerb.MEMBER_MENTIONED:
            return (React.createElement(Trans, { i18nKey: "notification:post.memberMentioned", values: { actorName }, defaults: "<highlight>{{ actorName }}</highlight> mentioned you in a post", components: { highlight: React.createElement(HighlightedTitle, null) } }));
        case NotificationVerb.SPACE_MEMBER_ADDED:
            return (React.createElement(Trans, { i18nKey: "notification:space.added", values: { actorName, space: target.summary, name: object.summary }, defaults: "<highlight>{{ actorName }}</highlight> added {{name}} to <highlight>{{space}}</highlight>", components: { highlight: React.createElement(HighlightedTitle, null) } }));
        case NotificationVerb.JOIN_REQUEST_STATUS_UPDATED:
            return (React.createElement(Trans, { i18nKey: "notification:space.joinRequestStatusUpdated", values: { actorName, space: target.summary, name: object.summary }, defaults: "<highlight>{{ actorName }}</highlight> added {{name}} to <highlight>{{space}}</highlight>", components: { highlight: React.createElement(HighlightedTitle, null) } }));
        default:
            // logger.warn('missing handler for notification verb', verb)
            return (React.createElement(Trans, { i18nKey: "notification:other", values: {
                    actorName,
                    target: target.type.toLowerCase(),
                    verb,
                }, defaults: "<highlight>{{ actorName }}</highlight> {{verb}} on your {{target}}", components: { highlight: React.createElement(HighlightedTitle, null) } }));
    }
};
export const getIcon = (actor, target, object, verb) => {
    if (!actor || !(target && target.type)) {
        // logger.error('error - Invalid Notification Structure', actor, target)
        return null;
    }
    switch (verb) {
        case NotificationVerb.COMMENT_CREATED:
        case NotificationVerb.REPLY_CREATED:
            return React.createElement(Icon, { as: ReplyFillIcon });
        case NotificationVerb.MEMBER_MENTIONED:
            return React.createElement(Icon, { as: AtLineIcon });
        case NotificationVerb.POST_CREATED:
        case NotificationVerb.JOIN_REQUEST_STATUS_UPDATED:
        case NotificationVerb.SPACE_MEMBER_ADDED:
            return (React.createElement(Avatar, { src: target.media, name: target.name, size: "xs", border: "2px" }));
        case NotificationVerb.REACTION_CREATED:
            return React.createElement(Emoji, { src: object.name, size: "xs" });
        default:
            return null;
    }
};
export const getTime = (date) => {
    return dayjs(date).fromNow();
};
export const getNotificationLink = (notification) => {
    if (!notification) {
        return;
    }
    const { target, space, verb, object } = notification;
    switch (verb) {
        case NotificationVerb.SPACE_MEMBER_ADDED:
            return space ? `/${space === null || space === void 0 ? void 0 : space.slug}/post?from=/notifications` : null;
        case NotificationVerb.POST_CREATED:
            return space
                ? `/${space === null || space === void 0 ? void 0 : space.slug}/post/${object === null || object === void 0 ? void 0 : object.id}?from=/notifications`
                : null;
        case NotificationVerb.REPLY_CREATED:
        case NotificationVerb.COMMENT_CREATED:
            return space
                ? `/${space === null || space === void 0 ? void 0 : space.slug}/post/${target === null || target === void 0 ? void 0 : target.id}?from=/notifications#comment/${object === null || object === void 0 ? void 0 : object.id}`
                : null;
        default:
        // decide based on target type
    }
    switch (target === null || target === void 0 ? void 0 : target.type) {
        case PayloadType.SPACE:
            return space ? `/${space === null || space === void 0 ? void 0 : space.slug}/post?from=/notifications` : null;
        case PayloadType.POST:
            return space
                ? `/${space === null || space === void 0 ? void 0 : space.slug}/post/${target === null || target === void 0 ? void 0 : target.id}?from=/notifications`
                : null;
        case PayloadType.REACTION:
            return space
                ? `/${space === null || space === void 0 ? void 0 : space.slug}/post/${target === null || target === void 0 ? void 0 : target.id}?from=/notifications`
                : null;
        case PayloadType.MEMBER:
            return `/member/${object === null || object === void 0 ? void 0 : object.id}`;
        default:
    }
};
//# sourceMappingURL=index.js.map