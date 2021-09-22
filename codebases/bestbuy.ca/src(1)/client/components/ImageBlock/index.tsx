import * as React from "react";
import Link from "components/Link";
import Picture, {PictureData} from "../Picture";
import {breakpoints} from "constants/Breakpoints";
import {Breakpoint, SectionImage, LinkEventType} from "models";
import {classIf, classname} from "utils/classname";
import buildRouteLinkProps from "components/DynamicContent/helpers/buildRouteLinkProps";
import {GlobalStyles} from "pages/PageLayouts/";
import * as styles from "./style.css";

export enum ImageBlockDisplayType {
    browserSize = "browserSize",
    siteSize = "siteSize",
    trueSize = "trueSize",
}

export interface ImageBlockProps {
    altText?: string;
    event?: LinkEventType;
    image: SectionImage;
    displayType?: ImageBlockDisplayType;
}

const PLACEHOLDER_SRC =
    "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAMAAAACCAQAAAA3fa6RAAAAEElEQVR42mN88J8BCBghFAAhsgPBzBY5fQAAAABJRU5ErkJggg==";

export const imageBreakpoints: Breakpoint[] = [
    breakpoints.extraSmall,
    breakpoints.small,
    {...breakpoints.medium, maxWidth: Infinity},
];

export const Container = ({event, children, className}: ImageBlockProps & {children: any; className?: string}) => {
    if (!!event?.eventType) {
        const ctaLinkProps = buildRouteLinkProps(event);
        return (
            <Link className={className} {...ctaLinkProps}>
                {children}
            </Link>
        );
    } else {
        return <div className={className}>{children}</div>;
    }
};

export const ImageBlock: React.FC<ImageBlockProps> = (props) => {
    const {altText = "", image, displayType = ImageBlockDisplayType.trueSize} = props;
    const contextStyles = React.useContext(GlobalStyles);
    const responsiveClassNames = `
        ${image?.extraSmall ? "extraSmallOnly" : ""}
        ${image?.small ? "smallOnly" : ""}
        ${image?.medium ? "medium" : ""}`;

    const pictureData: PictureData[] = imageBreakpoints.map((breakpoint) => ({
        breakpointData: breakpoint,
        imageData: image[breakpoint.name],
    }));

    return (
        <div className={responsiveClassNames}>
            <Container
                className={classname([
                    styles.imageBlock,
                    styles[displayType],
                    classIf(contextStyles.browserSizeLayout, displayType === ImageBlockDisplayType.browserSize),
                    classIf(styles.noMargin, displayType === ImageBlockDisplayType.browserSize),
                ])}
                {...props}>
                <Picture
                    fallbackImage={image?.fallbackImage || {x1: PLACEHOLDER_SRC}}
                    pictureData={pictureData}
                    alt={altText}
                />
            </Container>
        </div>
    );
};

ImageBlock.displayName = "ImageBlock";
Container.displayName = "ImageBlockContainer";

export default ImageBlock;
