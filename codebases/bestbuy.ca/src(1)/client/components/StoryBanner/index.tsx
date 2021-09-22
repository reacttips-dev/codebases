import * as React from "react";
import * as styles from "./style.css";
import {IBrowser as ScreenSize} from "redux-responsive";
import {SectionStoryBanner} from "models";
import Link from "components/Link";
import {buildLinkProps} from "@bbyca/apex-components";
import ProductImagePlaceholder from "components/SvgIcons/ProductImagePlaceholder";
import LazyLoad from "react-lazyload";
import {ChevronRight} from "@bbyca/bbyca-components";
import {getImageProps, getIncorrectlyMappedImageProps} from "utils/imageUtils";

interface Props {
    content: SectionStoryBanner;
    alignment: "right" | "left";
    screenSize: ScreenSize;
    isMobileApp?: boolean;
    language: Language;
}

export class StoryBanner extends React.Component<Props> {
    public render() {
        const {content, alignment, isMobileApp} = this.props;

        return (
            <React.Fragment>
                {content.event.eventType && !content.ctaText ? (
                    <Link
                        {...buildLinkProps(content.event, isMobileApp)}
                        className={`${styles.textContainer} ${styles.storyBannerRow} ${
                            styles[alignment] ? styles[alignment] : styles.left
                        }`}>
                        {this.getTextContent()}
                        {this.getProductMedia()}
                    </Link>
                ) : (
                    <div className={`${styles.storyBannerRow} ${styles[alignment] ? styles[alignment] : styles.left}`}>
                        {this.getTextContent()}
                        {this.getProductMedia()}
                    </div>
                )}
            </React.Fragment>
        );
    }

    private getTextContent = () => {
        const {content} = this.props;
        return (
            <div className={styles.column}>
                <div className={styles.title}>{content.headline1}</div>
                <div className={styles.body}>{content.headline2}</div>
                {content.ctaText && content.event && this.buildCtaLink()}
            </div>
        );
    };

    private getProductMedia = () => {
        const {content, screenSize} = this.props;
        const productImageProps = getImageProps(
            {
                image: content.image,
                description: content.alternateText,
            },
            screenSize,
            getIncorrectlyMappedImageProps,
        );
        return (
            <div className={`${styles.column} ${styles.productMedia}`}>
                <LazyLoad offset={100}>
                    <ProductImagePlaceholder {...productImageProps} />
                </LazyLoad>
            </div>
        );
    };

    private buildCtaLink = () => {
        const {
            content: {event},
            isMobileApp,
            language,
        } = this.props;
        const props = {...event, language};
        const ctaLinkProps = buildLinkProps(props, isMobileApp);

        return (
            <React.Fragment>
                {event.eventType ? (
                    <Link className={styles.link} {...ctaLinkProps}>
                        {this.buildCtaContent()}
                    </Link>
                ) : (
                    <div className={styles.link}>{this.buildCtaContent()}</div>
                )}
            </React.Fragment>
        );
    };

    private buildCtaContent = () => {
        const {
            content: {ctaText},
        } = this.props;

        return (
            <div className={styles.linkTextContainer}>
                <span>{ctaText}</span>
                <ChevronRight className={`${styles.ctaIcon} ${styles.arrowIcon}`} viewBox={"0 0 24 24"} />
            </div>
        );
    };
}

export default StoryBanner;
