import { textStyles } from '../theme/foundations/typography';
const parts = [
    'card',
    'description',
    'image',
    'infoContainer',
    'joinButton',
    'membersIcon',
    'skeletonCard',
    'skeletonDescription',
    'skeletonImage',
    'title',
    'userbar',
];
const baseCardStyle = {
    flexDirection: 'column',
    borderRadius: 'base',
    maxWidth: '100vw',
    boxShadow: 'sm',
    backgroundColor: 'bg.base',
};
export const SPACE_CARD_WIDTH = 256;
export const SPACE_CARD_HEIGHT = 120;
const SpaceCardTheme = {
    baseStyle: {
        card: {
            ...baseCardStyle,
            display: 'flex',
            width: ['full', SPACE_CARD_WIDTH],
        },
        skeletonCard: {
            ...baseCardStyle,
            cursor: 'default',
            width: 'full',
        },
        image: {
            width: 'full',
            height: SPACE_CARD_HEIGHT,
            borderTopLeftRadius: 'base',
            borderTopRightRadius: 'base',
        },
        skeletonImage: {
            background: 'border.lite',
            w: 'full',
        },
        skeletonDescription: {
            background: 'border.lite',
        },
        infoContainer: {
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
            flexGrow: 1,
            p: 4,
            pt: [3, 4],
            ml: ['0 !important', 2],
            maxW: '95%',
        },
        description: {
            ...textStyles['regular/small'],
            color: 'label.secondary',
            // Ellipsis on second line
            display: '-webkit-box',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            WebkitLineClamp: '2',
            WebkitBoxOrient: 'vertical',
            mt: ['4px !important', 2],
        },
        membersIcon: {
            color: 'label.secondary',
        },
        membersCount: {
            color: 'label.secondary',
            ...textStyles['regular/xsmall'],
        },
        joinButton: {
            marginTop: 'auto !important',
            w: 'full',
            py: 2,
        },
    },
    sizes: {
        lg: {
            boxShadow: 'xl',
            skeletonImage: {
                height: '120px',
            },
            skeletonDescription: {
                borderRadius: 'md',
                height: 2,
            },
        },
        md: {
            boxShadow: 'lg',
            skeletonImage: {
                height: '80px',
            },
            skeletonDescription: {
                borderRadius: 'base',
                height: 1.5,
            },
        },
        sm: {
            boxShadow: 'md',
        },
        xs: {
            boxShadow: 'sm',
            card: {
                width: ['full', 200],
                minW: 200,
                maxW: 200,
            },
            infoContainer: {
                maxW: 'full',
            },
        },
        xxs: {
            boxShadow: 'sm',
            infoContainer: {
                maxW: 'full',
            },
            image: {
                height: 95,
            },
            card: {
                width: ['full', 200],
                minW: 200,
                maxW: 200,
                height: 224,
            },
        },
    },
    defaultProps: {
        size: 'xs',
    },
    parts,
};
export default SpaceCardTheme;
//# sourceMappingURL=style.js.map