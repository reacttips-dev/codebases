export interface ProductMedia {
    images: ProductImagesMap;
    videos: ProductVideo[];
    loading?: boolean;
}

export interface MediaApiResponse {
    images: {
        [key: string]: ProductImage[];
    };
    videos: Array<Pick<ProductVideo, "id" | "source">>;
}

export interface KeyValue<T> {
    [key: string]: T;
}

export type ProductImageSizeMap = KeyValue<ProductImage>;
export type ProductImagesMap = KeyValue<ProductImageSizeMap>;

export interface ProductImage {
    mimeType: string;
    size: {
        width: number;
        height: number;
    };
    url: string;
}

export interface ProductVideo {
    source: string;
    id: string;
    thumbnail: string;
}

export enum ImageSizes {
    highResoultion = "1500x1500",
    midResolution = "500x500",
    lowResultion = "100x100",
}
