import React, { useCallback } from 'react';
import { Box, useMultiStyleConfig } from '@chakra-ui/react';
import { Emoji as EmojiMart } from 'emoji-mart';
import { Skeleton, SkeletonCircle } from '../Skeleton';
/**
 * Component which renders emoji, it maintains same size as Avatar
 */
export const Emoji = ({ size, src }) => {
    const styles = useMultiStyleConfig('Avatar', { size });
    const containerSize = parseInt(styles.container.height, 10);
    const fallback = useCallback(() => React.createElement(SkeletonCircle, { boxSize: containerSize, speed: 0 }), [containerSize]);
    let emojiId;
    if (typeof src === 'string') {
        emojiId = src;
    }
    else {
        emojiId = src === null || src === void 0 ? void 0 : src.text;
    }
    if (!emojiId) {
        return React.createElement(Box, { boxSize: containerSize });
    }
    return (React.createElement(Skeleton, { lineHeight: "1", fallback: React.createElement(SkeletonCircle, { boxSize: containerSize }), "data-testid": emojiId },
        React.createElement(EmojiMart, { emoji: emojiId, fallback: fallback, native: true, size: 4 * containerSize, set: "apple" })));
};
//# sourceMappingURL=Emoji.js.map