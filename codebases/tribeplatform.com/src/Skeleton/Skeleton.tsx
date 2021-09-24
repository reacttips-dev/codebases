import React from 'react';
import { Skeleton as ChakraSkeleton, SkeletonCircle as ChakraSkeletonCircle, SkeletonText as ChakraSkeletonText, } from '@chakra-ui/react';
import { useIsLoading } from './SkeletonProvider';
export const Skeleton = ({ fallback, ...props }) => {
    const { loading, speed } = useIsLoading();
    if (loading) {
        return (fallback || (React.createElement(ChakraSkeleton, Object.assign({ isLoaded: false, fadeDuration: 0, speed: speed }, props))));
    }
    return React.createElement(ChakraSkeleton, Object.assign({ fadeDuration: 0, isLoaded: true }, props));
};
const defaultSkeletonProps = {
    skeletonHeight: '10px',
    fadeDuration: 0,
};
export const SkeletonText = (props) => {
    const { loading, speed } = useIsLoading();
    if (loading) {
        return (React.createElement(ChakraSkeletonText, Object.assign({ isLoaded: false, speed: speed, spacing: 3 }, defaultSkeletonProps, props)));
    }
    return React.createElement(ChakraSkeletonText, Object.assign({}, defaultSkeletonProps, { isLoaded: true }, props));
};
export const SkeletonCircle = (props) => {
    const { loading, speed } = useIsLoading();
    if (loading) {
        return (React.createElement(ChakraSkeletonCircle, Object.assign({ isLoaded: false, speed: speed, fadeDuration: 0, startColor: "label.secondary", endColor: "label.secondary" }, props)));
    }
    return React.createElement(ChakraSkeletonCircle, Object.assign({ fadeDuration: 0, isLoaded: true }, props));
};
export const SkeletonButton = (props) => {
    const { loading, speed } = useIsLoading();
    if (loading) {
        return (React.createElement(ChakraSkeleton, Object.assign({ isLoaded: false, fadeDuration: 0, speed: speed, sx: {
                width: 8,
                height: 6,
                borderRadius: 'xl',
            } }, props)));
    }
    return React.createElement(ChakraSkeleton, Object.assign({ fadeDuration: 0, isLoaded: true }, props));
};
//# sourceMappingURL=Skeleton.js.map