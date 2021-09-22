import * as React from "react";
import {Loader, LoadingSkeleton} from "@bbyca/bbyca-components";
import SharedImageGallery, {Props as SharedImageGalleryProps} from "../../ImageGallery";

interface ImageGalleryProps extends SharedImageGalleryProps {
    loading: boolean;
}

export const ImageGallerySkeleton = ({className}) => <LoadingSkeleton.Banner className={className} />;

const ImageGallery = ({className, loading, ...rest}: ImageGalleryProps) => {
    return (
        <Loader loading={loading} loadingDisplay={<ImageGallerySkeleton className={className} />}>
            <SharedImageGallery {...rest} className={className} width="100%" height="100%" />
        </Loader>
    );
};

export default ImageGallery;
