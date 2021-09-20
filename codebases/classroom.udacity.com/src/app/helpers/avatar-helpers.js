import Identicon from 'identicon.js';

const AvatarHelpers = {
    cycleId(originalUid) {
        if (originalUid.toString().length >= 15) {
            return originalUid;
        }

        let newId = originalUid.toString();
        while (newId.length < 15) {
            newId += originalUid;
        }
        return newId.slice(0, 16);
    },

    makeIdenticon: _.memoize(
        (uid, size) => {
            if (!uid) {
                return '';
            }
            return `data:image/png;base64,${new Identicon(
        `${AvatarHelpers.cycleId(uid)}`,
        size
      ).toString()}`;
        },
        (uid, size) => `${uid} ${size}`
    ),

    translateSizeSelectionToInt: (sizeSelection) => {
        switch (sizeSelection) {
            case 'sm':
                return 24;
            case 'md':
                return 64;
            case 'lg':
                return 72;
            case 'xl':
                return 120;
        }
        return 32;
    },
};

export default AvatarHelpers;