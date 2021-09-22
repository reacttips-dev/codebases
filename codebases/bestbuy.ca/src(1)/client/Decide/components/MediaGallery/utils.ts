import {ResponsiveObject} from "react-slick";

import {breakpoints} from "constants/Breakpoints";

export const placeVideoInOrder = <T>(imageList: T[], videoList: T[], position = 1, deleteCount = 0): T[] => {
    const mediaList = [...imageList];
    if (videoList.length > 0) {
        videoList.forEach((element, index) => mediaList.splice(index + position, deleteCount, element));
    }
    return mediaList;
};

export const getResponsiveThumbnailSliderSettings = ({
    fullScreenView,
    totalThumbnails = 0,
}: {
    fullScreenView: boolean;
    totalThumbnails: number;
}): ResponsiveObject[] => {
    const initialSettings: ResponsiveObject[] = [
        {
            breakpoint: 348,
            settings: {
                slidesToShow: Math.min(totalThumbnails, 3),
                arrows: false,
            },
        },
        {
            breakpoint: 427,
            settings: {
                slidesToShow: Math.min(totalThumbnails, 4),
                arrows: false,
            },
        },
        {
            breakpoint: 506,
            settings: {
                slidesToShow: Math.min(totalThumbnails, 5),
                arrows: false,
            },
        },
        {
            breakpoint: 592,
            settings: {
                slidesToShow: Math.min(totalThumbnails, 6),
                arrows: false,
            },
        },
        {
            breakpoint: breakpoints.extraSmall.maxWidth, // extra small screen breakpoint
            settings: {
                slidesToShow: Math.min(totalThumbnails, 7),
                arrows: false,
            },
        },
    ];

    if (!fullScreenView) {
        return [
            ...initialSettings,
            {
                breakpoint: 767,
                settings: {
                    slidesToScroll: Math.min(totalThumbnails, 2),
                    slidesToShow: Math.min(totalThumbnails, 2),
                },
            },
            {
                breakpoint: 840,
                settings: {
                    slidesToScroll: Math.min(totalThumbnails, 3),
                    slidesToShow: Math.min(totalThumbnails, 3),
                },
            },
            {
                breakpoint: breakpoints.small.maxWidth, // small screen breakpoint
                settings: {
                    slidesToScroll: Math.min(totalThumbnails, 4),
                    slidesToShow: Math.min(totalThumbnails, 4),
                },
            },
            {
                breakpoint: 1078,
                settings: {
                    slidesToScroll: Math.min(totalThumbnails, 6),
                    slidesToShow: Math.min(totalThumbnails, 6),
                },
            },
            {
                breakpoint: 1140,
                settings: {
                    slidesToScroll: Math.min(totalThumbnails, 7),
                    slidesToShow: Math.min(totalThumbnails, 7),
                },
            },
            {
                breakpoint: 9999,
                settings: {
                    slidesToScroll: Math.min(totalThumbnails, 8),
                    slidesToShow: Math.min(totalThumbnails, 8),
                },
            },
        ];
    } else {
        return [
            ...initialSettings,
            {
                breakpoint: breakpoints.small.maxWidth, // small screen breakpoint
                settings: {
                    slidesToScroll: Math.min(totalThumbnails, 6),
                    slidesToShow: Math.min(totalThumbnails, 6),
                },
            },
            {
                breakpoint: breakpoints.medium.maxWidth,
                settings: {
                    slidesToScroll: Math.min(totalThumbnails, 7),
                    slidesToShow: Math.min(totalThumbnails, 7),
                },
            },
            {
                breakpoint: 9999,
                settings: {
                    slidesToScroll: Math.min(totalThumbnails, 8),
                    slidesToShow: Math.min(totalThumbnails, 8),
                },
            },
        ];
    }
};
