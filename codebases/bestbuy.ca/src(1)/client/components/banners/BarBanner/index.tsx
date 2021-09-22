import * as React from "react";
import {BannerDisplayOption, SectionImage, Theme, LinkEventType} from "models";
import * as styles from "./styles.css";
import {classname} from "utils/classname";
import CTABlock from "../components/CTABlock";
import Disclaimer from "../components/Disclaimer";
import Headline from "../components/Headline";
import ForegroundImage from "components/ForegroundImage";

export interface BarBannerProps {
    body: {
        headline?: string;
        subHeadline?: string;
        disclaimer?: string;
        logo?: SectionImage;
    };
    links: {
        primaryCta?: LinkEventType;
        secondaryCta?: LinkEventType;
    };
    foregroundImage?: SectionImage;
    displayOptions?: BannerDisplayOption;
}

const BarBanner: React.FC<BarBannerProps> = (props) => {
    const {displayOptions = {}, foregroundImage} = props;
    const {headline, subHeadline, disclaimer, logo} = props.body;
    const {primaryCta, secondaryCta} = props.links;
    const {foregroundImageAlignment, theme = Theme.light, textPosition} = displayOptions;
    const classes = classname([styles.barBanner, styles[theme], textPosition && styles[textPosition]]);
    return (
        <div className={classes}>
            {foregroundImage && (
                <ForegroundImage
                    alignment={foregroundImageAlignment}
                    className={styles.foregroundImage}
                    images={foregroundImage}
                    fallbackImage={foregroundImage.fallbackImage}
                />
            )}
            <div className={styles.bannerContent}>
                {logo && (
                    <ForegroundImage
                        className={styles.logoContainer}
                        images={logo}
                        fallbackImage={logo.fallbackImage}
                    />
                )}
                {headline && <Headline className={styles.headline}>{headline}</Headline>}
                <span className={styles.subHeadline}>{subHeadline}</span>
                {(primaryCta || secondaryCta) && (
                    <CTABlock
                        darkTheme={theme === Theme.dark}
                        className={styles.ctaBlock}
                        primaryCta={primaryCta && {...primaryCta}}
                        secondaryCta={secondaryCta && {...secondaryCta}}
                    />
                )}
                {disclaimer && <Disclaimer text={disclaimer} />}
            </div>
        </div>
    );
};

export default BarBanner;
