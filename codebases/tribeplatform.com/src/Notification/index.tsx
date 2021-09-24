import React, { forwardRef } from 'react';
import { Box, Flex, HStack, useMultiStyleConfig, } from '@chakra-ui/react';
import { Avatar, AvatarBadge } from '../Avatar';
import { Skeleton, SkeletonText } from '../Skeleton';
import { Text } from '../Text';
import { getIcon, getTime, getTitle } from './utils';
const UnreadNotificationIndicator = () => {
    const { newNotification } = useMultiStyleConfig('Notification', {});
    return React.createElement(Box, { "data-testid": "notification-unread", sx: newNotification });
};
export const Notification = forwardRef(({ notification, ...props }, ref) => {
    const { title: titleStyle, time: timeStyle, card: cardStyle, } = useMultiStyleConfig('Notification', {});
    const { actor, target, createdAt, read = false, verb, object, } = notification;
    const title = getTitle(actor, target, object, verb);
    const icon = getIcon(actor, target, object, verb);
    const time = getTime(createdAt);
    return (React.createElement(HStack, Object.assign({ sx: cardStyle }, props, { ref: ref }),
        React.createElement(Box, { w: "2" }, !read && React.createElement(UnreadNotificationIndicator, null)),
        React.createElement(Box, { pr: "2" },
            React.createElement(Avatar, { variant: "avatar", size: "lg", src: actor.media, name: actor.name }, icon && (React.createElement(AvatarBadge, { bg: "highlight", borderColor: "highlight", color: "label.primary", boxSize: "1.5em" }, icon)))),
        React.createElement(Flex, { align: "center", flex: "1" },
            React.createElement(Skeleton, { fallback: React.createElement(SkeletonText, { noOfLines: 2, spacing: "4", width: "xs" }) },
                React.createElement(Box, { "data-testid": "notification-title", sx: titleStyle }, title),
                React.createElement(Text, { "data-testid": "notification-time", sx: timeStyle }, time)))));
});
export default Notification;
export * from './utils';
//# sourceMappingURL=index.js.map