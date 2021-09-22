import * as React from "react";
import * as styles from "./style.css";
import {classname} from "utils/classname";
import {MarginSizes, DisplayOptions, SectionImage, BackgroundWidth} from "models";
import Background from "components/Background";
import {GlobalStyles} from "pages/PageLayouts";

enum MarginSuffixes {
    xs = "xs",
    s = "s",
    m = "m",
}

export interface ContainerComponentProps {
    backgroundImage?: SectionImage;
    backgroundColour?: string;
    displayOptions?: DisplayOptions;
    className?: string;
    extraAttrs?: any;
    id?: {id: string} | null;
    style?: React.CSSProperties;
    displaySection?: boolean;
}

const getMarginClass = (margin: MarginSizes, size: MarginSuffixes) => {
    switch (margin) {
        case MarginSizes.none:
            return styles[`${size}_marginBottom_none`];
        case MarginSizes.extraSmall:
            return styles[`${size}_marginBottom_xs`];
        case MarginSizes.small:
            return styles[`${size}_marginBottom_s`];
        case MarginSizes.medium:
            return styles[`${size}_marginBottom_m`];
        case MarginSizes.large:
            return styles[`${size}_marginBottom_l`];
        default:
            break;
    }
};

interface BackgroundImageProps {
    backgroundImage?: SectionImage;
    backgroundWidth?: BackgroundWidth;
    backgroundColour?: string;
}
const BackgroundImage: React.FC<BackgroundImageProps> = ({backgroundImage, backgroundWidth, backgroundColour}) => {
    const contextStyles = React.useContext(GlobalStyles);
    return (
        <Background
            className={classname([backgroundWidth === BackgroundWidth.browserSize && contextStyles.browserSizeLayout])}
            images={backgroundImage}
            localStyles={
                backgroundColour
                    ? {
                          backgroundColor: backgroundColour,
                      }
                    : undefined
            }
        />
    );
};

const ContentContainer: React.FC<ContainerComponentProps> = ({
    id,
    className,
    displayOptions,
    children,
    extraAttrs,
    backgroundImage,
    backgroundColour,
}) => {
    const xsMargin =
        !!displayOptions && displayOptions.marginExtraSmall
            ? getMarginClass(displayOptions.marginExtraSmall, MarginSuffixes.xs)
            : styles.xs_marginBottom_s;
    const smallMargin =
        !!displayOptions && displayOptions.marginSmall
            ? getMarginClass(displayOptions.marginSmall, MarginSuffixes.s)
            : styles.s_marginBottom_m;
    const mediumMargin =
        !!displayOptions && displayOptions.marginMedium
            ? getMarginClass(displayOptions.marginMedium, MarginSuffixes.m)
            : styles.m_marginBottom_m;

    return (
        <section
            className={classname([styles.contentContainer, xsMargin, smallMargin, mediumMargin, className])}
            {...id}
            {...extraAttrs}>
            {children}
            {(backgroundImage || backgroundColour) && (
                <BackgroundImage
                    backgroundImage={backgroundImage}
                    backgroundColour={backgroundColour}
                    backgroundWidth={displayOptions && displayOptions.backgroundWidth}
                />
            )}
        </section>
    );
};

export const withContentContainer = <T extends {}>(
    Component: React.ComponentType<T>,
): React.FunctionComponent<T & ContainerComponentProps> => {
    return (props) => (
        <ContentContainer {...props}>
            {props.children}
            <Component {...props} />
        </ContentContainer>
    );
};

export default ContentContainer;
