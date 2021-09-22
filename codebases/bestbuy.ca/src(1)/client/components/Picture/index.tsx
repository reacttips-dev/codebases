import * as React from "react";
import {ImageResType, Breakpoint} from "models";

export const getSrcset = (imageResPaths: ImageResType) => {
    if (imageResPaths) {
        const imageKeys = Object.keys(imageResPaths);
        const resMap = {x1: "1x", x2: "2x", x3: "3x"};
        return imageKeys.map((res) => `${imageResPaths[res]} ${resMap[res]}`).join(",");
    }
};
interface Image {
    alt: string;
    src: string;
    srcSet?: string;
    className?: string;
}

export const Image = (props: Image) => (
    <img src={props.src} srcSet={props.srcSet} alt={props.alt} className={props.className || ""} />
);

export interface PictureData {
    imageData: ImageResType;
    breakpointData: Breakpoint;
}

export interface PictureProps {
    alt: string;
    pictureData: PictureData[];
    fallbackImage?: ImageResType;
    className?: string;
}

const Picture = (props: PictureProps) => {
    const {alt, pictureData, fallbackImage, className} = props;
    const imgSrcs = pictureData.map((bpImg) => (
        <source
            key={bpImg.breakpointData.name}
            media={
                `(min-width: ${bpImg.breakpointData.minWidth}px)` +
                (bpImg.breakpointData.maxWidth < Infinity ? ` and (max-width: ${bpImg.breakpointData.maxWidth}px)` : "")
            }
            srcSet={bpImg.imageData && getSrcset(bpImg.imageData)}
        />
    ));

    return (
        <picture>
            {imgSrcs}
            <Image
                className={className}
                src={(fallbackImage && fallbackImage.x1) || ""}
                srcSet={fallbackImage && getSrcset(fallbackImage)}
                alt={alt}
            />
        </picture>
    );
};

export default Picture;
