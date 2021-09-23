import React from 'react';
import { Box, HStack, VStack, useMultiStyleConfig, Flex, } from '@chakra-ui/react';
import GroupFillIcon from 'remixicon-react/GroupFillIcon';
import Lock2FillIcon from 'remixicon-react/Lock2FillIcon';
import { Trans } from 'tribe-translation';
import { Avatar } from '../Avatar';
import { Button } from '../Button';
import Card from '../Card';
import Icon from '../Icon';
import Image from '../Image';
import { ImagePickerDropdown } from '../ImagePickerDropdown';
import { Skeleton, SkeletonText } from '../Skeleton';
import Text from '../Text';
export const SpaceCardSkeleton = ({ display = 'flex', isPhone, size = 'lg', space, ...rest }) => {
    const styles = useMultiStyleConfig('SpaceCard', { size });
    const { name, image, membersCount } = space || {};
    return (React.createElement(Card, Object.assign({ sx: styles.skeletonCard, "data-testid": "space-card", display: display, height: "auto" }, rest),
        React.createElement(Box, { sx: styles.skeletonImage }),
        React.createElement(Box, { maxW: "full", pl: 0 },
            React.createElement(VStack, { sx: styles.infoContainer, spacing: size === 'lg' ? 4 : 3 },
                name && (React.createElement(Flex, { maxW: "inherit", alignItems: "center" },
                    React.createElement(Box, { mr: 1 },
                        React.createElement(Avatar, { src: image, size: "2xs", name: name })),
                    React.createElement(Text, { fontSize: size === 'lg' ? 'md' : 'xs', fontWeight: "medium", "data-testid": "space-card-name", height: "21px", ellipsis: true }, name))),
                React.createElement(VStack, { alignItems: "flex-start", spacing: size === 'lg' ? 2 : 1.5, width: "100%" },
                    React.createElement(Box, { sx: styles.skeletonDescription, w: "full" }),
                    React.createElement(Box, { sx: styles.skeletonDescription, w: "full" }),
                    React.createElement(Box, { sx: styles.skeletonDescription, w: "75%" })),
                React.createElement(HStack, null,
                    !isPhone && React.createElement(Icon, { color: "border.lite", as: GroupFillIcon }),
                    React.createElement(Text, { sx: styles.membersCount, "data-testid": "space-card-members" },
                        React.createElement(Trans, { i18nKey: "common:space.card.members", defaults: "{{ count, ifNumAbbr }} members", count: membersCount || 0 })))))));
};
export const SpaceCard = ({ isPhone, join, showImagePickerDropdownOnMobile = false, showJoinButton, size, space = {}, ...rest }) => {
    const styles = useMultiStyleConfig('SpaceCard', { size });
    const { name, description, image, banner, membersCount } = space;
    return (React.createElement(Card, Object.assign({ sx: styles.card, "data-testid": "space-card", height: ['80px', showJoinButton ? 297 : 249] }, rest),
        React.createElement(Skeleton, { fallback: React.createElement(React.Fragment, null,
                React.createElement(Skeleton, { borderRadius: 0, height: "120px" }),
                React.createElement(SkeletonText, { mt: 4, mx: 2, spacing: 4, noOfLines: 4 })) },
            banner && !isPhone && (React.createElement(Image, { "data-testid": "space-card-image", sx: styles.image, src: banner, alt: name, size: "sm", objectFit: "cover" })),
            React.createElement(HStack, { maxW: "full", pl: [5, 0] },
                isPhone && (React.createElement(React.Fragment, null, showImagePickerDropdownOnMobile && image ? (React.createElement(ImagePickerDropdown, { emojiSize: "md", isDisabled: true, imageBoxSize: 10, image: image })) : (React.createElement(Avatar, { src: image, size: "lg", name: name })))),
                React.createElement(VStack, { sx: styles.infoContainer },
                    name && (React.createElement(Flex, { maxW: "inherit", pb: 1, alignItems: "center" },
                        !isPhone && (React.createElement(Box, { mr: 1 },
                            React.createElement(Avatar, { src: image, size: "2xs", name: name }))),
                        React.createElement(Text, { fontSize: ['lg', 'md'], fontWeight: ['medium', 'regular'], "data-testid": "space-card-name", height: "21px", ellipsis: true }, name),
                        (space === null || space === void 0 ? void 0 : space.private) && (React.createElement(Icon, { sx: styles.membersIcon, as: Lock2FillIcon, ml: 2 })))),
                    description && !isPhone && (React.createElement(Text, { "data-testid": "space-card-description", sx: styles.description }, description)),
                    React.createElement(HStack, { mt: "4px !important", pt: 2 },
                        !isPhone && React.createElement(Icon, { sx: styles.membersIcon, as: GroupFillIcon }),
                        React.createElement(Text, { sx: styles.membersCount, "data-testid": "space-card-members" },
                            React.createElement(Trans, { i18nKey: "common:space.card.membersCount", defaults: "{{ count, numberWithCommas }} members", values: {
                                    count: membersCount || 0,
                                } }))),
                    showJoinButton && (React.createElement(Button, { "data-testid": "space-card-join-button", sx: styles.joinButton, colorScheme: "gray", onClick: join },
                        React.createElement(Trans, { i18nKey: "common:space.card.joinSpace", defaults: "Join Space" })))),
                isPhone && showJoinButton && (React.createElement(Box, { pr: 5 },
                    React.createElement(Button, { "data-testid": "space-card-join-button", sx: styles.joinButton, size: "sm", buttonType: "secondary", onClick: join },
                        React.createElement(Trans, { i18nKey: "common:space.card.join", defaults: "Join" }))))))));
};
export default SpaceCard;
//# sourceMappingURL=index.js.map