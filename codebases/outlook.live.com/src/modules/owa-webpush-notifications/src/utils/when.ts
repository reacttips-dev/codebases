import { shouldShowWebPushLightning } from '../shouldShowWebPushLightning';
import loadWebPushOptions from '../services/loadWebPushOptions';

export const when = async (lightup: () => void) => {
    if (shouldShowWebPushLightning(window, await loadWebPushOptions())) {
        lightup();
    }
};
