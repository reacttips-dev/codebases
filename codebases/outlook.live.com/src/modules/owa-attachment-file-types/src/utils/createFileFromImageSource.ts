const BASE64_IMAGE_REGEX = new RegExp('^data:(image\\/\\w+);base64,([A-Za-z0-9+/=]+?)$', 'i');

export default function createFileFromImageSource(source: string): File | null {
    let file: File | null = null;
    const match = BASE64_IMAGE_REGEX.exec(source);

    if (match) {
        const contentType = match[1];
        const dataUri = match[2];

        let byteString: string | null = null;
        try {
            byteString = atob(dataUri);
        } catch {}

        if (byteString) {
            const arrayBuilder = new ArrayBuffer(byteString.length);
            const unit8Array = new Uint8Array(arrayBuilder);

            for (let i = 0; i < byteString.length; i++) {
                unit8Array[i] = byteString.charCodeAt(i);
            }

            file = new File([arrayBuilder], 'image.png', { type: contentType });
        }
    }

    return file;
}
