import * as React from "react";
import {BannerDisplayOption, SectionImage, Theme, LinkEventType} from "models";
import * as styles from "./styles.css";
import {classname} from "utils/classname";
import CTABlock from "../components/CTABlock";
import Disclaimer from "../components/Disclaimer";
import Headline from "../components/Headline";
import ForegroundImage from "components/ForegroundImage";

export interface TitleBannerProps {
    body: {
        headline: string;
        subHeadline: string;
        disclaimer: string;
    };
    cta?: LinkEventType;
    logo?: SectionImage;
    displayOptions?: BannerDisplayOption;
}

const TitleBanner: React.FC<TitleBannerProps> = (props) => {
    const {displayOptions = {}, logo, cta} = props;
    const {disclaimer, headline, subHeadline} = props.body;
    const {theme = Theme.light} = displayOptions;
    const classes = classname([styles.titleBanner, styles[theme]]);
    return (
        <div className={classes}>
            <div className={styles.bannerContent}>
                {logo && (
                    <ForegroundImage
                        className={styles.logoContainer}
                        images={logo}
                        fallbackImage={logo.fallbackImage}
                    />
                )}
                {headline && <Headline className={styles.headline}>{headline}</Headline>}
                {subHeadline && <p className={styles.subHeadline}>{subHeadline}</p>}
                {cta && cta.ctaText && (
                    <CTABlock
                        darkTheme={theme === Theme.dark}
                        className={styles.ctaBlock}
                        secondaryCta={cta && {...cta}}
                    />
                )}
                {disclaimer && <Disclaimer className={styles.disclaimer} text={disclaimer} />}
            </div>
        </div>
    );
};

export default TitleBanner;
