function browserPredicates(userAgent) {
    // eslint-disable-next-line prefer-const
    let isChrome = /Chrome/i.test(userAgent) && !/Edge/i.test(userAgent);
    // eslint-disable-next-line prefer-const
    let isMobile = /iPhone|iPad|Android/i.test(userAgent);
    // eslint-disable-next-line prefer-const
    let isAndroid = /android/i.test(userAgent);
    // TODO(johnicholas): This access of the global "window" is dangerous and inappropriate for a component; figure out an alternative.
    // eslint-disable-next-line prefer-const, dot-notation
    let isIOS = /iPad|iPhone|iPod/.test(userAgent) && !window['MSStream'];
    // eslint-disable-next-line prefer-const
    let isMacOS = /Mac/i.test(userAgent);
    // eslint-disable-next-line prefer-const
    let isAppleDevice = isIOS || isMacOS;

    return {
        isChrome,
        isMobile,
        isAndroid,
        isIOS,
        isMacOS,
        isAppleDevice,
    };
}

module.exports = browserPredicates;