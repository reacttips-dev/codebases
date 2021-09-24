import React from 'react';
import { Emoji } from '../../Emoji';
import Image from '../../Image';
const ImagePickerDropdownImage = ({ emojiSize, image, imageBoxSize, }) => {
    if (!image) {
        return (React.createElement(Emoji, { src: {
                __typename: 'Emoji',
                id: '',
                text: 'speech_balloon',
            }, size: emojiSize }));
    }
    if (image.__typename === 'Emoji') {
        return React.createElement(Emoji, { src: image, size: emojiSize });
    }
    if (image.__typename === 'Image') {
        return (React.createElement(Image, { borderRadius: "base", objectFit: "cover", objectPosition: "0 50%", boxSize: imageBoxSize, src: image, size: emojiSize }));
    }
    return React.createElement("div", null);
};
export default ImagePickerDropdownImage;
//# sourceMappingURL=ImagePickerDropdownImage.js.map