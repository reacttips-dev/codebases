import * as React from "react";
import {IBrowser as ScreenSize} from "redux-responsive";

import Image from "components/Image";
import {ResponsiveImageType} from "models";
import {getImageProps, getIncorrectlyMappedImageProps} from "utils/imageUtils";

import * as styles from "../../style.css";

export interface FlexBannerImageProps {
    image: ResponsiveImageType;
    alternateText: string;
    screenSize: ScreenSize;
    disableSeoAttributes?: boolean;
}

export const FlexBannerImage: React.StatelessComponent<FlexBannerImageProps> = (props: FlexBannerImageProps) => {
    const bannerImageProps = getImageProps(
        {
            image: props.image,
            description: props.alternateText,
        },
        props.screenSize,
        getIncorrectlyMappedImageProps,
    );
    return (
        <div key="image" className={styles.imagePositionWrapper} data-automation="flex-banner-image">
            <Image {...bannerImageProps} disableSeoAttributes={props.disableSeoAttributes} />
        </div>
    );
};
