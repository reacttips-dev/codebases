import {ProductMedia, MediaApiResponse, ProductImagesMap} from "models";
import {getProductVideos} from "utils/imageUtils";

export default (data: MediaApiResponse): ProductMedia => {
    const images: ProductImagesMap = {};

    if (data.images instanceof Object) {
        Object.keys(data.images).map((index) => {
            data.images[index].map((productImage) => {
                const {
                    size: {width, height},
                } = productImage;

                images[index] = {
                    ...images[index],
                    [`${width}x${height}`]: productImage,
                };
            });
        });
    }

    const videos = getProductVideos(data.videos);

    return {images, videos};
};
