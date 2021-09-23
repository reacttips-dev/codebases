import React, { useMemo, memo } from 'react';
import { Avatar as ChakraAvatar, AvatarGroup as ChakraAvatarGroup, AvatarBadge as ChakraAvatarBadge, } from '@chakra-ui/react';
import isEqual from 'react-fast-compare';
import { Emoji } from '../Emoji';
import { Skeleton, SkeletonCircle } from '../Skeleton';
import { getMediaURL } from '../utils/getMedia';
import { getSkeletonStyles } from './style';
export const Avatar = memo(({ name, variant = 'avatar', size, src = '', skeletonProps, ...rest }) => {
    const containerStyles = getSkeletonStyles(size);
    const mediaURL = useMemo(() => {
        // If `src` is a Media object
        if (src instanceof Object && src.constructor === Object) {
            return getMediaURL(src, { size: 'xs' });
        }
        return src;
    }, [src]);
    if (typeof src !== 'string' && (src === null || src === void 0 ? void 0 : src.__typename) === 'Emoji') {
        return React.createElement(Emoji, { src: src, size: size });
    }
    return (React.createElement(Skeleton, Object.assign({}, skeletonProps, { fallback: React.createElement(SkeletonCircle, { sx: containerStyles }) }),
        React.createElement(ChakraAvatar, Object.assign({ src: mediaURL, name: name || ' ', size: size, variant: variant }, rest))));
}, isEqual);
export { ChakraAvatarGroup as AvatarGroup };
export { ChakraAvatarBadge as AvatarBadge };
export default Avatar;
//# sourceMappingURL=Avatar.js.map