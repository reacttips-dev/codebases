import React from 'react';
import { Box, Flex, HStack, Spacer, useMultiStyleConfig, } from '@chakra-ui/react';
import ArrowRightLineIcon from 'remixicon-react/ArrowRightLineIcon';
import { SearchEntityType } from 'tribe-api';
import { Avatar } from '../Avatar';
import { Icon } from '../Icon';
import { Skeleton, SkeletonText } from '../Skeleton';
import { Text } from '../Text';
export const SearchResult = ({ title, subtext, media, entityType, ...rest }) => {
    const { card: cardStyle, title: titleStyle, subtext: subtextStyle, } = useMultiStyleConfig('SearchResult', {});
    return (React.createElement(HStack, { sx: cardStyle },
        React.createElement(Flex, Object.assign({ "data-testid": "search", cursor: "pointer" }, rest),
            entityType !== SearchEntityType.POST && (React.createElement(Box, { mr: 2 },
                React.createElement(Avatar, { variant: "avatar", size: "lg", src: media, name: title }))),
            React.createElement(Flex, { flex: "1", align: "center" },
                React.createElement(Skeleton, { fallback: React.createElement(SkeletonText, { noOfLines: 2, spacing: "4", width: "xs" }) },
                    React.createElement(Text, { "data-testid": "search-title", sx: titleStyle }, title),
                    subtext && (React.createElement(Text, { "data-testid": "search-time", sx: subtextStyle }, subtext))))),
        React.createElement(Spacer, null),
        React.createElement(Icon, { as: ArrowRightLineIcon, boxSize: 5, color: "label.secondary" })));
};
//# sourceMappingURL=index.js.map