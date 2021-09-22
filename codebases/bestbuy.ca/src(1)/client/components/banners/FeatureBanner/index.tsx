import * as React from "react";
import * as styles from "./styles.css";
import {LinkEventType, SectionImage, Theme, ContentPositions, BackgroundWidth, DisplayOptions} from "models";
import Disclaimer from "components/banners/components/Disclaimer";
import ForegroundImage from "components/ForegroundImage";
import {classname} from "utils/classname";
import Countdown from "components/banners/components/Countdown";
import CTABlock from "components/banners/components/CTABlock";
import Headline from "components/banners/components/Headline";
import Logo from "components/banners/components/Logo";
import ContentContainer, {ContainerComponentProps} from "components/DynamicContent/ContentContainer";
import {GlobalStyles} from "pages/PageLayouts";

export interface FeatureBannerProps extends ContainerComponentProps {
    body: {
        disclaimer?: string;
        headline?: string;
        logo?: {
            alternateText?: string;
            url?: string;
        };
        text?: string;
    };
    countdown?: {
        countdownTime: number;
        label?: string;
        textColour?: string;
    };
    links: {
        primaryCta?: LinkEventType;
        secondaryCta?: LinkEventType;
    };
    foregroundImage?: SectionImage;
    displayOptions?: DisplayOptions;
    disableLazyLoad?: boolean;
}

export const FeatureBanner: React.FC<FeatureBannerProps & {className?: string}> = (props) => {
    const {countdown, className, displayOptions = {}, foregroundImage, disableLazyLoad} = props;
    const {foregroundImageAlignment, theme = Theme.light, textPosition = ContentPositions.left} = displayOptions;
    const {primaryCta, secondaryCta} = props.links;
    const {disclaimer, headline, logo = {}, text} = props.body;
    const classes = classname([className, styles.featureBanner, styles[theme], textPosition && styles[textPosition]]);
    return (
        <div className={classes}>
            {foregroundImage && (
                <ForegroundImage
                    alignment={foregroundImageAlignment}
                    className={styles.foregroundImage}
                    images={foregroundImage}
                    fallbackImage={foregroundImage.fallbackImage}
                    disableLazyLoad={disableLazyLoad}
                />
            )}
            <div className={styles.bannerContent}>
                {logo.url && (
                    <Logo className={styles.logoContainer} src={logo.url} alternateText={logo.alternateText || ""} />
                )}
                {headline && <Headline>{headline}</Headline>}
                {text}
                {countdown && countdown.countdownTime && (
                    <Countdown
                        textColour={countdown.textColour}
                        toDate={new Date(countdown.countdownTime)}
                        label={countdown.label}
                    />
                )}
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

const WrappedFeatureBanner: React.FC<FeatureBannerProps> = (props) => {
    const contextStyles = React.useContext(GlobalStyles);
    return (
        <ContentContainer
            {...props}
            className={classname([contextStyles.browserSizeLayout, props.className])}
            displayOptions={{
                ...props.displayOptions,
                backgroundWidth: BackgroundWidth.browserSize,
            }}>
            <FeatureBanner {...props} />
        </ContentContainer>
    );
};

WrappedFeatureBanner.displayName = "FeatureBanner";

export default WrappedFeatureBanner;
