import { isFeatureEnabled } from 'owa-feature-flags';
import { getCurrentLanguage } from 'owa-localize';

export default function isNaturalLanguageGhostTextEnabled(): boolean {
    return isFeatureEnabled('sea-teachNL-ghostText') && getCurrentLanguage() === 'en';
}
