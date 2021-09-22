import * as React from "react";
import {BannerDisplayOption, SectionImage, ContentPositions, Theme, LinkEventType} from "models";
import * as styles from "./styles.css";
import ForegroundImage from "components/ForegroundImage";
import {classname} from "utils/classname";
import CTABlock from "../components/CTABlock";
import Logo from "../components/Logo";
import Disclaimer from "../components/Disclaimer";
import Headline from "../components/Headline";

export interface HeroBannerProps {
    body: {
        disclaimer?: string;
        headline?: string;
        logo?: {
            alternateText?: string;
            url?: string;
        };
        text?: string;
    };
    links: {
        primaryCta?: LinkEventType;
        secondaryCta?: LinkEventType;
    };
    foregroundImage?: SectionImage;
    displayOptions?: BannerDisplayOption;
}

const HeroBanner: React.FC<HeroBannerProps> = (props) => {
    const {displayOptions = {}, foregroundImage} = props;
    const {foregroundImageAlignment, theme = Theme.light, textPosition} = displayOptions;
    const {primaryCta, secondaryCta} = props.links;
    const {disclaimer, headline, logo = {}, text} = props.body;
    const classes = classname([
        styles.heroBanner,
        styles[theme],
        textPosition === ContentPositions.left && styles[ContentPositions.left],
        textPosition === ContentPositions.right && styles[ContentPositions.right],
        textPosition === ContentPositions.centre && styles[ContentPositions.centre],
    ]);
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
                {logo.url && (
                    <Logo className={styles.logoContainer} src={logo.url} alternateText={logo.alternateText || ""} />
                )}
                {headline && <Headline>{headline}</Headline>}
                {text}
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

export default HeroBanner;
