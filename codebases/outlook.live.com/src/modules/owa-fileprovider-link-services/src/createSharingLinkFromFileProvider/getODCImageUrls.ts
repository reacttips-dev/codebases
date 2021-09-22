import { format } from 'owa-localize';
import AttachmentDataProviderType from 'owa-service/lib/contract/AttachmentDataProviderType';
import getRequest, { FileProviderRequestSet } from '../utils/FileProviderQueryConfig';
import { getResponseFromFileProvider } from '../utils/getResponseFromFileProvider';

export interface ODCImageUrls {
    value: ImageUrls[];
}

interface ImageUrls {
    c200x150_Crop: ImageUrl; // The cropped image url can be used for thumbnail
    large: ImageUrl; // The large image url can be used for preview
}

interface ImageUrl {
    height: number;
    url: string;
    width: number;
}
export async function getODCImageUrls(shareId: string): Promise<ODCImageUrls> {
    const request: FileProviderRequestSet = getRequest(AttachmentDataProviderType.OneDriveConsumer);
    const requestUrl: string = format(request.get_image_urls_request.requestUrlFormat, shareId);
    const thumbnailResult: string = await getResponseFromFileProvider(
        AttachmentDataProviderType.OneDriveConsumer,
        requestUrl,
        null, // additional headers
        request.get_image_urls_request.method,
        null, //request body
        null, // original url
        request.get_image_urls_request.dataPointName
    );

    return JSON.parse(thumbnailResult);
}
