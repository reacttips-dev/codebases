import Image from "components/Image";
import Link from "components/Link";
import * as React from "react";
import {IBrowser as ScreenSize} from "redux-responsive";
import {MerchBannerType} from "models";
import {buildLinkProps} from "@bbyca/apex-components";
import * as styles from "./style.css";
import LazyLoad from "react-lazyload";
import ProductImagePlaceholder from "../SvgIcons/ProductImagePlaceholder";
import {getImageProps, getIncorrectlyMappedImageProps} from "utils/imageUtils";

export interface Props extends MerchBannerType {
    screenSize: ScreenSize;
    isMobileApp?: boolean;
    belongsWithText?: boolean;
    disableSeoAttributes?: boolean;
}

export class MerchBanner extends React.Component<Props> {
    public render() {
        const {belongsWithText, description, image, screenSize, event, isMobileApp, disableSeoAttributes} = this.props;

        const placeholder = <ProductImagePlaceholder disableSeoAttributes={disableSeoAttributes} />;

        const bannerImageProps = getImageProps(
            {
                image,
                description,
            },
            screenSize,
            getIncorrectlyMappedImageProps,
        );

        const bannerImg = (
            <Image
                className={styles.bannerImage}
                placeholder={placeholder}
                dispatchLoadEvents
                {...bannerImageProps}
                disableSeoAttributes={disableSeoAttributes}
            />
        );
        const bannerProps = event ? buildLinkProps(event, isMobileApp) : null;
        const ariaLabel =
            !(event && event.eventType) || event.eventType === "externalUrl" || isMobileApp
                ? null
                : {ariaLabel: description};

        const banner = bannerProps ? (
            <Link {...bannerProps} {...ariaLabel}>
                <LazyLoad offset={100}>{bannerImg}</LazyLoad>
            </Link>
        ) : (
            bannerImg
        );

        return (
            <div className={belongsWithText ? `${styles.container} ${styles.limitedSize}` : `${styles.container}`}>
                {banner}
            </div>
        );
    }
}

export default MerchBanner;
