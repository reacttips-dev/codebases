const SESSION_URL_FUNCTION_NAME = "getCurrentSessionURL";

const fs = (): any => {
    const fsNamespace = window["_fs_namespace"];
    return window[fsNamespace];
};

export const isFsLoaded = (): boolean => {
    const fsObject = fs();
    if (fsObject && typeof fsObject[SESSION_URL_FUNCTION_NAME] === "function" ) {
        return true;
    }
    return false;
};

export const getUrlWithTime = (): string => {
    return fs()[SESSION_URL_FUNCTION_NAME](true);
};

export const getUrl = (): string => {
    return fs()[SESSION_URL_FUNCTION_NAME]();
};



// WEBPACK FOOTER //
// ./src/utils/FullStory.ts