import React, { Fragment } from 'react';
import { Box, Flex, useMultiStyleConfig, } from '@chakra-ui/react';
import ArrowRightSLineIcon from 'remixicon-react/ArrowRightSLineIcon';
import { Avatar } from '../Avatar';
import Text from '../Text';
import { ELLIPSIS_STYLES } from '../theme';
import { withLink } from '../utils/withLink';
const breadcrumbArrowStyles = {
    marginTop: 3,
    flexShrink: 0,
};
const setTitleBreadCrumbs = ({ breadcrumbs, customBreadcrumbSplitter, titleStyle }, title) => {
    // Breadcrumbs in title
    if (Array.isArray(breadcrumbs)) {
        return (React.createElement(Text, { sx: titleStyle, as: "span", ellipsis: true },
            title,
            breadcrumbs.map((breadcrumb, index) => (
            // eslint-disable-next-line react/no-array-index-key
            React.createElement(Fragment, { key: index },
                typeof customBreadcrumbSplitter !== 'undefined' ? (customBreadcrumbSplitter) : (React.createElement(ArrowRightSLineIcon, { size: "16px", style: breadcrumbArrowStyles })),
                breadcrumb)))));
    }
    return title;
};
const setTitleOnClick = ({ withBreadcrumbs, onTitleClick, titleLink }, title) => {
    return onTitleClick ? (React.createElement(Box
    // Show ellipsis at the end and
    // devote some space for breadcrumbs
    , { 
        // Show ellipsis at the end and
        // devote some space for breadcrumbs
        maxW: withBreadcrumbs ? '50%' : 'auto', cursor: "pointer", onClick: onTitleClick }, title)) : (withLink(title, titleLink));
};
export const UserBar = ({ title, titleProps, subtitleProps, picture, subtitle, size = 'lg', breadcrumbs, customBreadcrumbSplitter, link, titleLink = link, subtitleLink = link, pictureLink = link, avatarProps, withPicture = true, onTitleClick, onPictureClick, onSubtitleClick, ...rest }) => {
    const { box, title: titleStyle, subtitle: subtitleStyle, } = useMultiStyleConfig('Userbar', {
        size,
        ellipsis: titleProps === null || titleProps === void 0 ? void 0 : titleProps.ellipsis,
    });
    const titleRendered = setTitleBreadCrumbs({ breadcrumbs, customBreadcrumbSplitter, titleStyle }, setTitleOnClick({ withBreadcrumbs: breadcrumbs === null || breadcrumbs === void 0 ? void 0 : breadcrumbs.length, titleLink, onTitleClick }, React.createElement(Text, Object.assign({ sx: titleStyle, style: ELLIPSIS_STYLES }, titleProps), title)));
    const subtitleRendered = (React.createElement(Text, Object.assign({ sx: subtitleStyle, style: ELLIPSIS_STYLES, noOfLines: 1 }, subtitleProps), subtitle));
    const avatarRendered = (React.createElement(Avatar, Object.assign({ variant: 'avatar', size: size, name: title, src: picture, cursor: "pointer" }, avatarProps)));
    return (React.createElement(Flex, Object.assign({ flexGrow: 1, alignItems: "center", overflow: "hidden" }, rest),
        withPicture && (React.createElement(Box, { sx: box }, onPictureClick ? (React.createElement(Box, { cursor: "pointer", onClick: onPictureClick }, avatarRendered)) : (withLink(avatarRendered, pictureLink)))),
        React.createElement(Box, { flex: "1", maxW: withPicture ? 'calc(100% - 52px)' : '100%' },
            titleRendered,
            subtitle && onSubtitleClick ? (React.createElement(Box, { cursor: "pointer", onClick: onSubtitleClick }, subtitleRendered)) : (withLink(subtitleRendered, subtitleLink)))));
};
export default UserBar;
//# sourceMappingURL=index.js.map