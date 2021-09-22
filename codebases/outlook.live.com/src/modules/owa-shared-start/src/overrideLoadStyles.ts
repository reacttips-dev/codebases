import { configureLoadStyles, ThemableArray, loadStyles } from '@microsoft/load-themed-styles';

let stylesBuffer: (string | ThemableArray)[] | undefined;

export function overrideLoadStyles() {
    stylesBuffer = [];
    // start to buffer the styles
    configureLoadStyles((processedStyles, rawStyles) => {
        stylesBuffer!.push(rawStyles!);
    });
}

export function unblockStyles() {
    // Unset the function that buffers the styles
    configureLoadStyles(undefined);
    if (stylesBuffer) {
        // load all the styles at once
        stylesBuffer.map(s => loadStyles(s));
    }

    stylesBuffer = undefined;
}
