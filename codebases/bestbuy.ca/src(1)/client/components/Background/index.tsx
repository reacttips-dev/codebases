import * as React from "react";
import {ResponsiveTypes, ImageResType, Theme, SectionImage} from "models";
import * as styles from "./style.css";
import {classname, classIf} from "utils/classname";

const getImageRes = (size: ImageResType): string => {
    if (!size) {
        return "";
    }
    return size.x3 || size.x2 || size.x1 || "";
};

const getBackgroundStyles = (bgImage?: string): React.CSSProperties =>
    bgImage ? {backgroundImage: `url(${bgImage})`} : {};

const Background = (props: {
    images?: SectionImage;
    repeatImage?: boolean;
    theme?: Theme;
    localStyles?: React.CSSProperties;
    className?: string;
}) => {
    const {images, repeatImage, theme, localStyles, className} = props;
    const allowedImageTypes: ResponsiveTypes[] = [
        ResponsiveTypes.extraSmall,
        ResponsiveTypes.small,
        ResponsiveTypes.medium,
    ];

    const bgClassNames = classname([
        className,
        styles.backgroundContainer,
        classIf(styles.repeat, !!repeatImage),
        theme && styles[theme],
    ]);
    const inlineStyles: React.CSSProperties = {...localStyles};

    return (
        <div className={bgClassNames} style={inlineStyles} role="img">
            {!!images &&
                Object.keys(images)
                    .filter((img) => allowedImageTypes.indexOf(img as ResponsiveTypes) > -1)
                    .map((image, i) => {
                        const bgImage: string = getImageRes(images[image]);
                        const imgInlineStyles: React.CSSProperties = {...localStyles, ...getBackgroundStyles(bgImage)};
                        return (
                            <div key={`${image}${i}`} className={classname(styles[`${image}Banner`])}>
                                <div
                                    className={classname([styles.backgroundImage, className])}
                                    style={imgInlineStyles}
                                />
                            </div>
                        );
                    })}
        </div>
    );
};

export default Background;
