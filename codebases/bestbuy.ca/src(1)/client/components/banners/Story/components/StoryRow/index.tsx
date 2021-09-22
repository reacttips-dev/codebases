import * as React from "react";
import * as styles from "./style.css";
import {
    TextLayout,
    TextPosition,
    BackgroundWidth,
    ResponsiveImageType,
    SectionImage,
    Theme,
    LinkEventType,
    DisplayOptions,
} from "models";
import Background from "components/Background";
import ForegroundImage from "components/ForegroundImage";
import {classname, classIf} from "utils/classname";
import StyledHTML from "components/StyledHTML";
import {GlobalStyles} from "pages/PageLayouts/";
import EmbeddedVideo from "components/EmbeddedVideo";
import CTABlock from "components/banners/components/CTABlock";
import getBackgroundSizing from "components/DynamicContent/helpers/getBackgroundSizing";

export interface StoryRowProps {
    id?: string;
    background?: {
        backgroundColour?: string;
        backgroundImage?: ResponsiveImageType;
        backgroundWidth?: BackgroundWidth;
    };
    body?: {
        text?: string;
        foregroundImage?: SectionImage;
        foregroundVideo?: {
            url?: string;
            ageRestricted?: boolean;
        };
    };
    displayOptions?: DisplayOptions;
    links?: {
        primaryCta?: LinkEventType;
        secondaryCta?: LinkEventType;
    };
    className?: string;
}

const StoryRow: React.FC<StoryRowProps | null> = (props) => {
    const {id, background = {}, body = {}, displayOptions = {}, links = {}, className} = props;
    const {backgroundColour, backgroundImage, backgroundWidth} = background;
    const {primaryCta, secondaryCta} = links;
    const {theme, textLayout = TextLayout.short, textPosition = TextPosition.right} = displayOptions;
    const {foregroundImage, foregroundVideo, text} = body;

    const hasBackgroundImage: boolean =
        !!backgroundImage && !!Object.keys(backgroundImage).filter((k) => backgroundImage[k as any] !== null).length;
    const backgroundSizing = backgroundWidth && getBackgroundSizing(backgroundWidth);

    const classes = classname([
        styles.storyRow,
        className,
        styles[theme as string],
        styles[textLayout as string],
        styles[textPosition as string],
        classIf(styles.withBackground, !!hasBackgroundImage || !!backgroundColour),
    ]);

    const primaryCtaText = !!primaryCta && primaryCta.ctaText;
    const secondaryCtaText = !!secondaryCta && secondaryCta.ctaText;

    const storyRowId = !!id ? {id} : {};
    const localStyles: React.CSSProperties | undefined =
        (backgroundColour && {backgroundColor: backgroundColour}) || undefined;
    const isDarkTheme = theme === Theme.dark;
    const contextStyles = React.useContext(GlobalStyles);

    return (
        <div {...storyRowId} className={classes}>
            <Background
                className={classname([
                    styles.background,
                    classIf(contextStyles.browserSizeLayout, backgroundSizing === BackgroundWidth.browserSize),
                ])}
                images={backgroundImage}
                localStyles={localStyles}
            />

            {foregroundVideo && foregroundVideo.url && (
                <div className={styles.foregroundImage}>
                    <EmbeddedVideo url={foregroundVideo.url} ageRestricted={foregroundVideo.ageRestricted} />
                </div>
            )}

            {foregroundImage && !foregroundVideo && (
                <ForegroundImage
                    className={styles.foregroundImage}
                    fallbackImage={foregroundImage.medium}
                    images={foregroundImage}
                />
            )}

            <div className={styles.body}>
                <StyledHTML className={styles.bodyText} body={text} />
                {!!(primaryCtaText || secondaryCtaText) && (
                    <CTABlock {...links} className={styles.ctaWrp} darkTheme={isDarkTheme} />
                )}
            </div>
        </div>
    );
};

export default StoryRow;
