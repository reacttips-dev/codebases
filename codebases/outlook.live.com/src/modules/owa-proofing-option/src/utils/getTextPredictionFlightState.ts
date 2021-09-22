import { isFeatureEnabled } from 'owa-feature-flags';
import { getCurrentCulture } from 'owa-localize';

export const TextPredictionViaSCPlugin = 0x01;
export const TextPredictionViaALPlugin = 0x02;
export const TextPredictionRenderEnabled = 0x04;

export function getTextPredictionFlightState(): number {
    if (isCultureSupported()) {
        if (
            isFeatureEnabled('mc-alTextPredictionUX') ||
            isFeatureEnabled('mc-alTextPredictionUXCalendar')
        ) {
            // If we have mc-alTextPredictionUX enabled then we want to request and render suggestions via the aug loop plugin
            return TextPredictionViaALPlugin | TextPredictionRenderEnabled;
        } else if (isFeatureEnabled('mc-alTextPredictionShadow')) {
            // Otherwise, if we have mc-alTextPredictionShadow enabled then we want to just request suggestions via the aug loop plugin
            return TextPredictionViaALPlugin;
        } else if (
            isFeatureEnabled('mc-smartCompose') ||
            isFeatureEnabled('mc-smartCompose-exp-flight01') ||
            isFeatureEnabled('mc-smartCompose-exp-flight02')
        ) {
            // Otherwise, if we have the mc-smartCompose, mc-smartCompose-exp-flight01, or mc-smartCompose-exp-flight01 are enabled
            // we want to both request and render suggestions via the SmartComposePlugin
            return TextPredictionViaSCPlugin | TextPredictionRenderEnabled;
        }
    } else if (isWWEn() && isFeatureEnabled('mc-smartComposeEnWW')) {
        return TextPredictionViaSCPlugin | TextPredictionRenderEnabled;
    } else if (isLatAndNamEs() && isFeatureEnabled('mc-smartComposeEs')) {
        return TextPredictionViaSCPlugin | TextPredictionRenderEnabled;
    }

    // the flight is out of culture support since we are using this to test internationalization
    if (isFeatureEnabled('mc-sc-intl-shadow')) {
        return TextPredictionViaSCPlugin;
    }

    return 0;
}

function isCultureSupported(): boolean {
    const userCulture = getCurrentCulture();
    return userCulture === 'en-US' || userCulture === 'en-CA' || userCulture === 'en-MX';
}

function isWWEn(): boolean {
    const userCulture = getCurrentCulture();
    const wwEnReg = new RegExp('^en-');
    return userCulture ? wwEnReg.test(userCulture as string) : false;
}

function isLatAndNamEs(): boolean {
    const userCulture = getCurrentCulture();
    const wwEnReg = new RegExp('^es-');
    return userCulture ? wwEnReg.test(userCulture as string) : false;
}
