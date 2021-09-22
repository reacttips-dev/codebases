import { getQueryStringParameter } from 'owa-querystring';
import { initializeLightningFromOverride } from './initializeLightningFromOverride';
import { initializeLightningFromServer } from './initializeLightningFromServer';
import { initializeLightningFromSessionData } from './initializeLightningFromSessionData';
import getUserConfiguration from 'owa-session-store/lib/actions/getUserConfiguration';

let initializationPromise: Promise<void>;
const LightningQueryParamName = 'lightning';
const LightningPrimeSettingKeyName = 'UnseenLightening';

/**
 * Initialize lightning store
 * @param id Lightning id
 */
export function initializeLightningIfNecessary(): Promise<void> {
    if (!initializationPromise) {
        const lightningQueryParamValue = getQueryStringParameter(LightningQueryParamName);

        // Check if the query parameter containing lightning override, if so, we should always
        // allow the callout to show to unblock testing client side only code without waiting
        // for server change to deploy.
        //
        // If no override exists, try to download the unseen items from server
        // if the collection hasn't been initialized already
        if (lightningQueryParamValue) {
            initializationPromise = initializeLightningFromOverride(lightningQueryParamValue);
        } else {
            let primeSettings = getUserConfiguration().PrimeSettings;

            if (primeSettings?.Items) {
                for (let primeSetting of primeSettings.Items) {
                    if (primeSetting.Id === LightningPrimeSettingKeyName && primeSetting.Value) {
                        initializationPromise = initializeLightningFromSessionData(
                            primeSetting.Value
                        );
                        break;
                    }
                }
            }

            if (!initializationPromise) {
                initializationPromise = initializeLightningFromServer();
            }
        }
    }

    return initializationPromise;
}
