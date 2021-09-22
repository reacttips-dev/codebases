import * as React from "react";
import * as styles from "./style.css";
import {SectionImage, ImageResType, ContentPositions} from "models";
import {breakpoints} from "constants/Breakpoints";
import {Breakpoint} from "models";
import Picture, {PictureData} from "components/Picture";
import LazyLoad from "react-lazyload";
import {classname} from "utils/classname";

interface ForegroundImageProps {
    alignment?: ContentPositions;
    className?: string;
    images: SectionImage;
    fallbackImage?: ImageResType;
    disableLazyLoad?: boolean;
}

const imageBreakpoints: Breakpoint[] = [
    breakpoints.extraSmall,
    breakpoints.small,
    {...breakpoints.medium, maxWidth: Infinity},
];

const ForegroundImage = (props: ForegroundImageProps) => {
    const {alignment = ContentPositions.centre, className, images, disableLazyLoad} = props;
    if (!images) {
        return null;
    }

    const pictureData: PictureData[] = imageBreakpoints.map((breakpoint) => ({
        breakpointData: breakpoint,
        imageData: images[breakpoint.name],
    }));

    const classes = [styles.foregroundImageContainer, className, getBreakpointClassNames(images), styles[alignment]];
    const picture = <Picture
        fallbackImage={props.fallbackImage}
        pictureData={pictureData}
        alt={images.alternateText || ""}
        className={styles.foregroundImage}
    />;
    return (
        <div className={classname(classes)}>
            {!disableLazyLoad ?
            <LazyLoad>
                {picture}
            </LazyLoad> : picture}
        </div>
    );
};

export const getBreakpointClassNames = (images: SectionImage) => {
    return Object.keys(images)
        .map((key) => {
            if (images[key] && images[key].x1) {
                return styles[key];
            }
        })
        .join(" ")
        .trim();
};

export default ForegroundImage;
