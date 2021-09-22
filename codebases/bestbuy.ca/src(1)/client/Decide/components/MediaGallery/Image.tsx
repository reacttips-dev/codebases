import * as React from "react";

import ProductImage from "components/ProductImage";
import {classname} from "utils/classname";
import {ZoomableProps} from "components/Zoomable";

import * as styles from "./style.css";

export interface ImageProps {
    imageSrc: string;
    thumbnailImageSrc: string;
    highResolutionImageSrc?: string;
    placeholderImageSrc?: string;
    width?: string;
    height?: string;
    enableZoom?: boolean;
    className?: string;
    alt?: string;
    disableLazyLoad?: boolean;
    disableMouseMoveCancelClick?: boolean;
    disableSeoAttributes?: boolean;
}

interface OwnProps extends Pick<ZoomableProps, "onImageZoom"> {
    index?: number;
    resetZoomCallback?: (resetTransform: () => void, zoomableId: number) => void;
    setIsDraggable?: React.Dispatch<React.SetStateAction<boolean>>;
    disableResponsiveSquareTrick?: boolean;
    onClick?: () => void;
}

export type IntrinsicImageProps = ImageProps & OwnProps;

const Image: React.FC<IntrinsicImageProps> = ({
    imageSrc,
    alt,
    thumbnailImageSrc,
    highResolutionImageSrc,
    index,
    placeholderImageSrc,
    className,
    onClick,
    width = "100%",
    height = "100%",
    enableZoom = true,
    resetZoomCallback,
    setIsDraggable,
    disableResponsiveSquareTrick,
    disableLazyLoad,
    disableMouseMoveCancelClick = false,
    onImageZoom,
    disableSeoAttributes,
}) => {
    let isClickEnabled = true;
    const src = !!enableZoom && !!highResolutionImageSrc ? highResolutionImageSrc : imageSrc;
    const isZoomable = !!enableZoom && !!highResolutionImageSrc;
    let isMouseDown = false;

    /**
     * Detects swipe event on desktop as not a click event.
     *
     * Mouse down, move and up events, and click events are both same for the device that
     * support mouse (i.e desktop). Using mouse move event when mouse down to disable the
     * onClick() call handles swipe event.
     */
    const onMouseDownHandler = () => (isMouseDown = true);
    const onMouseMoveHandler = () => !!isMouseDown && !disableMouseMoveCancelClick && (isClickEnabled = false);
    const onMouseUpHandler = () => (isMouseDown = false);
    const onClickHandler = () => {
        if (isClickEnabled && typeof onClick === "function") {
            onClick();
        }
        isClickEnabled = true;
    };

    return (
        <div
            className={className}
            key={index}
            role="button"
            onMouseDown={onMouseDownHandler}
            onMouseMove={onMouseMoveHandler}
            onMouseUp={onMouseUpHandler}
            onClick={onClickHandler}>
            <ProductImage
                alt={alt}
                className={classname(styles.productImage)}
                src={src}
                width={width}
                height={height}
                placeholderImage={placeholderImageSrc}
                enableZoom={isZoomable}
                resetZoomCallback={!!resetZoomCallback && resetZoomCallback}
                setIsDraggable={setIsDraggable}
                disableResponsiveSquareTrick={disableResponsiveSquareTrick}
                disableLazyLoad={disableLazyLoad}
                disablePlaceholder={!placeholderImageSrc}
                onImageZoom={onImageZoom}
                disableSeoAttributes={disableSeoAttributes}
            />
        </div>
    );
};

Image.displayName = "Image";
ProductImage.displayName = "ProductImage";

export default Image;
