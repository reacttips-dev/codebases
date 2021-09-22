import {BackgroundWidth, CMSMappedSizing} from "models";

const getBackgroundSizing = (appearance?: string): BackgroundWidth => {
    switch (appearance) {
        case CMSMappedSizing.browserSize:
            return BackgroundWidth.browserSize;
        case CMSMappedSizing.siteSize:
            return BackgroundWidth.siteSize;
        default:
            return BackgroundWidth.trueSize;
    }
};

export default getBackgroundSizing;
