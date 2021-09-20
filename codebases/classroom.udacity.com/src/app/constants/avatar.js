import {
    __
} from 'services/localization-service';

export const FILE_TYPES = ['image/jpeg', 'image/jpg', 'image/png'];

//15Mb - this file size can be increased as phone images get larger as it is all done on client side now
export const MAX_FILE_SIZE = 15 * 1048576; // 15MB;

export const COPY = {
    fileTypeError: __('Please upload a JPG or PNG.'),
    fileSizeError: __('Max file size is 1MB.'),
    dimensionError: __('Please upload a 120x120 image.'),
    genericError: __('Something went wrong. Try again.'),
};