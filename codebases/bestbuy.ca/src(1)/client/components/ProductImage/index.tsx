import * as React from "react";
import Image, {ImageProps} from "../Image";
import ProductImagePlaceholder from "../SvgIcons/ProductImagePlaceholder";
import * as styles from "./style.css";
import LazyLoad from "react-lazyload";
import {classname, classIf} from "utils/classname";

export const NO_IMAGE_PLACEHOLDER_PATH_FROM_API = "images/common/pictures/noimage";

const PLACEHOLDER_MAX_HEIGHT = "500px";
const PLACEHOLDER_MAX_WIDTH = "500px";

export interface ProductImageProps extends Omit<ImageProps, "placeholder"> {
    setIsDraggable?: any;
    placeholderImage?: string;
    disableResponsiveSquareTrick?: boolean;
    disableLazyLoad?: boolean;
    disablePlaceholder?: boolean;
    placeholderImageSrc?: string;
    disableSeoAttributes?: boolean;
}

export const ProductImageContainer = (props) => {
    const productImageContainerStyles = classname([
        styles.productImageContainer,
        styles.touchActionManipulation,
        props.className,
        classIf(styles.applyResponsiveSquareTrick, !props.disableResponsiveSquareTrick),
    ]);

    return (
        <div className={productImageContainerStyles} data-automation="image-slider-test">
            {props.children}
        </div>
    );
};

ProductImageContainer.displayName = "ProductImageContainer";

export const ProductImageContent: React.FC<ProductImageProps> = (props) => {
    const placeholder = (
        <ProductImagePlaceholder
            title={props.alt}
            width={props.width}
            height={props.height}
            src={props.placeholderImage}
            maxWidth={PLACEHOLDER_MAX_WIDTH}
            maxHeight={PLACEHOLDER_MAX_HEIGHT}
        />
    );

    const productImageProps = props.disablePlaceholder ? {...props} : {...props, placeholder};
    delete productImageProps.disableResponsiveSquareTrick;
    delete productImageProps.disableLazyLoad;
    delete productImageProps.placeholderImage;

    if (!props.src || props.src.includes(NO_IMAGE_PLACEHOLDER_PATH_FROM_API)) {
        return placeholder;
    }

    if (!!props.disableLazyLoad) {
        return <Image {...productImageProps} />;
    }

    return (
        <LazyLoad offset={0}>
            <Image {...productImageProps} />
        </LazyLoad>
    );
};

ProductImageContent.displayName = "ProductImageContent";

export const ProductImage: React.FC<ProductImageProps> = ({disableResponsiveSquareTrick, ...rest}) => {
    return (
        <ProductImageContainer className={rest.className} disableResponsiveSquareTrick={disableResponsiveSquareTrick}>
            <ProductImageContent {...rest} />
        </ProductImageContainer>
    );
};

ProductImage.displayName = "ProductImage";

export default ProductImage;
