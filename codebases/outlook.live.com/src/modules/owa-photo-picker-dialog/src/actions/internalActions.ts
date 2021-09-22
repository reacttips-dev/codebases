import { action } from 'satcheljs';

export const onDismissed = action('ON_DISMISSED');

export const onUploadPhoto = action(
    'ON_UPLOAD_PHOTO',
    (dataUrl: string, onSuccess: () => void, onError: () => void) => ({
        dataUrl,
        onSuccess,
        onError,
    })
);
