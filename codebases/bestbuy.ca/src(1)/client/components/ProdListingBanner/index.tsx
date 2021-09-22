import * as React from "react";
import * as styles from "./styles.css";
import {classname} from "utils/classname";
import {DisplayOptions, LinkEventType, SectionImage, Theme} from "models";
import ForegroundImage from "components/ForegroundImage";
import Logo from "components/banners/components/Logo";
import Headline from "components/banners/components/Headline";
import CTABlock from "components/banners/components/CTABlock";
import Background from "components/Background";
import useTrackVisit from "hooks/useTrackVisit";
import {addNumberSignPrefix} from "utils/colorUtils";

export type ProdListingBannerDisplayOptions = Pick<
    DisplayOptions,
    "theme" | "backgroundColour"
>;

export interface ProdListingBannerProps {
    body: {
        headline?: string;
        logo?: {
            url?: string;
            alternateText?: string;
        };
        text?: string;
    };
    backgroundImage?: SectionImage;
    foregroundImage?: SectionImage;
    cta?: LinkEventType;
    displayOptions?: ProdListingBannerDisplayOptions;
}

const hasForegroundImage = (props: ProdListingBannerProps): boolean => {
    return !!(
        props?.foregroundImage &&
        (props.foregroundImage.extraSmall ||
            props.foregroundImage.small ||
            props.foregroundImage.medium ||
            props.foregroundImage.large)
    );
};

const ProdListingBanner: React.FC<ProdListingBannerProps> = (props) => {
    const {displayOptions = {}, foregroundImage, backgroundImage, cta, body = {}} = props;
    const {headline, logo, text} = body;
    const {theme = Theme.light, backgroundColour} = displayOptions;
    const classes = classname([styles.prodListingBanner, styles[theme], !hasForegroundImage(props) && styles.textOnly]);
    const {ref}  = useTrackVisit({
        payload: {
            customLink: "Search Banner Impression",
        },
        event: "PLP_PRODUCTLISTING_IMPRESSION",
        visibleContentPercent: 60,
        delay: 3000,
    });
    const hasBackground = !!(backgroundImage || backgroundColour);
    const localStyles: React.CSSProperties | undefined =
    (backgroundColour && {backgroundColor: addNumberSignPrefix(backgroundColour)}) || undefined;


    return (
        <div className={classes} ref={ref}>
            {hasBackground && (
                <Background images={backgroundImage} className={styles.background} localStyles={localStyles} />
            )}
            {foregroundImage && (
                <ForegroundImage
                    images={foregroundImage}
                    className={styles.foregroundImage}
                    fallbackImage={foregroundImage.fallbackImage}
                />
            )}
            <div className={styles.bannerContent}>
                {logo?.url && (
                    <Logo className={styles.logoContainer} src={logo.url} alternateText={logo.alternateText || ""} />
                )}
                {headline && <Headline className={styles.headline}>{headline}</Headline>}
                {text && <p>{text}</p>}
                {cta && (
                    <CTABlock darkTheme={theme === Theme.dark} className={styles.ctaBlock} secondaryCta={{...cta}} />
                )}
            </div>
        </div>
    );
};

export default ProdListingBanner;
