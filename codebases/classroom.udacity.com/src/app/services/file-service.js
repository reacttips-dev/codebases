import {
    COPY,
    FILE_TYPES,
    MAX_FILE_SIZE
} from 'constants/avatar';
import Pica from 'pica';
// eslint-disable-next-line
export const pica = Pica();

// make this a class?
export const FileService = {
    getBase64: (file) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => {
                resolve(reader.result);
            };
            reader.onerror = (error) => {
                reject(error);
            };
            reader.readAsDataURL(file);
        });
    },
    calculateAspectRatioFit: (srcWidth, srcHeight, maxWidth, maxHeight) => {
        // if it's not bigger than our max just return and do nothing
        if (srcWidth <= maxWidth && srcHeight <= maxHeight) {
            return {
                width: srcWidth,
                height: srcHeight
            };
        }
        var ratio = Math.min(maxWidth / srcWidth, maxHeight / srcHeight);

        return {
            width: srcWidth * ratio,
            height: srcHeight * ratio
        };
    },

    getImagePreview: (files) => {
        const file = files[0];
        const mimeType = file.type;
        const name = file.name;
        var offscreenCanvas = document.createElement('canvas');
        try {
            return FileService.getBase64(file).then((photoBase64) => {
                return new Promise((resolve, reject) => {
                    const img = new Image();
                    img.onload = () => {
                        if (img.width < 120 || img.height < 120) {
                            reject(new Error(COPY.dimensionError));
                        }
                        const resizedDimensions = FileService.calculateAspectRatioFit(
                            img.width,
                            img.height,
                            800,
                            800
                        );
                        offscreenCanvas.width = resizedDimensions.width;
                        offscreenCanvas.height = resizedDimensions.height;

                        pica
                            .resize(img, offscreenCanvas, {
                                unsharpAmount: 80,
                                unsharpRadius: 0.6,
                                unsharpThreshold: 2,
                            })
                            .then((result) => pica.toBlob(result, mimeType))
                            // convert the resized image back to base64 for return
                            .then((blob) =>
                                resolve(
                                    FileService.getBase64(
                                        new File([blob], name, {
                                            type: mimeType,
                                        })
                                    )
                                )
                            );
                    };
                    img.src = photoBase64;
                });
            });
        } catch (e) {
            throw Error(e);
        }
    },

    verifyPhotoFile: (files) => {
        const file = files[0];
        if (!FILE_TYPES.includes(file.type)) {
            throw new Error(COPY.fileTypeError);
        }
        if (file.size > MAX_FILE_SIZE) {
            throw new Error(COPY.fileSizeError);
        }
    },
};

export default FileService;